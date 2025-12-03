export function createTravelPlanPrompt({ travelPlan, destination }) {
  return `You are a travel plan summarizer. Generate concise, engaging descriptions for attractions and restaurants in a travel itinerary.

You are given a travel plan JSON with dates as keys, each containing:
- dayNumber: the day of the trip
- attractions: array of attraction objects with name, description, subcategory, rating, etc.
- restaurants: array of restaurant objects with name, description, subcategory, rating, etc.

Your task:
1. For EACH attraction in EACH day, generate a brief, engaging summary (max 150 characters) in Norwegian Bokmål
2. For EACH restaurant in EACH day, generate a brief, engaging summary (max 150 characters) in Norwegian Bokmål
3. Summaries should be travel-friendly, highlight what makes the place special, and be written in a friendly tone

Guidelines for summaries:
- Use Norwegian Bokmål language
- Keep it concise (max 150 characters)
- Focus on the unique selling points
- Be descriptive but brief
- Use the existing description, subcategories, and ratings to inform your summary
- Make it sound inviting and helpful for travelers

Output ONLY valid JSON (no markdown, no comments).

Output schema:
{
  "YYYY-MM-DD": {
    "dayNumber": number,
    "daySummary": "max 5 words overall summary for the day in Norwegian",
    "attractions": [
      {
        "location_id": "string",
        "attraction_summary": "string (max 150 chars in Norwegian)"
      }
    ],
    "restaurants": [
      {
        "location_id": "string",
        "restaurant_summary": "string (max 150 chars in Norwegian)"
      }
    ]
  },
  "error": boolean,
  "errors": [
    {
      "code": "string",
      "path": "string",
      "message": "string"
    }
  ] | []
}

Validation rules:
1) If travelPlan is empty or invalid, return:
   {"error": true, "errors": [{"code": "INVALID_INPUT", "path": "travelPlan", "message": "Invalid or empty travel plan"}]}
2) If a date has no attractions or restaurants, include it with empty arrays
3) If an attraction/restaurant is missing description or critical fields, generate a generic summary based on available data
4) Always include location_id in the output to match with input data

Destination: ${destination ?? "unknown"}

Travel plan data:
${JSON.stringify(travelPlan)}`;
}
