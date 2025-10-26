import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import AdminGalleryClient from '@/components/admin/AdminGalleryClient';

interface GalleryItemRow {
  id: number;
  category: string;
  image_path: string;
  title: string;
  description: string | null;
}

async function ensureAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/admingallery');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin gallery page:', error);
    redirect('/login?redirect=/admin/admingallery');
  }
}

async function getGalleryItems(): Promise<GalleryItemRow[]> {
  const result = await query(
    `SELECT id, category, image_path, title, description
     FROM gallery_items
     ORDER BY id DESC`
  );

  return result.rows as GalleryItemRow[];
}

export default async function AdminGalleryPage() {
  await ensureAdminAccess();
  const items = await getGalleryItems();

  return <AdminGalleryClient items={items} />;
}
