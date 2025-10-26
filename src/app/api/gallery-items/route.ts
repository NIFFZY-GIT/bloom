import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';

const COLUMNS = 'id, category, image_path, title, description';

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const validateRequired = (field: string, value: string) => {
  if (!value) {
    throw new Error(`${field} is required`);
  }
};

export async function GET() {
  try {
    const result = await query(`SELECT ${COLUMNS} FROM gallery_items ORDER BY id DESC`);
    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return NextResponse.json({ message: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = normalizeText(body?.category);
    const title = normalizeText(body?.title);
    const imagePath = normalizeText(body?.imagePath ?? body?.image_path);
    const description = normalizeText(body?.description);

    validateRequired('Category', category);
    validateRequired('Title', title);
    validateRequired('Image path', imagePath);

    const insertResult = await query(
      `INSERT INTO gallery_items (category, image_path, title, description)
       VALUES ($1, $2, $3, NULLIF($4, ''))
       RETURNING ${COLUMNS}`,
      [category, imagePath, title, description]
    );

    revalidatePath('/admin/admingallery');
    revalidatePath('/gallery');

    return NextResponse.json({ item: insertResult.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('is required')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error('Failed to create gallery item:', error);
    return NextResponse.json({ message: 'Failed to create gallery item' }, { status: 500 });
  }
}
