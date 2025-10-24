'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/ui/navbar';

interface Booking {
  id: string;
  packageName: string;
  destination: string;
  date: string;
  travelers: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  quotationUrl?: string;
}

interface Quotation {
  id: string;
  bookingId: string;
  packageName: string;
  date: string;
  amount: number;
  downloadUrl: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newBooking, setNewBooking] = useState({
    packageName: '',
    destination: '',
    date: '',
    travelers: 1,
    amount: 0
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        packageName: 'Beach Paradise Tour',
        destination: 'Mirissa',
        date: '2024-12-15',
        travelers: 2,
        status: 'confirmed',
        amount: 450,
        quotationUrl: '/quotations/quote-1.pdf'
      },
      {
        id: '2',
        packageName: 'Wildlife Safari',
        destination: 'Yala National Park',
        date: '2024-11-20',
        travelers: 4,
        status: 'pending',
        amount: 320
      },
      {
        id: '3',
        packageName: 'Cultural Heritage',
        destination: 'Sigiriya',
        date: '2024-10-05',
        travelers: 2,
        status: 'completed',
        amount: 280
      }
    ];

    const mockQuotations: Quotation[] = [
      {
        id: '1',
        bookingId: '1',
        packageName: 'Beach Paradise Tour',
        date: '2024-11-01',
        amount: 450,
        downloadUrl: '/quotations/quote-1.pdf'
      }
    ];

    setBookings(mockBookings);
    setQuotations(mockQuotations);
  }, []);

  const stats = {
    totalBookings: bookings.length,
    currentBookings: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
    totalSpent: bookings.reduce((sum, booking) => sum + booking.amount, 0),
    pendingQuotations: quotations.length
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const booking: Booking = {
      id: Date.now().toString(),
      ...newBooking,
      status: 'pending'
    };
    setBookings([...bookings, booking]);
    setNewBooking({
      packageName: '',
      destination: '',
      date: '',
      travelers: 1,
      amount: 0
    });
  };

  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setBookings(bookings.map(booking => 
      booking.id === editingBooking.id ? editingBooking : booking
    ));
    setIsEditing(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditing(true);
  };

  return (
    <div className="dashboard-page">
      
      
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">My Dashboard</h1>
            <p className="hero-subtitle">
              Manage your bookings, view quotations, and track your Sri Lankan adventures
            </p>
          </div>
        </div>
      </section>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-layout">
            {/* Sidebar */}
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
                  📄 Quotations
                </button>
                <button 
                  className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  👤 Profile Settings
                </button>
              </nav>

              {/* Quick Stats */}
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

            {/* Main Content */}
            <div className="dashboard-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Dashboard Overview</h2>
                    <p>Welcome back! Here's your travel summary</p>
                  </div>

                  {/* Stats Cards */}
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
                      <div className="stat-icon">📄</div>
                      <div className="stat-info">
                        <div className="stat-number">{stats.pendingQuotations}</div>
                        <div className="stat-label">Quotations</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="recent-section">
                    <h3>Recent Bookings</h3>
                    <div className="bookings-list">
                      {bookings.slice(0, 3).map(booking => (
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
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>My Bookings</h2>
                    <p>Manage your travel bookings and create new ones</p>
                  </div>

                  {/* Create/Edit Booking Form */}
                  <div className="booking-form-section">
                    <h3>{isEditing ? 'Edit Booking' : 'Create New Booking'}</h3>
                    <form onSubmit={isEditing ? handleUpdateBooking : handleCreateBooking} className="booking-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Package Name</label>
                          <input
                            type="text"
                            value={isEditing ? editingBooking?.packageName : newBooking.packageName}
                            onChange={(e) => isEditing 
                              ? setEditingBooking({...editingBooking!, packageName: e.target.value})
                              : setNewBooking({...newBooking, packageName: e.target.value})
                            }
                            required
                            placeholder="e.g., Beach Paradise Tour"
                          />
                        </div>
                        <div className="form-group">
                          <label>Destination</label>
                          <input
                            type="text"
                            value={isEditing ? editingBooking?.destination : newBooking.destination}
                            onChange={(e) => isEditing
                              ? setEditingBooking({...editingBooking!, destination: e.target.value})
                              : setNewBooking({...newBooking, destination: e.target.value})
                            }
                            required
                            placeholder="e.g., Mirissa"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Date</label>
                          <input
                            type="date"
                            value={isEditing ? editingBooking?.date : newBooking.date}
                            onChange={(e) => isEditing
                              ? setEditingBooking({...editingBooking!, date: e.target.value})
                              : setNewBooking({...newBooking, date: e.target.value})
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Travelers</label>
                          <input
                            type="number"
                            min="1"
                            value={isEditing ? editingBooking?.travelers : newBooking.travelers}
                            onChange={(e) => isEditing
                              ? setEditingBooking({...editingBooking!, travelers: parseInt(e.target.value)})
                              : setNewBooking({...newBooking, travelers: parseInt(e.target.value)})
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Estimated Amount ($)</label>
                        <input
                          type="number"
                          min="0"
                          value={isEditing ? editingBooking?.amount : newBooking.amount}
                          onChange={(e) => isEditing
                            ? setEditingBooking({...editingBooking!, amount: parseInt(e.target.value)})
                            : setNewBooking({...newBooking, amount: parseInt(e.target.value)})
                          }
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="submit-btn">
                          {isEditing ? 'Update Booking' : 'Create Booking'}
                        </button>
                        {isEditing && (
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => {
                              setIsEditing(false);
                              setEditingBooking(null);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Bookings List */}
                  <div className="bookings-section">
                    <h3>All Bookings</h3>
                    <div className="bookings-table">
                      {bookings.map(booking => (
                        <div key={booking.id} className="booking-row">
                          <div className="booking-details">
                            <h4>{booking.packageName}</h4>
                            <p>{booking.destination}</p>
                            <small>Date: {booking.date} • Travelers: {booking.travelers}</small>
                          </div>
                          <div className="booking-meta">
                            <div className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </div>
                            <div className="booking-amount">${booking.amount}</div>
                          </div>
                          <div className="booking-actions">
                            <button 
                              className="action-btn edit"
                              onClick={() => handleEditBooking(booking)}
                            >
                              Edit
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={() => handleDeleteBooking(booking.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quotations Tab */}
              {activeTab === 'quotations' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Price Quotations</h2>
                    <p>Review and download your price quotations</p>
                  </div>

                  <div className="quotations-grid">
                    {quotations.map(quotation => (
                      <div key={quotation.id} className="quotation-card">
                        <div className="quotation-header">
                          <h3>{quotation.packageName}</h3>
                          <div className="quotation-date">{quotation.date}</div>
                        </div>
                        <div className="quotation-details">
                          <div className="quotation-amount">${quotation.amount}</div>
                          <div className="quotation-id">Quote #{quotation.id}</div>
                        </div>
                        <div className="quotation-actions">
                          <button className="view-btn">View PDF</button>
                          <button className="download-btn">Download</button>
                        </div>
                      </div>
                    ))}
                    
                    {quotations.length === 0 && (
                      <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h3>No Quotations Yet</h3>
                        <p>Your price quotations will appear here once reviewed by our team</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Profile Settings</h2>
                    <p>Manage your account information and preferences</p>
                  </div>

                  <div className="profile-sections">
                    {/* Personal Information */}
                    <div className="profile-section">
                      <h3>Personal Information</h3>
                      <form className="profile-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>First Name</label>
                            <input type="text" defaultValue="John" />
                          </div>
                          <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" defaultValue="Doe" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input type="email" defaultValue="john.doe@example.com" />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input type="tel" defaultValue="+1 (555) 123-4567" />
                        </div>
                        <button type="submit" className="save-btn">Save Changes</button>
                      </form>
                    </div>

                    {/* Change Password */}
                    <div className="profile-section">
                      <h3>Change Password</h3>
                      <form className="password-form">
                        <div className="form-group">
                          <label>Current Password</label>
                          <input type="password" />
                        </div>
                        <div className="form-group">
                          <label>New Password</label>
                          <input type="password" />
                        </div>
                        <div className="form-group">
                          <label>Confirm New Password</label>
                          <input type="password" />
                        </div>
                        <button type="submit" className="save-btn">Update Password</button>
                      </form>
                    </div>

                    {/* Preferences */}
                    <div className="profile-section">
                      <h3>Travel Preferences</h3>
                      <div className="preferences">
                        <label className="preference-item">
                          <input type="checkbox" defaultChecked />
                          <span>Receive promotional emails</span>
                        </label>
                        <label className="preference-item">
                          <input type="checkbox" defaultChecked />
                          <span>SMS notifications for bookings</span>
                        </label>
                        <label className="preference-item">
                          <input type="checkbox" />
                          <span>Weekly travel inspiration</span>
                        </label>
                      </div>
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

        /* Hero Section */
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

        /* Main Content */
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

        /* Sidebar */
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

        /* Dashboard Content */
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

        /* Stats Grid */
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

        /* Forms */
        .booking-form-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .booking-form-section h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .submit-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: #6b7280;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #4b5563;
        }

        /* Bookings Table */
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
        }

        .action-btn.edit {
          background: #dbeafe;
          color: #1e40af;
        }

        .action-btn.edit:hover {
          background: #bfdbfe;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #fecaca;
        }

        /* Quotations Grid */
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

        /* Profile Sections */
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

        .profile-form, .password-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .save-btn {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-start;
        }

        .save-btn:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .preferences {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preference-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .preference-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #f59e0b;
        }

        .preference-item span {
          color: #374151;
        }

        /* Empty State */
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

        /* Recent Section */
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

        /* Responsive Design */
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

          .form-row {
            grid-template-columns: 1fr;
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
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .section-header h2 {
            font-size: 1.8rem;
          }

          .booking-actions {
            flex-direction: column;
          }

          .quotation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}