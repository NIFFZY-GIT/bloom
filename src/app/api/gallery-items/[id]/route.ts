import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { query } from '@/lib/db';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

const COLUMNS = 'id, category, image_path, title, description';

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const parseId = (idValue: string) => {
  const numericId = Number(idValue);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error('Invalid identifier');
  }
  return numericId;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseId(paramId);
    const body = await request.json();

    const category = normalizeText(body?.category);
    const title = normalizeText(body?.title);
    const imagePath = normalizeText(body?.imagePath ?? body?.image_path);
    const description = normalizeText(body?.description);

    if (!category || !title || !imagePath) {
      return NextResponse.json({ message: 'Category, title, and image path are required.' }, { status: 400 });
    }

    const updateResult = await query(
      `UPDATE gallery_items
       SET category = $1,
           image_path = $2,
           title = $3,
           description = NULLIF($4, '')
       WHERE id = $5
       RETURNING ${COLUMNS}`,
      [category, imagePath, title, description, id]
    );

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    revalidatePath('/admin/admingallery');
    revalidatePath('/gallery');

    return NextResponse.json({ item: updateResult.rows[0] });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid identifier') {
      return NextResponse.json({ message: 'Invalid gallery item id' }, { status: 400 });
    }

    console.error('Failed to update gallery item:', error);
    return NextResponse.json({ message: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: paramId } = await params;
    const id = parseId(paramId);
    const result = await query('DELETE FROM gallery_items WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid identifier') {
      return NextResponse.json({ message: 'Invalid gallery item id' }, { status: 400 });
    }

    revalidatePath('/admin/admingallery');
    revalidatePath('/gallery');

    console.error('Failed to delete gallery item:', error);
    return NextResponse.json({ message: 'Failed to delete gallery item' }, { status: 500 });
  }
}
