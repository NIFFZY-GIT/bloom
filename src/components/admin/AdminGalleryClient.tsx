'use client';

import { useMemo, useRef } from 'react';

import styles from '@/app/admin/admingallery/AdminGallery.module.css';
import GalleryManager, { GalleryItem, GalleryManagerHandle } from './GalleryManager';

interface AdminGalleryClientProps {
  items: GalleryItem[];
}

export default function AdminGalleryClient({ items }: AdminGalleryClientProps) {
  const managerRef = useRef<GalleryManagerHandle>(null);

  const categoriesText = useMemo(() => {
    const categories = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });

    if (categories.size === 0) {
      return 'None yet';
    }

    return Array.from(categories)
      .sort((a, b) => a.localeCompare(b))
      .join(', ');
  }, [items]);

  const handleAddClick = () => {
    managerRef.current?.openCreateModal();
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroCard}>
        <div className={styles.heroTextGroup}>
          <h1 className={styles.pageTitle}>Manage Gallery Projects</h1>
          <p className={styles.heroSubtitle}>
            Review the collection showcased on the public gallery page. Add new work, refresh existing entries, or tidy up
            categories to keep the experience consistent.
          </p>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.heroButton} onClick={handleAddClick}>
            + Add New Photo
          </button>
        </div>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <h2 className={styles.sectionTitle}>Current Gallery Items</h2>
            <p className={styles.sectionSubtitle}>Categories in use: {categoriesText}</p>
          </div>
          <span className={styles.countBubble}>{items.length}</span>
        </div>

        <GalleryManager ref={managerRef} items={items} />
      </section>
    </div>
  );
}
