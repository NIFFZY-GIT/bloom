import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import { query } from '@/lib/db';
import styles from './AdminDashboard.module.css';

interface PackageSummary {
  id: number;
  title: string;
  price: number | null;
  category: string | null;
  reviews: number;
  imagePath: string | null;
}

interface DbPackageRow {
  id: number;
  title: string | null;
  price: number | string | null;
  category: string | null;
  reviews: number | null;
  image_path: string | null;
}

interface DashboardStats {
  totalUsers: number;
  totalPackages: number;
  totalBookings: number;
  revenue: number;
}

interface BookingRow {
  id: number;
  customerName: string;
  packageTitle: string;
  status: string;
  preferredDate: Date | null;
  createdAt: Date | null;
}

interface DbBookingRow {
  id?: number;
  booking_id?: number;
  customer_name: string;
  preferred_date: string | null;
  created_at: string | null;
  status: string | null;
  package_title: string | null;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/dashboard');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin dashboard:', error);
    redirect('/login?redirect=/admin/dashboard');
  }
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [userCountRes, packageCountRes, bookingCountRes, revenueRes] = await Promise.all([
      query('SELECT COUNT(*)::int AS count FROM users'),
      query('SELECT COUNT(*)::int AS count FROM tour_packages'),
      query('SELECT COUNT(*)::int AS count FROM bookings'),
      query(
        `SELECT COALESCE(SUM(tp.price), 0)::numeric AS revenue
         FROM bookings b
         LEFT JOIN tour_packages tp ON b.package_id = tp.id`
      ),
    ]);

    return {
      totalUsers: Number(userCountRes.rows[0]?.count ?? 0),
      totalPackages: Number(packageCountRes.rows[0]?.count ?? 0),
      totalBookings: Number(bookingCountRes.rows[0]?.count ?? 0),
      revenue: Number(revenueRes.rows[0]?.revenue ?? 0),
    };
  } catch (error) {
    console.error('Failed to load dashboard statistics:', error);
    return {
      totalUsers: 0,
      totalPackages: 0,
      totalBookings: 0,
      revenue: 0,
    };
  }
}

async function getPackages(): Promise<PackageSummary[]> {
  try {
    const result = await query(
      `SELECT id, title, price, category, reviews, image_path
       FROM tour_packages
       ORDER BY id DESC
       LIMIT 6`
    );

    const rows = result.rows as DbPackageRow[];

    return rows.map((row) => ({
      id: Number(row.id),
      title: row.title ?? 'Untitled package',
      price: row.price != null ? Number(row.price) : null,
      category: row.category ?? null,
      reviews: row.reviews != null ? Number(row.reviews) : 0,
      imagePath: row.image_path ?? null,
    }));
  } catch (error) {
    console.error('Failed to load dashboard packages:', error);
    return [];
  }
}

async function getRecentBookings(): Promise<BookingRow[]> {
  const mapRows = (rows: DbBookingRow[]): BookingRow[] =>
    rows.map((row) => ({
      id: row.id ?? row.booking_id ?? 0,
      customerName: row.customer_name,
      packageTitle: row.package_title ?? 'Unknown package',
      status: (row.status ?? 'PENDING').toUpperCase(),
      preferredDate: row.preferred_date ? new Date(row.preferred_date) : null,
      createdAt: row.created_at ? new Date(row.created_at) : null,
    }));

  try {
    const result = await query(
      `SELECT 
         b.id,
         b.customer_name,
         b.preferred_date,
         b.created_at,
         b.status,
         tp.title AS package_title
       FROM bookings b
       LEFT JOIN tour_packages tp ON b.package_id = tp.id
       ORDER BY b.created_at DESC NULLS LAST, b.id DESC
       LIMIT 5`
    );

    return mapRows(result.rows as DbBookingRow[]);
  } catch (error) {
    console.warn('Falling back to legacy booking shape for dashboard:', error);
    try {
      const fallback = await query(
        `SELECT 
           b.booking_id AS id,
           b.customer_name,
           b.preferred_date,
           NULL::timestamp AS created_at,
           NULL::text AS status,
           tp.title AS package_title
         FROM bookings b
         LEFT JOIN tour_packages tp ON b.package_id = tp.id
         ORDER BY b.booking_id DESC
         LIMIT 5`
      );

      return mapRows(fallback.rows as DbBookingRow[]);
    } catch (fallbackError) {
      console.error('Failed to load recent bookings for dashboard:', fallbackError);
      return [];
    }
  }
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

function formatCurrency(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return '$0';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusClass(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return styles.statusConfirmed;
    case 'CANCELLED':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
}

export default async function AdminDashboard() {
  await requireAdmin();
  const [stats, packages, recentBookings] = await Promise.all([
    getDashboardStats(),
    getPackages(),
    getRecentBookings(),
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>Dashboard Overview</h1>
            <p className={styles.headerSubtitle}>Welcome back, Admin</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn} type="button">
              <span>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
            <button className={styles.actionBtn} type="button">
              <span>👑</span>
            </button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <article className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Users</p>
              <h3 className={styles.statValue}>{stats.totalUsers}</h3>
              <p className={`${styles.statChange} ${styles.statChangePositive}`}>+12% from last month</p>
            </div>
          </article>

          <article className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Packages</p>
              <h3 className={styles.statValue}>{stats.totalPackages}</h3>
              <p className={`${styles.statChange} ${styles.statChangePositive}`}>+8% from last month</p>
            </div>
          </article>

          <article className={`${styles.statCard} ${styles.statCardYellow}`}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Bookings</p>
              <h3 className={styles.statValue}>{stats.totalBookings}</h3>
              <p className={`${styles.statChange} ${styles.statChangePositive}`}>+23% from last month</p>
            </div>
          </article>

          <article className={`${styles.statCard} ${styles.statCardPurple}`}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Revenue</p>
              <h3 className={styles.statValue}>{formatCurrency(stats.revenue)}</h3>
              <p className={`${styles.statChange} ${styles.statChangePositive}`}>+15% from last month</p>
            </div>
          </article>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Bookings</h2>
              <Link href="/admin/bookings" className={styles.viewAllBtn}>View All</Link>
            </div>
            <div className={styles.cardContent}>
              {recentBookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No bookings recorded yet. Confirmed reservations will appear here once guests start booking.</p>
                </div>
              ) : (
                recentBookings.map((booking) => {
                  const requestedDate = formatDate(booking.preferredDate);
                  const createdDate = formatDate(booking.createdAt);
                  const displayDate = booking.createdAt ? `Booked on ${createdDate}` : `Requested for ${requestedDate}`;

                  return (
                    <div className={styles.bookingItem} key={booking.id}>
                      <div className={styles.bookingInfo}>
                        <p className={styles.bookingName}>{booking.customerName}</p>
                        <p className={styles.bookingPackage}>{booking.packageTitle}</p>
                      </div>
                      <div className={styles.bookingMeta}>
                        <span className={styles.bookingDate}>{displayDate}</span>
                        <span className={`${styles.bookingStatus} ${getStatusClass(booking.status)}`}>
                          {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.quickActionsGrid}>
                <Link href="/admin/packages/new" className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>➕</span>
                  <span className={styles.quickActionText}>Add Package</span>
                </Link>
                <Link href="/admin/users" className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>👤</span>
                  <span className={styles.quickActionText}>Add User</span>
                </Link>
                <Link href="/admin/bookings" className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>📝</span>
                  <span className={styles.quickActionText}>New Booking</span>
                </Link>
                <Link href="/admin/bookings" className={styles.quickActionBtn}>
                  <span className={styles.quickActionIcon}>📊</span>
                  <span className={styles.quickActionText}>Reports</span>
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className={`${styles.card} ${styles.cardFullWidth}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Current Packages</h2>
            <Link href="/admin/packages/new" className={styles.viewAllBtn}>+ Add New Package</Link>
          </div>
          <div className={styles.cardContent}>
            {packages.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No tour packages available yet. Create your first package to showcase it here.</p>
              </div>
            ) : (
              <div className={styles.packagesGrid}>
                {packages.map((pkg) => (
                  <div className={styles.packageCard} key={pkg.id}>
                    <div
                      className={styles.packageImage}
                      style={{ backgroundImage: `url(${pkg.imagePath || '/images/packages/default.jpg'})` }}
                    >
                      {pkg.category && <span className={styles.packageBadge}>{pkg.category}</span>}
                    </div>
                    <div className={styles.packageInfo}>
                      <h3 className={styles.packageName}>{pkg.title}</h3>
                      <p className={styles.packageBookings}>{pkg.reviews ?? 0} reviews</p>
                      <p className={styles.packagePrice}>{pkg.price != null ? formatCurrency(pkg.price) : '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
