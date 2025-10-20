import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import styles from './AdminBookings.module.css';

const ALLOWED_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const;
type BookingStatus = typeof ALLOWED_STATUSES[number];

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
};

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
  status: string;
  price: number | null;
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
    status: (row.status ?? 'PENDING').toUpperCase(),
    price: row.price,
  }));

  const idSelectors = ['b.id AS id', 'b.booking_id AS id'];
  const statusSelectors = ['b.status AS status', 'b.booking_status AS status'];
  const createdSelectors = ['b.created_at AS created_at', 'b.booking_date AS created_at', 'NULL::timestamp AS created_at'];

  const attemptedSql = new Set<string>();
  const errors: unknown[] = [];

  for (const idExpr of idSelectors) {
    for (const statusExpr of statusSelectors) {
      for (const createdExpr of createdSelectors) {
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

function getStatusClassName(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return styles.statusConfirmed;
    case 'CANCELLED':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
}

export default async function AdminBookingsPage() {
  await requireAdmin();
  const bookings = await getBookings();

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((booking) => booking.status === 'PENDING').length;
  const confirmedCount = bookings.filter((booking) => booking.status === 'CONFIRMED').length;
  const upcomingCount = bookings.filter((booking) => {
    if (!booking.preferredDate) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const preferred = new Date(booking.preferredDate);
    preferred.setHours(0, 0, 0, 0);
    return preferred >= today;
  }).length;

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
          <h2 className={styles.cardHeading}>Recent Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>No bookings yet</strong>
            <span>Reservations will appear here as soon as guests start booking your packages.</span>
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
                  <th className={styles.tableHeaderCell}>Booked On</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const normalizedStatus = (booking.status ?? 'PENDING').trim().toUpperCase() as BookingStatus;
                  const statusLabel = STATUS_LABELS[normalizedStatus] ?? STATUS_LABELS.PENDING;
                  const statusKey = `${booking.id}-${normalizedStatus}`;

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
                        <span className={`${styles.statusBadge} ${getStatusClassName(normalizedStatus)}`}>
                          {statusLabel}
                        </span>
                        <form className={styles.statusForm} action={updateBookingStatus}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <select
                            id={`status-${booking.id}`}
                            name="status"
                            defaultValue={normalizedStatus}
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
                    <td className={styles.tableCell}>{formatDate(booking.createdAt)}</td>
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
