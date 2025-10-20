'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from '@/app/admin/packages/AdminPackages.module.css';

interface PackageRow {
  id: number;
  title: string;
  category: string | null;
  duration: string | null;
  price: string;
}

interface PackagesTableProps {
  packages: PackageRow[];
}

export default function PackagesTable({ packages }: PackagesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Delete this package? This action cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete package');
      }
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete package';
      // eslint-disable-next-line no-alert
      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeaderCell}>Title</th>
            <th className={styles.tableHeaderCell}>Category</th>
            <th className={styles.tableHeaderCell}>Duration</th>
            <th className={styles.tableHeaderCell}>Price</th>
            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellActions}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr key={pkg.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{pkg.title}</td>
              <td className={styles.tableCell}>{pkg.category || '—'}</td>
              <td className={styles.tableCell}>{pkg.duration || '—'}</td>
              <td className={styles.tableCell}>${pkg.price}</td>
              <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                <div className={styles.actionsGroup}>
                  <Link href={`/admin/packages/${pkg.id}/edit`} className={styles.editBtn}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(pkg.id)}
                    disabled={deletingId === pkg.id}
                  >
                    {deletingId === pkg.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
