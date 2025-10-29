import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get all places for a specific category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = parseInt(params.id, 10);

  if (isNaN(categoryId)) {
    return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
  }

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
       INNER JOIN "Category" c ON p."categoryId" = c.id
       WHERE p."categoryId" = $1
       ORDER BY p.id ASC`,
      [categoryId]
    );

    return NextResponse.json({ success: true, places: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Failed to load places for category:', error);
    return NextResponse.json({ message: 'Failed to load places' }, { status: 500 });
  }
}
