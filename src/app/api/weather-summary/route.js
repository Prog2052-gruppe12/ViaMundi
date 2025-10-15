import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather/weather';
import { summarizeWeather } from '@/lib/weather/ai';
import { decodeCityToCord } from '@/utils/decodeCityToCord';
import { cityIsValid } from '@/utils/cityIsValid';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') ?? '';
    const dateFrom = searchParams.get('dateFrom') ?? new Date().toISOString().slice(0,10);
    const d = new Date(dateFrom); d.setDate(d.getDate() + 4);
    const dateTo = searchParams.get('dateTo') ?? d.toISOString().slice(0,10);

    if (!cityIsValid(city)) {
      return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
    }

    const { latitude, longitude } = await decodeCityToCord(city);
    const weatherData = await fetchWeather({ latitude, longitude, dateFrom, dateTo });
    
    const aiSummary = await summarizeWeather({ 
      city, 
      dateFrom, 
      dateTo, 
      weatherData 
    });
    return NextResponse.json({
      aiSummary 
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed', detail: e.message }, { status: 500 });
  }
}
