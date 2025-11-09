import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import Link from 'next/link';
import styles from '../bookings/AdminBookings.module.css';
import CustomPackagesFilters from './CustomPackagesFilters';
import DeletePackageButton from './DeletePackageButton';
import DeleteAllPackagesForm from './DeleteAllPackagesForm';
import UploadQuotationButton from './UploadQuotationButton';

const ALLOWED_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
type PackageStatus = typeof ALLOWED_STATUSES[number];

const STATUS_LABELS: Record<PackageStatus, string> = {
  PENDING: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

interface Place {
  id: number;
  name: string;
  description: string | null;
  imagePath: string | null;
  category: string | null;
  duration: string;
  location: string | null;
  highlights: string[];
  price: number;
  displayOrder: number;
}

interface CustomPackage {
  id: string;
  name: string;
  description: string | null;
  totalDurationMinutes: number;
  totalDurationLabel: string;
  guests: number;
  contactEmail: string;
  contactPhone: string | null;
  startDate: string | null;
  endDate: string | null;
  foodAndSpecialRequests: string | null;
  additionalInfo: string | null;
  status: PackageStatus;
  quotationPdfPath: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  places: Place[];
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/custompackages');
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as { role?: string };

    if (payload.role !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {
    console.error('Failed to verify auth token for admin custom packages page:', error);
    redirect('/login?redirect=/admin/custompackages');
  }
}

function parseStatus(value: string | null | undefined): PackageStatus {
  const normalized = (value ?? '').trim().toUpperCase();
  if (ALLOWED_STATUSES.includes(normalized as PackageStatus)) {
    return normalized as PackageStatus;
  }
  return 'PENDING';
}

function tryCastStatus(value: string | undefined): PackageStatus | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  return ALLOWED_STATUSES.includes(normalized as PackageStatus) ? (normalized as PackageStatus) : null;
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function getCustomPackages(): Promise<CustomPackage[]> {
  try {
    const result = await query(
      `SELECT
         cp.id,
         cp.name,
         cp.description,
         cp.total_duration_minutes,
         cp.total_duration_label,
         cp.guests,
         cp.contact_email,
         cp.contact_phone,
         cp.start_date,
         cp.end_date,
         cp.food_and_special_requests,
         cp.additional_info,
         cp.status,
         cp.quotation_pdf_path,
         cp.created_at,
         cp.updated_at,
         COALESCE(
           json_agg(
             json_build_object(
               'id', p.id,
               'name', p.name,
               'description', p.description,
               'imagePath', p.image_path,
               'category', p.category,
               'duration', p.duration,
               'location', p.location,
               'highlights', p.highlights,
               'price', p.price,
               'displayOrder', cpp.display_order
             )
             ORDER BY cpp.display_order
           )
           FILTER (WHERE p.id IS NOT NULL),
           '[]'
         ) AS places
       FROM custom_packages cp
       LEFT JOIN custom_package_places cpp ON cpp.custom_package_id = cp.id
       LEFT JOIN places p ON p.id = cpp.place_id
       GROUP BY cp.id
       ORDER BY cp.created_at DESC`
    );

    return result.rows.map((row) => ({
      id: String(row.id),
      name: row.name,
      description: row.description,
      totalDurationMinutes: row.total_duration_minutes,
      totalDurationLabel: row.total_duration_label,
      guests: row.guests,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      startDate: row.start_date,
      endDate: row.end_date,
      foodAndSpecialRequests: row.food_and_special_requests,
      additionalInfo: row.additional_info,
      status: parseStatus(row.status),
      quotationPdfPath: row.quotation_pdf_path,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
      places: Array.isArray(row.places) ? row.places : [],
    }));
  } catch (error) {
    console.error('Failed to load custom packages:', error);
    return [];
  }
}

function formatDate(value: Date | string | null) {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);
  
  if (Number.isNaN(date.valueOf())) {
    return '—';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Unused helper function - keeping for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatDateTime(value: Date | null) {
  if (!value || Number.isNaN(value.valueOf())) {
    return '—';
  }

  return value.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start) {
    return '—';
  }

  const startLabel = formatDate(start);
  if (!end || start === end) {
    return startLabel;
  }

  return `${startLabel} – ${formatDate(end)}`;
}

async function updatePackageStatus(formData: FormData) {
  'use server';

  await requireAdmin();

  const rawId = formData.get('packageId');
  const rawStatus = formData.get('status');

  const packageId = typeof rawId === 'string' ? rawId.trim() : '';
  const status = typeof rawStatus === 'string' ? rawStatus.trim().toUpperCase() : '';

  if (!packageId || !isValidUuid(packageId)) {
    console.warn('Invalid package id submitted for status update:', rawId);
    return;
  }

  if (!ALLOWED_STATUSES.includes(status as PackageStatus)) {
    console.warn('Invalid package status submitted:', status);
    return;
  }

  try {
    await query(
      `UPDATE custom_packages SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status.toLowerCase(), packageId]
    );

    revalidatePath('/admin/custompackages');
  } catch (error) {
    console.error('Failed to update package status:', error);
  }
}

async function deletePackage(formData: FormData) {
  'use server';

  await requireAdmin();

  const rawId = formData.get('packageId');
  const packageId = typeof rawId === 'string' ? rawId.trim() : '';

  if (!packageId || !isValidUuid(packageId)) {
    console.warn('Invalid package id submitted for deletion:', rawId);
    return;
  }

  try {
    // Delete relationships first (CASCADE should handle this, but being explicit)
    await query('DELETE FROM custom_package_places WHERE custom_package_id = $1', [packageId]);
    
    // Delete the package
    await query('DELETE FROM custom_packages WHERE id = $1', [packageId]);

    revalidatePath('/admin/custompackages');
  } catch (error) {
    console.error('Failed to delete package:', error);
  }
}

async function deleteAllPackages() {
  'use server';

  await requireAdmin();

  try {
    await query('DELETE FROM custom_package_places');
    await query('DELETE FROM custom_packages');

    revalidatePath('/admin/custompackages');
  } catch (error) {
    console.error('Failed to delete all packages:', error);
  }
}

// Unused helper function - keeping for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStatusClassName(status: PackageStatus) {
  switch (status) {
    case 'APPROVED':
      return styles.statusConfirmed;
    case 'REJECTED':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
}

type SearchParams = Record<string, string | string[] | undefined>;

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminCustomPackagesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const packages = await getCustomPackages();

  // Await searchParams in Next.js 15
  const params = await searchParams;
  const statusFilter = tryCastStatus(toSingleValue(params?.status));
  const searchTermRaw = toSingleValue(params?.query);
  const searchTerm = searchTermRaw ? searchTermRaw.trim().toLowerCase() : '';

  const totalPackages = packages.length;
  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;

  packages.forEach((pkg) => {
    if (pkg.status === 'PENDING') {
      pendingCount += 1;
    } else if (pkg.status === 'APPROVED') {
      approvedCount += 1;
    } else if (pkg.status === 'REJECTED') {
      rejectedCount += 1;
    }
  });

  const filteredPackages = packages.filter((pkg) => {
    if (statusFilter && pkg.status !== statusFilter) {
      return false;
    }
    if (searchTerm) {
      const haystack = [
        pkg.name,
        pkg.description ?? '',
        pkg.contactEmail,
        pkg.contactPhone ?? '',
        pkg.id.toString(),
        ...pkg.places.map(p => p.name),
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });

  const isFiltered = Boolean(statusFilter || searchTerm);
  const visiblePackages = filteredPackages;
  const visibleCount = visiblePackages.length;

  const activeFilters: string[] = [];
  if (statusFilter) {
    activeFilters.push(`Status: ${STATUS_LABELS[statusFilter]}`);
  }
  if (searchTerm) {
    const searchLabel = (searchTermRaw ?? '').trim();
    activeFilters.push(`Search: "${searchLabel}"`);
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Custom Package Requests</h1>
          <p className={styles.pageSubtitle}>
            Review and manage personalized tour packages created by guests. Approve or reject requests, and view all trip details.
          </p>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Requests</span>
          <span className={styles.summaryValue}>{totalPackages}</span>
          <span className={styles.summaryHelper}>All custom package requests</span>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Pending Review</span>
          <span className={styles.summaryValue}>{pendingCount}</span>
          <span className={styles.summaryHelper}>Awaiting your decision</span>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Approved</span>
          <span className={styles.summaryValue}>{approvedCount}</span>
          <span className={styles.summaryHelper}>Packages confirmed</span>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Rejected</span>
          <span className={styles.summaryValue}>{rejectedCount}</span>
          <span className={styles.summaryHelper}>Packages declined</span>
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardHeading}>Package Requests</h2>
            <span className={styles.cardMeta}>Showing {visibleCount} of {totalPackages} requests</span>
          </div>
          <div className={styles.cardActions}>
            <DeleteAllPackagesForm action={deleteAllPackages} disabled={totalPackages === 0} />
          </div>
        </div>

        <CustomPackagesFilters
          statusOptions={ALLOWED_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
          initialStatus={statusFilter}
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

        {visiblePackages.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>{isFiltered ? 'No packages match your filters' : 'No custom package requests yet'}</strong>
            <span>
              {isFiltered
                ? 'Adjust or clear the filters to see more requests.'
                : 'Custom package requests from guests will appear here.'}
            </span>
            {isFiltered && (
              <Link href="/admin/custompackages" className={styles.filterResetInline}>
                Reset filters
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.bookingsGrid}>
            {visiblePackages.map((pkg) => {
              const hasDetails = pkg.foodAndSpecialRequests || pkg.additionalInfo;

              return (
                <div key={pkg.id} className={styles.bookingCard}>
                  <div className={styles.bookingId}>#{pkg.id}</div>
                  
                  {/* Left Column: Package Info */}
                  <div className={styles.bookingHeader}>
                    <div className={styles.bookingPackage}>
                      <h3 className={styles.packageTitle}>{pkg.name}</h3>
                      {pkg.description && (
                        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.5rem 0', lineHeight: '1.5' }}>
                          {pkg.description}
                        </p>
                      )}
                      <div className={styles.packageMeta}>
                        <span className={styles.metaItem}>
                          <i className="fas fa-clock"></i>
                          {pkg.totalDurationLabel}
                        </span>
                        <span className={styles.metaItem}>
                          <i className="fas fa-users"></i>
                          {pkg.guests} {pkg.guests === 1 ? 'guest' : 'guests'}
                        </span>
                        <span className={styles.metaItem}>
                          <i className="fas fa-map-marked-alt"></i>
                          {pkg.places.length} {pkg.places.length === 1 ? 'place' : 'places'}
                        </span>
                      </div>
                      <div className={styles.packageMeta} style={{ marginTop: '0.5rem' }}>
                        <span className={styles.metaItem}>
                          <i className="fas fa-calendar-day"></i>
                          <strong>Dates:</strong> {formatDateRange(pkg.startDate, pkg.endDate)}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      Requested on {formatDate(pkg.createdAt)}
                    </div>
                  </div>

                  {/* Middle Column: Customer Details */}
                  <div className={styles.customerInfo}>
                    <h4 className={styles.customerName}>
                      <i className="fas fa-user"></i>
                      Contact Information
                    </h4>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactItem}>
                        <i className="fas fa-envelope"></i>
                        {pkg.contactEmail}
                      </div>
                      {pkg.contactPhone && (
                        <div className={styles.contactItem}>
                          <i className="fas fa-phone"></i>
                          {pkg.contactPhone}
                        </div>
                      )}
                    </div>

                    {/* Places List */}
                    <div style={{ marginTop: '1rem' }}>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                        Selected Places:
                      </h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {pkg.places.map((place, idx) => (
                          <div 
                            key={place.id} 
                            style={{ 
                              fontSize: '0.85rem', 
                              color: '#64748b',
                              display: 'flex',
                              gap: '0.5rem',
                              alignItems: 'start'
                            }}
                          >
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}.</span>
                            <span>{place.name} <span style={{ color: '#94a3b8' }}>({place.duration})</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status Controls */}
                  <div className={styles.statusSection}>
                    <div className={styles.statusGroup}>
                      <label className={styles.statusLabel} htmlFor={`status-${pkg.id}`}>
                        Request Status
                      </label>
                      <form action={updatePackageStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="hidden" name="packageId" value={pkg.id} />
                        <select
                          id={`status-${pkg.id}`}
                          name="status"
                          defaultValue={pkg.status}
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
                      </form>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <label className={styles.statusLabel} style={{ marginBottom: '0.5rem', display: 'block' }}>
                        Quotation PDF
                      </label>
                      <UploadQuotationButton 
                        packageId={pkg.id} 
                        currentPdfPath={pkg.quotationPdfPath} 
                      />
                    </div>

                    <DeletePackageButton
                      packageId={pkg.id}
                      packageName={pkg.name}
                      action={deletePackage}
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
                        {pkg.foodAndSpecialRequests && (
                          <div className={styles.foodBox}>
                            <h5 className={styles.foodTitle}>
                              <i className="fas fa-utensils"></i>
                              Food & Dietary Requirements
                            </h5>
                            <p className={styles.foodText}>{pkg.foodAndSpecialRequests}</p>
                          </div>
                        )}
                        {pkg.additionalInfo && (
                          <div className={styles.noteBox}>
                            <h5 className={styles.noteTitle}>
                              <i className="fas fa-sticky-note"></i>
                              Additional Notes
                            </h5>
                            <p className={styles.noteText}>{pkg.additionalInfo}</p>
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
