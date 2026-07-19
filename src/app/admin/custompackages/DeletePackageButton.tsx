"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/action-result";
import styles from "../bookings/AdminBookings.module.css";

export type DeletePackageButtonProps = {
  packageId: string;
  packageName: string;
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
};

export default function DeletePackageButton({
  packageId,
  packageName,
  action,
}: DeletePackageButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    const formData = new FormData();
    formData.set("packageId", String(packageId));

    startTransition(async () => {
      setError(null);
      try {
        const result = await action(null, formData);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setShowConfirm(false);
      } catch (err) {
        // A server action that throws (network drop, redacted server error) would
        // otherwise leave the button spinning with nothing shown.
        setError(err instanceof Error ? err.message : "Failed to delete the request.");
      }
    });
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setError(null);
  };

  return (
    <div style={{ marginTop: 'auto' }}>
      {error ? (
        <p role="alert" style={{ fontSize: '0.75rem', color: '#dc2626', margin: '0 0 0.5rem' }}>
          {error}
        </p>
      ) : null}
      {showConfirm ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>
            Delete &quot;{packageName}&quot;?
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
