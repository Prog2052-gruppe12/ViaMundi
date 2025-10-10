/**
 * Handles GET requests to fetch the large image URL for a given location from the TripAdvisor API.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A JSON response containing the large image URL, or an error message with appropriate status code.
 *
 * @throws {Error} Returns a 400 error if locationId is missing, a 500 error if the API key is not configured,
 *                 a 404 error if no photos are found, or a 500 error if the TripAdvisor API request fails.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    // Validate required parameters
    if (!locationId) {
      return Response.json(
        { error: 'locationId parameter is required' },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.TRIP_ADVISOR_API_KEY;
    if (!apiKey) {
      return Response.json(
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
      return Response.json(data.data[0].images.large.url, { status: 200 });
    } else {
      return Response.json(
        { error: 'No photos found for this location' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error fetching attraction images:', error);
    return Response.json(
      { error: 'Failed to fetch attraction images' },
      { status: 500 }
    );
  }
}