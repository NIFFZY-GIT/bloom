import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import BookingsFilters from './BookingsFilters';
import DeleteAllBookingsForm from '@/components/admin/bookings/DeleteAllBookingsForm';
import DeleteBookingButton from '@/components/admin/bookings/DeleteBookingButton';
import Link from 'next/link';
import styles from './AdminBookings.module.css';

const ALLOWED_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const;
type BookingStatus = typeof ALLOWED_STATUSES[number];

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};

const PAYMENT_STATUSES = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const;
type PaymentStatus = typeof PAYMENT_STATUSES[number];

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Awaiting receipt',
  UNDER_REVIEW: 'Receipt submitted',
  APPROVED: 'Payment verified',
  REJECTED: 'Receipt rejected',
};

function parseBookingStatus(value: string | null | undefined): BookingStatus {
  const normalized = (value ?? '').trim().toUpperCase();
  if (ALLOWED_STATUSES.includes(normalized as BookingStatus)) {
    return normalized as BookingStatus;
  }
  return 'PENDING';
}

function parsePaymentStatus(value: string | null | undefined): PaymentStatus {
  const normalized = (value ?? '').trim().toUpperCase();
  if (PAYMENT_STATUSES.includes(normalized as PaymentStatus)) {
    return normalized as PaymentStatus;
  }
  return 'PENDING';
}

function tryCastBookingStatus(value: string | undefined): BookingStatus | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  return ALLOWED_STATUSES.includes(normalized as BookingStatus) ? (normalized as BookingStatus) : null;
}

function tryCastPaymentStatus(value: string | undefined): PaymentStatus | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  return PAYMENT_STATUSES.includes(normalized as PaymentStatus) ? (normalized as PaymentStatus) : null;
}

interface DbBookingRow {
  id?: number;
  booking_id?: number;
  package_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  preferred_date: string | null;
  number_of_guests: number | null;
  special_requests: string | null;
  created_at: string | null;
  status: string | null;
  package_title: string | null;
  price: number | null;
  payment_status?: string | null;
  receipt_url?: string | null;
  receipt_uploaded_at?: string | null;
}

interface BookingViewModel {
  id: number;
  packageTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: Date | null;
  guests: number | null;
  specialRequests: string | null;
  createdAt: Date | null;
  status: BookingStatus;
  price: number | null;
  paymentStatus: PaymentStatus;
  receiptUrl: string | null;
  receiptUploadedAt: Date | null;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/bookings');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin bookings page:', error);
    redirect('/login?redirect=/admin/bookings');
  }
}

function isUndefinedColumnError(error: unknown) {
  const pgCode =
    typeof error === 'object' && error && 'code' in error ? (error as { code?: string }).code : undefined;
  if (pgCode === '42703') {
    return true;
  }

  if (error instanceof Error && error.message.includes('column')) {
    return true;
  }

  return false;
}

function isMissingRelationError(error: unknown) {
  const pgCode =
    typeof error === 'object' && error && 'code' in error ? (error as { code?: string }).code : undefined;
  if (pgCode === '42P01') {
    return true;
  }

  if (error instanceof Error && error.message.includes('does not exist')) {
    return true;
  }

  return false;
}

async function getBookings(): Promise<BookingViewModel[]> {
  const mapRows = (rows: DbBookingRow[]): BookingViewModel[] => rows.map((row) => ({
    id: row.id ?? row.booking_id ?? 0,
    packageTitle: row.package_title ?? 'Unknown package',
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone ?? '—',
    preferredDate: row.preferred_date ? new Date(row.preferred_date) : null,
    guests: row.number_of_guests,
    specialRequests: row.special_requests,
    createdAt: row.created_at ? new Date(row.created_at) : null,
    status: parseBookingStatus(row.status),
    price: row.price,
    paymentStatus: parsePaymentStatus(row.payment_status ?? row.status),
    receiptUrl: row.receipt_url ?? null,
    receiptUploadedAt: row.receipt_uploaded_at ? new Date(row.receipt_uploaded_at) : null,
  }));

  const idSelectors = ['b.id AS id', 'b.booking_id AS id'];
  const statusSelectors = ['b.status AS status', 'b.booking_status AS status'];
  const createdSelectors = ['b.created_at AS created_at', 'b.booking_date AS created_at', 'NULL::timestamp AS created_at'];
  const paymentStatusSelectors = [
    'b.payment_status AS payment_status',
    'b.paymentstatus AS payment_status',
    'b.payment_state AS payment_status',
    `'PENDING'::text AS payment_status`,
  ];
  const receiptSelectors = [
    'b.receipt_url AS receipt_url',
    'b.receipturl AS receipt_url',
    'NULL::text AS receipt_url',
  ];
  const receiptUploadedSelectors = [
    'b.receipt_uploaded_at AS receipt_uploaded_at',
    'b.receiptuploadedat AS receipt_uploaded_at',
    'NULL::timestamp AS receipt_uploaded_at',
  ];

  const attemptedSql = new Set<string>();
  const errors: unknown[] = [];

  for (const idExpr of idSelectors) {
    for (const statusExpr of statusSelectors) {
      for (const createdExpr of createdSelectors) {
        for (const paymentExpr of paymentStatusSelectors) {
          for (const receiptExpr of receiptSelectors) {
            for (const receiptUploadedExpr of receiptUploadedSelectors) {
              const sql = `SELECT 
           ${idExpr},
           b.package_id,
           b.customer_name,
           b.customer_email,
           b.customer_phone,
           b.preferred_date,
           b.number_of_guests,
           b.special_requests,
           ${createdExpr},
           ${statusExpr},
           ${paymentExpr},
           ${receiptExpr},
           ${receiptUploadedExpr},
           tp.title AS package_title,
           tp.price
         FROM bookings b
         LEFT JOIN tour_packages tp ON b.package_id = tp.id
         ORDER BY created_at DESC NULLS LAST, id DESC`;

              if (attemptedSql.has(sql)) {
                continue;
              }
              attemptedSql.add(sql);

              try {
                const result = await query(sql);
                if (result.rowCount != null && result.rowCount >= 0) {
                  return mapRows(result.rows as DbBookingRow[]);
                }
              } catch (error) {
                errors.push(error);
                if (isUndefinedColumnError(error)) {
                  continue;
                }
                throw error;
              }
            }
          }
        }
      }
    }
  }

  console.warn('Unable to load bookings with known schema variations. Returning empty result.', errors);
  return [];
}

function formatDate(value: Date | null) {
  if (!value || Number.isNaN(value.valueOf())) {
    return '—';
  }

  return value.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(value: Date | null) {
  if (!value || Number.isNaN(value.valueOf())) {
    return '—';
  }

  return value.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatCurrency(amount: number | null) {
  if (amount == null) {
    return '—';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

type ReceiptPreviewKind = 'image' | 'pdf' | 'other';

function detectReceiptType(url: string): ReceiptPreviewKind {
  const normalized = url.split('?')[0].toLowerCase();
  if (/\.(png|jpe?g|gif|bmp|webp|avif|svg)$/.test(normalized)) {
    return 'image';
  }
  if (normalized.endsWith('.pdf')) {
    return 'pdf';
  }
  return 'other';
}

function ReceiptPreview({ url, uploadedAt }: { url: string; uploadedAt: Date | null }) {
  const type = detectReceiptType(url);
  const uploadedLabel = uploadedAt ? formatDateTime(uploadedAt) : null;

  return (
    <div className={styles.receiptReview}>
      <details className={styles.receiptDetails}>
        <summary className={styles.receiptSummary}>Review uploaded receipt</summary>
        <div className={styles.receiptPreview}>
          {type === 'image' ? (
            <img
              src={url}
              alt="Uploaded payment receipt"
              className={styles.receiptImage}
              loading="lazy"
            />
          ) : type === 'pdf' ? (
            <iframe
              src={url}
              title="Receipt preview"
              className={styles.receiptFrame}
              loading="lazy"
            />
          ) : (
            <p className={styles.receiptFallback}>
              Preview not available. Use the button below to open the original file.
            </p>
          )}
          <div className={styles.receiptActions}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className={styles.receiptButton}
            >
              Open in new tab
            </a>
            {uploadedLabel && <span className={styles.receiptTimestamp}>Uploaded {uploadedLabel}</span>}
          </div>
        </div>
      </details>
    </div>
  );
}

async function updateBookingStatus(formData: FormData) {
  'use server';

  await requireAdmin();

  const rawId = formData.get('bookingId');
  const rawStatus = formData.get('status');

  const bookingId = typeof rawId === 'string' ? Number(rawId) : NaN;
  const status = typeof rawStatus === 'string' ? rawStatus.toUpperCase() : '';

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.warn('Invalid booking id submitted for status update:', rawId);
    return;
  }

  if (!ALLOWED_STATUSES.includes(status as BookingStatus)) {
    console.warn('Invalid booking status submitted:', status);
    return;
  }

  const attemptUpdate = async (
    column: 'booking_id' | 'id',
    statusColumn: 'status' | 'booking_status',
  ) => {
    try {
      const result = await query(
        `UPDATE bookings SET ${statusColumn} = $1 WHERE ${column} = $2`,
        [status, bookingId],
      );
      return result.rowCount ?? 0;
    } catch (error) {
      const pgCode = typeof error === 'object' && error && 'code' in error ? (error as { code?: string }).code : undefined;
      if (pgCode === '42703') {
        return 0;
      }
      if (
        error instanceof Error &&
        (error.message.includes(`column "${column}`) || error.message.includes(`column "${statusColumn}`))
      ) {
        return 0;
      }
      throw error;
    }
  };

  let updatedRows = await attemptUpdate('booking_id', 'status');

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('booking_id', 'booking_status');
  }

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('id', 'status');
  }

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('id', 'booking_status');
  }

  if (updatedRows === 0) {
    console.warn('No booking rows updated for id:', bookingId);
    return;
  }

  revalidatePath('/admin/bookings');
}

async function updatePaymentStatus(formData: FormData) {
  'use server';

  await requireAdmin();

  const rawId = formData.get('bookingId');
  const rawStatus = formData.get('paymentStatus');

  const bookingId = typeof rawId === 'string' ? Number(rawId) : NaN;
  const status = typeof rawStatus === 'string' ? rawStatus.toUpperCase() : '';

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.warn('Invalid booking id submitted for payment status update:', rawId);
    return;
  }

  if (!PAYMENT_STATUSES.includes(status as PaymentStatus)) {
    console.warn('Invalid payment status submitted:', status);
    return;
  }

  const attemptUpdate = async (
    column: 'booking_id' | 'id',
    statusColumn: 'payment_status' | 'paymentstatus' | 'payment_state',
  ) => {
    try {
      const result = await query(
        `UPDATE bookings SET ${statusColumn} = $1 WHERE ${column} = $2`,
        [status, bookingId],
      );
      return result.rowCount ?? 0;
    } catch (error) {
      if (isUndefinedColumnError(error)) {
        return 0;
      }
      if (
        error instanceof Error &&
        (error.message.includes(`column "${statusColumn}`) || error.message.includes(`column "${column}`))
      ) {
        return 0;
      }
      throw error;
    }
  };

  let updatedRows = await attemptUpdate('booking_id', 'payment_status');

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('booking_id', 'paymentstatus');
  }

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('booking_id', 'payment_state');
  }

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('id', 'payment_status');
  }

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('id', 'paymentstatus');
  }

  if (updatedRows === 0) {
    updatedRows = await attemptUpdate('id', 'payment_state');
  }

  if (updatedRows === 0) {
    console.warn('No booking rows updated for payment status id:', bookingId);
    return;
  }

  revalidatePath('/admin/bookings');
}

async function deleteBooking(formData: FormData) {
  'use server';

  await requireAdmin();

  const rawId = formData.get('bookingId');
  const bookingId = typeof rawId === 'string' ? Number(rawId) : NaN;

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.warn('Invalid booking id submitted for deletion:', rawId);
    return;
  }

  const receiptCleanup = async () => {
    try {
      await query('DELETE FROM booking_receipts WHERE booking_id = $1', [bookingId]);
    } catch (error) {
      if (isUndefinedColumnError(error) || isMissingRelationError(error)) {
        return;
      }
      console.error('Failed to delete booking receipt audit records:', error);
    }
  };

  await receiptCleanup();

  const idColumns: Array<'booking_id' | 'id'> = ['booking_id', 'id'];
  let deleted = false;

  for (const column of idColumns) {
    try {
      const result = await query(`DELETE FROM bookings WHERE ${column} = $1`, [bookingId]);
      if ((result.rowCount ?? 0) > 0) {
        deleted = true;
        break;
      }
    } catch (error) {
      if (isUndefinedColumnError(error)) {
        continue;
      }
      throw error;
    }
  }

  if (!deleted) {
    console.warn('No booking rows deleted for id:', bookingId);
  }

  revalidatePath('/admin/bookings');
}

async function deleteAllBookings() {
  'use server';

  await requireAdmin();

  const statements: Array<{ sql: string; optional?: boolean }> = [
    { sql: 'DELETE FROM booking_receipts', optional: true },
    { sql: 'DELETE FROM bookings' },
  ];

  for (const { sql, optional } of statements) {
    try {
      await query(sql);
    } catch (error) {
      if (optional && (isUndefinedColumnError(error) || isMissingRelationError(error))) {
        continue;
      }
      throw error;
    }
  }

  revalidatePath('/admin/bookings');
}

function getStatusClassName(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED':
      return styles.statusConfirmed;
    case 'CANCELLED':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
}

function getPaymentClassName(status: PaymentStatus) {
  switch (status) {
    case 'APPROVED':
      return styles.paymentApproved;
    case 'UNDER_REVIEW':
      return styles.paymentReview;
    case 'REJECTED':
      return styles.paymentRejected;
    default:
      return styles.paymentPending;
  }
}

type SearchParams = Record<string, string | string[] | undefined>;

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  await requireAdmin();
  const bookings = await getBookings();

  const statusFilter = tryCastBookingStatus(toSingleValue(searchParams?.status));
  const paymentFilter = tryCastPaymentStatus(toSingleValue(searchParams?.payment));
  const searchTermRaw = toSingleValue(searchParams?.query);
  const searchTerm = searchTermRaw ? searchTermRaw.trim().toLowerCase() : '';

  const totalBookings = bookings.length;
  let pendingCount = 0;
  let confirmedCount = 0;
  let upcomingCount = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  bookings.forEach((booking) => {
    if (booking.status === 'PENDING') {
      pendingCount += 1;
    }
    if (booking.status === 'CONFIRMED') {
      confirmedCount += 1;
    }
    if (booking.preferredDate) {
      const preferred = new Date(booking.preferredDate);
      preferred.setHours(0, 0, 0, 0);
      if (preferred >= today) {
        upcomingCount += 1;
      }
    }
  });

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    if (paymentFilter && booking.paymentStatus !== paymentFilter) {
      return false;
    }
    if (searchTerm) {
      const haystack = [
        booking.packageTitle,
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone,
        booking.id.toString(),
        booking.specialRequests ?? '',
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });

  const isFiltered = Boolean(statusFilter || paymentFilter || searchTerm);
  const visibleBookings = filteredBookings;
  const visibleCount = visibleBookings.length;

  const activeFilters: string[] = [];
  if (statusFilter) {
    activeFilters.push(`Status: ${STATUS_LABELS[statusFilter]}`);
  }
  if (paymentFilter) {
    activeFilters.push(`Payment: ${PAYMENT_STATUS_LABELS[paymentFilter]}`);
  }
  if (searchTerm) {
    const searchLabel = (searchTermRaw ?? '').trim();
    activeFilters.push(`Search: "${searchLabel}"`);
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bookings Overview</h1>
          <p className={styles.pageSubtitle}>
            Track reservations for every tour package, monitor guest details, and keep tabs on upcoming trips.
          </p>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Bookings</span>
          <span className={styles.summaryValue}>{totalBookings}</span>
          <span className={styles.summaryHelper}>All recorded reservations</span>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Upcoming Trips</span>
          <span className={styles.summaryValue}>{upcomingCount}</span>
          <span className={styles.summaryHelper}>Preferred date today or later</span>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Pending Confirmation</span>
          <span className={styles.summaryValue}>{pendingCount}</span>
          <span className={styles.summaryHelper}>Awaiting manual follow-up</span>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Confirmed</span>
          <span className={styles.summaryValue}>{confirmedCount}</span>
          <span className={styles.summaryHelper}>Marked as confirmed</span>
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardHeading}>Recent Bookings</h2>
            <span className={styles.cardMeta}>Showing {visibleCount} of {totalBookings} bookings</span>
          </div>
          <div className={styles.cardActions}>
            <DeleteAllBookingsForm action={deleteAllBookings} disabled={totalBookings === 0} />
          </div>
        </div>

        <BookingsFilters
          statusOptions={ALLOWED_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
          paymentOptions={PAYMENT_STATUSES.map((status) => ({ value: status, label: PAYMENT_STATUS_LABELS[status] }))}
          initialStatus={statusFilter}
          initialPayment={paymentFilter}
          initialQuery={searchTermRaw ?? ''}
        />

        {isFiltered && activeFilters.length > 0 && (
          <div className={styles.activeFilters}>
            {activeFilters.map((filter) => (
              <span key={filter} className={styles.activeFilterPill}>
                {filter}
              </span>
            ))}
          </div>
        )}

        {visibleBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>{isFiltered ? 'No bookings match your filters' : 'No bookings yet'}</strong>
            <span>
              {isFiltered
                ? 'Adjust or clear the filters to see more reservations.'
                : 'Reservations will appear here as soon as guests start booking your packages.'}
            </span>
            {isFiltered && (
              <Link href="/admin/bookings" className={styles.filterResetInline}>
                Reset filters
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeaderCell}>Package</th>
                  <th className={styles.tableHeaderCell}>Guest</th>
                  <th className={styles.tableHeaderCell}>Preferred Date</th>
                  <th className={styles.tableHeaderCell}>Guests</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Payment</th>
                  <th className={styles.tableHeaderCell}>Booked On</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleBookings.map((booking) => {
                  const statusLabel = STATUS_LABELS[booking.status] ?? STATUS_LABELS.PENDING;
                  const statusKey = `${booking.id}-${booking.status}`;
                  const paymentLabel = PAYMENT_STATUS_LABELS[booking.paymentStatus] ?? PAYMENT_STATUS_LABELS.PENDING;
                  const paymentKey = `${booking.id}-${booking.paymentStatus}`;

                  return (
                    <tr key={booking.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.packChip}>{booking.packageTitle}</div>
                      {booking.price != null && (
                        <div>{formatCurrency(booking.price)}</div>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <div>{booking.customerName}</div>
                      <div>{booking.customerEmail}</div>
                      {booking.customerPhone && booking.customerPhone !== '—' && (
                        <div>{booking.customerPhone}</div>
                      )}
                      {booking.specialRequests && (
                        <ul className={styles.notesList}>
                          <li>{booking.specialRequests}</li>
                        </ul>
                      )}
                    </td>
                    <td className={styles.tableCell}>{formatDate(booking.preferredDate)}</td>
                    <td className={styles.tableCell}>{booking.guests ?? '—'}</td>
                    <td className={styles.tableCell}>
                      <div className={styles.statusCell} key={statusKey}>
                        <span className={`${styles.statusBadge} ${getStatusClassName(booking.status)}`}>
                          {statusLabel}
                        </span>
                        <form className={styles.statusForm} action={updateBookingStatus}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <select
                            id={`status-${booking.id}`}
                            name="status"
                            defaultValue={booking.status}
                            className={styles.statusSelect}
                            aria-label={`Update status for ${booking.customerName}`}
                          >
                            {ALLOWED_STATUSES.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {STATUS_LABELS[statusOption]}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className={styles.statusSubmit}>
                            Save
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className={`${styles.tableCell} ${styles.paymentCell}`}>
                      <div className={`${styles.paymentBadge} ${getPaymentClassName(booking.paymentStatus)}`} key={paymentKey}>
                        {paymentLabel}
                      </div>
                      {booking.receiptUrl ? (
                        <ReceiptPreview
                          url={booking.receiptUrl}
                          uploadedAt={booking.receiptUploadedAt}
                        />
                      ) : (
                        <div className={styles.receiptMissing}>Receipt not provided</div>
                      )}
                      <form className={styles.paymentForm} action={updatePaymentStatus}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <select
                          id={`payment-status-${booking.id}`}
                          name="paymentStatus"
                          defaultValue={booking.paymentStatus}
                          className={styles.paymentSelect}
                          aria-label={`Update payment status for ${booking.customerName}`}
                        >
                          {PAYMENT_STATUSES.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {PAYMENT_STATUS_LABELS[statusOption]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className={styles.paymentSubmit}>
                          Save
                        </button>
                      </form>
                    </td>
                    <td className={styles.tableCell}>{formatDate(booking.createdAt)}</td>
                    <td className={`${styles.tableCell} ${styles.tableActionsCell}`}>
                      <DeleteBookingButton
                        bookingId={booking.id}
                        customerName={booking.customerName}
                        action={deleteBooking}
                      />
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
