import { NextResponse } from 'next/server';

/**
 * Henter bilde fra TripAdvisor
 * @param {Request} request 
 * @returns {Promise<NextResponse>} {url: string}
 */
export async function GET(request) {
  try {
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
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos`;
    const params = new URLSearchParams({
      key: apiKey,
      language: 'no',
      currency: 'NOK'
    });

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

    // Check if photos exist and return the "large type" image URL
    if (data.data && data.data.length > 0) {
      return NextResponse.json(data.data[0].images.large.url, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'No photos found for this location' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error fetching attraction images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attraction images' },
      { status: 500 }
    );
  }
}


