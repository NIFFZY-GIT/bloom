"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/action-result";
import styles from "../bookings/AdminBookings.module.css";

export type DeleteAllPackagesFormProps = {
  action: () => Promise<ActionResult>;
  disabled: boolean;
};

export default function DeleteAllPackagesForm({
  action,
  disabled,
}: DeleteAllPackagesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const result = await action();
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setShowConfirm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete all requests.");
      }
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.deleteAllForm}>
      {error ? (
        <p role="alert" style={{ fontSize: '0.8rem', color: '#dc2626', margin: '0 0 0.5rem' }}>
          {error}
        </p>
      ) : null}
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
