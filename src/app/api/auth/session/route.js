// Bruk nodejs runtime for Firebase Admin SDK
export const runtime = "nodejs";

import { cookies } from "next/headers";
import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "firebase_session";
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN;
const COOKIE_TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 dager i millisekunder
const COOKIE_TTL_SEC = Math.floor(COOKIE_TTL_MS / 1000); // Sekunder
const SAME_SITE = "lax";

/**
 * Oppretter en session cookie for brukeren
 * @param {Object} params - Parametere
 * @param {string} params.idToken - Firebase ID token
 * @returns {Promise<NextResponse>} Response med suksess eller feil
 */
async function setSessionCookie({ idToken }) {
  if (!idToken) {
    throw new Error("Mangler idToken");
  }

  // Opprett session cookie
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: COOKIE_TTL_MS,
  });

  const jar = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  jar.set(COOKIE_NAME, sessionCookie, {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite: SAME_SITE,
    maxAge: COOKIE_TTL_SEC,
    ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}



/**
 * Sørger for at brukerdokumentet eksisterer i Firestore
 * @param {string} uid - Bruker ID
 * @param {Object} info - Brukerinformasjon (email, name, picture)
 */
async function ensureUserDoc(uid, info = {}) {
  const now = Timestamp.now();
  const ref = adminDb.collection("users").doc(uid);

  const snapshot = await ref.get();
  const existing = snapshot.exists;

  const data = {
    ...info,
    updatedAt: now,
    ...(existing ? {} : { createdAt: now }),
  };

  await ref.set(data, { merge: true });
}


/**
 * POST handler - Logger inn brukeren og oppretter session cookie
 * @param {Request} req - Next.js request objekt
 * @returns {Promise<NextResponse>} Response med suksess eller feil
 */
export async function POST(req) {
  try {
    const reqBody = await req.json();

    const { idToken } = reqBody;
    if (!idToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "Mangler idToken",
        },
        { status: 400 }
      );
    }

    // Verifiser ID token
    const decoded = await adminAuth.verifyIdToken(idToken);

    if (!decoded) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ugyldig idToken",
        },
        { status: 401 }
      );
    }

    // Opprett eller oppdater brukerdokument i Firestore
    await ensureUserDoc(decoded.uid, {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });

    // Opprett session cookie og returner respons
    return await setSessionCookie({ idToken });
  } catch (error) {
    console.error("Feil ved innlogging:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


/**
 * DELETE handler - Logger ut brukeren og sletter session cookie
 * @returns {Promise<NextResponse>} Response med suksess eller feil
 */
export async function DELETE() {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get(COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        {
          ok: false,
          error: "Fant ikke session cookie",
        },
        { status: 401 }
      );
    }

    // Verifiser session cookie og tilbakekall refresh tokens
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    await adminAuth.revokeRefreshTokens(decoded.uid);

    // Slett session cookie
    jar.delete(COOKIE_NAME);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Feil ved utlogging:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}