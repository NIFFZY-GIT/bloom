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
         price,
         created_at as "createdAt",
         updated_at as "updatedAt"
       FROM places
       ORDER BY id ASC`
    );

    console.log('[API] Places fetched:', result.rows.length);
    console.log('[API] Place data:', result.rows.map(p => ({ name: p.name, imagePath: p.imagePath, category: p.category })));

    return NextResponse.json({ success: true, places: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Failed to load places:', error);
    return NextResponse.json({ message: 'Failed to load places' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { 
    name?: string; 
    description?: string; 
    imagePath?: string;
    category?: string;
    duration?: string;
    location?: string;
    highlights?: string[];
    price?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const name = body?.name?.trim();
  const description = body?.description?.trim();
  const imagePath = body?.imagePath?.trim() || null;
  const category = body?.category?.trim() || null;
  const duration = body?.duration?.trim() || null;
  const location = body?.location?.trim() || null;
  const highlights = Array.isArray(body?.highlights) ? body.highlights : [];
  const price = typeof body?.price === 'number' ? body.price : 0;

  if (!name) {
    return NextResponse.json({ message: 'Name is required' }, { status: 400 });
  }

  try {
    const result = await query(
      `INSERT INTO places (name, description, image_path, category, duration, location, highlights, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
       RETURNING id, name, description, image_path as "imagePath", category, duration, location, highlights, price`,
      [name, description, imagePath, category, duration, location, JSON.stringify(highlights), price]
    );

    const newPlace = result.rows[0];

    console.log('[API] Place created:', newPlace);

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
