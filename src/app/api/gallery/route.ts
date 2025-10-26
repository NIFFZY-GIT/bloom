import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface GalleryItemRow {
  id: number;
  category: string;
  image_path: string;
  title: string;
  description: string | null;
}

interface ReviewRow {
  id: number;
  name: string;
  position: string | null;
  avatar: string | null;
  rating: number | string | null;
  text: string;
}

const ITEMS_QUERY = `
  SELECT id, category, image_path, title, description
  FROM gallery_items
  ORDER BY id DESC
`;

const REVIEWS_QUERY = `
  SELECT id, name, position, avatar, rating, text
  FROM reviews
  ORDER BY id DESC
`;

export async function GET() {
  try {
    const [itemsResult, reviewsResult] = await Promise.all([
      query(ITEMS_QUERY),
      query(REVIEWS_QUERY),
    ]);

    const itemRows = itemsResult.rows as GalleryItemRow[];
  const reviewRows = reviewsResult.rows as ReviewRow[];

    const items = itemRows.map((row) => ({
      id: row.id,
      category: row.category,
      imagePath: row.image_path,
      title: row.title,
      description: row.description ?? '',
    }));

    const reviews = reviewRows.map((row) => ({
      id: row.id,
      name: row.name,
      position: row.position ?? '',
      avatar: row.avatar ?? '',
      rating: typeof row.rating === 'string' ? Number(row.rating) : Number(row.rating ?? 0),
      text: row.text,
    }));

    return NextResponse.json({ items, reviews });
  } catch (error) {
    console.error('Failed to load gallery data', error);
    return NextResponse.json({ message: 'Failed to load gallery data' }, { status: 500 });
  }
}
