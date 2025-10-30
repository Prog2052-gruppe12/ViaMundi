import { NextResponse } from "next/server";
import { summerizeUserPrompt } from "@/lib/summerizeUserPrompt/summerizeUserPrompt";
import rateLimit from "@/lib/ratelimiter/ratelimit";

const rateLimiter = rateLimit(10, 60000);

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
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const body = await req.json();
    
    // Validate required fields only
    if (!body.destination) {
      return NextResponse.json(
        { error: 'destination is required' },
        { status: 400 }
      );
    }
    
    const result = await summerizeUserPrompt({
      destination: body.destination,
      dateFrom: body.dateFrom || '',
      dateTo: body.dateTo || '',
      travelers: body.travelers || 1,
      interests: body.interests || '',
      other: body.other || ''
    });
    
    const response = NextResponse.json({
      success: true,
      data: result
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '10');
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

