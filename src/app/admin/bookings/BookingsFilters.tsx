"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import styles from "./AdminBookings.module.css";

type Option = {
  value: string;
  label: string;
};

export type BookingsFiltersProps = {
  statusOptions: Option[];
  paymentOptions: Option[];
  initialStatus?: string | null;
  initialPayment?: string | null;
  initialQuery?: string;
};

function buildQueryString({
  status,
  payment,
  query,
}: {
  status: string;
  payment: string;
  query: string;
}) {
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }
  if (payment) {
    params.set("payment", payment);
  }
  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    params.set("query", trimmedQuery);
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}

export default function BookingsFilters({
  statusOptions,
  paymentOptions,
  initialStatus = "",
  initialPayment = "",
  initialQuery = "",
}: BookingsFiltersProps) {
  const [status, setStatus] = useState(initialStatus ?? "");
  const [payment, setPayment] = useState(initialPayment ?? "");
  const [searchValue, setSearchValue] = useState(initialQuery ?? "");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const applyFilters = (nextStatus: string, nextPayment: string, nextQuery: string) => {
    const href = `${pathname}${buildQueryString({
      status: nextStatus,
      payment: nextPayment,
      query: nextQuery,
    })}`;

    startTransition(() => {
      router.replace(href);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyFilters(status, payment, searchValue);
  };

  const handleReset = () => {
    setStatus("");
    setPayment("");
    setSearchValue("");
    applyFilters("", "", "");
  };

  const isFiltered = useMemo(
    () => Boolean(status || payment || searchValue.trim()),
    [status, payment, searchValue],
  );

  return (
    <form className={styles.filtersBar} onSubmit={handleSubmit} role="search" aria-label="Filter bookings">
      <label className={styles.filterField}>
        <span className={styles.filterLabel}>Status</span>
        <select
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={styles.filterSelect}
          disabled={isPending}
        >
          <option value="">All</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.filterField}>
        <span className={styles.filterLabel}>Payment</span>
        <select
          name="payment"
          value={payment}
          onChange={(event) => setPayment(event.target.value)}
          className={styles.filterSelect}
          disabled={isPending}
        >
          <option value="">All</option>
          {paymentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.filterField}>
        <span className={styles.filterLabel}>Search</span>
        <input
          type="search"
          name="query"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Guest, email, package, or ID"
          className={styles.filterInput}
          disabled={isPending}
        />
      </label>
      <div className={styles.filterActions}>
        <button type="submit" className={styles.filterSubmit} disabled={isPending}>
          {isPending ? "Applying..." : "Apply"}
        </button>
        {isFiltered && (
          <button type="button" className={styles.filterReset} onClick={handleReset} disabled={isPending}>
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
