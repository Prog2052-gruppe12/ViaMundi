import { NextResponse } from "next/server";
import { curateDayActivities } from "@/lib/curateDayActivities/curateDayActivites";
import rateLimit from "@/lib/ratelimiter/ratelimit";

const rateLimiter = rateLimit(100, 60000);

/**
 * POST /api/ai/curate-day
 *
 * Curates and filters TripAdvisor results using AI to keep only high-quality,
 * relevant activities. Returns location_ids that passed the quality filter.
 *
 * Request body:
 * {
 *   locations: Array<Object>,      // TripAdvisor location objects with details
 *   restaurants: Array<Object>,    // TripAdvisor restaurant objects with details
 *   activyInterests: string,       // User's interests/preferences
 *   restaurantInterests: string,   // User's interests/preferences
 *   destination: string            // Travel destination
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
        if (!body.activities || !Array.isArray(body.activities)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'locations array is required'
                },
                { status: 400 }
            );
        }

        if (!body.restaurants || !Array.isArray(body.restaurants)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'restaurants array is required'
                },
                { status: 400 }
            );
        }

        if (!body.activityInterests) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'activityInterests is required'
                },
                { status: 400 }
            );
        }

        if (!body.restaurantInterests) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'restaurantInterests is required'
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
        const { activities, restaurants, activityInterests, restaurantInterests, destination } = body;

        // Call AI curation
        const result = await curateDayActivities(
            activities,
            restaurants,
            activityInterests,
            restaurantInterests,
            destination
        );

        const response = NextResponse.json({
            success: true,
            activityId: result.activityId,
            restaurantId: result.restaurantId,
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
