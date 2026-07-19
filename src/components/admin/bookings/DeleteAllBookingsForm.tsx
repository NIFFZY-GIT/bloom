"use client";

import { FormEvent, useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ActionResult } from "@/lib/action-result";
import styles from "@/app/admin/bookings/AdminBookings.module.css";

type DeleteAllBookingsFormProps = {
  action: () => Promise<ActionResult>;
  disabled?: boolean;
};

export default function DeleteAllBookingsForm({ action, disabled = false }: DeleteAllBookingsFormProps) {
  const [state, formAction] = useActionState<ActionResult | null>(async () => action(), null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    const confirmed = window.confirm(
      "This will permanently delete all bookings and related receipts. Do you want to continue?",
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <>
      <form action={formAction} onSubmit={handleSubmit} className={styles.deleteAllForm}>
        <DeleteAllButton disabled={disabled} />
      </form>
      {state && !state.ok ? (
        <p role="alert" style={{ fontSize: '0.8rem', color: '#dc2626', margin: '0.35rem 0 0' }}>
          {state.message}
        </p>
      ) : null}
    </>
  );
}

function DeleteAllButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button type="submit" className={styles.deleteAllButton} disabled={isDisabled}>
      {pending ? "Deleting..." : "Delete all"}
    </button>
  );
}
