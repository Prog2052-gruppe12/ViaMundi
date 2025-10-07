export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, profileCompleted: false },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    const userDoc = await adminDb.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({
        ok: true,
        profileCompleted: false,
      });
    }

    const userData = userDoc.data();
    const profileCompleted = userData.profileCompleted === true;

    return NextResponse.json({
      ok: true,
      profileCompleted,
    });
  } catch (error) {
    console.error("Feil ved sjekk av profil:", error);
    return NextResponse.json(
      { ok: false, error: error.message, profileCompleted: false },
      { status: 500 }
    );
  }
}

