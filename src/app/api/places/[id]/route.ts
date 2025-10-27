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
      'SELECT id, name, description, image_path, category, duration, location, highlights, gallery_images FROM places WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Place not found' }, { status: 404 });
    }

    const place = result.rows[0];
    
    return NextResponse.json({
      success: true,
      place: {
        id: place.id,
        name: place.name,
        description: place.description,
        imagePath: place.image_path,
        category: place.category,
        duration: place.duration,
        location: place.location,
        highlights: place.highlights || [],
        galleryImages: place.gallery_images || [],
      }
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

    // Check if place is used in any custom packages
    const usageCheck = await query(
      'SELECT COUNT(*) as count FROM custom_package_places WHERE place_id = $1',
      [id]
    );

    if (usageCheck.rows[0].count > 0) {
      return NextResponse.json({ 
        message: 'Cannot delete place: it is used in one or more custom packages' 
      }, { status: 400 });
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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid place ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, imagePath, category, duration, location, highlights, galleryImages } = body;

    if (!name || !category || !duration) {
      return NextResponse.json({ 
        message: 'Name, category, and duration are required' 
      }, { status: 400 });
    }

    const result = await query(
      `UPDATE places 
       SET name = $1, description = $2, image_path = $3, category = $4, 
           duration = $5, location = $6, highlights = $7, gallery_images = $8
       WHERE id = $9
       RETURNING id`,
      [name, description, imagePath, category, duration, location, JSON.stringify(highlights || []), JSON.stringify(galleryImages || []), id]
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
