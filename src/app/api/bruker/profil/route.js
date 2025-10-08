export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Lagre brukerdata i Firestore
 * @param {Request} req - Next.js request objekt
 * @returns {Promise<NextResponse>} Response med suksess eller feil
 */
export async function POST(req) {
  try {
    // Hent session cookie fra cookies
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    // Hvis session cookie ikke finnes, returner 401
    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "Ikke autentisert" },
        { status: 401 }
      );
    }

    // decode session cookie og hent bruker ID
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    const data = await req.json();
    // ignore user id og oppdater resten av data. 
    const {userId: _, ...profileData } = data;

    // hent referanse til brukerdokumentet
    const userRef = adminDb.collection("users").doc(userId);
    // oppdater brukerdokumentet
    await userRef.set(
      {
        ...profileData,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Feil ved lagring av profil:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}


/**
 * Hent brukerdata fra Firestore
 * @returns {Promise<NextResponse>} Response med suksess eller feil
 */
export async function GET() {
  try {
    // Hent session cookie fra cookies og
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    // Hvis session cookie ikke finnes, returner 401
    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, profileCompleted: false },
        { status: 401 }
      );
    }

    // Verifiser session cookie og hent bruker ID
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Hent brukerdata fra Firestore
    const userDoc = await adminDb.collection("users").doc(userId).get();

    // Hvis brukerdata ikke finnes, returner 404 med feilmelding
    if (!userDoc.exists) {
      return NextResponse.json({
        ok: true,
        userData: null,
        profileCompleted: false,
      }, { status: 404 });
    }

    const userData = userDoc.data();
    

    return NextResponse.json({
      ok: true,
      userData,
      profileCompleted: userData.profileCompleted,
    });
  } catch (error) {
    console.error("Feil ved sjekk av profil:", error);
    return NextResponse.json(
      { ok: false, error: error.message},
      { status: 500 }
    );
  }
}

