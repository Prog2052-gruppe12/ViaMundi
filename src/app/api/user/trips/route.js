export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Save a new trip to user's collection
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

    const tripData = await req.json();
    
    // Validate required fields
    const required = ["destination", "dateFrom", "dateTo", "finalPlan"];
    for (const field of required) {
      if (!tripData[field]) {
        return NextResponse.json(
          { ok: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate data size (Firestore has 1MB limit per document)
    const dataSize = JSON.stringify(tripData).length;
    const maxSize = 1024 * 1024; // 1MB
    
    if (dataSize > maxSize) {
      return NextResponse.json(
        { ok: false, error: "Trip data too large. Please try with fewer details." },
        { status: 400 }
      );
    }

    // Get reference to user's trips subcollection
    const tripsRef = adminDb.collection("users").doc(userId).collection("trips");
    
    // Add new trip document
    const docRef = await tripsRef.add({
      ...tripData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ 
      ok: true, 
      tripId: docRef.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Error saving trip:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get all trips for authenticated user (minimal data for list view)
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
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify session cookie and get user ID
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get all trips for user, ordered by creation date (newest first)
    const tripsSnapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("trips")
      .orderBy("createdAt", "desc")
      .get();

    // Return ONLY minimal data for list view
    const trips = tripsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        destination: data.destination,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        travelers: data.travelers,
        metadata: data.metadata || {},
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    });

    return NextResponse.json({ 
      ok: true, 
      trips,
      count: trips.length 
    });

  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
