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

interface DashboardClientProps {
  initialBookings: Booking[];
  initialQuotations: Quotation[];
  userName: string;
}

export default function DashboardClient({ initialBookings, initialQuotations, userName }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newBooking, setNewBooking] = useState({
    packageName: '',
    destination: '',
    date: '',
    travelers: 1,
    amount: 0,
  });

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    setQuotations(initialQuotations);
  }, [initialQuotations]);

  const stats = useMemo(() => ({
    totalBookings: bookings.length,
    currentBookings: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
    totalSpent: bookings.reduce((sum, booking) => sum + (booking.amount ?? 0), 0),
    pendingQuotations: quotations.length,
  }), [bookings, quotations]);

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

  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setBookings(bookings.map((booking) =>
      booking.id === editingBooking.id ? editingBooking : booking,
    ));
    setIsEditing(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditing(true);
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

              {activeTab === 'profile' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Profile Settings</h2>
                    <p>We&apos;re working on profile editing. Reach out to support if you need updates.</p>
                  </div>

                  <div className="profile-sections">
                    <div className="profile-section">
                      <h3>Account</h3>
                      <p>
                        Your account is connected to <strong>{userName}</strong>. For profile changes, contact
                        {' '}<strong>support@bloom.travel</strong> and our team will update your details.
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
          height: 300px;
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
