import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import AdminReviewsClient from '@/components/admin/AdminReviewsClient';

interface ReviewRow {
  id: number;
  name: string;
  position: string | null;
  avatar: string | null;
  rating: number;
  text: string;
}

async function ensureAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/reviews');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin reviews page:', error);
    redirect('/login?redirect=/admin/reviews');
  }
}

async function getReviews(): Promise<ReviewRow[]> {
  const result = await query(
    `SELECT id, name, position, avatar, rating, text
     FROM reviews
     ORDER BY id DESC`
  );

  return result.rows as ReviewRow[];
}

export default async function AdminReviewsPage() {
  await ensureAdminAccess();
  const reviews = await getReviews();

  return <AdminReviewsClient reviews={reviews} />;
}
