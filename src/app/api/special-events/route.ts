import { NextResponse } from 'next/server';
import { getSpecialEventsData } from '@/lib/special-event-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getSpecialEventsData();
  return NextResponse.json(data);
}
