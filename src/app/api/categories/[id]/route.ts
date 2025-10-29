import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT id, name, image, color, "bgColor", description, animation
       FROM "Category"
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Failed to load category:', error);
    return NextResponse.json({ message: 'Failed to load category' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
  }

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
      `UPDATE "Category"
       SET name = $1, image = $2, color = $3, "bgColor" = $4, description = $5, animation = $6
       WHERE id = $7
       RETURNING id, name, image, color, "bgColor", description, animation`,
      [name, image, color, bgColor, description, animation, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Category updated successfully',
      category: result.rows[0]
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
  }

  try {
    const result = await query(
      `DELETE FROM "Category" WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}
