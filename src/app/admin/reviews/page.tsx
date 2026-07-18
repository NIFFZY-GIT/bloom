import { query } from '@/lib/db';
import AdminReviewsClient from '@/components/admin/AdminReviewsClient';
import { requireAdminPage } from '@/lib/admin-auth';

interface ReviewRow {
  id: number;
  name: string;
  position: string | null;
  avatar: string | null;
  rating: number;
  text: string;
}

async function ensureAdminAccess() {
  await requireAdminPage('/admin/reviews');
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
