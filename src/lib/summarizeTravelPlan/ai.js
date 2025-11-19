import { createTravelPlanPrompt } from '@/lib/summarizeTravelPlan/prompt';
import groq from '@/lib/groq/client';

/**
 * Summarize a travel plan using AI to generate descriptions for attractions and restaurants
 * @param {Object} params - Parameters for summarization
 * @param {Object} params.travelPlan - The travel plan object with dates as keys
 * @param {string} params.destination - The destination city/country
 * @returns {Promise<Object>} Summarized travel plan with attraction_summary and restaurant_summary for each item
 */
function stripTravelPlanForAI(travelPlan) {
    const stripped = {};
    
    for (const [dateKey, dayData] of Object.entries(travelPlan)) {
        stripped[dateKey] = {
            dayNumber: dayData.dayNumber,
            attractions: (dayData.attractions || []).map(attr => ({
                location_id: attr.location_id,
                name: attr.name,
                description: attr.description || "",
                rating: attr.rating || "",
                subcategory: (attr.subcategory || []).slice(0, 2).map(s => ({
                    localized_name: s.localized_name
                }))
            })),
            restaurants: (dayData.restaurants || []).map(rest => ({
                location_id: rest.location_id,
                name: rest.name,
                description: rest.description || "",
                rating: rest.rating || "",
                subcategory: (rest.subcategory || []).slice(0, 2).map(s => ({
                    localized_name: s.localized_name
                }))
            }))
        };
    }
    
    return stripped;
}



export async function summarizeTravelPlan(travelPlan) {
  try {
    const prompt = createTravelPlanPrompt({travelPlan: stripTravelPlanForAI(travelPlan)});
    
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in Groq response for travel plan summarization');
    }
    
    const parsed = JSON.parse(content);
    
    if (parsed.error === true) {
      throw new Error(parsed.errors?.[0]?.message || 'AI detected invalid input');
    }

    return parsed;
  } catch (error) {
    console.error('Error in summarizeTravelPlan:', error);
    throw error;
  }
}
