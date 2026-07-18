import PlaceForm from '@/components/admin/PlaceForm';
import { requireAdminPage } from '@/lib/admin-auth';
import styles from '../../packages/AdminPackages.module.css';

async function getAuthStatus() {
  await requireAdminPage('/admin/places/new');
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
