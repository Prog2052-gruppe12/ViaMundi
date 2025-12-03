import groq from "../groq/client";
import {
    PROMPT_GENERATE_STORY,
    SYSTEM_PROMPT_GENERATE_STORY
} from "./prompts";

/**
 * Helper function to call Groq API
 */
async function callGroqAPI(systemPrompt, userPrompt, queryType) {
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
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

        return parsed;
    } catch (error) {
        console.error(`Error in callGroqAPI (${queryType}):`, error);
        throw error;
    }
}

/**
 * Generate story
 * @param {Object} userData - User travel data for interests/activities
 * @param {string} userData.destination - Destination city/country
 * @param {string} userData.dateFrom - Start date (ISO string)
 * @param {string} userData.dateTo - End date (ISO string)
 * @param {number} userData.travelers - Number of travelers
 * @param {string} userData.interests - Comma-separated interests
 * @param {string} userData.other - Additional free text
 * @returns {Promise<{queries: string[]}>} Travel story
 */
export async function createTravelStory(userData) {
    return callGroqAPI(
        SYSTEM_PROMPT_GENERATE_STORY,
        PROMPT_GENERATE_STORY(userData),
        'story'
    );
}