export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";


/**
 * Hent brukerdata fra Firestore
 * @returns {Promise<NextResponse>} Response med suksess eller feil
 */
export async function GET() {
  try {
    // Hent session cookie fra cookies og
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session").value;

    // Hvis session cookie ikke finnes, returner 401
    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false},
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
        userData: "User data does not exist",
      }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      ok: true,
      userData,
    });
  } catch (error) {
    console.error("Feil ved sjekk av profil:", error);
    return NextResponse.json(
      { ok: false, error: error.message},
      { status: 500 }
    );
  }
}

