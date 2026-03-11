import { NextResponse } from 'next/server';
import { getTestimoniesData } from '@/lib/testimony-content';

export async function GET() {
  const data = await getTestimoniesData();
  return NextResponse.json(data);
}
