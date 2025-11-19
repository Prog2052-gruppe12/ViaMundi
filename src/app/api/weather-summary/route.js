import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather/weather';
import { summarizeWeather } from '@/lib/weather/ai';
import { decodeCityToCord } from '@/utils/decodeCityToCord';
import { cityIsValid } from '@/utils/cityIsValid';
import rateLimit from '@/lib/ratelimiter/ratelimit';

const rateLimiter = rateLimit(10, 60000);

export async function GET(request) {
  try {
    const rateLimitResult = await rateLimiter(request);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${rateLimitResult.retryAfter} seconds.`,
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('destination').split(',')[0].trim();
    const city = searchParams.get('destination').split(',')[1].trim();
    const dateFrom = searchParams.get('dateFrom') ?? new Date().toISOString().slice(0,10);
    const d = new Date(dateFrom); d.setDate(d.getDate() + 4);
    const dateTo = searchParams.get('dateTo') ?? d.toISOString().slice(0,10);

    if (!cityIsValid(city)) {
      return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
    }

    const { latitude, longitude } = await decodeCityToCord(city, country);
    const weatherData = await fetchWeather({ latitude, longitude, dateFrom, dateTo });
    
    const aiSummary = await summarizeWeather({ 
      city, 
      dateFrom, 
      dateTo, 
      weatherData 
    });

    // Return response with rate limit headers
    return NextResponse.json(
      { aiSummary },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed', detail: error.message }, { status: 500 });
  }
}
