'use client';

import { useMemo, useRef } from 'react';

import styles from '@/app/admin/admingallery/AdminGallery.module.css';
import ReviewsManager, { ReviewsManagerHandle, ReviewRecord } from './ReviewsManager';

interface AdminReviewsClientProps {
  reviews: ReviewRecord[];
}

export default function AdminReviewsClient({ reviews }: AdminReviewsClientProps) {
  const managerRef = useRef<ReviewsManagerHandle>(null);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const sum = reviews.reduce((acc, review) => acc + Math.min(5, Math.max(0, review.rating ?? 0)), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleAddClick = () => {
    managerRef.current?.openCreateModal();
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroCard}>
        <div className={styles.heroTextGroup}>
          <h1 className={styles.pageTitle}>Manage Testimonials</h1>
          <p className={styles.heroSubtitle}>
            Share client success stories and keep every quote feeling current. Fresh testimonials build trust across the
            public site.
          </p>
          <div className={styles.heroMetaRow}>
            <span className={styles.heroMetaPill}>Average rating: {averageRating.toFixed(1)} / 5</span>
            <span className={styles.heroMetaPill}>Live stories: {reviews.length}</span>
          </div>
        </div>
        <div className={styles.heroActions}>
          <button type="button" className={styles.heroButton} onClick={handleAddClick}>
            + Add New Testimonial
          </button>
        </div>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <h2 className={styles.sectionTitle}>Published Testimonials</h2>
            <p className={styles.sectionSubtitle}>
              Invite clients to speak for your work. Upload their portrait, set a rating, and highlight their feedback below.
            </p>
          </div>
          <span className={styles.countBubble}>{reviews.length}</span>
        </div>

        <ReviewsManager ref={managerRef} reviews={reviews} />
      </section>
    </div>
  );
}
