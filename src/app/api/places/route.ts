import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
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
         gallery_images as "galleryImages",
         created_at as "createdAt"
       FROM places
       ORDER BY created_at DESC`
    );

    const places = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      imagePath: row.imagePath,
      category: row.category,
      duration: row.duration,
      location: row.location,
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
      galleryImages: Array.isArray(row.galleryImages) ? row.galleryImages : [],
    }));

    return NextResponse.json({ success: true, places }, { status: 200 });
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
  const description = body?.description?.trim() || null;
  const imagePath = body?.imagePath?.trim() || null;
  const category = body?.category?.trim() || null;
  const duration = body?.duration?.trim() || '1 hour';
  const location = body?.location?.trim() || null;
  const highlights = Array.isArray(body?.highlights) ? body.highlights : [];
  const galleryImages = Array.isArray(body?.galleryImages) ? body.galleryImages : [];

  if (!name) {
    return NextResponse.json({ message: 'Place name is required' }, { status: 400 });
  }

  try {
    const result = await query(
      `INSERT INTO places (name, description, image_path, category, duration, location, highlights, gallery_images)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
       RETURNING id, name, description, image_path as "imagePath", category, duration, location, highlights, gallery_images as "galleryImages"`,
      [name, description, imagePath, category, duration, location, JSON.stringify(highlights), JSON.stringify(galleryImages)]
    );

    const newPlace = result.rows[0];

    return NextResponse.json({ 
      success: true, 
      message: 'Place created successfully',
      place: {
        id: newPlace.id,
        name: newPlace.name,
        description: newPlace.description,
        imagePath: newPlace.imagePath,
        category: newPlace.category,
        duration: newPlace.duration,
        location: newPlace.location,
        highlights: Array.isArray(newPlace.highlights) ? newPlace.highlights : [],
        galleryImages: Array.isArray(newPlace.galleryImages) ? newPlace.galleryImages : [],
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create place:', error);
    return NextResponse.json({ message: 'Failed to create place' }, { status: 500 });
  }
}
