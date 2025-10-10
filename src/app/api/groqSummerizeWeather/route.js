import { NextResponse } from 'next/server';
import groq from '@/lib/groq/client';

export async function POST(request) {
  try {
    console.log('Summarizing weather data...');
    const summary = 'Weather data summarized';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Failed to generate summary:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}