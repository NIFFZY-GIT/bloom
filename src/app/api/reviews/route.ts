import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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

export async function GET() {
  try {
    const result = await query(`SELECT ${COLUMNS} FROM reviews ORDER BY id DESC`);
    return NextResponse.json({ reviews: result.rows });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const insertResult = await query(
      `INSERT INTO reviews (name, position, avatar, rating, text)
       VALUES ($1, NULLIF($2, ''), NULLIF($3, ''), $4, $5)
       RETURNING ${COLUMNS}`,
      [name, position, avatar, ratingValue, text]
    );

    return NextResponse.json({ review: insertResult.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ message: 'Failed to create review' }, { status: 500 });
  }
}
