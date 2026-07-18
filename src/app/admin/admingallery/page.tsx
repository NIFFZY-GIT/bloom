import { query } from '@/lib/db';
import AdminGalleryClient from '@/components/admin/AdminGalleryClient';
import { requireAdminPage } from '@/lib/admin-auth';

interface GalleryItemRow {
  id: number;
  category: string;
  image_path: string;
  title: string;
  description: string | null;
}

async function ensureAdminAccess() {
  await requireAdminPage('/admin/admingallery');
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
