import { NextResponse } from 'next/server';
import { getOutreachReports } from '@/lib/outreach-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getOutreachReports();
  return NextResponse.json(data);
}
