import { NextResponse } from 'next/server';
import { decodeCityToCord } from '@/utils/decodeCityToCord';
import rateLimit from '@/lib/ratelimiter/ratelimit';

const rateLimiter = rateLimit(100, 60000);

export async function GET(req) {
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
  
  const { searchParams } = new URL(req.url);
  //console.log(searchParams);
  const searchQuery = searchParams.get('interests');
  const city = searchParams.get('destination').split(',')[1].trim();
  const radiusUnit = searchParams.get('radiusUnit');
  const { latitude: lat, longitude: lon } = await decodeCityToCord(city);
  const latLong = lat && lon ? `${lat},${lon}` : null;
  const radius = searchParams.get('radius');

  if (!searchQuery) {
    return NextResponse.json({ error: 'searchQuery is required' }, { status: 400 });
  }

  const apiKey = process.env.TRIP_ADVISOR_API_KEY;
  const baseUrl = 'https://api.content.tripadvisor.com/api/v1/location/search';

  const params = new URLSearchParams({
    key: apiKey,
    searchQuery: searchQuery,
    category: 'attractions',
    language: 'no',

  });

  if (latLong) params.append('latLong', latLong);
  if (radius) params.append('radius', radius);
  if (radiusUnit) params.append('radiusUnit', radiusUnit);

  const url = `${baseUrl}?${params.toString()}`;
  //console.log(url);

  //** DEV MOCK *//
  if (process.env.NODE_ENV === 'development') {
    //console.log('Mock response for ' + url);

    return NextResponse.json({
      location_ids: [
        "00001", "00002", "00003", "00004", "00005",
        "00006", "00007", "00008", "00009", "00010",
      ],
    });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': apiKey,
        'Referer': 'https://prog-2053-semester-project.vercel.app',
        'Origin': 'https://prog-2053-semester-project.vercel.app',
      },
    });
    if (!response.ok) {
      console.error('TripAdvisor API error:', response.status, response.statusText);
      const errorBody = await response.text();
      console.error('Error Body:', errorBody);
      return NextResponse.json({ error: 'Failed to fetch data from TripAdvisor' }, { status: response.status });
    }

    const responseData = await response.json();

    const locationIds = responseData.data.map(location => location.location_id);

    return NextResponse.json(
      { location_ids: locationIds },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      }
    );

    //return NextResponse.json(responseData) All data

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}