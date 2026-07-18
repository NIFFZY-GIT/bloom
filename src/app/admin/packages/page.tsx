import { query } from '@/lib/db';
import Link from 'next/link';

import PackagesTable from '@/components/admin/PackagesTable';
import { requireAdminPage } from '@/lib/admin-auth';
import styles from './AdminPackages.module.css';

interface TourPackage {
  id: number;
  title: string;
  category: string | null;
  price: string;
  duration: string | null;
}

async function getAuthStatus() {
  await requireAdminPage('/admin/packages');
}

async function getPackages(): Promise<TourPackage[]> {
  const result = await query(
    `SELECT id, title, category, price::text AS price, duration
     FROM tour_packages
     ORDER BY id DESC`);
  return result.rows;
}

export default async function AdminPackagesPage() {
  await getAuthStatus();
  const packages = await getPackages();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manage Tour Packages</h1>
          <p className={styles.pageSubtitle}>Review existing packages or create new experiences for your customers.</p>
        </div>
        <Link href="/admin/packages/new" className={styles.primaryBtn}>
          + Add New Package
        </Link>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardHeading}>Current Packages</h2>
          <span className={styles.countBadge}>{packages.length}</span>
        </div>

        {packages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tour packages found.</p>
            <Link href="/admin/packages/new" className={styles.secondaryBtn}>Create your first package</Link>
          </div>
        ) : (
          <PackagesTable packages={packages} />
        )}
      </section>
    </div>
  );
}
