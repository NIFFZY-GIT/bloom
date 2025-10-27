"use client";

import { useState, useTransition } from "react";
import styles from "../bookings/AdminBookings.module.css";

export type DeleteAllPackagesFormProps = {
  action: () => Promise<void>;
  disabled: boolean;
};

export default function DeleteAllPackagesForm({
  action,
  disabled,
}: DeleteAllPackagesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      await action();
      setShowConfirm(false);
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.deleteAllForm}>
      {showConfirm ? (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 600 }}>
            Delete all requests?
          </span>
          <button
            type="submit"
            disabled={isPending || disabled}
            className={styles.deleteAllButton}
            style={{ padding: '0.5rem 1rem' }}
          >
            {isPending ? "Deleting..." : "Confirm"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            style={{
              padding: '0.5rem 1rem',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={disabled}
          className={styles.deleteAllButton}
        >
          Delete All Requests
        </button>
      )}
    </form>
  );
}
