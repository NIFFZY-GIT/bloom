import { NextResponse } from 'next/server';

import db, { query } from '@/lib/db';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const MAX_GALLERY_IMAGES = 10;

const PACKAGE_WITH_GALLERY_SQL = `
  SELECT
    tp.*,
    COALESCE(
      (
        SELECT json_agg(
                 json_build_object(
                   'id', tpi.id,
                   'image_path', tpi.image_path,
                   'alt_text', tpi.alt_text,
                   'sort_order', tpi.sort_order
                 )
                 ORDER BY tpi.sort_order, tpi.id
               )
        FROM tour_package_images tpi
        WHERE tpi.package_id = tp.id
      ),
      '[]'::json
    ) AS gallery_images
  FROM tour_packages tp
  WHERE tp.id = $1
`;

const sanitizeGalleryImages = (input: unknown): string[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  const result: string[] = [];
  const seen = new Set<string>();

  for (const entry of input) {
    if (typeof entry !== 'string') {
      continue;
    }
    const trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= MAX_GALLERY_IMAGES) {
      break;
    }
  }

  return result;
};

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

export async function GET(request: Request, { params: paramsPromise }: Params) {
  const params = await paramsPromise;
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ message: 'Invalid package id' }, { status: 400 });
  }

  try {
    const result = await query(PACKAGE_WITH_GALLERY_SQL, [numericId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params: paramsPromise }: Params) {
  const params = await paramsPromise;
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ message: 'Invalid package id' }, { status: 400 });
  }

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
      rating,
      reviews,
      galleryImages,
    } = body;

    const normalizedImagePath = typeof image_path === 'string'
      ? image_path.trim().length === 0
        ? null
        : image_path.trim()
      : null;

    const normalizedHighlights = Array.isArray(highlights) ? JSON.stringify(highlights) : JSON.stringify([]);
    const normalizedIncludes = Array.isArray(includes) ? JSON.stringify(includes) : JSON.stringify([]);

    const numericPrice = typeof price === 'string' ? Number.parseFloat(price) : Number(price);
    const numericDuration = typeof duration === 'string' ? Number.parseInt(duration, 10) : Number(duration);
    const ratingProvided = rating !== undefined;
    const reviewsProvided = reviews !== undefined;
    const ratingValue = ratingProvided ? toNumber(rating, 0) : null;
    const reviewsValue = reviewsProvided ? Math.max(0, Math.trunc(toNumber(reviews, 0))) : null;
    const galleryList = sanitizeGalleryImages(galleryImages);

    if (!title || !description || !price || !duration || !category || !difficulty) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ message: 'Price must be a valid number' }, { status: 400 });
    }

    if (!Number.isInteger(numericDuration) || numericDuration <= 0) {
      return NextResponse.json({ message: 'Duration must be a positive whole number (days)' }, { status: 400 });
    }

    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const updateQuery = `
        UPDATE tour_packages
        SET title = $1,
            description = $2,
            price = $3,
            duration = $4,
            image_path = $5,
            category = $6,
            highlights = CAST($7 AS jsonb),
            includes = CAST($8 AS jsonb),
            difficulty = $9,
            rating = COALESCE($10, rating),
            reviews = COALESCE($11, reviews)
        WHERE id = $12
        RETURNING id
      `;

      const updateResult = await client.query(updateQuery, [
        title.trim(),
        description.trim(),
        numericPrice,
        numericDuration,
        normalizedImagePath,
        category.trim(),
        normalizedHighlights,
        normalizedIncludes,
        difficulty,
        ratingValue,
        reviewsValue,
        numericId,
      ]);

      if (updateResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ message: 'Package not found' }, { status: 404 });
      }

      await client.query('DELETE FROM tour_package_images WHERE package_id = $1', [numericId]);

      if (galleryList.length > 0) {
        for (let index = 0; index < galleryList.length; index += 1) {
          await client.query(
            `INSERT INTO tour_package_images (package_id, image_path, sort_order)
             VALUES ($1, $2, $3)`,
            [numericId, galleryList[index], index],
          );
        }
      }

      await client.query('COMMIT');

      const packageResult = await query(PACKAGE_WITH_GALLERY_SQL, [numericId]);
      return NextResponse.json({ success: true, package: packageResult.rows[0] }, { status: 200 });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating package:', error);
      return NextResponse.json({ message: 'Failed to update package' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params: paramsPromise }: Params) {
  const params = await paramsPromise;
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ message: 'Invalid package id' }, { status: 400 });
  }

  try {
    const result = await query('DELETE FROM tour_packages WHERE id = $1 RETURNING id', [numericId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
