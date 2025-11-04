import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

    const result = await query(
      `SELECT 
         id,
         name,
         description,
         image_path as "imagePath",
         category,
         duration,
         location,
         highlights,
         price,
         gallery_images as "galleryImages",
         created_at as "createdAt",
         updated_at as "updatedAt"
       FROM places
       WHERE id = $1`,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

    const result = await query('DELETE FROM places WHERE id = $1 RETURNING id', [id]);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, imagePath, category, duration, location, highlights, galleryImages, price } = body;

    if (!name) {
      return NextResponse.json({ 
        message: 'Name is required' 
      }, { status: 400 });
    }

    const result = await query(
      `UPDATE places 
       SET name = $1, 
           description = $2, 
           image_path = $3, 
           category = $4,
           duration = $5,
           location = $6,
           highlights = $7::jsonb,
           price = $8,
           gallery_images = $9::jsonb,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING id, name, description, image_path as "imagePath", category, duration, location, highlights, price, gallery_images as "galleryImages"`,
      [name, description, imagePath, category, duration, location, JSON.stringify(highlights || []), price || 0, JSON.stringify(galleryImages || []), id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Place updated successfully',
      place: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to update place:', error);
    return NextResponse.json({ message: 'Failed to update place' }, { status: 500 });
  }
}

