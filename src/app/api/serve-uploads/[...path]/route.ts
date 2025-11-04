import { NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { constants } from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: filePath } = await params;
    
    if (!filePath || filePath.length === 0) {
      return new NextResponse('No file path provided', { status: 400 });
    }

    // Construct the full file path
    const fullPath = path.join(process.cwd(), 'public', 'uploads', ...filePath);

    // Security: Ensure the path is within uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fullPath.startsWith(uploadsDir)) {
      return new NextResponse('Invalid file path', { status: 403 });
    }

    // Check if file exists and is readable
    try {
      await access(fullPath, constants.R_OK);
    } catch {
      return new NextResponse('File not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(fullPath);
    
    // Determine content type based on extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
