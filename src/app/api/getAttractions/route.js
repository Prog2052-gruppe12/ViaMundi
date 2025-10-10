import { NextResponse } from 'next/server';
import { decodeCityToCord } from '@/utils/decodeCityToCord';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);
  const searchQuery = searchParams.get('interests');
  const city = searchParams.get('destination');
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
  console.log(url);

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

    //return NextResponse.json(responseData) All data

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}