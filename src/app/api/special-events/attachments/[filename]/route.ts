import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getStoragePath } from '@/lib/storage-paths';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
): Promise<Response> {
  const { filename } = await context.params;
  const storageDir = getStoragePath('content/special-events');
  const filePath = path.join(storageDir, filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  
  const ext = path.extname(filename).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
  };

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
