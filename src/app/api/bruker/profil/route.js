export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "Ikke autentisert" },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    const data = await req.json();
    const { userId: _, ...profileData } = data;

    const userRef = adminDb.collection("users").doc(userId);
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

