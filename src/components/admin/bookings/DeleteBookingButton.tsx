"use client";

import { FormEvent, useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { ActionResult } from "@/lib/action-result";
import styles from "@/app/admin/bookings/AdminBookings.module.css";

type DeleteBookingButtonProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  bookingId: number;
  customerName: string;
};

export default function DeleteBookingButton({ action, bookingId, customerName }: DeleteBookingButtonProps) {
  const [state, formAction] = useActionState(action, null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm(
      `Delete booking #${bookingId} for ${customerName}? This action cannot be undone.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <>
      <form action={formAction} onSubmit={handleSubmit} className={styles.deleteForm}>
        <input type="hidden" name="bookingId" value={bookingId} />
        <DeleteButton />
      </form>
      {state && !state.ok ? (
        <p role="alert" style={{ fontSize: '0.75rem', color: '#dc2626', margin: '0.35rem 0 0' }}>
          {state.message}
        </p>
      ) : null}
    </>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.deleteButton} disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
