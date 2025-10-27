import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import PlaceForm from '@/components/admin/PlaceForm';
import styles from '../../packages/AdminPackages.module.css';

async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/places/new');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };
    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for new place page:', error);
    redirect('/login?redirect=/admin/places/new');
  }
}

export default async function NewPlacePage() {
  await getAuthStatus();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add New Place</h1>
          <p className={styles.pageSubtitle}>Create a new place for guests to choose in their custom tours.</p>
        </div>
      </header>

      <section className={styles.card}>
        <PlaceForm mode="create" />
      </section>
    </div>
  );
}
