import { NextResponse } from 'next/server';
import { decodeCityToCoord } from '@/utils/decodeCityToCoord';

/**
 * Henter attraksjoner fra TripAdvisor
 * @param {Request} req 
 * @returns {Promise<NextResponse>} {location_ids: string[]}
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('searchQuery');
  const city = searchParams.get('city');
  const radiusUnit = searchParams.get('radiusUnit');
  const { latitude: lat, longitude: lon } = await decodeCityToCoord(city);
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

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
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

    return NextResponse.json({ location_ids: locationIds });

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

