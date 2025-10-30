import { createWeatherPrompt } from '@/lib/weather/prompt';
import groq from '@/lib/groq/client';


export async function summarizeWeather({ city, dateFrom, dateTo, weatherData }) {
  const prompt = createWeatherPrompt({ 
    city, 
    dateFrom, 
    dateTo, 
    weatherData: weatherData 
  });
  
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  const parsed = JSON.parse(content);
  if (parsed.error === true) {
    throw new Error(parsed.error_message || 'AI detected invalid input');
  }

  return parsed;
}
