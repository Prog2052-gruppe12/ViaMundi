import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch restaurant location IDs from the TripAdvisor API based on search parameters.
 *
 * @param {Request} req - The incoming request object containing URL and search parameters.
 * @returns {Promise<Response>} A JSON response containing either the list of restaurant location IDs or an error message.
 *
 * @throws {Error} Returns a 400 error if 'searchQuery' is missing, a 500 error for internal server errors, or a TripAdvisor API error status if the fetch fails.
 *
 * @example
 * // Example request URL:
 * // /api/getRestaurants?searchQuery=Oslo&latLong=59.9139,10.7522&radius=10&radiusUnit=km
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('searchQuery');
  const latLong = searchParams.get('latLong')
  const radiusUnit = searchParams.get('radiusUnit') || 'km';
  const radius = searchParams.get('radius') || '10';

  if (!searchQuery) {
    return NextResponse.json({ error: 'searchQuery is required' }, { status: 400 });
  }

  const apiKey = process.env.TRIP_ADVISOR_API_KEY;
  const baseUrl = 'https://api.content.tripadvisor.com/api/v1/location/search';

  const params = new URLSearchParams({
    key: apiKey,
    searchQuery: searchQuery,
    category: 'restaurants',
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

    //return NextResponse.json(responseData) All data

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}