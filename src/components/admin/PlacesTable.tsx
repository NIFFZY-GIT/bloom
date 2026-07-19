'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { readJson } from '@/lib/http';
import styles from '@/app/admin/packages/AdminPackages.module.css';

interface PlaceRow {
  id: number;
  name: string;
  category: string | null;
  location: string | null;
  duration: string | null;
  price: string;
  imagePath: string | null;
}

interface PlacesTableProps {
  places: PlaceRow[];
}

export default function PlacesTable({ places }: PlacesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Delete this place? This action cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE',
      });
      await readJson(response, 'Failed to delete place');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete place';
       
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
            <th className={styles.tableHeaderCell}>Image</th>
            <th className={styles.tableHeaderCell}>Name</th>
            <th className={styles.tableHeaderCell}>Category</th>
            <th className={styles.tableHeaderCell}>Location</th>
            <th className={styles.tableHeaderCell}>Duration</th>
            <th className={styles.tableHeaderCell}>Price</th>
            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellActions}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map(place => (
            <tr key={place.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                {place.imagePath ? (
                  <Image 
                    src={place.imagePath} 
                    alt={place.name}
                    width={60}
                    height={60}
                    style={{ 
                      objectFit: 'cover', 
                      borderRadius: '8px' 
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: '#f1f5f9', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8'
                  }}>
                    <i className="fas fa-image"></i>
                  </div>
                )}
              </td>
              <td className={styles.tableCell}>{place.name}</td>
              <td className={styles.tableCell}>{place.category || '—'}</td>
              <td className={styles.tableCell}>{place.location || '—'}</td>
              <td className={styles.tableCell}>{place.duration || '—'}</td>
              <td className={styles.tableCell}>${place.price}</td>
              <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                <div className={styles.actionsGroup}>
                  <Link href={`/admin/places/${place.id}/edit`} className={styles.editBtn}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(place.id)}
                    disabled={deletingId === place.id}
                  >
                    {deletingId === place.id ? 'Deleting…' : 'Delete'}
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
