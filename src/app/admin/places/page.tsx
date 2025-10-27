import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import Link from 'next/link';
import styles from '../packages/AdminPackages.module.css';
import PlacesTable from '@/components/admin/PlacesTable';

interface Place {
  id: number;
  name: string;
  category: string | null;
  location: string | null;
  duration: string | null;
  price: string;
  imagePath: string | null;
}

async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/places');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };
    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin places page:', error);
    redirect('/login?redirect=/admin/places');
  }
}

async function getPlaces(): Promise<Place[]> {
  try {
    const result = await query(
      `SELECT 
        id, 
        name, 
        category, 
        location, 
        duration,
        price::text AS price,
        image_path AS "imagePath"
       FROM places
       ORDER BY id DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to load places:', error);
    return [];
  }
}

export default async function AdminPlacesPage() {
  await getAuthStatus();
  const places = await getPlaces();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manage Places</h1>
          <p className={styles.pageSubtitle}>Add, edit, or remove places that guests can choose for their custom tours.</p>
        </div>
        <Link href="/admin/places/new" className={styles.primaryBtn}>
          + Add New Place
        </Link>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardHeading}>Available Places</h2>
          <span className={styles.countBadge}>{places.length}</span>
        </div>

        {places.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No places found.</p>
            <Link href="/admin/places/new" className={styles.secondaryBtn}>Create your first place</Link>
          </div>
        ) : (
          <PlacesTable places={places} />
        )}
      </section>
    </div>
  );
}
