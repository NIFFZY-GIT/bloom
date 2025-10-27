"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import styles from "../bookings/AdminBookings.module.css";

type Option = {
  value: string;
  label: string;
};

export type CustomPackagesFiltersProps = {
  statusOptions: Option[];
  initialStatus?: string | null;
  initialQuery?: string;
};

function buildQueryString({
  status,
  query,
}: {
  status: string;
  query: string;
}) {
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }
  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    params.set("query", trimmedQuery);
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}

export default function CustomPackagesFilters({
  statusOptions,
  initialStatus = "",
  initialQuery = "",
}: CustomPackagesFiltersProps) {
  const [status, setStatus] = useState(initialStatus ?? "");
  const [searchValue, setSearchValue] = useState(initialQuery ?? "");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const applyFilters = (nextStatus: string, nextQuery: string) => {
    const href = `${pathname}${buildQueryString({
      status: nextStatus,
      query: nextQuery,
    })}`;

    startTransition(() => {
      router.replace(href);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyFilters(status, searchValue);
  };

  const handleReset = () => {
    setStatus("");
    setSearchValue("");
    applyFilters("", "");
  };

  const isFiltered = useMemo(
    () => Boolean(status || searchValue.trim()),
    [status, searchValue],
  );

  return (
    <form className={styles.filtersBar} onSubmit={handleSubmit} role="search" aria-label="Filter custom packages">
      <label className={styles.filterField}>
        <span className={styles.filterLabel}>Status</span>
        <select
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={styles.filterSelect}
          disabled={isPending}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((option) => (
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
          placeholder="Search packages, guests, email..."
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
