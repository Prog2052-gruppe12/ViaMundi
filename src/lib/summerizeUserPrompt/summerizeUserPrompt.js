import groq from "../groq/client";
import { PROMPT_SUMMARIZE_USER_INTERESTS, SYSTEM_PROMPT_SUMMARIZE_USER_INTERESTS } from "./prompts";


/**
 * Summarize user interests and generate TripAdvisor search queries
 * @param {Object} userData - User travel data
 * @param {string} userData.destination - Destination city/country
 * @param {string} userData.dateFrom - Start date (ISO string)
 * @param {string} userData.dateTo - End date (ISO string)
 * @param {number} userData.travelers - Number of travelers
 * @param {string} userData.interests - Comma-separated interests
 * @param {string} userData.other - Additional free text
 * @returns {Promise<{queries: string[]}>} Array of search queries
 */

export async function summerizeUserPrompt(userData) {
    try {
        const prompt = PROMPT_SUMMARIZE_USER_INTERESTS(userData);
        
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b", 
            messages: [
                { role: "system", content: SYSTEM_PROMPT_SUMMARIZE_USER_INTERESTS },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });
        
        
        const content = response.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content in Groq response');
        }
        
    
        const parsed = JSON.parse(content);
        
        if (parsed.error === true) {
            throw new Error(parsed.error_message || 'AI detected invalid input');
        }
        
        if (!parsed.queries || !Array.isArray(parsed.queries)) {
            throw new Error('Invalid response format from Groq');
        }
        
        return parsed;
    } catch (error) {
        console.error('Error in summerizeUserPrompt:', error);
        throw error;
    }
}