import { NextResponse } from 'next/server';
import rateLimit from '@/lib/ratelimiter/ratelimit';

const rateLimiter = rateLimit(100, 60000);
/**
 * Henter informasjon om en attraksjon fra TripAdvisor
 * @param {Request} request 
 * @returns {Promise<NextResponse>} {data: object}
 */
export async function GET(request) {
  try {
    const rateLimitResult = await rateLimiter(request);
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

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    // Validate required parameters
    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId parameter is required' },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.TRIP_ADVISOR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'TripAdvisor API key not configured' },
        { status: 500 }
      );
    }

    // Make request to TripAdvisor API
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details`;
    const params = new URLSearchParams({
      key: apiKey,
      language: 'no',
      currency: 'NOK'
    });

    //** DEV MOCK *//
    if (process.env.NODE_ENV === 'development') {
      console.log('Mock response for ' + url + '?' + params);

      return NextResponse.json({
        location_id: locationId,
        name: `Mock destination ${locationId}`,
        subcategory: [
          { localized_name: "Mock gruppe 1" },
          { localized_name: "Mock gruppe 2" },
          { localized_name: "Mock gruppe 3" },
        ],
        rating: "4.5", // 👈 string or number, as expected
        ranking_data: {
          ranking_string: "Nr. 3 av 140 mock ting å gjøre" // 👈 matches location["ranking_data"]["ranking_string"]
        },
        rating_image_url: "https://picsum.photos/70/5/", // 👈 matches location["rating_image_url"]
        num_reviews: "254", // 👈 matches location["num_reviews"]
        description: "This is a mocked description for the destination.",
        web_url: `https://example.com/location/${locationId}`, // 👈 matches location["web_url"]
      });
    }

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TripAdvisor API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200, headers: {
              'X-RateLimit-Limit': '10',
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
            }});

  } catch (error) {
    console.error('Error fetching attraction details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attraction details' },
      { status: 500 }
    );
  }
}


