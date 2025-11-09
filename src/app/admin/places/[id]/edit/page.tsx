import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import PlaceForm from '@/components/admin/PlaceForm';
import styles from '../../../packages/AdminPackages.module.css';

async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };
    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for edit place page:', error);
    redirect('/login');
  }
}

async function getPlace(id: number) {
  try {
    const result = await query(
      `SELECT id, name, description, image_path, category, duration, location, highlights, price, gallery_images
       FROM places
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    // Use gallery_images if available, otherwise fallback to image_path
    let galleryImages = [];
    if (row.gallery_images && Array.isArray(row.gallery_images) && row.gallery_images.length > 0) {
      galleryImages = row.gallery_images;
    } else if (row.image_path) {
      galleryImages = [row.image_path];
    }

    return {
      name: row.name,
      description: row.description,
      image_path: row.image_path,
      category: row.category,
      duration: row.duration,
      location: row.location,
      highlights: row.highlights || [],
      price: parseFloat(row.price),
      galleryImages: galleryImages,
    };
  } catch (error) {
    console.error('Failed to fetch place:', error);
    return null;
  }
}

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  await getAuthStatus();

  // Await params in Next.js 15
  const { id } = await params;
  const placeId = parseInt(id, 10);
  if (isNaN(placeId)) {
    redirect('/admin/places');
  }

  const placeData = await getPlace(placeId);
  if (!placeData) {
    redirect('/admin/places');
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Place</h1>
          <p className={styles.pageSubtitle}>Update the details for {placeData.name}.</p>
        </div>
      </header>

      <section className={styles.card}>
        <PlaceForm mode="edit" placeId={placeId} initialData={placeData} />
      </section>
    </div>
  );
}
