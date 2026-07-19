import { revalidatePath } from 'next/cache';
import Image from 'next/image';

import { query } from '@/lib/db';
import { requireAdminPage } from '@/lib/admin-auth';
import { actionError, actionOk, describeError, type ActionResult } from '@/lib/action-result';
import { notifyUserBookingStatusChange, notifyUserPaymentStatusChange, notifyAdminNewBooking, sendBookingConfirmationToUser } from '@/lib/email';
import ActionForm from '@/components/admin/ActionForm';
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
  preferred_end_date: string | null;
  number_of_guests: number | null;
  special_requests: string | null;
  food_and_special_requests: string | null;
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
  preferredStartDate: Date | null;
  preferredEndDate: Date | null;
  guests: number | null;
  specialRequests: string | null;
  foodAndSpecialRequests: string | null;
  createdAt: Date | null;
  status: BookingStatus;
  price: number | null;
  paymentStatus: PaymentStatus;
  receiptUrl: string | null;
  receiptUploadedAt: Date | null;
}

async function requireAdmin() {
  await requireAdminPage('/admin/bookings');
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
    preferredStartDate: row.preferred_date ? new Date(row.preferred_date) : null,
    preferredEndDate: row.preferred_end_date ? new Date(row.preferred_end_date) : (row.preferred_date ? new Date(row.preferred_date) : null),
    guests: row.number_of_guests,
    specialRequests: row.special_requests,
    foodAndSpecialRequests: row.food_and_special_requests ?? null,
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
  const preferredEndSelectors = [
    'b.preferred_end_date AS preferred_end_date',
    'b.preferred_date AS preferred_end_date',
    'NULL::date AS preferred_end_date',
  ];
  const foodRequestsSelectors = [
    'b.food_and_special_requests AS food_and_special_requests',
    'NULL::text AS food_and_special_requests',
  ];

  const attemptedSql = new Set<string>();
  const errors: unknown[] = [];

  for (const idExpr of idSelectors) {
    for (const statusExpr of statusSelectors) {
      for (const createdExpr of createdSelectors) {
        for (const paymentExpr of paymentStatusSelectors) {
          for (const receiptExpr of receiptSelectors) {
            for (const receiptUploadedExpr of receiptUploadedSelectors) {
              for (const preferredEndExpr of preferredEndSelectors) {
                for (const foodRequestsExpr of foodRequestsSelectors) {
                  const sql = `SELECT 
           ${idExpr},
           b.package_id,
           b.customer_name,
           b.customer_email,
           b.customer_phone,
           b.preferred_date,
           ${preferredEndExpr},
           b.number_of_guests,
           b.special_requests,
           ${foodRequestsExpr},
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatDateRange(start: Date | null, end: Date | null) {
  if (!start || Number.isNaN(start.valueOf())) {
    return '—';
  }

  const startLabel = formatDate(start);
  if (!end || Number.isNaN(end.valueOf()) || start.toDateString() === end.toDateString()) {
    return startLabel;
  }

  return `${startLabel} – ${formatDate(end)}`;
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

// Unused component - keeping for future use  
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ReceiptPreview({ url, uploadedAt }: { url: string; uploadedAt: Date | null }) {
  const type = detectReceiptType(url);
  const uploadedLabel = uploadedAt ? formatDateTime(uploadedAt) : null;

  return (
    <div className={styles.receiptReview}>
      <details className={styles.receiptDetails}>
        <summary className={styles.receiptSummary}>Review uploaded receipt</summary>
        <div className={styles.receiptPreview}>
          {type === 'image' ? (
            <Image
              src={url}
              alt="Uploaded payment receipt"
              className={styles.receiptImage}
              width={800}
              height={600}
              style={{ objectFit: 'contain' }}
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

async function updateBookingStatus(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  'use server';

  await requireAdmin();

  const rawId = formData.get('bookingId');
  const rawStatus = formData.get('status');

  const bookingId = typeof rawId === 'string' ? Number(rawId) : NaN;
  const status = typeof rawStatus === 'string' ? rawStatus.toUpperCase() : '';

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.warn('Invalid booking id submitted for status update:', rawId);
    return actionError('That booking has an invalid id, so its status could not be updated.');
  }

  if (!ALLOWED_STATUSES.includes(status as BookingStatus)) {
    console.warn('Invalid booking status submitted:', status);
    return actionError(`"${status}" is not a valid booking status.`);
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

  let updatedRows: number;
  try {
    updatedRows = await attemptUpdate('booking_id', 'status');

    if (updatedRows === 0) {
      updatedRows = await attemptUpdate('booking_id', 'booking_status');
    }

    if (updatedRows === 0) {
      updatedRows = await attemptUpdate('id', 'status');
    }

    if (updatedRows === 0) {
      updatedRows = await attemptUpdate('id', 'booking_status');
    }
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return actionError(describeError(error, 'Failed to update the booking status.'));
  }

  if (updatedRows === 0) {
    console.warn('No booking rows updated for id:', bookingId);
    return actionError(`Booking #${bookingId} was not found — it may have been deleted already.`);
  }

  let emailWarning: string | null = null;

  // If status changed to CONFIRMED, send invoice emails to both admin and customer
  if (status === 'CONFIRMED') {
    try {
      const bookingDetailsResult = await query(
        `SELECT 
          b.customer_name, 
          b.customer_email, 
          b.customer_phone,
          b.preferred_date,
          b.preferred_end_date,
          b.number_of_guests,
          b.special_requests,
          tp.title AS package_name,
          tp.price
         FROM bookings b
         LEFT JOIN tour_packages tp ON b.package_id = tp.id
         WHERE b.id = $1 OR b.booking_id = $1`,
        [bookingId]
      );

      if (bookingDetailsResult.rows.length > 0) {
        const booking = bookingDetailsResult.rows[0];
        const totalAmount = Number(booking.price || 0) * Number(booking.number_of_guests);

        // Send detailed invoice to admin
        await notifyAdminNewBooking({
          bookingId: String(bookingId),
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          packageName: booking.package_name || 'Package',
          preferredDate: booking.preferred_date,
          preferredEndDate: booking.preferred_end_date,
          numberOfGuests: Number(booking.number_of_guests),
          totalAmount,
          pricePerPerson: Number(booking.price || 0),
          specialRequests: booking.special_requests,
        });

        // Send detailed invoice confirmation to customer
        await sendBookingConfirmationToUser({
          bookingId: String(bookingId),
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          packageName: booking.package_name || 'Package',
          preferredStartDate: booking.preferred_date,
          preferredEndDate: booking.preferred_end_date,
          numberOfGuests: Number(booking.number_of_guests),
          pricePerPerson: Number(booking.price || 0),
          totalAmount,
          specialRequests: booking.special_requests,
        });
      }
    } catch (invoiceEmailError) {
      console.error('Failed to send invoice emails on confirmation:', invoiceEmailError);
      // Continue - status was already updated successfully, but tell the admin so
      // they know to follow up with the customer manually.
      emailWarning = 'the invoice email could not be sent';
    }
  }

  // Send status change notification email to customer
  try {
    const bookingResult = await query(
      `SELECT b.customer_email, tp.title AS package_name
       FROM bookings b
       LEFT JOIN tour_packages tp ON b.package_id = tp.id
       WHERE b.id = $1 OR b.booking_id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length > 0) {
      const bookingData = bookingResult.rows[0];
      await notifyUserBookingStatusChange({
        email: bookingData.customer_email,
        bookingId: String(bookingId),
        packageName: bookingData.package_name || 'Your Package',
        newStatus: status.toLowerCase(),
      });
    }
  } catch (emailError) {
    // Log email error but don't fail the request
    console.error('Failed to send booking status notification email:', emailError);
    emailWarning = 'the customer notification email could not be sent';
  }

  revalidatePath('/admin/bookings');
  return actionOk(
    emailWarning ? `Status saved, but ${emailWarning}. Please contact the customer directly.` : undefined,
  );
}

async function updatePaymentStatus(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  'use server';

  await requireAdmin();

  const rawId = formData.get('bookingId');
  const rawStatus = formData.get('paymentStatus');

  const bookingId = typeof rawId === 'string' ? Number(rawId) : NaN;
  const status = typeof rawStatus === 'string' ? rawStatus.toUpperCase() : '';

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.warn('Invalid booking id submitted for payment status update:', rawId);
    return actionError('That booking has an invalid id, so its payment status could not be updated.');
  }

  if (!PAYMENT_STATUSES.includes(status as PaymentStatus)) {
    console.warn('Invalid payment status submitted:', status);
    return actionError(`"${status}" is not a valid payment status.`);
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

  let updatedRows: number;
  try {
    updatedRows = await attemptUpdate('booking_id', 'payment_status');

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
  } catch (error) {
    console.error('Failed to update payment status:', error);
    return actionError(describeError(error, 'Failed to update the payment status.'));
  }

  if (updatedRows === 0) {
    console.warn('No booking rows updated for payment status id:', bookingId);
    return actionError(`Booking #${bookingId} was not found — it may have been deleted already.`);
  }

  let emailWarning: string | null = null;

  // Send notification email to customer
  try {
    const bookingResult = await query(
      `SELECT b.customer_email, tp.title AS package_name
       FROM bookings b
       LEFT JOIN tour_packages tp ON b.package_id = tp.id
       WHERE b.id = $1 OR b.booking_id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length > 0) {
      const bookingData = bookingResult.rows[0];
      await notifyUserPaymentStatusChange({
        email: bookingData.customer_email,
        bookingId: String(bookingId),
        packageName: bookingData.package_name || 'Your Package',
        newPaymentStatus: status.toLowerCase(),
      });
    }
  } catch (emailError) {
    // Log email error but don't fail the request
    console.error('Failed to send payment status notification email:', emailError);
    emailWarning = 'the customer notification email could not be sent';
  }

  revalidatePath('/admin/bookings');
  return actionOk(
    emailWarning ? `Payment status saved, but ${emailWarning}. Please contact the customer directly.` : undefined,
  );
}

async function deleteBooking(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  'use server';

  await requireAdmin();

  const rawId = formData.get('bookingId');
  const bookingId = typeof rawId === 'string' ? Number(rawId) : NaN;

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    console.warn('Invalid booking id submitted for deletion:', rawId);
    return actionError('That booking has an invalid id, so it could not be deleted.');
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
      console.error('Failed to delete booking:', error);
      return actionError(describeError(error, 'Failed to delete the booking.'));
    }
  }

  if (!deleted) {
    console.warn('No booking rows deleted for id:', bookingId);
    return actionError(`Booking #${bookingId} was not found — it may have been deleted already.`);
  }

  revalidatePath('/admin/bookings');
  return actionOk();
}

async function deleteAllBookings(): Promise<ActionResult> {
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
      console.error('Failed to delete all bookings:', error);
      return actionError(describeError(error, 'Failed to delete all bookings.'));
    }
  }

  revalidatePath('/admin/bookings');
  return actionOk();
}

// Unused helper functions - keeping for future use
// function getStatusClassName(status: BookingStatus) {
//   switch (status) {
//     case 'CONFIRMED': return styles.statusConfirmed;
//     case 'CANCELLED': return styles.statusCancelled;
//     default: return styles.statusPending;
//   }
// }

// function getPaymentClassName(status: PaymentStatus) {
//   switch (status) {
//     case 'APPROVED': return styles.paymentApproved;
//     case 'UNDER_REVIEW': return styles.paymentReview;
//     case 'REJECTED': return styles.paymentRejected;
//     default: return styles.paymentPending;
//   }
// }

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const bookings = await getBookings();

  // Await searchParams in Next.js 15
  const params = await searchParams;
  const statusFilter = tryCastBookingStatus(toSingleValue(params?.status));
  const paymentFilter = tryCastPaymentStatus(toSingleValue(params?.payment));
  const searchTermRaw = toSingleValue(params?.query);
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
    if (booking.preferredStartDate) {
      const start = new Date(booking.preferredStartDate);
      const end = booking.preferredEndDate ? new Date(booking.preferredEndDate) : start;
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      if (end >= today) {
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
          <div className={styles.bookingsGrid}>
            {visibleBookings.map((booking) => {
              const hasDetails = booking.specialRequests || booking.foodAndSpecialRequests;

              return (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingId}>#{booking.id}</div>
                  
                  {/* Left Column: Package & Customer Info */}
                  <div className={styles.bookingHeader}>
                    <div className={styles.bookingPackage}>
                      <h3 className={styles.packageTitle}>{booking.packageTitle}</h3>
                      <div className={styles.packageMeta}>
                        {booking.price && (
                          <span className={styles.metaItem}>
                            <i className="fas fa-tag"></i>
                            {formatCurrency(booking.price)}
                          </span>
                        )}
                        <span className={styles.metaItem}>
                          <i className="fas fa-users"></i>
                          {booking.guests ?? 0} {booking.guests === 1 ? 'guest' : 'guests'}
                        </span>
                      </div>
                      <div className={styles.packageMeta} style={{ marginTop: '0.5rem' }}>
                        <span className={styles.metaItem}>
                          <i className="fas fa-calendar-day"></i>
                          <strong>Start:</strong> {formatDate(booking.preferredStartDate)}
                        </span>
                        <span className={styles.metaItem}>
                          <i className="fas fa-calendar-check"></i>
                          <strong>End:</strong> {formatDate(booking.preferredEndDate)}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      Booked on {formatDate(booking.createdAt)}
                    </div>
                  </div>

                  {/* Middle Column: Customer Details */}
                  <div className={styles.customerInfo}>
                    <h4 className={styles.customerName}>
                      <i className="fas fa-user"></i>
                      {booking.customerName}
                    </h4>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactItem}>
                        <i className="fas fa-envelope"></i>
                        {booking.customerEmail}
                      </div>
                      {booking.customerPhone && booking.customerPhone !== '—' && (
                        <div className={styles.contactItem}>
                          <i className="fas fa-phone"></i>
                          {booking.customerPhone}
                        </div>
                      )}
                    </div>

                    {booking.receiptUrl && (
                      <div style={{ marginTop: '1rem' }}>
                        <a 
                          href={booking.receiptUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`${styles.actionButton} ${styles.receiptButton}`}
                          style={{ width: '100%' }}
                        >
                          <i className="fas fa-receipt"></i>
                          View Receipt
                          <span className={styles.receiptBadge}>✓</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status Controls */}
                  <div className={styles.statusSection}>
                    <div className={styles.statusGroup}>
                      <label className={styles.statusLabel} htmlFor={`status-${booking.id}`}>
                        Booking Status
                      </label>
                      <ActionForm action={updateBookingStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <select
                          id={`status-${booking.id}`}
                          name="status"
                          defaultValue={booking.status}
                          className={styles.statusSelect}
                          style={{ flex: 1 }}
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
                      </ActionForm>
                    </div>

                    <div className={styles.statusGroup}>
                      <label className={styles.statusLabel} htmlFor={`payment-${booking.id}`}>
                        Payment Status
                      </label>
                      <ActionForm action={updatePaymentStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <select
                          id={`payment-${booking.id}`}
                          name="paymentStatus"
                          defaultValue={booking.paymentStatus}
                          className={styles.paymentSelect}
                          style={{ flex: 1 }}
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
                      </ActionForm>
                    </div>

                    <DeleteBookingButton
                      bookingId={booking.id}
                      customerName={booking.customerName}
                      action={deleteBooking}
                    />
                  </div>

                  {/* Full Width: Additional Details */}
                  {hasDetails && (
                    <details className={styles.detailsSection}>
                      <summary className={styles.detailsToggle}>
                        <span>📋 Additional Information</span>
                        <i className="fas fa-chevron-down"></i>
                      </summary>
                      <div className={styles.detailsContent}>
                        {booking.specialRequests && (
                          <div className={styles.noteBox}>
                            <h5 className={styles.noteTitle}>
                              <i className="fas fa-sticky-note"></i>
                              Special Notes
                            </h5>
                            <p className={styles.noteText}>{booking.specialRequests}</p>
                          </div>
                        )}
                        {booking.foodAndSpecialRequests && (
                          <div className={styles.foodBox}>
                            <h5 className={styles.foodTitle}>
                              <i className="fas fa-utensils"></i>
                              Food & Dietary Requirements
                            </h5>
                            <p className={styles.foodText}>{booking.foodAndSpecialRequests}</p>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
