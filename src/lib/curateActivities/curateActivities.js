import groq from "../groq/client";
import { SYSTEM_PROMPT_CURATE_ACTIVITIES, PROMPT_CURATE_ACTIVITIES } from "./prompt";

/**
 * Curate and filter TripAdvisor locations using AI
 *
 * Takes a list of TripAdvisor location objects and filters them to keep only
 * high-quality, relevant activities that match user interests.
 *
 * @param {Array<Object>} locations - Array of TripAdvisor location objects with details
 * @param {string} userInterests - User's stated interests/preferences
 * @param {string} destination - Travel destination city/country
 * @returns {Promise<{curated: string[], filtered_count: number, kept_count: number, reason: string}>}
 * @throws {Error} If AI curation fails or returns invalid response
 */
export async function curateActivities(locations, userInterests, destination) {
  try {
    // Validate inputs
    if (!Array.isArray(locations) || locations.length === 0) {
      console.warn('No locations provided for curation');
      return {
        curated: [],
        filtered_count: 0,
        kept_count: 0,
        reason: 'No locations to curate'
      };
    }

    // Ensure all locations have location_id
    const validLocations = locations.filter(loc => loc.location_id);

    if (validLocations.length === 0) {
      throw new Error('No valid locations with location_id found');
    }

    // Call Groq API for curation
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // Fast model for filtering
      messages: [
        { role: "system", content: SYSTEM_PROMPT_CURATE_ACTIVITIES },
        {
          role: "user",
          content: PROMPT_CURATE_ACTIVITIES(validLocations, userInterests, destination)
        }
      ],
      temperature: 0.3, // Low temperature for consistent, conservative filtering
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Groq response for activity curation');
    }

    const parsed = JSON.parse(content);

    // Validate response structure
    if (!parsed.curated || !Array.isArray(parsed.curated)) {
      throw new Error('Invalid curation response format: missing or invalid curated array');
    }

    // Ensure all returned IDs are valid
    const validIds = parsed.curated.filter(id =>
      validLocations.some(loc => loc.location_id === id)
    );

    return {
      curated: validIds,
      filtered_count: parsed.filtered_count || (validLocations.length - validIds.length),
      kept_count: validIds.length,
      reason: parsed.reason || 'AI curation completed'
    };

  } catch (error) {
    console.error('Error in curateActivities:', error);
    throw new Error(`Activity curation failed: ${error.message}`);
  }
}
