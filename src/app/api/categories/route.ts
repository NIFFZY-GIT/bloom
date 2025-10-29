import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT
         id,
         name,
         image,
         color,
         "bgColor",
         description,
         animation
       FROM "Category"
       ORDER BY id ASC`
    );

    return NextResponse.json({ success: true, categories: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Failed to load categories:', error);
    return NextResponse.json({ message: 'Failed to load categories' }, { status: 500 });
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
  const image = body?.image?.trim();
  const color = body?.color?.trim();
  const bgColor = body?.bgColor?.trim();
  const description = body?.description?.trim();
  const animation = body?.animation?.trim();

  if (!name || !image || !color || !bgColor || !description || !animation) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const result = await query(
      `INSERT INTO "Category" (name, image, color, "bgColor", description, animation)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, image, color, "bgColor", description, animation`,
      [name, image, color, bgColor, description, animation]
    );

    const newCategory = result.rows[0];

    return NextResponse.json({ 
      success: true, 
      message: 'Category created successfully',
      category: newCategory
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}
