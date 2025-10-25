"use client";

import { FormEvent } from "react";
import { useFormStatus } from "react-dom";

import styles from "@/app/admin/bookings/AdminBookings.module.css";

type DeleteBookingButtonProps = {
  action: (formData: FormData) => Promise<void>;
  bookingId: number;
  customerName: string;
};

export default function DeleteBookingButton({ action, bookingId, customerName }: DeleteBookingButtonProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm(
      `Delete booking #${bookingId} for ${customerName}? This action cannot be undone.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit} className={styles.deleteForm}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <DeleteButton />
    </form>
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
