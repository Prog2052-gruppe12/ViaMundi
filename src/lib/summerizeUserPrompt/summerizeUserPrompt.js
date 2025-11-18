import groq from "../groq/client";
import { 
    PROMPT_SUMMARIZE_USER_INTERESTS, 
    SYSTEM_PROMPT_SUMMARIZE_USER_INTERESTS,
    PROMPT_SUMMARIZE_USER_RESTAURANTS,
    SYSTEM_PROMPT_SUMMARIZE_USER_RESTAURANTS
} from "./prompts";

/**
 * Helper function to call Groq API
 */
async function callGroqAPI(systemPrompt, userPrompt, queryType) {
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b", 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });
        
        const content = response.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error(`No content in Groq response for ${queryType}`);
        }
        
        const parsed = JSON.parse(content);
        
        if (parsed.error === true) {
            throw new Error(parsed.error_message || 'AI detected invalid input');
        }
        
        if (!parsed.queries || !Array.isArray(parsed.queries)) {
            throw new Error(`Invalid response format from Groq for ${queryType}`);
        }
        
        return parsed;
    } catch (error) {
        console.error(`Error in callGroqAPI (${queryType}):`, error);
        throw error;
    }
}

/**
 * Generate TripAdvisor search queries for INTERESTS AND ACTIVITIES
 * @param {Object} userData - User travel data for interests/activities
 * @param {string} userData.destination - Destination city/country
 * @param {string} userData.dateFrom - Start date (ISO string)
 * @param {string} userData.dateTo - End date (ISO string)
 * @param {number} userData.travelers - Number of travelers
 * @param {string} userData.interests - Comma-separated interests
 * @param {string} userData.other - Additional free text
 * @returns {Promise<{queries: string[]}>} Interest/activity search queries
 */
export async function summarizeUserInterests(userData) {
    return callGroqAPI(
        SYSTEM_PROMPT_SUMMARIZE_USER_INTERESTS,
        PROMPT_SUMMARIZE_USER_INTERESTS(userData),
        'interests'
    );
}

/**
 * Generate TripAdvisor search queries for RESTAURANTS AND DINING
 * @param {Object} restaurantData - Restaurant-specific data
 * @param {string} restaurantData.destination - Destination city/country
 * @param {string} restaurantData.dateFrom - Start date (ISO string)
 * @param {string} restaurantData.dateTo - End date (ISO string)
 * @param {number} restaurantData.travelers - Number of travelers
 * @param {string} restaurantData.interests - Cuisine preferences or dining interests
 * @param {string} restaurantData.other - Additional dining preferences
 * @returns {Promise<{queries: string[]}>} Restaurant search queries
 */
export async function summarizeUserRestaurants(restaurantData) {
    return callGroqAPI(
        SYSTEM_PROMPT_SUMMARIZE_USER_RESTAURANTS,
        PROMPT_SUMMARIZE_USER_RESTAURANTS(restaurantData),
        'restaurants'
    );
}

/**
 * LEGACY: Summarize user interests and generate TripAdvisor search queries for both interests and restaurants
 * @param {Object} userData - User travel data for interests/activities
 * @param {Object} restaurantData - Restaurant-specific data
 * @returns {Promise<{interests: {queries: string[]}, restaurants: {queries: string[]}}>} Object with both interests and restaurant queries
 * @deprecated Use summarizeUserInterests and summarizeUserRestaurants separately
 */
export async function summerizeUserPrompt(userData, restaurantData) {
    try {
        // Call both APIs in parallel for better performance
        const [interestsResult, restaurantsResult] = await Promise.all([
            summarizeUserInterests(userData),
            summarizeUserRestaurants(restaurantData)
        ]);
        
        return {
            interests: interestsResult,
            restaurants: restaurantsResult
        };
    } catch (error) {
        console.error('Error in summerizeUserPrompt:', error);
        throw error;
    }
}