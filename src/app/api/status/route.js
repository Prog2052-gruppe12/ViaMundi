import { NextResponse } from 'next/server';

/**
 * Status endpoint for appen
 * @returns {Promise<NextResponse>} Status response
 */
export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
  