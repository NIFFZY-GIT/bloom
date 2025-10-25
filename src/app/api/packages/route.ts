import { NextResponse } from 'next/server';
import db, { query } from '@/lib/db';

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

const LIST_PACKAGES_WITH_GALLERY_SQL = `
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
  ORDER BY tp.id DESC
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
      rating = 0,
      reviews = 0,
      galleryImages,
    } = body ?? {};

    const normalizedImagePath = typeof image_path === 'string' && image_path.trim().length === 0
      ? null
      : typeof image_path === 'string'
        ? image_path.trim()
        : null;

    const normalizedHighlights = Array.isArray(highlights) ? JSON.stringify(highlights) : JSON.stringify([]);
    const normalizedIncludes = Array.isArray(includes) ? JSON.stringify(includes) : JSON.stringify([]);

    const numericPrice = typeof price === 'string' ? Number.parseFloat(price) : Number(price);
    const numericDuration = typeof duration === 'string' ? Number.parseInt(duration, 10) : Number(duration);
    const numericRating = toNumber(rating, 0);
    const numericReviews = Math.max(0, Math.trunc(toNumber(reviews, 0)));

    if (!title || !description || !price || !duration || !category || !difficulty) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return NextResponse.json({ message: 'Price must be a valid number' }, { status: 400 });
    }

    if (!Number.isInteger(numericDuration) || numericDuration <= 0) {
      return NextResponse.json({ message: 'Duration must be a positive whole number (days)' }, { status: 400 });
    }

    const galleryList = sanitizeGalleryImages(galleryImages);

    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const insertQuery = `
        INSERT INTO tour_packages (
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
          reviews
        )
        VALUES ($1, $2, $3, $4, $5, $6, CAST($7 AS jsonb), CAST($8 AS jsonb), $9, $10, $11)
        RETURNING id
      `;

      const insertResult = await client.query(insertQuery, [
        title.trim(),
        description.trim(),
        numericPrice,
        numericDuration,
        normalizedImagePath,
        category.trim(),
        normalizedHighlights,
        normalizedIncludes,
        difficulty,
        numericRating,
        numericReviews,
      ]);

      const newPackageId = insertResult.rows[0].id as number;

      if (galleryList.length > 0) {
        for (let index = 0; index < galleryList.length; index += 1) {
          await client.query(
            `INSERT INTO tour_package_images (package_id, image_path, sort_order)
             VALUES ($1, $2, $3)`,
            [newPackageId, galleryList[index], index],
          );
        }
      }

      await client.query('COMMIT');

      const packageResult = await query(PACKAGE_WITH_GALLERY_SQL, [newPackageId]);
      return NextResponse.json({ success: true, package: packageResult.rows[0] }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating package:', error);
      return NextResponse.json({ message: 'Failed to create package' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET - Fetch all tour packages
export async function GET() {
  try {
    const result = await query(LIST_PACKAGES_WITH_GALLERY_SQL);
    return NextResponse.json({ success: true, packages: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
