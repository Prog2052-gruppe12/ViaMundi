import { NextResponse } from "next/server";
import { curateActivities } from "@/lib/curateActivities/curateActivities";
import rateLimit from "@/lib/ratelimiter/ratelimit";

const rateLimiter = rateLimit(100, 60000);

/**
 * POST /api/ai/curate-activities
 *
 * Curates and filters TripAdvisor results using AI to keep only high-quality,
 * relevant activities. Returns location_ids that passed the quality filter.
 *
 * Request body:
 * {
 *   locations: Array<Object>,  // TripAdvisor location objects with details
 *   userInterests: string,      // User's interests/preferences
 *   destination: string         // Travel destination
 * }
 *
 * Response:
 * {
 *   success: true,
 *   curated: string[],           // Filtered location_ids, sorted by quality
 *   filtered_count: number,      // Number of locations filtered out
 *   kept_count: number,          // Number kept
 *   reason: string              // Brief explanation of filtering
 * }
 */
export async function POST(req) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiter(req);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate required fields
    if (!body.locations || !Array.isArray(body.locations)) {
      return NextResponse.json(
        {
          success: false,
          error: 'locations array is required'
        },
        { status: 400 }
      );
    }

    if (!body.destination) {
      return NextResponse.json(
        {
          success: false,
          error: 'destination is required'
        },
        { status: 400 }
      );
    }

    // Extract parameters
    const { locations, userInterests, destination } = body;

    //** DEV MOCK *//
    if (process.env.NODE_ENV === 'development') {
      // In development, return first 50% of locations as "curated"
      const halfCount = Math.ceil(locations.length / 2);
      const mockCurated = locations
        .slice(0, halfCount)
        .map(loc => loc.location_id)
        .filter(Boolean);

      return NextResponse.json({
        success: true,
        curated: mockCurated,
        filtered_count: locations.length - mockCurated.length,
        kept_count: mockCurated.length,
        reason: 'Mock curation: kept first 50% of locations'
      });
    }

    // Call AI curation
    const result = await curateActivities(
      locations,
      userInterests || '',
      destination
    );

    const response = NextResponse.json({
      success: true,
      curated: result.curated,
      filtered_count: result.filtered_count,
      kept_count: result.kept_count,
      reason: result.reason
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

    return response;

  } catch (error) {
    console.error('AI Curate Activities API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to curate activities',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
