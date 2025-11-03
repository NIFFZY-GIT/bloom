import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/jpg',
  'application/pdf',
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    // Check if file exists and is a Blob/File-like object
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Type guard for file-like objects in Node.js environment
    const fileObj = file as Blob & { name?: string; type: string };
    
    if (!fileObj.arrayBuffer || !fileObj.type) {
      return NextResponse.json({ message: 'Invalid file object' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(fileObj.type)) {
      return NextResponse.json({ message: 'Unsupported file type' }, { status: 400 });
    }

    const folderInput = formData.get('folder');
    let folderSegments: string[] = [];
    if (typeof folderInput === 'string') {
      const trimmed = folderInput.trim();
      if (trimmed.length > 0) {
        const candidates = trimmed.split(/[\\/]+/);
        folderSegments = candidates.filter(segment => /^[a-zA-Z0-9_-]+$/.test(segment));
      }
    }

    const bytes = await fileObj.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ message: 'File too large. Max size is 10MB.' }, { status: 400 });
    }

  // Always store uploads under public/uploads to keep a single writable directory
  // This avoids splitting files between public/images and public/uploads which
  // caused confusion and missing files in production.
  const baseDir = path.join(process.cwd(), 'public', 'uploads', ...folderSegments);
  await mkdir(baseDir, { recursive: true });

    const extensionByType: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
    };

  const inferredExtension = extensionByType[fileObj.type];
  const fileName = fileObj.name || 'unnamed';
  const fileExtension = inferredExtension || path.extname(fileName) || '.bin';
  const uniqueName = `${crypto.randomUUID()}${fileExtension}`;
  const filePath = path.join(baseDir, uniqueName);

    await writeFile(filePath, buffer);

    // Construct public URL - always point to /uploads
    const publicPathSegments = ['uploads', ...folderSegments, uniqueName];
    const publicUrl = `/${publicPathSegments.join('/')}`;

    return NextResponse.json({ success: true, url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
  }
}
