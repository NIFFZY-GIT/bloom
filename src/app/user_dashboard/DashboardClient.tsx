'use client';

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  packageName: string;
  destination: string;
  date: string;
  travelers: number;
  status: BookingStatus;
  amount: number;
  quotationUrl?: string;
  paymentStatus?: string;
  paymentStatusLabel?: string;
  receiptUploadedAt?: string | null;
  createdAt?: string | null;
  specialRequests?: string | null;
}

export interface Quotation {
  id: string;
  bookingId: string;
  packageName: string;
  date: string;
  amount: number;
  downloadUrl: string;
  statusLabel?: string;
}

export interface CustomTrip {
  id: string;
  name: string;
  description: string | null;
  duration: string;
  guests: number;
  status: 'pending' | 'approved' | 'rejected';
  quotationPdfPath: string | null;
  dateRange: string;
  placesCount: number;
  places: Array<{
    name: string;
    duration: string;
  }>;
  createdAt: string;
}

interface DashboardClientProps {
  initialBookings: Booking[];
  initialQuotations: Quotation[];
  initialCustomTrips: CustomTrip[];
  userName: string;
}

type TabKey = 'overview' | 'bookings' | 'customtrips' | 'quotations' | 'profile';
type Tone = 'amber' | 'teal' | 'violet' | 'navy' | 'blue' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/* ---------------------------------------------------------------- Icons */
type IconName =
  | 'grid' | 'calendar' | 'sparkles' | 'card' | 'user' | 'plus' | 'arrow'
  | 'download' | 'eye' | 'pin' | 'guests' | 'clock' | 'check' | 'x'
  | 'mail' | 'lock' | 'shield' | 'compass' | 'dollar' | 'file' | 'help' | 'send';

const ICON_PATHS: Record<IconName, ReactNode> = {
  grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  sparkles: (<><path d="m12 3 1.7 4.9L18.6 9.6l-4.9 1.7L12 16.2l-1.7-4.9L5.4 9.6l4.9-1.7z" /><path d="M18.5 14.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" /></>),
  card: (<><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20M6 15h4" /></>),
  user: (<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  plus: (<path d="M12 5v14M5 12h14" />),
  arrow: (<path d="M5 12h14M13 6l6 6-6 6" />),
  download: (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>),
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>),
  pin: (<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>),
  guests: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  check: (<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></>),
  x: (<><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></>),
  mail: (<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>),
  lock: (<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>),
  compass: (<><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></>),
  dollar: (<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />),
  file: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></>),
  help: (<><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3M12 17h.01" /></>),
  send: (<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />),
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* --------------------------------------------------------------- Helpers */
function formatMoney(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p.charAt(0)).join('');
  return (letters.slice(0, 2) || 'T').toUpperCase();
}

function bookingTone(status: BookingStatus): Tone {
  switch (status) {
    case 'confirmed': return 'success';
    case 'completed': return 'info';
    case 'cancelled': return 'danger';
    default: return 'warning';
  }
}

function paymentTone(status?: string): Tone {
  switch ((status ?? '').toUpperCase()) {
    case 'APPROVED': return 'success';
    case 'UNDER_REVIEW': return 'info';
    case 'REJECTED': return 'danger';
    default: return 'neutral';
  }
}

function tripTone(status: CustomTrip['status']): Tone {
  switch (status) {
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    default: return 'warning';
  }
}

function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`ud-badge ud-badge--${tone}`}>{children}</span>;
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="ud-empty">
      <span className="ud-empty__icon"><Icon name={icon} size={30} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

const NAV_ITEMS: Array<{ key: TabKey; label: string; icon: IconName }> = [
  { key: 'overview', label: 'Overview', icon: 'grid' },
  { key: 'bookings', label: 'My Bookings', icon: 'calendar' },
  { key: 'customtrips', label: 'Custom Trips', icon: 'sparkles' },
  { key: 'quotations', label: 'Payments & Receipts', icon: 'card' },
  { key: 'profile', label: 'Profile & Security', icon: 'user' },
];

/* ============================================================ Component */
export default function DashboardClient({
  initialBookings,
  initialQuotations,
  initialCustomTrips,
  userName,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [customTrips, setCustomTrips] = useState<CustomTrip[]>(initialCustomTrips);

  // Password reset state
  const [resetStep, setResetStep] = useState<'idle' | 'code-sent' | 'resetting'>('idle');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setBookings(initialBookings); }, [initialBookings]);
  useEffect(() => { setQuotations(initialQuotations); }, [initialQuotations]);
  useEffect(() => { setCustomTrips(initialCustomTrips); }, [initialCustomTrips]);

  const stats = useMemo(() => ({
    totalBookings: bookings.length,
    activeBookings: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.amount ?? 0), 0),
    receipts: quotations.length,
    customTrips: customTrips.length,
    pendingCustomTrips: customTrips.filter((t) => t.status === 'pending').length,
  }), [bookings, quotations, customTrips]);

  const displayName = userName?.trim() || 'Traveler';
  const initials = initialsFrom(displayName);
  const recentBookings = bookings.slice(0, 4);
  const recentTrips = customTrips.slice(0, 2);

  const handleSendResetCode = async () => {
    setIsLoading(true);
    setResetError('');
    setResetSuccess('');
    try {
      const response = await fetch('/api/user/send-reset-code', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setResetStep('code-sent');
        setResetSuccess(data.message);
      } else {
        setResetError(data.message || 'Failed to send code');
      }
    } catch {
      setResetError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: resetCode, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setResetSuccess(data.message);
        setResetStep('idle');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setResetError(data.message || 'Failed to reset password');
      }
    } catch {
      setResetError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReset = () => {
    setResetStep('idle');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setResetSuccess('');
  };

  return (
    <div className="ud-page">
      {/* ---------------------------------------------------------- Header */}
      <header className="ud-header">
        <div className="ud-header__inner">
          <div className="ud-header__id">
            <div className="ud-avatar" aria-hidden="true">{initials}</div>
            <div className="ud-header__text">
              <span className="ud-eyebrow">My Account</span>
              <h1>Welcome back, {displayName}</h1>
              <p>Track your bookings, payments, and custom journeys — all in one place.</p>
            </div>
          </div>
          <div className="ud-header__actions">
            <a className="ud-btn ud-btn--ghost" href="/packages">
              <Icon name="compass" size={18} /> Browse packages
            </a>
            <a className="ud-btn ud-btn--amber" href="/create_pkg">
              <Icon name="plus" size={18} /> Plan a custom trip
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ Body */}
      <main className="ud-main">
        <div className="ud-layout">
          {/* --------------------------------------------------- Sidebar */}
          <aside className="ud-side">
            <div className="ud-usercard">
              <div className="ud-usercard__avatar" aria-hidden="true">{initials}</div>
              <div className="ud-usercard__name">{displayName}</div>
              <span className="ud-usercard__role">Traveler</span>
              <div className="ud-usercard__stats">
                <div>
                  <div className="ud-usercard__num">{stats.totalBookings}</div>
                  <div className="ud-usercard__cap">Bookings</div>
                </div>
                <div>
                  <div className="ud-usercard__num">{formatMoney(stats.totalSpent)}</div>
                  <div className="ud-usercard__cap">Total spent</div>
                </div>
              </div>
            </div>

            <nav className="ud-nav" aria-label="Dashboard sections">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`ud-nav__item ${activeTab === item.key ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(item.key)}
                  aria-current={activeTab === item.key ? 'page' : undefined}
                >
                  <span className="ud-nav__icon"><Icon name={item.icon} size={19} /></span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="ud-help">
              <Icon name="help" size={18} />
              <div>
                <strong>Need a hand?</strong>
                <p>Email <a href="mailto:support@bloom.travel">support@bloom.travel</a></p>
              </div>
            </div>
          </aside>

          {/* --------------------------------------------------- Content */}
          <section className="ud-content">
            {/* ----------------------------------------------- Overview */}
            {activeTab === 'overview' && (
              <div className="ud-tab">
                <div className="ud-tab__head">
                  <h2>Dashboard overview</h2>
                  <p>A quick snapshot of everything happening on your account.</p>
                </div>

                <div className="ud-kpis">
                  <article className="ud-kpi">
                    <span className="ud-kpi__icon ud-kpi__icon--amber"><Icon name="calendar" /></span>
                    <div>
                      <div className="ud-kpi__value">{stats.totalBookings}</div>
                      <div className="ud-kpi__label">Total bookings</div>
                    </div>
                  </article>
                  <article className="ud-kpi">
                    <span className="ud-kpi__icon ud-kpi__icon--teal"><Icon name="compass" /></span>
                    <div>
                      <div className="ud-kpi__value">{stats.activeBookings}</div>
                      <div className="ud-kpi__label">Active trips</div>
                    </div>
                  </article>
                  <article className="ud-kpi">
                    <span className="ud-kpi__icon ud-kpi__icon--violet"><Icon name="sparkles" /></span>
                    <div>
                      <div className="ud-kpi__value">{stats.customTrips}</div>
                      <div className="ud-kpi__label">Custom trips</div>
                    </div>
                  </article>
                  <article className="ud-kpi">
                    <span className="ud-kpi__icon ud-kpi__icon--navy"><Icon name="dollar" /></span>
                    <div>
                      <div className="ud-kpi__value">{formatMoney(stats.totalSpent)}</div>
                      <div className="ud-kpi__label">Total spent</div>
                    </div>
                  </article>
                </div>

                <div className="ud-cols">
                  <div className="ud-panel">
                    <div className="ud-panel__head">
                      <h3>Recent bookings</h3>
                      {bookings.length > 0 && (
                        <button type="button" className="ud-link" onClick={() => setActiveTab('bookings')}>
                          View all <Icon name="arrow" size={15} />
                        </button>
                      )}
                    </div>
                    {recentBookings.length > 0 ? (
                      <ul className="ud-mini">
                        {recentBookings.map((b) => (
                          <li key={b.id} className="ud-mini__row">
                            <div className="ud-mini__main">
                              <span className="ud-mini__title">{b.packageName}</span>
                              <span className="ud-mini__sub">{b.destination} · {b.date}</span>
                            </div>
                            <Badge tone={bookingTone(b.status)}>{b.status}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyState
                        icon="calendar"
                        title="No bookings yet"
                        description="Your confirmed trips will appear here once you start planning."
                        action={<a className="ud-btn ud-btn--amber ud-btn--sm" href="/packages">Explore packages</a>}
                      />
                    )}
                  </div>

                  <div className="ud-panel">
                    <div className="ud-panel__head">
                      <h3>Custom trips</h3>
                      {customTrips.length > 0 && (
                        <button type="button" className="ud-link" onClick={() => setActiveTab('customtrips')}>
                          View all <Icon name="arrow" size={15} />
                        </button>
                      )}
                    </div>
                    {recentTrips.length > 0 ? (
                      <ul className="ud-mini">
                        {recentTrips.map((t) => (
                          <li key={t.id} className="ud-mini__row">
                            <div className="ud-mini__main">
                              <span className="ud-mini__title">{t.name}</span>
                              <span className="ud-mini__sub">{t.dateRange} · {t.placesCount} {t.placesCount === 1 ? 'place' : 'places'}</span>
                            </div>
                            <Badge tone={tripTone(t.status)}>{t.status}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyState
                        icon="sparkles"
                        title="No custom trips yet"
                        description="Design a personalised journey and track its quotation here."
                        action={<a className="ud-btn ud-btn--amber ud-btn--sm" href="/create_pkg">Create custom trip</a>}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------- Bookings */}
            {activeTab === 'bookings' && (
              <div className="ud-tab">
                <div className="ud-tab__head">
                  <h2>My bookings</h2>
                  <p>Review the status of each trip and its payment receipt.</p>
                </div>

                <div className="ud-note">
                  <Icon name="help" size={20} />
                  <p>
                    Need to change guest details or travel dates? Email our travel team at{' '}
                    <strong>support@bloom.travel</strong> with your booking reference.
                  </p>
                </div>

                {bookings.length > 0 ? (
                  <div className="ud-bookings">
                    {bookings.map((b) => (
                      <article key={b.id} className="ud-booking">
                        <div className="ud-booking__body">
                          <div className="ud-booking__top">
                            <h4>{b.packageName}</h4>
                            <div className="ud-booking__badges">
                              <Badge tone={bookingTone(b.status)}>{b.status}</Badge>
                              {b.paymentStatusLabel && (
                                <Badge tone={paymentTone(b.paymentStatus)}>{b.paymentStatusLabel}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="ud-booking__facts">
                            <span><Icon name="pin" size={15} />{b.destination || 'Destination TBD'}</span>
                            <span><Icon name="calendar" size={15} />{b.date || 'Dates TBD'}</span>
                            <span><Icon name="guests" size={15} />{b.travelers} {b.travelers === 1 ? 'traveler' : 'travelers'}</span>
                          </div>
                          {b.specialRequests && (
                            <p className="ud-booking__notes">“{b.specialRequests}”</p>
                          )}
                        </div>
                        <div className="ud-booking__aside">
                          <div className="ud-booking__amount">{formatMoney(b.amount)}</div>
                          {b.quotationUrl ? (
                            <a className="ud-btn ud-btn--outline ud-btn--sm" href={b.quotationUrl} target="_blank" rel="noreferrer">
                              <Icon name="eye" size={16} /> View receipt
                            </a>
                          ) : (
                            <span className="ud-chip-muted">Receipt pending</span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="calendar"
                    title="No bookings yet"
                    description="Your upcoming adventures will appear here once you confirm a package."
                    action={<a className="ud-btn ud-btn--amber ud-btn--sm" href="/packages">Browse packages</a>}
                  />
                )}
              </div>
            )}

            {/* --------------------------------------------- Custom trips */}
            {activeTab === 'customtrips' && (
              <div className="ud-tab">
                <div className="ud-tab__head">
                  <h2>Custom trips</h2>
                  <p>Track your personalised travel packages and quotations from our team.</p>
                </div>

                {customTrips.length > 0 ? (
                  <div className="ud-trips">
                    {customTrips.map((trip) => (
                      <article key={trip.id} className="ud-trip">
                        <div className="ud-trip__head">
                          <div>
                            <h3>{trip.name}</h3>
                            <span className="ud-trip__req">Requested on {trip.createdAt}</span>
                          </div>
                          <Badge tone={tripTone(trip.status)}>
                            {trip.status === 'pending' && 'Pending review'}
                            {trip.status === 'approved' && 'Approved'}
                            {trip.status === 'rejected' && 'Rejected'}
                          </Badge>
                        </div>

                        {trip.description && <p className="ud-trip__desc">{trip.description}</p>}

                        <div className="ud-trip__facts">
                          <div><span className="ud-fact__ic"><Icon name="clock" size={16} /></span><span>{trip.duration}</span></div>
                          <div><span className="ud-fact__ic"><Icon name="guests" size={16} /></span><span>{trip.guests} {trip.guests === 1 ? 'guest' : 'guests'}</span></div>
                          <div><span className="ud-fact__ic"><Icon name="pin" size={16} /></span><span>{trip.placesCount} {trip.placesCount === 1 ? 'place' : 'places'}</span></div>
                          <div><span className="ud-fact__ic"><Icon name="calendar" size={16} /></span><span>{trip.dateRange}</span></div>
                        </div>

                        {trip.places.length > 0 && (
                          <div className="ud-trip__places">
                            <h4>Itinerary</h4>
                            <ol className="ud-places">
                              {trip.places.map((place, idx) => (
                                <li key={`${trip.id}-${idx}`} className="ud-places__item">
                                  <span className="ud-places__num">{idx + 1}</span>
                                  <span className="ud-places__name">{place.name}</span>
                                  <span className="ud-places__dur">{place.duration}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {trip.quotationPdfPath ? (
                          <div className="ud-quote ud-quote--ready">
                            <div className="ud-quote__info">
                              <span className="ud-quote__ic"><Icon name="file" size={20} /></span>
                              <div>
                                <strong>Quotation ready</strong>
                                <p>Your personalised quotation is available to view and download.</p>
                              </div>
                            </div>
                            <div className="ud-quote__btns">
                              <a className="ud-btn ud-btn--outline ud-btn--sm" href={trip.quotationPdfPath} target="_blank" rel="noreferrer">
                                <Icon name="eye" size={16} /> View
                              </a>
                              <a className="ud-btn ud-btn--amber ud-btn--sm" href={trip.quotationPdfPath} download>
                                <Icon name="download" size={16} /> Download
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="ud-quote ud-quote--pending">
                            <span className="ud-quote__ic"><Icon name="clock" size={20} /></span>
                            <div>
                              <strong>Quotation pending</strong>
                              <p>Our team is preparing your personalised quotation. Watch your email and this space for updates.</p>
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="sparkles"
                    title="No custom trips yet"
                    description="Create your own personalised travel package and track it here."
                    action={<a className="ud-btn ud-btn--amber ud-btn--sm" href="/create_pkg"><Icon name="plus" size={16} /> Create custom trip</a>}
                  />
                )}
              </div>
            )}

            {/* -------------------------------------- Payments & receipts */}
            {activeTab === 'quotations' && (
              <div className="ud-tab">
                <div className="ud-tab__head">
                  <h2>Payments &amp; receipts</h2>
                  <p>Keep track of submitted payment receipts and their verification status.</p>
                </div>

                {quotations.length > 0 ? (
                  <div className="ud-receipts">
                    {quotations.map((q) => (
                      <article key={q.id} className="ud-receipt">
                        <div className="ud-receipt__top">
                          <span className="ud-receipt__ic"><Icon name="card" size={20} /></span>
                          {q.statusLabel && <Badge tone="info">{q.statusLabel}</Badge>}
                        </div>
                        <h3>{q.packageName}</h3>
                        <div className="ud-receipt__meta">
                          <span>Booking #{q.bookingId}</span>
                          <span>Uploaded {q.date}</span>
                        </div>
                        <div className="ud-receipt__amount">{formatMoney(q.amount)}</div>
                        <div className="ud-receipt__btns">
                          <a className="ud-btn ud-btn--outline ud-btn--sm" href={q.downloadUrl} target="_blank" rel="noreferrer">
                            <Icon name="eye" size={16} /> View
                          </a>
                          <a className="ud-btn ud-btn--amber ud-btn--sm" href={q.downloadUrl} target="_blank" rel="noreferrer">
                            <Icon name="download" size={16} /> Download
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="card"
                    title="No receipts yet"
                    description="Upload your payment proof from the booking confirmation page to see it here."
                  />
                )}
              </div>
            )}

            {/* ------------------------------------------------- Profile */}
            {activeTab === 'profile' && (
              <div className="ud-tab">
                <div className="ud-tab__head">
                  <h2>Profile &amp; security</h2>
                  <p>Manage your account information and keep it secure.</p>
                </div>

                <div className="ud-panel ud-account">
                  <div className="ud-account__avatar" aria-hidden="true">{initials}</div>
                  <div>
                    <div className="ud-account__name">{displayName}</div>
                    <div className="ud-account__sub">Tropical Bloom traveler account</div>
                  </div>
                </div>

                <div className="ud-panel">
                  <div className="ud-panel__head ud-panel__head--icon">
                    <span className="ud-panel__ic"><Icon name="shield" size={18} /></span>
                    <h3>Reset password</h3>
                  </div>
                  <p className="ud-panel__lead">
                    Update your password to keep your account secure. We&apos;ll send a 6-digit verification code to your email.
                  </p>

                  {resetSuccess && (
                    <div className="ud-alert ud-alert--success">
                      <Icon name="check" size={18} /> <span>{resetSuccess}</span>
                    </div>
                  )}
                  {resetError && (
                    <div className="ud-alert ud-alert--error">
                      <Icon name="x" size={18} /> <span>{resetError}</span>
                    </div>
                  )}

                  {resetStep === 'idle' && (
                    <div className="ud-reset-idle">
                      <button type="button" className="ud-btn ud-btn--amber" onClick={handleSendResetCode} disabled={isLoading}>
                        <Icon name="send" size={17} /> {isLoading ? 'Sending…' : 'Send verification code'}
                      </button>
                      <p className="ud-hint">A 6-digit code will be emailed to the address on your account.</p>
                    </div>
                  )}

                  {resetStep === 'code-sent' && (
                    <form onSubmit={handleResetPassword} className="ud-form">
                      <div className="ud-field">
                        <label htmlFor="reset-code">Verification code</label>
                        <input
                          id="reset-code"
                          type="text"
                          inputMode="numeric"
                          className="ud-input"
                          placeholder="Enter 6-digit code"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          maxLength={6}
                          required
                        />
                        <small>Check your email for the verification code.</small>
                      </div>
                      <div className="ud-field">
                        <label htmlFor="new-password">New password</label>
                        <input
                          id="new-password"
                          type="password"
                          className="ud-input"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                        <small>Minimum 6 characters.</small>
                      </div>
                      <div className="ud-field">
                        <label htmlFor="confirm-password">Confirm password</label>
                        <input
                          id="confirm-password"
                          type="password"
                          className="ud-input"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                      <div className="ud-form__actions">
                        <button type="submit" className="ud-btn ud-btn--amber" disabled={isLoading}>
                          <Icon name="lock" size={17} /> {isLoading ? 'Updating…' : 'Update password'}
                        </button>
                        <button type="button" className="ud-btn ud-btn--ghost-dark" onClick={handleCancelReset} disabled={isLoading}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="ud-panel">
                  <div className="ud-panel__head ud-panel__head--icon">
                    <span className="ud-panel__ic"><Icon name="mail" size={18} /></span>
                    <h3>Need help?</h3>
                  </div>
                  <p className="ud-panel__lead">
                    For any other account changes or assistance, contact our support team at{' '}
                    <a className="ud-inline-link" href="mailto:support@bloom.travel">support@bloom.travel</a>.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <style jsx global>{`
        .ud-page {
          min-height: 100vh;
          background: var(--surface-2);
          font-family: var(--font-body);
        }

        /* -------------------------------------------------------- Header */
        .ud-header {
          position: relative;
          padding: calc(6rem + 2.75rem) 1.5rem 6.5rem;
          color: #fff;
          background:
            radial-gradient(1100px 380px at 88% -30%, rgba(245, 158, 11, 0.28), transparent 62%),
            radial-gradient(800px 460px at 2% 130%, rgba(18, 59, 76, 0.85), transparent 60%),
            linear-gradient(135deg, #0c2a38 0%, #123b4c 100%);
          overflow: hidden;
        }
        .ud-header::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 22px 22px;
          -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0.5), transparent 70%);
          mask-image: linear-gradient(180deg, rgba(0,0,0,0.5), transparent 70%);
          pointer-events: none;
        }
        .ud-header__inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .ud-header__id { display: flex; align-items: center; gap: 1.25rem; }
        .ud-avatar {
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          border-radius: 20px;
          display: grid;
          place-items: center;
          font-family: var(--font-display);
          font-size: 1.9rem;
          font-weight: 700;
          color: #3a2400;
          background: linear-gradient(135deg, var(--amber-300), var(--amber-500));
          box-shadow: 0 12px 30px -8px rgba(245, 158, 11, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.35);
        }
        .ud-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--amber-300);
          margin-bottom: 0.35rem;
        }
        .ud-header__text h1 {
          font-family: var(--font-display);
          font-size: clamp(1.7rem, 3.4vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 0.4rem;
        }
        .ud-header__text p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          max-width: 44ch;
          margin: 0;
        }
        .ud-header__actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        /* --------------------------------------------------------- Body */
        .ud-main {
          max-width: 1200px;
          margin: -4rem auto 0;
          padding: 0 1.5rem 4rem;
          position: relative;
          z-index: 2;
        }
        .ud-layout {
          display: grid;
          grid-template-columns: 288px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* ------------------------------------------------------ Sidebar */
        .ud-side { position: sticky; top: 7rem; display: flex; flex-direction: column; gap: 1rem; }
        .ud-usercard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.75rem 1.5rem;
          text-align: center;
          box-shadow: var(--shadow-md);
        }
        .ud-usercard__avatar {
          width: 60px; height: 60px; margin: 0 auto 0.85rem;
          border-radius: 16px;
          display: grid; place-items: center;
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700; color: #3a2400;
          background: linear-gradient(135deg, var(--amber-300), var(--amber-500));
        }
        .ud-usercard__name {
          font-weight: 700; color: var(--navy); font-size: 1.05rem;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ud-usercard__role {
          display: inline-block; margin-top: 0.4rem;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--amber-700); background: var(--amber-50);
          border: 1px solid var(--amber-200); border-radius: var(--r-pill);
          padding: 0.2rem 0.7rem;
        }
        .ud-usercard__stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
          margin-top: 1.35rem; padding-top: 1.35rem; border-top: 1px solid var(--border);
        }
        .ud-usercard__num { font-weight: 800; color: var(--navy); font-size: 1.15rem; }
        .ud-usercard__cap { font-size: 0.75rem; color: var(--muted); margin-top: 0.15rem; }

        .ud-nav {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 0.6rem;
          display: flex; flex-direction: column; gap: 0.25rem;
          box-shadow: var(--shadow-sm);
        }
        .ud-nav__item {
          display: flex; align-items: center; gap: 0.8rem;
          width: 100%; text-align: left;
          padding: 0.8rem 0.95rem;
          border: none; background: none; cursor: pointer;
          border-radius: var(--r-md);
          font-family: var(--font-body); font-size: 0.94rem; font-weight: 600;
          color: var(--muted);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .ud-nav__icon { display: inline-flex; color: var(--muted-soft); transition: color 0.2s ease; }
        .ud-nav__item:hover { background: var(--surface-2); color: var(--ink); }
        .ud-nav__item:hover .ud-nav__icon { color: var(--ink); }
        .ud-nav__item.is-active {
          background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
          color: #fff;
          box-shadow: 0 10px 22px -10px rgba(245, 158, 11, 0.7);
        }
        .ud-nav__item.is-active .ud-nav__icon { color: #fff; }

        .ud-help {
          display: flex; gap: 0.75rem; align-items: flex-start;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 1.1rem 1.25rem;
          color: var(--amber-700);
        }
        .ud-help strong { display: block; color: var(--navy); font-size: 0.9rem; }
        .ud-help p { margin: 0.15rem 0 0; font-size: 0.85rem; color: var(--muted); }
        .ud-help a { color: var(--amber-700); font-weight: 600; }
        .ud-help a:hover { text-decoration: underline; }

        /* ------------------------------------------------------ Content */
        .ud-content {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 2.25rem;
          box-shadow: var(--shadow-md);
          min-height: 520px;
        }
        .ud-tab__head { margin-bottom: 1.75rem; }
        .ud-tab__head h2 {
          font-family: var(--font-display);
          font-size: 1.7rem; font-weight: 700; color: var(--navy); margin: 0 0 0.3rem;
        }
        .ud-tab__head p { color: var(--muted); margin: 0; }

        /* --------------------------------------------------------- KPIs */
        .ud-kpis {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .ud-kpi {
          display: flex; align-items: center; gap: 0.9rem;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.15rem 1.25rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ud-kpi:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border-strong); }
        .ud-kpi__icon {
          width: 46px; height: 46px; flex-shrink: 0;
          border-radius: 13px; display: grid; place-items: center;
        }
        .ud-kpi__icon--amber { background: var(--amber-50); color: var(--amber-600); }
        .ud-kpi__icon--teal { background: #ecfdf5; color: #0d9488; }
        .ud-kpi__icon--violet { background: #f5f3ff; color: #7c3aed; }
        .ud-kpi__icon--navy { background: #eef2f7; color: var(--navy); }
        .ud-kpi__value { font-size: 1.55rem; font-weight: 800; color: var(--navy); line-height: 1.1; letter-spacing: -0.02em; }
        .ud-kpi__label { font-size: 0.82rem; color: var(--muted); margin-top: 0.15rem; }

        /* --------------------------------------------------- Two-col panels */
        .ud-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .ud-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.5rem;
        }
        .ud-panel__head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.1rem;
        }
        .ud-panel__head--icon { justify-content: flex-start; gap: 0.7rem; }
        .ud-panel__ic {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: grid; place-items: center;
          background: var(--amber-50); color: var(--amber-600);
        }
        .ud-panel__head h3 { font-size: 1.15rem; font-weight: 700; color: var(--navy); margin: 0; }
        .ud-panel__lead { color: var(--muted); margin: 0 0 1.25rem; line-height: 1.6; }
        .ud-link {
          display: inline-flex; align-items: center; gap: 0.3rem;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: var(--amber-600);
        }
        .ud-link:hover { color: var(--amber-700); }

        .ud-mini { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .ud-mini__row {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.85rem 1rem;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          transition: border-color 0.2s ease;
        }
        .ud-mini__row:hover { border-color: var(--border-strong); }
        .ud-mini__main { min-width: 0; }
        .ud-mini__title {
          display: block; font-weight: 700; color: var(--navy); font-size: 0.95rem;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ud-mini__sub { display: block; font-size: 0.82rem; color: var(--muted); margin-top: 0.15rem; }

        /* -------------------------------------------------------- Badges */
        .ud-badge {
          display: inline-flex; align-items: center;
          padding: 0.28rem 0.72rem;
          border-radius: var(--r-pill);
          font-size: 0.74rem; font-weight: 700; letter-spacing: 0.02em;
          text-transform: capitalize; white-space: nowrap;
          border: 1px solid transparent;
        }
        .ud-badge--success, .ud-badge--teal { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
        .ud-badge--warning, .ud-badge--amber { background: var(--amber-50); color: var(--amber-800); border-color: var(--amber-200); }
        .ud-badge--danger { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
        .ud-badge--info, .ud-badge--blue { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .ud-badge--violet { background: #f5f3ff; color: #6d28d9; border-color: #ddd6fe; }
        .ud-badge--navy { background: #eef2f7; color: var(--navy); border-color: #dbe3ec; }
        .ud-badge--neutral { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }

        /* -------------------------------------------------------- Buttons */
        .ud-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          font-family: var(--font-body); font-weight: 600; font-size: 0.92rem;
          padding: 0.7rem 1.3rem; border-radius: var(--r-pill);
          cursor: pointer; border: 1px solid transparent; text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .ud-btn--sm { padding: 0.5rem 0.95rem; font-size: 0.84rem; }
        .ud-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ud-btn--amber {
          color: #fff; background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
          box-shadow: 0 10px 24px -10px rgba(245, 158, 11, 0.7);
        }
        .ud-btn--amber:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 30px -12px rgba(245, 158, 11, 0.8); }
        .ud-btn--outline { color: var(--navy); background: var(--surface); border-color: var(--border-strong); }
        .ud-btn--outline:hover:not(:disabled) { border-color: var(--amber-500); color: var(--amber-700); background: var(--amber-50); }
        .ud-btn--ghost { color: #fff; background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.28); }
        .ud-btn--ghost:hover { background: rgba(255, 255, 255, 0.2); }
        .ud-btn--ghost-dark { color: var(--muted); background: var(--surface-2); border-color: var(--border); }
        .ud-btn--ghost-dark:hover:not(:disabled) { background: var(--surface-3); color: var(--ink); }

        .ud-chip-muted {
          display: inline-flex; align-items: center;
          font-size: 0.8rem; font-weight: 600; color: var(--muted-soft);
          background: var(--surface-2); border: 1px dashed var(--border-strong);
          border-radius: var(--r-pill); padding: 0.45rem 0.9rem;
        }

        /* ---------------------------------------------------------- Note */
        .ud-note {
          display: flex; gap: 0.85rem; align-items: flex-start;
          background: var(--amber-50); border: 1px solid var(--amber-200);
          border-radius: var(--r-lg); padding: 1.1rem 1.35rem; margin-bottom: 1.5rem;
          color: var(--amber-700);
        }
        .ud-note p { margin: 0; color: var(--amber-800); line-height: 1.55; font-size: 0.92rem; }
        .ud-note strong { color: var(--amber-800); }

        /* ------------------------------------------------------ Bookings */
        .ud-bookings { display: flex; flex-direction: column; gap: 1rem; }
        .ud-booking {
          display: flex; gap: 1.5rem; align-items: stretch; justify-content: space-between;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.4rem 1.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ud-booking:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--border-strong); }
        .ud-booking__body { min-width: 0; flex: 1; }
        .ud-booking__top {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
          flex-wrap: wrap; margin-bottom: 0.75rem;
        }
        .ud-booking__top h4 { font-size: 1.15rem; font-weight: 700; color: var(--navy); margin: 0; }
        .ud-booking__badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .ud-booking__facts { display: flex; flex-wrap: wrap; gap: 0.4rem 1.25rem; }
        .ud-booking__facts span {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: var(--muted); font-size: 0.88rem;
        }
        .ud-booking__facts svg { color: var(--amber-600); }
        .ud-booking__notes {
          margin: 0.85rem 0 0; padding: 0.65rem 0.9rem;
          background: var(--surface); border-left: 3px solid var(--amber-400);
          border-radius: 0 var(--r-sm) var(--r-sm) 0;
          color: var(--muted); font-style: italic; font-size: 0.88rem;
        }
        .ud-booking__aside {
          display: flex; flex-direction: column; align-items: flex-end; justify-content: center;
          gap: 0.75rem; flex-shrink: 0; text-align: right;
          border-left: 1px solid var(--border); padding-left: 1.5rem;
        }
        .ud-booking__amount { font-size: 1.35rem; font-weight: 800; color: var(--navy); letter-spacing: -0.02em; }

        /* --------------------------------------------------- Custom trips */
        .ud-trips { display: flex; flex-direction: column; gap: 1.5rem; }
        .ud-trip {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 1.9rem;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ud-trip:hover { box-shadow: var(--shadow-md); border-color: var(--border-strong); }
        .ud-trip__head {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
          flex-wrap: wrap; padding-bottom: 1.25rem; margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .ud-trip__head h3 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--navy); margin: 0 0 0.25rem; }
        .ud-trip__req { font-size: 0.85rem; color: var(--muted); }
        .ud-trip__desc { color: var(--muted); line-height: 1.65; margin: 0 0 1.35rem; }
        .ud-trip__facts {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .ud-trip__facts > div {
          display: flex; align-items: center; gap: 0.65rem;
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 0.8rem 1rem;
          color: var(--ink); font-weight: 600; font-size: 0.9rem;
        }
        .ud-fact__ic { display: inline-flex; color: var(--amber-600); flex-shrink: 0; }
        .ud-trip__places { margin-bottom: 1.5rem; }
        .ud-trip__places h4 { font-size: 1rem; font-weight: 700; color: var(--navy); margin: 0 0 0.85rem; }
        .ud-places { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
        .ud-places__item {
          display: flex; align-items: center; gap: 0.9rem;
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 0.75rem 0.95rem;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .ud-places__item:hover { transform: translateX(4px); border-color: var(--amber-300); }
        .ud-places__num {
          width: 28px; height: 28px; flex-shrink: 0;
          display: grid; place-items: center; border-radius: 50%;
          background: linear-gradient(135deg, var(--amber-500), var(--amber-600));
          color: #fff; font-weight: 700; font-size: 0.82rem;
        }
        .ud-places__name { flex: 1; font-weight: 600; color: var(--navy); font-size: 0.92rem; min-width: 0; }
        .ud-places__dur {
          font-size: 0.78rem; color: var(--muted); font-weight: 600;
          background: var(--surface); border: 1px solid var(--border);
          padding: 0.25rem 0.65rem; border-radius: var(--r-pill); white-space: nowrap;
        }
        .ud-quote { border-radius: var(--r-lg); padding: 1.3rem 1.5rem; }
        .ud-quote--ready {
          display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; flex-wrap: wrap;
          background: #ecfdf5; border: 1px solid #a7f3d0;
        }
        .ud-quote--pending {
          display: flex; align-items: flex-start; gap: 1rem;
          background: var(--amber-50); border: 1px solid var(--amber-200);
        }
        .ud-quote__info { display: flex; align-items: center; gap: 0.9rem; }
        .ud-quote__ic {
          width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px;
          display: grid; place-items: center; background: #fff;
        }
        .ud-quote--ready .ud-quote__ic { color: #047857; border: 1px solid #a7f3d0; }
        .ud-quote--pending .ud-quote__ic { color: var(--amber-700); border: 1px solid var(--amber-200); }
        .ud-quote strong { display: block; font-size: 1.02rem; font-weight: 700; }
        .ud-quote--ready strong { color: #065f46; }
        .ud-quote--pending strong { color: var(--amber-800); }
        .ud-quote p { margin: 0.2rem 0 0; font-size: 0.88rem; line-height: 1.5; }
        .ud-quote--ready p { color: #047857; }
        .ud-quote--pending p { color: var(--amber-700); }
        .ud-quote__btns { display: flex; gap: 0.6rem; flex-wrap: wrap; }

        /* -------------------------------------------------------- Receipts */
        .ud-receipts { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
        .ud-receipt {
          display: flex; flex-direction: column; gap: 0.6rem;
          background: var(--surface-2); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 1.4rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ud-receipt:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border-strong); }
        .ud-receipt__top { display: flex; align-items: center; justify-content: space-between; }
        .ud-receipt__ic {
          width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center;
          background: var(--amber-50); color: var(--amber-600);
        }
        .ud-receipt h3 { font-size: 1.08rem; font-weight: 700; color: var(--navy); margin: 0.35rem 0 0; }
        .ud-receipt__meta { display: flex; flex-direction: column; gap: 0.1rem; font-size: 0.82rem; color: var(--muted); }
        .ud-receipt__amount { font-size: 1.35rem; font-weight: 800; color: var(--amber-600); letter-spacing: -0.02em; margin: 0.3rem 0 0.5rem; }
        .ud-receipt__btns { display: flex; gap: 0.55rem; margin-top: auto; }
        .ud-receipt__btns .ud-btn { flex: 1; }

        /* --------------------------------------------------------- Profile */
        .ud-account { display: flex; align-items: center; gap: 1.1rem; margin-bottom: 1.25rem; }
        .ud-account__avatar {
          width: 56px; height: 56px; flex-shrink: 0; border-radius: 15px;
          display: grid; place-items: center; font-family: var(--font-display);
          font-size: 1.4rem; font-weight: 700; color: #3a2400;
          background: linear-gradient(135deg, var(--amber-300), var(--amber-500));
        }
        .ud-account__name { font-weight: 700; color: var(--navy); font-size: 1.15rem; }
        .ud-account__sub { font-size: 0.86rem; color: var(--muted); margin-top: 0.15rem; }
        .ud-panel + .ud-panel { margin-top: 1.25rem; }

        .ud-alert {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 1.15rem; border-radius: var(--r-md);
          font-size: 0.9rem; font-weight: 600; margin-bottom: 1.25rem;
        }
        .ud-alert--success { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .ud-alert--error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

        .ud-reset-idle { display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
        .ud-hint { font-size: 0.85rem; color: var(--muted); margin: 0; }
        .ud-form { max-width: 480px; }
        .ud-field { margin-bottom: 1.25rem; }
        .ud-field label { display: block; font-weight: 600; color: var(--navy); margin-bottom: 0.45rem; font-size: 0.9rem; }
        .ud-input {
          width: 100%; padding: 0.8rem 1rem;
          border: 1.5px solid var(--border-strong); border-radius: var(--r-md);
          font-size: 0.95rem; font-family: inherit; color: var(--ink);
          background: var(--surface); transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ud-input:focus { outline: none; border-color: var(--amber-500); box-shadow: 0 0 0 3px var(--brand-ring); }
        .ud-field small { display: block; color: var(--muted); font-size: 0.8rem; margin-top: 0.4rem; }
        .ud-form__actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .ud-inline-link { color: var(--amber-700); font-weight: 600; }
        .ud-inline-link:hover { text-decoration: underline; }

        /* ---------------------------------------------------- Empty state */
        .ud-empty { text-align: center; padding: 2.75rem 1.5rem; }
        .ud-empty__icon {
          width: 68px; height: 68px; margin: 0 auto 1.1rem;
          display: grid; place-items: center; border-radius: 20px;
          background: var(--amber-50); color: var(--amber-500);
        }
        .ud-empty h3 { font-size: 1.2rem; font-weight: 700; color: var(--navy); margin: 0 0 0.4rem; }
        .ud-empty p { color: var(--muted); margin: 0 auto 1.3rem; max-width: 40ch; }

        /* ------------------------------------------------------ Responsive */
        @media (max-width: 960px) {
          .ud-layout { grid-template-columns: 1fr; }
          .ud-side { position: static; }
          .ud-usercard { display: none; }
          .ud-nav {
            flex-direction: row; overflow-x: auto;
            padding: 0.45rem; gap: 0.35rem;
            scrollbar-width: none;
          }
          .ud-nav::-webkit-scrollbar { display: none; }
          .ud-nav__item { white-space: nowrap; }
          .ud-help { display: none; }
          .ud-cols { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .ud-header { padding: calc(4.5rem + 2rem) 1.25rem 5.5rem; }
          .ud-header__inner { align-items: flex-start; }
          .ud-header__actions { width: 100%; }
          .ud-header__actions .ud-btn { flex: 1; }
          .ud-main { padding: 0 1rem 3rem; }
          .ud-content { padding: 1.5rem 1.25rem; border-radius: var(--r-lg); }
          .ud-kpis { grid-template-columns: 1fr 1fr; }
          .ud-booking { flex-direction: column; gap: 1rem; }
          .ud-booking__aside {
            flex-direction: row; align-items: center; justify-content: space-between;
            border-left: none; border-top: 1px solid var(--border);
            padding-left: 0; padding-top: 1rem;
          }
        }
        @media (max-width: 460px) {
          .ud-avatar { width: 62px; height: 62px; font-size: 1.5rem; }
          .ud-kpis { grid-template-columns: 1fr; }
          .ud-header__id { gap: 0.9rem; }
        }
      `}</style>
    </div>
  );
}
