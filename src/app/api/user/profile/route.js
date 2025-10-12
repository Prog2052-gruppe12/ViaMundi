export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Save user data to Firestore
 * @param {Request} req - Next.js request object
 * @returns {Promise<NextResponse>} Response with success or error
 */
export async function POST(req) {
  try {
    // Get session cookie from cookies
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    // If session cookie doesn't exist, return 401
    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Decode session cookie and get user ID
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    const data = await req.json();
    // Ignore user id and update the rest of the data
    const {userId: _, ...profileData } = data;

    // Get reference to user document
    const userRef = adminDb.collection("users").doc(userId);
    // Update user document
    await userRef.set(
      {
        ...profileData,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}


/**
 * Get user data from Firestore
 * @returns {Promise<NextResponse>} Response with success or error
 */
export async function GET() {
  try {
    // Get session cookie from cookies
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    // If session cookie doesn't exist, return 401
    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, profileCompleted: false },
        { status: 401 }
      );
    }

    // Verify session cookie and get user ID
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get user data from Firestore
    const userDoc = await adminDb.collection("users").doc(userId).get();

    // If user data doesn't exist, return 404 with error message
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
    console.error("Error checking profile:", error);
    return NextResponse.json(
      { ok: false, error: error.message},
      { status: 500 }
    );
  }
}

