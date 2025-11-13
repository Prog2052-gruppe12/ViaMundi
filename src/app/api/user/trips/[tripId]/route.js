export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Get a specific trip by ID (full data for detail view)
 * @param {Request} request
 * @param {Object} context - Contains route params
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;
    const { tripId } = await params;

    const tripDoc = await adminDb
      .collection("users")
      .doc(userId)
      .collection("trips")
      .doc(tripId)
      .get();

    if (!tripDoc.exists) {
      return NextResponse.json(
        { ok: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    const tripData = tripDoc.data();

    // Return ALL data for the detail view
    return NextResponse.json({
      ok: true,
      trip: {
        id: tripDoc.id,
        ...tripData,
        createdAt: tripData.createdAt?.toDate().toISOString(),
        updatedAt: tripData.updatedAt?.toDate().toISOString(),
      }
    });

  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Update a specific trip
 * @param {Request} request
 * @param {Object} context - Contains route params
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request, { params }) {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;
    const { tripId } = await params;

    const updateData = await request.json();

    // Remove fields that shouldn't be updated
    const { id, createdAt, ...validUpdateData } = updateData;

    // Validate data size
    const dataSize = JSON.stringify(validUpdateData).length;
    const maxSize = 1024 * 1024; // 1MB
    
    if (dataSize > maxSize) {
      return NextResponse.json(
        { ok: false, error: "Trip data too large" },
        { status: 400 }
      );
    }

    const tripRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("trips")
      .doc(tripId);

    // Check if trip exists
    const tripDoc = await tripRef.get();
    if (!tripDoc.exists) {
      return NextResponse.json(
        { ok: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    // Update trip
    await tripRef.update({
      ...validUpdateData,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ 
      ok: true,
      message: "Trip updated successfully" 
    });

  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Delete a specific trip
 * @param {Request} request
 * @param {Object} context - Contains route params
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;
    const { tripId } = await params;

    const tripRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("trips")
      .doc(tripId);

    // Check if trip exists
    const tripDoc = await tripRef.get();
    if (!tripDoc.exists) {
      return NextResponse.json(
        { ok: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    // Delete trip
    await tripRef.delete();

    return NextResponse.json({ 
      ok: true,
      message: "Trip deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
