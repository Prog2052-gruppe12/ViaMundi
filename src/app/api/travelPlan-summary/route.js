import { NextResponse } from 'next/server';
import { summarizeTravelPlan } from '@/lib/summarizeTravelPlan/ai';

/**
 * POST /api/summarize-travel-plan
 * 
 * Request body:
 * {
 *   "travelPlan": { ... }, // The travel plan object with dates as keys
 * }
 * 
 * Response:
 * {
 *   "summarizedPlan": {
 *     "YYYY-MM-DD": {
 *       "dayNumber": number,
 *       "attractions": [{ "location_id": "string", "attraction_summary": "string" }],
 *       "restaurants": [{ "location_id": "string", "restaurant_summary": "string" }]
 *     },
 *     ...
 *   }
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { travelPlan} = body;

    // Validate input
    if (!travelPlan || typeof travelPlan !== 'object' || Object.keys(travelPlan).length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty travel plan provided' },
        { status: 400 }
      );
    }

    // Call AI summarization
    const summarizedPlan = await summarizeTravelPlan(travelPlan);

    return NextResponse.json({ summarizedPlan });

  } catch (error) {
    console.error('Failed to summarize travel plan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize travel plan' },
      { status: 500 }
    );
  }
}
