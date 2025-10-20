import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST - Create a new tour package
export async function POST(request: Request) {
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
      rating = 0, // Default value
      reviews = 0, // Default value
    } = body;

    const normalizedImagePath = typeof image_path === 'string' && image_path.trim().length === 0
      ? null
      : image_path;
    const normalizedHighlights = Array.isArray(highlights) ? highlights : [];
    const normalizedIncludes = Array.isArray(includes) ? includes : [];

    // Basic validation
    if (!title || !description || !price || !duration || !category || !difficulty) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO tour_packages (
        title, description, price, duration, image_path, category, 
        highlights, includes, difficulty, rating, reviews
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    
    const values = [
      title,
      description,
      price,
      duration, // Now a string
      normalizedImagePath,
      category,
      normalizedHighlights, // Assumes highlights is an array of strings
      normalizedIncludes,   // Assumes includes is an array of strings
      difficulty,
      rating,
      reviews,
    ];

    const result = await query(insertQuery, values);

    return NextResponse.json({ success: true, package: result.rows[0] }, { status: 201 });

  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET - Fetch all tour packages
export async function GET() {
  try {
    const selectQuery = 'SELECT * FROM tour_packages ORDER BY id DESC;';
    const result = await query(selectQuery);

    return NextResponse.json({ success: true, packages: result.rows }, { status: 200 });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
