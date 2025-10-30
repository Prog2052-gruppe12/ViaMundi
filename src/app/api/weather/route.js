import { NextResponse } from "next/server";
import { cityIsValid } from "@/utils/cityIsValid";
import { decodeCityToCoord } from "@/utils/decodeCityToCoord";

/**
 * Get weather data from Open-Meteo API
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Weather data
 */
async function getWeather(latitude, longitude) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data = await response.json();
  return data;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    if(dateFrom && dateTo){
      return NextResponse.json({ error: 'Date range is not supported' }, { status: 400 });
    }
    const city = searchParams.get('city');
    if (!cityIsValid(city)) {
      return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
    }
    
    const { latitude, longitude } = await decodeCityToCoord(city);
    const weather = await getWeather(latitude, longitude);
    
    return NextResponse.json(weather);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}