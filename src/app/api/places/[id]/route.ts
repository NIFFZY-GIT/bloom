import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

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
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      place: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to fetch place:', error);
    return NextResponse.json({ message: 'Failed to fetch place' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

    const result = await query('DELETE FROM "Place" WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Failed to delete place:', error);
    return NextResponse.json({ message: 'Failed to delete place' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, image, categoryId } = body;

    if (!name || !description || !image || isNaN(parseInt(categoryId, 10))) {
      return NextResponse.json({ 
        message: 'All fields are required (name, description, image, categoryId)' 
      }, { status: 400 });
    }

    // Verify category exists
    const categoryCheck = await query(
      `SELECT id FROM "Category" WHERE id = $1`,
      [categoryId]
    );

    if (categoryCheck.rows.length === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const result = await query(
      `UPDATE "Place" 
       SET name = $1, description = $2, image = $3, "categoryId" = $4
       WHERE id = $5
       RETURNING id`,
      [name, description, image, categoryId, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Place updated successfully' });
  } catch (error) {
    console.error('Failed to update place:', error);
    return NextResponse.json({ message: 'Failed to update place' }, { status: 500 });
  }
}

