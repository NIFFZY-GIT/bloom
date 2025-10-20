"use client";

import React, { useState, useEffect, useRef } from 'react';
import './PackagesPage.css';

// This interface now includes image_path to match the database column
interface TourPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_path: string; // Updated from imagePath
  category: string;
  highlights: string[];
  includes: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviews: number;
}

interface PackagesClientProps {
  initialTourPackages: TourPackage[];
}

// Main component remains a client component for interactivity
const PackagesClient = ({ initialTourPackages }: PackagesClientProps) => {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>(initialTourPackages);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: 1,
    message: ''
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredPackages = activeFilter === 'all'
    ? tourPackages
    : tourPackages.filter(pkg => pkg.category === activeFilter);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleViewPackage = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
    setBookingForm({ name: '', email: '', phone: '', date: '', guests: 1, message: '' });
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          ...bookingForm
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      alert(`Thank you ${bookingForm.name}! Your booking for ${selectedPackage?.title} has been received. We'll contact you soon!`);
      handleCloseModal();

    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('There was an error submitting your booking. Please try again.');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // ... (renderStars and getDifficultyColor functions remain the same)
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Moderate': return '#FF9800';
      case 'Challenging': return '#F44336';
      default: return '#666';
    }
  };


  return (
    <div className="packages-page">
      {/* Hero Section */}
      <section className="packages-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Brooklyn</h1>
          <p>Experience the best of Brooklyn with our carefully curated tour packages. From historic walks to culinary adventures, we have something for every explorer.</p>
          <button className="cta-button">Explore Tours</button>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </section>

      <div className="container">
        {/* Packages Section */}
        <section className="packages-section" ref={sectionRef}>
          <div className="section-header">
            <h2>Our Tour Packages</h2>
            <p>Choose from our selection of handcrafted Brooklyn experiences</p>
          </div>

          <div className="packages-filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              All Tours
            </button>
            <button
              className={`filter-btn ${activeFilter === 'city' ? 'active' : ''}`}
              onClick={() => handleFilterClick('city')}
            >
              City Tours
            </button>
            <button
              className={`filter-btn ${activeFilter === 'cultural' ? 'active' : ''}`}
              onClick={() => handleFilterClick('cultural')}
            >
              Cultural
            </button>
            <button
              className={`filter-btn ${activeFilter === 'food' ? 'active' : ''}`}
              onClick={() => handleFilterClick('food')}
            >
              Food & Drink
            </button>
            <button
              className={`filter-btn ${activeFilter === 'scenic' ? 'active' : ''}`}
              onClick={() => handleFilterClick('scenic')}
            >
              Scenic
            </button>
            <button
              className={`filter-btn ${activeFilter === 'night' ? 'active' : ''}`}
              onClick={() => handleFilterClick('night')}
            >
              Night Tours
            </button>
          </div>

          <div className="packages-grid">
            {filteredPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`package-card fade-in ${isVisible ? 'appear' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="package-image">
                  <img src={pkg.image_path} alt={pkg.title} /> {/* Updated to image_path */}
                  <div className="package-badge">
                    <span className="duration">{pkg.duration}</span>
                    <span
                      className="difficulty"
                      style={{ backgroundColor: getDifficultyColor(pkg.difficulty) }}
                    >
                      {pkg.difficulty}
                    </span>
                  </div>
                  <div className="package-overlay">
                    <button
                      className="view-package-btn"
                      onClick={() => handleViewPackage(pkg)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="package-content">
                  <div className="package-header">
                    <h3>{pkg.title}</h3>
                    <div className="package-rating">
                      <div className="stars">
                        {renderStars(pkg.rating)}
                      </div>
                      <span>({pkg.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="package-description">{pkg.description}</p>
                  
                  <div className="package-highlights">
                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="highlight-tag">#{highlight}</span>
                    ))}
                  </div>
                  
                  <div className="package-footer">
                    <div className="package-price">
                      <span className="price">${pkg.price}</span>
                      <span className="per-person">per person</span>
                    </div>
                    <button
                      className="book-now-btn"
                      onClick={() => handleViewPackage(pkg)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ... (Features Section remains the same) ... */}
        <section className="features-section">
          <div className="section-header">
            <h2>Why Choose Our Tours?</h2>
            <p>We provide exceptional experiences that you'll remember forever</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3>Expert Guides</h3>
              <p>Our local guides are passionate about Brooklyn and will share hidden gems you won't find in guidebooks.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Small Groups</h3>
              <p>Enjoy personalized attention with our small group sizes, ensuring a more intimate experience.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-camera"></i>
              </div>
              <h3>Photo Opportunities</h3>
              <p>We know all the best spots for amazing photos that will make your friends jealous.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Safety First</h3>
              <p>Your safety is our priority. All our tours follow the highest safety standards.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Package Detail Modal */}
      {selectedPackage && (
        <div className="modal-overlay">
          <div className="package-modal">
            <button className="close-modal" onClick={handleCloseModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedPackage.image_path} alt={selectedPackage.title} /> {/* Updated to image_path */}
                <div className="image-overlay">
                  <div className="package-info-badge">
                    <span className="duration">{selectedPackage.duration}</span>
                    <span
                      className="difficulty"
                      style={{ backgroundColor: getDifficultyColor(selectedPackage.difficulty) }}
                    >
                      {selectedPackage.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="modal-details">
                <div className="modal-header">
                  <h2>{selectedPackage.title}</h2>
                  <div className="modal-rating">
                    <div className="stars">
                      {renderStars(selectedPackage.rating)}
                    </div>
                    <span>{selectedPackage.rating} ({selectedPackage.reviews} reviews)</span>
                  </div>
                </div>
                
                <p className="modal-description">{selectedPackage.description}</p>
                
                <div className="modal-highlights">
                  <h4>Tour Highlights</h4>
                  <div className="highlights-list">
                    {selectedPackage.highlights.map((highlight, idx) => (
                      <div key={idx} className="highlight-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="modal-includes">
                  <h4>What's Included</h4>
                  <div className="includes-list">
                    {selectedPackage.includes.map((item, idx) => (
                      <div key={idx} className="include-item">
                        <i className="fas fa-check"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="booking-section">
                  <h4>Book This Tour</h4>
                  <form className="booking-form" onSubmit={handleBookNow}>
                    {/* ... (Form inputs remain the same) ... */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={bookingForm.name}
                          onChange={handleBookingChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={bookingForm.email}
                          onChange={handleBookingChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={bookingForm.phone}
                          onChange={handleBookingChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="date">Preferred Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={bookingForm.date}
                          onChange={handleBookingChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="guests">Number of Guests</label>
                        <select
                          id="guests"
                          name="guests"
                          value={bookingForm.guests}
                          onChange={handleBookingChange}
                          required
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Special Requests</label>
                        <input
                          type="text"
                          id="message"
                          name="message"
                          value={bookingForm.message}
                          onChange={handleBookingChange}
                          placeholder="Any special requirements?"
                        />
                      </div>
                    </div>
                    
                    <div className="booking-summary">
                      <div className="price-summary">
                        <span className="label">Total Price:</span>
                        <span className="price">${selectedPackage.price * bookingForm.guests}</span>
                      </div>
                      <button type="submit" className="confirm-booking-btn">
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesClient;
