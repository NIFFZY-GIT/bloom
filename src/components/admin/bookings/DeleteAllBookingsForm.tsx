"use client";

import { FormEvent } from "react";
import { useFormStatus } from "react-dom";

import styles from "@/app/admin/bookings/AdminBookings.module.css";

type DeleteAllBookingsFormProps = {
  action: (formData: FormData) => Promise<void>;
  disabled?: boolean;
};

export default function DeleteAllBookingsForm({ action, disabled = false }: DeleteAllBookingsFormProps) {
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
    <form action={action} onSubmit={handleSubmit} className={styles.deleteAllForm}>
      <DeleteAllButton disabled={disabled} />
    </form>
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
