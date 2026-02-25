import { getNewUpdatesCount } from "@/lib/local-content";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = getNewUpdatesCount();
    return NextResponse.json({ count });
  } catch (e) {
    return NextResponse.json({ count: 0 });
  }
}
