import { NextResponse } from 'next/server';
import { getSpecialEventsData } from '@/lib/special-event-content';

export async function GET() {
  const data = await getSpecialEventsData();
  return NextResponse.json(data);
}
