'use client';

import { useEffect, useMemo, useState } from 'react';

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

export default function DashboardClient({ initialBookings, initialQuotations, initialCustomTrips, userName }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [customTrips, setCustomTrips] = useState<CustomTrip[]>(initialCustomTrips);
  const [, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newBooking, setNewBooking] = useState({
    packageName: '',
    destination: '',
    date: '',
    travelers: 1,
    amount: 0,
  });

  // Debug logging
  useEffect(() => {
    console.log('[DashboardClient] Initial custom trips:', initialCustomTrips);
    console.log('[DashboardClient] Custom trips count:', initialCustomTrips.length);
  }, [initialCustomTrips]);

  useEffect(() => {
    console.log('[DashboardClient] Custom trips state updated:', customTrips);
    console.log('[DashboardClient] Custom trips state count:', customTrips.length);
  }, [customTrips]);

  // Password reset states
  const [resetStep, setResetStep] = useState<'idle' | 'code-sent' | 'resetting'>('idle');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    setQuotations(initialQuotations);
  }, [initialQuotations]);

  useEffect(() => {
    setCustomTrips(initialCustomTrips);
  }, [initialCustomTrips]);

  const stats = useMemo(() => ({
    totalBookings: bookings.length,
    currentBookings: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
    totalSpent: bookings.reduce((sum, booking) => sum + (booking.amount ?? 0), 0),
    pendingQuotations: quotations.length,
    customTrips: customTrips.length,
    pendingCustomTrips: customTrips.filter((t) => t.status === 'pending').length,
  }), [bookings, quotations, customTrips]);

  // Unused handlers - keeping for future feature expansion
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const booking: Booking = {
      id: Date.now().toString(),
      packageName: newBooking.packageName,
      destination: newBooking.destination,
      date: newBooking.date,
      travelers: newBooking.travelers,
      amount: newBooking.amount,
      status: 'pending',
    };
    setBookings([...bookings, booking]);
    setNewBooking({
      packageName: '',
      destination: '',
      date: '',
      travelers: 1,
      amount: 0,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setBookings(bookings.map((booking) =>
      booking.id === editingBooking.id ? editingBooking : booking,
    ));
    setIsEditing(false);
    setEditingBooking(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditing(true);
  };

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

  const handleResetPassword = async (e: React.FormEvent) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          code: resetCode,
          newPassword,
        }),
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
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome back, {userName}.</h1>
            <p className="hero-subtitle">
              Manage your bookings, view payment updates, and keep track of every detail of your adventures.
            </p>
          </div>
        </div>
      </section>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
              <nav className="sidebar-nav">
                <button
                  className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
                <button
                  className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  🗓️ My Bookings
                </button>
                <button
                  className={`nav-item ${activeTab === 'customtrips' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customtrips')}
                >
                  ✨ Custom Trips
                </button>
                <button
                  className={`nav-item ${activeTab === 'quotations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quotations')}
                >
                  💳 Payments & Receipts
                </button>
                <button
                  className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  👤 Profile Settings
                </button>
              </nav>

              <div className="sidebar-stats">
                <div className="stat-item">
                  <div className="stat-value">{stats.totalBookings}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">${stats.totalSpent}</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>
            </aside>

            <div className="dashboard-content">
              {activeTab === 'overview' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Dashboard Overview</h2>
                    <p>Here&apos;s everything happening on your account.</p>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📊</div>
                      <div className="stat-info">
                        <div className="stat-number">{stats.totalBookings}</div>
                        <div className="stat-label">Total Bookings</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🔄</div>
                      <div className="stat-info">
                        <div className="stat-number">{stats.currentBookings}</div>
                        <div className="stat-label">Current Bookings</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <div className="stat-number">${stats.totalSpent}</div>
                        <div className="stat-label">Total Spent</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💳</div>
                      <div className="stat-info">
                        <div className="stat-number">{stats.pendingQuotations}</div>
                        <div className="stat-label">Receipts</div>
                      </div>
                    </div>
                  </div>

                  <div className="recent-section">
                    <h3>Recent Bookings</h3>
                    <div className="bookings-list">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="booking-item">
                          <div className="booking-info">
                            <h4>{booking.packageName}</h4>
                            <p>{booking.destination} • {booking.date}</p>
                          </div>
                          <div className={`booking-status ${booking.status}`}>
                            {booking.status}
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <div className="empty-state">
                          <div className="empty-icon">🌴</div>
                          <h3>No bookings yet</h3>
                          <p>Your confirmed trips will appear here once you start planning.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>My Bookings</h2>
                    <p>Review the status of each trip and payment receipt.</p>
                  </div>

                  <div className="booking-form-section info">
                    <h3>Need to make a change?</h3>
                    <p>
                      To update guest details or change travel dates, please reach out to our travel team at
                      {' '}<strong>support@bloom.travel</strong> and include your booking reference.
                    </p>
                  </div>

                  <div className="bookings-section">
                    <h3>All Bookings</h3>
                    <div className="bookings-table">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="booking-row">
                          <div className="booking-details">
                            <h4>{booking.packageName}</h4>
                            <p>{booking.destination || 'Destination to be confirmed'}</p>
                            <small>Date: {booking.date || 'TBD'} • Travelers: {booking.travelers}</small>
                            {booking.specialRequests && (
                              <small>Notes: {booking.specialRequests}</small>
                            )}
                          </div>
                          <div className="booking-meta">
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </div>
                            {booking.paymentStatusLabel && (
                              <div className={`status-badge payment ${booking.paymentStatus?.toLowerCase()}`}>
                                {booking.paymentStatusLabel}
                              </div>
                            )}
                            <div className="booking-amount">${booking.amount}</div>
                          </div>
                          <div className="booking-actions">
                            {booking.quotationUrl ? (
                              <a className="action-btn view" href={booking.quotationUrl} target="_blank" rel="noreferrer">
                                View Receipt
                              </a>
                            ) : (
                              <span className="action-btn muted">Receipt pending</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <div className="empty-state">
                          <div className="empty-icon">🗓️</div>
                          <h3>No bookings yet</h3>
                          <p>Your upcoming adventures will appear here once you confirm a package.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quotations' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Payments & Receipts</h2>
                    <p>Keep track of submitted payment receipts and verification status.</p>
                  </div>

                  <div className="quotations-grid">
                    {quotations.map((quotation) => (
                      <div key={quotation.id} className="quotation-card">
                        <div className="quotation-header">
                          <h3>{quotation.packageName}</h3>
                          <div className="quotation-date">Uploaded on {quotation.date}</div>
                        </div>
                        <div className="quotation-details">
                          <div className="quotation-amount">${quotation.amount}</div>
                          <div className="quotation-id">Booking #{quotation.bookingId}</div>
                        </div>
                        {quotation.statusLabel && (
                          <div className="quotation-status">{quotation.statusLabel}</div>
                        )}
                        <div className="quotation-actions">
                          <a className="view-btn" href={quotation.downloadUrl} target="_blank" rel="noreferrer">
                            View receipt
                          </a>
                          <a className="download-btn" href={quotation.downloadUrl} target="_blank" rel="noreferrer">
                            Download
                          </a>
                        </div>
                      </div>
                    ))}

                    {quotations.length === 0 && (
                      <div className="empty-state">
                        <div className="empty-icon">💳</div>
                        <h3>No receipts yet</h3>
                        <p>Upload your payment proof from the booking confirmation page to see it here.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'customtrips' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Custom Trips</h2>
                    <p>Track your personalized travel packages and quotations from our team.</p>
                  </div>

                  <div className="custom-trips-section">
                    {customTrips.map((trip) => (
                      <div key={trip.id} className="custom-trip-card">
                        <div className="trip-header">
                          <div className="trip-title-section">
                            <h3>{trip.name}</h3>
                            <div className={`trip-status-badge ${trip.status}`}>
                              {trip.status === 'pending' && '⏳ Pending Review'}
                              {trip.status === 'approved' && '✅ Approved'}
                              {trip.status === 'rejected' && '❌ Rejected'}
                            </div>
                          </div>
                          <div className="trip-meta">
                            <span className="trip-date">Requested on {trip.createdAt}</span>
                          </div>
                        </div>

                        {trip.description && (
                          <p className="trip-description">{trip.description}</p>
                        )}

                        <div className="trip-details">
                          <div className="trip-detail-item">
                            <span className="detail-icon">⏱️</span>
                            <span className="detail-text">{trip.duration}</span>
                          </div>
                          <div className="trip-detail-item">
                            <span className="detail-icon">👥</span>
                            <span className="detail-text">{trip.guests} {trip.guests === 1 ? 'guest' : 'guests'}</span>
                          </div>
                          <div className="trip-detail-item">
                            <span className="detail-icon">📍</span>
                            <span className="detail-text">{trip.placesCount} {trip.placesCount === 1 ? 'place' : 'places'}</span>
                          </div>
                          <div className="trip-detail-item">
                            <span className="detail-icon">📅</span>
                            <span className="detail-text">{trip.dateRange}</span>
                          </div>
                        </div>

                        <div className="trip-places">
                          <h4>Selected Places:</h4>
                          <div className="places-list">
                            {trip.places.map((place, idx) => (
                              <div key={idx} className="place-item">
                                <span className="place-number">{idx + 1}</span>
                                <span className="place-name">{place.name}</span>
                                <span className="place-duration">({place.duration})</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="trip-quotation-section">
                          {trip.quotationPdfPath ? (
                            <div className="quotation-available">
                              <div className="quotation-info">
                                <span className="quotation-label">📄 Quotation Available</span>
                                <span className="quotation-text">Your personalized quotation is ready to view and download.</span>
                              </div>
                              <div className="quotation-buttons">
                                <a className="quotation-btn view" href={trip.quotationPdfPath} target="_blank" rel="noreferrer">
                                  View PDF
                                </a>
                                <a className="quotation-btn download" href={trip.quotationPdfPath} download>
                                  Download
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="quotation-pending">
                              <span className="pending-icon">⏳</span>
                              <div className="pending-text">
                                <strong>Quotation Pending</strong>
                                <p>Our team is preparing your personalized quotation. Check your email and this section for updates.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {customTrips.length === 0 && (
                      <div className="empty-state">
                        <div className="empty-icon">✨</div>
                        <h3>No custom trips yet</h3>
                        <p>Create your personalized travel package and track it here.</p>
                        <a href="/create_pkg" className="create-trip-btn">
                          Create Custom Trip
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Profile Settings</h2>
                    <p>Manage your account settings and security.</p>
                  </div>

                  <div className="profile-sections">
                    <div className="profile-section">
                      <h3>Account Information</h3>
                      <p>
                        Your account is connected to <strong>{userName}</strong>.
                      </p>
                    </div>

                    <div className="profile-section">
                      <h3>Reset Password</h3>
                      <p className="section-description">
                        Update your password to keep your account secure. We&apos;ll send a verification code to your email.
                      </p>

                      {resetSuccess && (
                        <div className="alert alert-success">
                          ✅ {resetSuccess}
                        </div>
                      )}

                      {resetError && (
                        <div className="alert alert-error">
                          ❌ {resetError}
                        </div>
                      )}

                      {resetStep === 'idle' && (
                        <div className="reset-idle">
                          <button
                            className="send-code-btn"
                            onClick={handleSendResetCode}
                            disabled={isLoading}
                          >
                            {isLoading ? '⏳ Sending...' : '📧 Send Verification Code'}
                          </button>
                          <p className="helper-text">
                            Click to receive a 6-digit verification code via email
                          </p>
                        </div>
                      )}

                      {resetStep === 'code-sent' && (
                        <form onSubmit={handleResetPassword} className="reset-form">
                          <div className="form-group">
                            <label htmlFor="reset-code">Verification Code</label>
                            <input
                              id="reset-code"
                              type="text"
                              className="form-input"
                              placeholder="Enter 6-digit code"
                              value={resetCode}
                              onChange={(e) => setResetCode(e.target.value)}
                              maxLength={6}
                              required
                            />
                            <small>Check your email for the verification code</small>
                          </div>

                          <div className="form-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                              id="new-password"
                              type="password"
                              className="form-input"
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              minLength={6}
                              required
                            />
                            <small>Minimum 6 characters</small>
                          </div>

                          <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                              id="confirm-password"
                              type="password"
                              className="form-input"
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              minLength={6}
                              required
                            />
                          </div>

                          <div className="form-actions">
                            <button
                              type="submit"
                              className="submit-btn"
                              disabled={isLoading}
                            >
                              {isLoading ? '⏳ Updating...' : '🔒 Update Password'}
                            </button>
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={handleCancelReset}
                              disabled={isLoading}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="profile-section">
                      <h3>Need Help?</h3>
                      <p>
                        For other account changes or assistance, contact our support team at
                        {' '}<strong>support@bloom.travel</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          margin-top: 0;
        }

        .dashboard-hero {
          height: 400px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          margin-top: 0;
          padding-top: 80px;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6));
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 2rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          font-weight: 300;
          opacity: 0.95;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
        }

        .dashboard-main {
          padding: 3rem 0;
          background: #f8fafc;
          min-height: calc(100vh - 300px);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .dashboard-sidebar {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 2rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .nav-item {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          border-radius: 12px;
          text-align: left;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .nav-item.active {
          background: #f59e0b;
          color: white;
        }

        .sidebar-stats {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #f59e0b;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .dashboard-content {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .booking-form-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .booking-form-section.info p {
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        }

        .bookings-table {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 2rem;
          align-items: center;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .booking-row:hover {
          background: #f3f4f6;
        }

        .booking-details h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .booking-details p {
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .booking-details small {
          color: #9ca3af;
          display: block;
        }

        .booking-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.completed {
          background: #e0e7ff;
          color: #3730a3;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.payment {
          background: #e0f2fe;
          color: #0369a1;
        }

        .booking-amount {
          font-weight: 700;
          color: #1f2937;
        }

        .booking-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.view {
          background: #dbeafe;
          color: #1e40af;
        }

        .action-btn.view:hover {
          background: #bfdbfe;
        }

        .action-btn.muted {
          background: #e5e7eb;
          color: #6b7280;
          cursor: default;
        }

        .quotations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .quotation-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          transition: transform 0.3s ease;
        }

        .quotation-card:hover {
          transform: translateY(-5px);
        }

        .quotation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .quotation-header h3 {
          font-size: 1.2rem;
          color: #1f2937;
          margin: 0;
        }

        .quotation-date {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .quotation-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .quotation-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f59e0b;
        }

        .quotation-id {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .quotation-status {
          margin-bottom: 1rem;
          font-weight: 600;
          color: #2563eb;
        }

        .quotation-actions {
          display: flex;
          gap: 0.75rem;
        }

        .view-btn, .download-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
        }

        .view-btn {
          background: #e0e7ff;
          color: #3730a3;
        }

        .view-btn:hover {
          background: #c7d2fe;
        }

        .download-btn {
          background: #f59e0b;
          color: white;
        }

        .download-btn:hover {
          background: #d97706;
        }

        .profile-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .profile-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
        }

        .profile-section h3 {
          font-size: 1.3rem;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .section-description {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .alert {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-info {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .reset-idle {
          text-align: center;
          padding: 2rem;
        }

        .send-code-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .send-code-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }

        .send-code-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .helper-text {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .reset-form {
          max-width: 500px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .form-group small {
          display: block;
          color: #6b7280;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .submit-btn {
          flex: 1;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-btn {
          padding: 1rem 2rem;
          background: #f3f4f6;
          color: #6b7280;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #e5e7eb;
          color: #374151;
        }

        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .custom-trips-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        .custom-trip-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 24px;
          padding: 3rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .custom-trip-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(245, 158, 11, 0.2);
          border-color: #f59e0b;
        }

        .trip-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 3px solid #f59e0b;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .trip-title-section {
          flex: 1;
          min-width: 250px;
        }

        .trip-title-section h3 {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .trip-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          letter-spacing: 0.02em;
        }

        .trip-status-badge.pending {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 2px solid #fbbf24;
        }

        .trip-status-badge.approved {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border: 2px solid #10b981;
        }

        .trip-status-badge.rejected {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border: 2px solid #ef4444;
        }

        .trip-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .trip-date {
          color: #6b7280;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .trip-description {
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 1.125rem;
          font-weight: 400;
        }

        .trip-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
          border-radius: 16px;
          border: 2px solid #e5e7eb;
        }

        .trip-detail-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .trip-detail-item:hover {
          border-color: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
        }

        .detail-icon {
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .detail-text {
          color: #111827;
          font-weight: 600;
          font-size: 1.05rem;
        }

        .trip-places {
          margin-bottom: 2rem;
        }

        .trip-places h4 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.01em;
        }

        .trip-places h4::before {
          content: '📍';
          font-size: 1.75rem;
        }

        .places-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
          padding: 2rem;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          position: relative;
        }

        .places-list::before {
          content: '';
          position: absolute;
          left: 32px;
          top: 50px;
          bottom: 50px;
          width: 3px;
          background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
          border-radius: 10px;
        }

        .place-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 1.05rem;
          padding: 1.25rem;
          background: white;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
        }

        .place-item:hover {
          border-color: #f59e0b;
          transform: translateX(8px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.15);
        }

        .place-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border-radius: 50%;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
          box-shadow: 0 6px 15px rgba(245, 158, 11, 0.4);
          border: 3px solid white;
        }

        .place-name {
          color: #111827;
          font-weight: 700;
          flex: 1;
          font-size: 1.125rem;
        }

        .place-duration {
          color: #6b7280;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.375rem 0.875rem;
          background: #f3f4f6;
          border-radius: 20px;
        }

        .trip-quotation-section {
          border-top: 3px solid #f59e0b;
          padding-top: 2rem;
          margin-top: 2rem;
        }

        .quotation-available {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          padding: 2.5rem;
          border-radius: 18px;
          border: 3px solid #10b981;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
        }

        .quotation-info {
          flex: 1;
        }

        .quotation-label {
          display: block;
          font-weight: 800;
          color: #065f46;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .quotation-text {
          color: #047857;
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.5;
        }

        .quotation-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quotation-btn {
          padding: 1.125rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .quotation-btn.view {
          background: white;
          color: #065f46;
          border: 2px solid #10b981;
        }

        .quotation-btn.view:hover {
          background: #f0fdf4;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(16, 185, 129, 0.2);
        }

        .quotation-btn.download {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .quotation-btn.download:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
        }

        .quotation-pending {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 2.5rem;
          border-radius: 18px;
          border: 3px solid #fbbf24;
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.2);
        }

        .pending-icon {
          font-size: 3.5rem;
          flex-shrink: 0;
        }

        .pending-text strong {
          display: block;
          color: #92400e;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .pending-text p {
          color: #78350f;
          font-size: 1.05rem;
          margin: 0;
          line-height: 1.6;
          font-weight: 500;
        }

        .create-trip-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1.125rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
          letter-spacing: 0.01em;
        }

        .create-trip-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.5);
        }

        .create-trip-btn::before {
          content: '✨';
          font-size: 1.5rem;
        }
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          margin-top: 1.5rem;
        }

        .create-trip-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          grid-column: 1 / -1;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #9ca3af;
        }

        .recent-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
        }

        .recent-section h3 {
          font-size: 1.3rem;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 8px;
        }

        .booking-info h4 {
          font-size: 1rem;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .booking-info p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .booking-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .booking-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .booking-status.confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .booking-status.completed {
          background: #e0e7ff;
          color: #3730a3;
        }

        .booking-status.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 1024px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            position: static;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-hero {
            height: 250px;
            padding-top: 70px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .container {
            padding: 0 1rem;
          }

          .dashboard-content {
            padding: 1.5rem;
          }

          .booking-row {
            grid-template-columns: 1fr;
            gap: 1rem;
            text-align: center;
          }

          .booking-meta {
            align-items: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .sidebar-nav {
            flex-direction: row;
            overflow-x: auto;
          }

          .nav-item {
            white-space: nowrap;
          }

          .booking-actions {
            justify-content: center;
          }

          .trip-header {
            flex-direction: column;
          }

          .trip-meta {
            text-align: left;
          }

          .trip-details {
            grid-template-columns: 1fr;
          }

          .quotation-available {
            flex-direction: column;
            text-align: center;
          }

          .quotation-buttons {
            width: 100%;
          }

          .quotation-btn {
            flex: 1;
          }

          .quotation-pending {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .section-header h2 {
            font-size: 1.8rem;
          }

          .quotation-actions {
            flex-direction: column;
          }

          .booking-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
