import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

const COLUMNS = 'id, name, position, avatar, rating, text';

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const toRating = (value: unknown) => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return NaN;
};

const parseId = (idValue: string) => {
  const numericId = Number(idValue);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error('Invalid identifier');
  }
  return numericId;
};

export async function PUT(request: Request, { params: paramsPromise }: RouteParams) {
  try {
    const params = await paramsPromise;
    const id = parseId(params.id);
    const body = await request.json();

    const name = normalizeText(body?.name);
    const position = normalizeText(body?.position);
    const avatar = normalizeText(body?.avatar);
    const ratingValue = toRating(body?.rating);
    const text = normalizeText(body?.text);

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ message: 'Review text is required' }, { status: 400 });
    }
    if (Number.isNaN(ratingValue)) {
      return NextResponse.json({ message: 'Rating must be a number' }, { status: 400 });
    }
    if (ratingValue < 0 || ratingValue > 5) {
      return NextResponse.json({ message: 'Rating must be between 0 and 5' }, { status: 400 });
    }

    const updateResult = await query(
      `UPDATE reviews
       SET name = $1,
           position = NULLIF($2, ''),
           avatar = NULLIF($3, ''),
           rating = $4,
           text = $5
       WHERE id = $6
       RETURNING ${COLUMNS}`,
      [name, position, avatar, ratingValue, text, id]
    );

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ review: updateResult.rows[0] });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid identifier') {
      return NextResponse.json({ message: 'Invalid review id' }, { status: 400 });
    }

    console.error('Failed to update review:', error);
    return NextResponse.json({ message: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params: paramsPromise }: RouteParams) {
  try {
    const params = await paramsPromise;
    const id = parseId(params.id);
    const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid identifier') {
      return NextResponse.json({ message: 'Invalid review id' }, { status: 400 });
    }

    console.error('Failed to delete review:', error);
    return NextResponse.json({ message: 'Failed to delete review' }, { status: 500 });
  }
}
