import { NextResponse } from "next/server";
import { summarizeUserInterests, summarizeUserRestaurants } from "@/lib/summerizeUserPrompt/summerizeUserPrompt";
import rateLimit from "@/lib/ratelimiter/ratelimit";

const rateLimiter = rateLimit(100, 60000);

export async function POST(req) {
  try {
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

    const body = await req.json();

    // Validate required fields
    if (!body.destination) {
      return NextResponse.json(
        { 
          success: false,
          error: 'destination is required' 
        },
        { status: 400 }
      );
    }

    // Validate type parameter
    const queryType = body.type || 'interests';
    if (!['interests', 'restaurants', 'both'].includes(queryType)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'type must be one of: interests, restaurants, both' 
        },
        { status: 400 }
      );
    }

    //** DEV MOCK *//
    if (process.env.NODE_ENV === 'development') {
      const mockData = {
        interests: { queries: ["Mock interest query 1", "Mock interest query 2"] },
        restaurants: { queries: ["Mock restaurant query 1", "Mock restaurant query 2"] }
      };

      return NextResponse.json({
        success: true,
        type: queryType,
        data: queryType === 'both' ? mockData : mockData[queryType]
      });
    }

    const userData = {
      destination: body.destination,
      dateFrom: body.dateFrom || '',
      dateTo: body.dateTo || '',
      travelers: body.travelers || 1,
      interests: body.interests || '',
      other: body.other || ''
    };

    let result;

    // Handle different query types
    if (queryType === 'both') {
      const [interestsResult, restaurantsResult] = await Promise.all([
        summarizeUserInterests(userData),
        summarizeUserRestaurants(userData)
      ]);
      
      result = {
        interests: interestsResult,
        restaurants: restaurantsResult
      };
    } else if (queryType === 'restaurants') {
      result = await summarizeUserRestaurants(userData);
    } else {
      result = await summarizeUserInterests(userData);
    }

    const response = NextResponse.json({
      success: true,
      type: queryType,
      data: result
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

    return response;

  } catch (error) {
    console.error('AI Summarize API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate search queries',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

