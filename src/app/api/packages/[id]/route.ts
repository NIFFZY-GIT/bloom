import { NextResponse } from 'next/server';

import { query } from '@/lib/db';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ message: 'Invalid package id' }, { status: 400 });
  }

  try {
    const result = await query('SELECT * FROM tour_packages WHERE id = $1', [numericId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ message: 'Invalid package id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      duration,
      image_path,
      category,
      highlights,
      includes,
      difficulty,
      rating,
      reviews,
    } = body;

    const normalizedImagePath = typeof image_path === 'string' && image_path.trim().length === 0
      ? null
      : image_path;
    const normalizedHighlights = Array.isArray(highlights) ? highlights : [];
    const normalizedIncludes = Array.isArray(includes) ? includes : [];

    if (!title || !description || !price || !duration || !category || !difficulty) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE tour_packages
      SET title = $1,
          description = $2,
          price = $3,
          duration = $4,
          image_path = $5,
          category = $6,
          highlights = $7,
          includes = $8,
          difficulty = $9,
          rating = COALESCE($10, rating),
          reviews = COALESCE($11, reviews)
      WHERE id = $12
      RETURNING *;
    `;

    const values = [
      title,
      description,
      price,
      duration,
      normalizedImagePath,
      category,
      normalizedHighlights,
      normalizedIncludes,
      difficulty,
      rating,
      reviews,
      numericId,
    ];

    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ message: 'Invalid package id' }, { status: 400 });
  }

  try {
    const result = await query('DELETE FROM tour_packages WHERE id = $1 RETURNING id', [numericId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
