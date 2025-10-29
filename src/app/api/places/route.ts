import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT
         p.id,
         p.name,
         p.description,
         p.image,
         p."categoryId",
         c.name as "categoryName"
       FROM "Place" p
       LEFT JOIN "Category" c ON p."categoryId" = c.id
       ORDER BY p.id ASC`
    );

    return NextResponse.json({ success: true, places: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Failed to load places:', error);
    return NextResponse.json({ message: 'Failed to load places' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const name = body?.name?.trim();
  const description = body?.description?.trim();
  const image = body?.image?.trim();
  const categoryId = parseInt(body?.categoryId, 10);

  if (!name || !description || !image || isNaN(categoryId)) {
    return NextResponse.json({ message: 'All fields are required (name, description, image, categoryId)' }, { status: 400 });
  }

  try {
    // Verify category exists
    const categoryCheck = await query(
      `SELECT id FROM "Category" WHERE id = $1`,
      [categoryId]
    );

    if (categoryCheck.rows.length === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const result = await query(
      `INSERT INTO "Place" (name, description, image, "categoryId")
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, image, "categoryId"`,
      [name, description, image, categoryId]
    );

    const newPlace = result.rows[0];

    return NextResponse.json({ 
      success: true, 
      message: 'Place created successfully',
      place: newPlace
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create place:', error);
    return NextResponse.json({ message: 'Failed to create place' }, { status: 500 });
  }
}
