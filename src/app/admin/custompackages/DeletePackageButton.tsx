"use client";

import { useState, useTransition } from "react";
import styles from "../bookings/AdminBookings.module.css";

export type DeletePackageButtonProps = {
  packageId: number;
  packageName: string;
  action: (formData: FormData) => Promise<void>;
};

export default function DeletePackageButton({
  packageId,
  packageName,
  action,
}: DeletePackageButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    const formData = new FormData();
    formData.set("packageId", String(packageId));

    startTransition(async () => {
      await action(formData);
      setShowConfirm(false);
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div style={{ marginTop: 'auto' }}>
      {showConfirm ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>
            Delete "{packageName}"?
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className={styles.deleteButton}
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem' }}
            >
              {isPending ? "Deleting..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              style={{
                flex: 1,
                fontSize: '0.75rem',
                padding: '0.4rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className={styles.deleteButton}
          style={{ width: '100%' }}
        >
          <i className="fas fa-trash"></i>
          Delete Request
        </button>
      )}
    </div>
  );
}
