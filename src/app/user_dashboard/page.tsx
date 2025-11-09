import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import DashboardClient, { Booking, Quotation, CustomTrip } from './DashboardClient';

const DASHBOARD_ROUTE = '/user_dashboard';
const LOGIN_REDIRECT = `/login?redirect=${encodeURIComponent(DASHBOARD_ROUTE)}`;

type JwtPayload = {
  sub?: string | number;
  email?: string;
  role?: string;
};

type AuthenticatedUser = {
  id: number;
  email: string;
  username: string;
  role: string | null;
};

type DbBookingRow = {
  id: number;
  package_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  preferred_date: string | Date | null;
  preferred_end_date: string | Date | null;
  number_of_guests: number | null;
  special_requests: string | null;
  status: string | null;
  payment_status: string | null;
  receipt_url: string | null;
  receipt_uploaded_at: string | Date | null;
  created_at: string | Date | null;
  package_title: string | null;
  package_category: string | null;
  package_price: string | number | null;
  latest_receipt_url: string | null;
  latest_receipt_uploaded_at: string | Date | null;
};

type DbReceiptRow = {
  id: number;
  booking_id: number;
  file_url: string | null;
  uploaded_at: string | Date | null;
  package_title: string | null;
  package_price: string | number | null;
  number_of_guests: number | null;
  payment_status: string | null;
};

type DbCustomTripRow = {
  id: number;
  name: string | null;
  description: string | null;
  total_duration_label: string | null;
  guests: number | null;
  status: string | null;
  quotation_pdf_path: string | null;
  start_date: string | Date | null;
  end_date: string | Date | null;
  contact_email: string | null;
  created_at: string | Date | null;
  places: unknown;
};

const PAYMENT_STATUSES = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const;
type PaymentStatusKey = typeof PAYMENT_STATUSES[number];

const PAYMENT_STATUS_LABELS: Record<PaymentStatusKey, string> = {
  PENDING: 'Awaiting receipt',
  UNDER_REVIEW: 'Receipt submitted',
  APPROVED: 'Payment verified',
  REJECTED: 'Receipt rejected',
};

const BOOKING_STATUS_MAP: Record<string, Booking['status']> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

function parseNumericId(value: string | number | undefined): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? NaN);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid identifier: ${value}`);
  }
  return parsed;
}

function formatDate(value: string | Date | null | undefined, fallback = 'TBD'): string {
  if (!value) {
    return fallback;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateRange(
  startValue: string | Date | null | undefined,
  endValue: string | Date | null | undefined,
  fallback = 'TBD',
): string {
  if (!startValue) {
    return fallback;
  }

  const startDate = startValue instanceof Date ? startValue : new Date(startValue);
  if (Number.isNaN(startDate.getTime())) {
    return fallback;
  }

  const startLabel = formatDate(startDate, fallback);

  if (!endValue) {
    return startLabel;
  }

  const endDate = endValue instanceof Date ? endValue : new Date(endValue);
  if (Number.isNaN(endDate.getTime())) {
    return startLabel;
  }

  if (startDate.toDateString() === endDate.toDateString()) {
    return startLabel;
  }

  const endLabel = formatDate(endDate, fallback);
  return `${startLabel} – ${endLabel}`;
}

function toIsoString(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function toClientBookingStatus(value: string | null | undefined): Booking['status'] {
  const normalized = (value ?? '').trim().toUpperCase();
  return BOOKING_STATUS_MAP[normalized] ?? 'pending';
}

function toPaymentStatus(value: string | null | undefined): PaymentStatusKey {
  const normalized = (value ?? '').trim().toUpperCase();
  if (PAYMENT_STATUSES.includes(normalized as PaymentStatusKey)) {
    return normalized as PaymentStatusKey;
  }
  return 'PENDING';
}

function computeAmount(price: string | number | null | undefined, guests: number | null | undefined): number {
  const numericPrice = Number(price ?? 0);
  const numericGuests = Number.isFinite(guests) && (guests ?? 0) > 0 ? Number(guests) : 1;
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return 0;
  }
  const total = numericPrice * numericGuests;
  return Math.round(total * 100) / 100;
}

function normalizeEmailForLookup(email: string): string {
  return email.trim().toLowerCase();
}

async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  // First check NextAuth session
  const session = await auth();
  
  if (session?.user) {
    // User authenticated via NextAuth (Google OAuth)
    const userId = parseNumericId(session.user.id);
    
    const result = await query(
      'SELECT user_id, username, email, role FROM users WHERE user_id = $1',
      [userId],
    );

    const row = result.rows[0] as { user_id: number; username: string | null; email: string; role: string | null } | undefined;

    if (!row) {
      console.error('[Dashboard] User not found in database for session:', session.user);
      throw new Error('Authenticated user not found');
    }

    // Use Google name if username is not set in database
    const normalizedEmail = row.email.trim();
    const displayUsername = row.username || session.user.name || normalizedEmail;

    return {
      id: row.user_id,
      email: normalizedEmail,
      username: displayUsername,
      role: row.role ?? session.user.role ?? null,
    };
  }

  // Fallback to legacy JWT token
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect(LOGIN_REDIRECT);
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as JwtPayload;
    const userId = parseNumericId(payload.sub as string | number | undefined);

    const result = await query(
      'SELECT user_id, username, email, role FROM users WHERE user_id = $1',
      [userId],
    );

    const row = result.rows[0] as { user_id: number; username: string | null; email: string; role: string | null } | undefined;

    if (!row) {
      throw new Error('Authenticated user not found');
    }

    const normalizedEmail = row.email.trim();

    return {
      id: row.user_id,
      email: normalizedEmail,
      username: row.username ?? normalizedEmail,
      role: row.role ?? payload.role ?? null,
    };
  } catch (error) {
    console.error('Failed to resolve user for dashboard:', error);
    redirect(LOGIN_REDIRECT);
  }
}

async function fetchBookingsForUser(user: AuthenticatedUser): Promise<Booking[]> {
  const emailLookup = normalizeEmailForLookup(user.email);
  console.log('[Dashboard] Fetching bookings for user:', { id: user.id, email: user.email, emailLookup });

  const result = await query(
    `SELECT
      b.id,
      b.package_id,
      b.customer_name,
      b.customer_email,
      b.customer_phone,
      b.preferred_date,
      b.number_of_guests,
      b.special_requests,
      b.status,
      b.payment_status,
      b.receipt_url,
      b.receipt_uploaded_at,
      b.created_at,
      tp.title AS package_title,
      tp.category AS package_category,
      tp.price AS package_price,
      latest_receipt.file_url AS latest_receipt_url,
      latest_receipt.uploaded_at AS latest_receipt_uploaded_at
    FROM bookings b
    LEFT JOIN tour_packages tp ON b.package_id = tp.id
    LEFT JOIN LATERAL (
      SELECT file_url, uploaded_at
      FROM booking_receipts br
      WHERE br.booking_id = b.id
      ORDER BY br.uploaded_at DESC NULLS LAST, br.id DESC
      LIMIT 1
    ) AS latest_receipt ON TRUE
   WHERE (b.user_id = $1)
     OR LOWER(TRIM(b.customer_email)) = $2
    ORDER BY b.created_at DESC NULLS LAST, b.id DESC`,
   [user.id, emailLookup],
  );

  console.log(`[Dashboard] Found ${result.rows.length} bookings for user ${user.id}`);

  return (result.rows as DbBookingRow[]).map((row) => {
    const paymentStatus = toPaymentStatus(row.payment_status);
    const receiptUrl = row.receipt_url || row.latest_receipt_url || null;
    const receiptUploaded = row.receipt_uploaded_at || row.latest_receipt_uploaded_at;
    const travelers = row.number_of_guests && row.number_of_guests > 0 ? row.number_of_guests : 1;

    return {
      id: String(row.id),
      packageName: row.package_title ?? 'Custom travel experience',
      destination: row.package_category ?? row.package_title ?? 'Sri Lanka',
      date: formatDateRange(row.preferred_date, row.preferred_end_date),
      travelers,
      status: toClientBookingStatus(row.status),
      amount: computeAmount(row.package_price, travelers),
      quotationUrl: receiptUrl ?? undefined,
      paymentStatus,
      paymentStatusLabel: PAYMENT_STATUS_LABELS[paymentStatus],
      receiptUploadedAt: toIsoString(receiptUploaded),
      createdAt: toIsoString(row.created_at),
      specialRequests: row.special_requests ?? null,
    };
  });
}

async function fetchReceiptsForUser(user: AuthenticatedUser, bookings: Booking[]): Promise<Quotation[]> {
  const emailLookup = normalizeEmailForLookup(user.email);
  const result = await query(
    `SELECT
      br.id,
      br.booking_id,
      br.file_url,
      br.uploaded_at,
      tp.title AS package_title,
      tp.price AS package_price,
      b.number_of_guests,
      b.payment_status
    FROM booking_receipts br
    JOIN bookings b ON br.booking_id = b.id
    LEFT JOIN tour_packages tp ON b.package_id = tp.id
   WHERE (b.user_id = $1)
     OR LOWER(TRIM(b.customer_email)) = $2
    ORDER BY br.uploaded_at DESC NULLS LAST, br.id DESC`,
   [user.id, emailLookup],
  );

  const seen = new Set<string>();
  const items: Quotation[] = [];

  (result.rows as DbReceiptRow[]).forEach((row) => {
    if (!row.file_url) {
      return;
    }
    const key = `${row.booking_id}:${row.file_url}`;
    if (seen.has(key)) {
      return;
    }

    const paymentStatus = toPaymentStatus(row.payment_status);

    items.push({
      id: String(row.id),
      bookingId: String(row.booking_id),
      packageName: row.package_title ?? `Booking #${row.booking_id}`,
      date: formatDate(row.uploaded_at, 'Uploaded receipt'),
      amount: computeAmount(row.package_price, row.number_of_guests),
      downloadUrl: row.file_url,
      statusLabel: PAYMENT_STATUS_LABELS[paymentStatus],
    });

    seen.add(key);
  });

  bookings.forEach((booking) => {
    if (!booking.quotationUrl) {
      return;
    }
    const key = `${booking.id}:${booking.quotationUrl}`;
    if (seen.has(key)) {
      return;
    }

    items.push({
      id: key,
      bookingId: booking.id,
      packageName: booking.packageName,
      date: booking.receiptUploadedAt ? formatDate(booking.receiptUploadedAt, 'Receipt uploaded') : 'Receipt uploaded',
      amount: booking.amount,
      downloadUrl: booking.quotationUrl,
      statusLabel: booking.paymentStatusLabel ?? PAYMENT_STATUS_LABELS[toPaymentStatus(booking.paymentStatus)],
    });

    seen.add(key);
  });

  return items;
}

async function fetchCustomTripsForUser(user: AuthenticatedUser): Promise<CustomTrip[]> {
  const emailLookup = normalizeEmailForLookup(user.email);
  console.log('[Dashboard] Fetching custom trips for user:', { id: user.id, email: user.email, emailLookup });

  type RawCustomTripPlace = {
    name?: string | null;
    duration?: string | null;
  };

  const mapCustomTripRow = (row: DbCustomTripRow): CustomTrip => {
    const rawPlaces = row.places;
    let places: RawCustomTripPlace[] = [];

    if (Array.isArray(rawPlaces)) {
      places = rawPlaces as RawCustomTripPlace[];
    } else if (typeof rawPlaces === 'string') {
      try {
        const parsed = JSON.parse(rawPlaces) as unknown;
        if (Array.isArray(parsed)) {
          places = parsed as RawCustomTripPlace[];
        }
      } catch (parseError) {
        console.warn('[Dashboard] Failed to parse custom trip places JSON:', parseError);
      }
    }

    const normalizedPlaces = places
      .filter((item): item is { name: string; duration?: string | null } =>
        typeof item?.name === 'string' && item.name.trim().length > 0,
      )
      .map((item) => ({
        name: item.name,
        duration:
          typeof item.duration === 'string' && item.duration.trim().length > 0
            ? item.duration
            : 'Duration TBD',
      }));

    const guestCount = typeof row.guests === 'number' && Number.isFinite(row.guests) ? row.guests : 0;

    return {
      id: String(row.id),
      name: row.name ?? 'Custom trip',
      description: row.description,
      duration: row.total_duration_label ?? 'Duration TBD',
      guests: guestCount,
      status: row.status === 'approved' ? 'approved' : row.status === 'rejected' ? 'rejected' : 'pending',
      quotationPdfPath: row.quotation_pdf_path,
      dateRange: formatDateRange(row.start_date, row.end_date, 'Dates TBD'),
      placesCount: normalizedPlaces.length,
      places: normalizedPlaces,
      createdAt: formatDate(row.created_at, 'Recently'),
    };
  };

  try {
    const result = await query(
      `SELECT
         cp.id,
         cp.name,
         cp.description,
         cp.total_duration_label,
         cp.guests,
         cp.status,
         cp.quotation_pdf_path,
         cp.start_date,
         cp.end_date,
         cp.contact_email,
         cp.created_at,
         COALESCE(
           json_agg(
             json_build_object(
               'name', p.name,
               'duration', p.duration
             )
             ORDER BY cpp.display_order
           )
           FILTER (WHERE p.id IS NOT NULL),
           '[]'
         ) AS places
       FROM custom_packages cp
       LEFT JOIN custom_package_places cpp ON cpp.custom_package_id = cp.id
       LEFT JOIN places p ON p.id = cpp.place_id
       WHERE (cp.user_id = $1)
          OR LOWER(TRIM(cp.contact_email)) = $2
       GROUP BY cp.id
       ORDER BY cp.created_at DESC`,
      [user.id, emailLookup],
    );

    console.log(`[Dashboard] Found ${result.rows.length} custom trips linked to user ${user.id}`);

    if (result.rows.length > 0) {
      console.log('[Dashboard] Custom trips emails:', result.rows.map((r) => (typeof r.contact_email === 'string' ? r.contact_email.trim() : r.contact_email)));
    }

  const rows = result.rows as DbCustomTripRow[];
  return rows.map(mapCustomTripRow);
  } catch (error) {
    const pgCode = typeof error === 'object' && error && 'code' in error
      ? (error as { code?: string }).code
      : undefined;

    if (pgCode === '42703') {
      console.warn('[Dashboard] custom_packages.user_id column missing, falling back to email lookup');
      try {
        const fallbackResult = await query(
          `SELECT
             cp.id,
             cp.name,
             cp.description,
             cp.total_duration_label,
             cp.guests,
             cp.status,
             cp.quotation_pdf_path,
             cp.start_date,
             cp.end_date,
             cp.contact_email,
             cp.created_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'name', p.name,
                   'duration', p.duration
                 )
                 ORDER BY cpp.display_order
               )
               FILTER (WHERE p.id IS NOT NULL),
               '[]'
             ) AS places
           FROM custom_packages cp
           LEFT JOIN custom_package_places cpp ON cpp.custom_package_id = cp.id
           LEFT JOIN places p ON p.id = cpp.place_id
           WHERE LOWER(TRIM(cp.contact_email)) = $1
           GROUP BY cp.id
           ORDER BY cp.created_at DESC`,
          [emailLookup],
        );

        console.log(`[Dashboard] Found ${fallbackResult.rows.length} custom trips via email fallback for ${user.email}`);
  const fallbackRows = fallbackResult.rows as DbCustomTripRow[];
  return fallbackRows.map(mapCustomTripRow);
      } catch (fallbackError) {
        console.error('[Dashboard] Email fallback query failed:', fallbackError);
        return [];
      }
    }

    console.error('[Dashboard] Failed to fetch custom trips:', error);
    return [];
  }
}

export default async function UserDashboardPage() {
  const user = await getAuthenticatedUser();
  const bookings = await fetchBookingsForUser(user);
  const quotations = await fetchReceiptsForUser(user, bookings);
  const customTrips = await fetchCustomTripsForUser(user);

  const displayName = user.username || user.email.split('@')[0] || 'Traveler';

  return (
    <DashboardClient
      initialBookings={bookings}
      initialQuotations={quotations}
      initialCustomTrips={customTrips}
      userName={displayName}
    />
  );
}
