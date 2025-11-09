"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/auth-client';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './CreatePackagePage.css';

interface Place {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  category: string;
  duration: string;
  price: number;
  location: string;
  highlights: string[];
}

const CreatePackagePage: React.FC = () => {
  const router = useRouter();
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    guests: 2,
    contactEmail: '',
    contactPhone: '',
    startDate: '',
    endDate: '',
    foodAndSpecialRequests: '',
    additionalInfo: '',
  });
  const [isSubmittingPackage, setIsSubmittingPackage] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const dateTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Fetch places from database
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoadingPlaces(true);
        const response = await fetch('/api/places');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.places)) {
          setAvailablePlaces(data.places);
        } else {
          console.error('Failed to load places:', data.message);
          setAvailablePlaces([]);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
        setAvailablePlaces([]);
      } finally {
        setIsLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsUserAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  const filteredPlaces = activeCategory === 'all' 
    ? availablePlaces 
    : availablePlaces.filter(place => place.category === activeCategory);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const handleAddPlace = (place: Place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleRemovePlace = (placeId: number) => {
    setSelectedPlaces(selectedPlaces.filter(place => place.id !== placeId));
  };

  const handleMovePlace = (index: number, direction: 'up' | 'down') => {
    const newPlaces = [...selectedPlaces];
    if (direction === 'up' && index > 0) {
      [newPlaces[index], newPlaces[index - 1]] = [newPlaces[index - 1], newPlaces[index]];
    } else if (direction === 'down' && index < newPlaces.length - 1) {
      [newPlaces[index], newPlaces[index + 1]] = [newPlaces[index + 1], newPlaces[index]];
    }
    setSelectedPlaces(newPlaces);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'startDate') {
      setPackageForm(prev => ({
        ...prev,
        startDate: value,
        endDate: prev.endDate && prev.endDate >= value ? prev.endDate : value,
      }));
    } else if (name === 'endDate') {
      setPackageForm(prev => ({
        ...prev,
        endDate: !prev.startDate || value >= prev.startDate ? value : prev.startDate,
      }));
    } else {
      setPackageForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleToggleDatePicker = () => {
    setIsDatePickerOpen(prev => !prev);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  const parseDurationToHours = (duration: string) => {
    const [rawValue = '0', unit = 'hours'] = duration.trim().split(/\s+/);
    const numeric = Number.parseFloat(rawValue);
    if (!Number.isFinite(numeric)) {
      return 0;
    }
    const lowered = unit.toLowerCase();
    if (lowered.startsWith('min')) {
      return numeric / 60;
    }
    return numeric;
  };

  const getTotalDurationHours = () =>
    selectedPlaces.reduce((total, place) => total + parseDurationToHours(place.duration), 0);

  const getTotalDurationMinutes = () => Math.max(0, Math.round(getTotalDurationHours() * 60));

  const calculateTotalDuration = () => {
    const totalHours = getTotalDurationHours();
    if (totalHours <= 0) {
      return '0 hours';
    }
    return Number.isInteger(totalHours) ? `${totalHours} hours` : `${totalHours.toFixed(1)} hours`;
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setSubmitError(null);
      setSubmitSuccess(null);
      
      if (currentStep === 1) {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          setSubmitError('Please log in to continue customizing your package. You will be redirected to the login page.');
          setTimeout(() => {
            router.push('/login?redirect=/create_pkg');
          }, 2000);
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setSubmitError(null);
      setSubmitSuccess(null);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitPackage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const authenticated = await isAuthenticated();
    if (!authenticated) {
      setSubmitError('Please log in to create a custom package. You will be redirected to the login page.');
      setTimeout(() => {
        router.push('/login?redirect=/create_pkg');
      }, 2000);
      return;
    }

    if (selectedPlaces.length === 0) {
      setSubmitError('Please select at least one place before submitting.');
      setCurrentStep(1);
      return;
    }

    const placesPayload = selectedPlaces.map((place, index) => ({
      id: place.id,
      name: place.name,
      description: place.description,
      imagePath: place.imagePath,
      category: place.category,
      duration: place.duration,
      location: place.location,
      highlights: place.highlights,
      order: index + 1,
    }));

    const totalDurationMinutes = getTotalDurationMinutes();

    const payload = {
      name: packageForm.name.trim(),
      description: packageForm.description.trim(),
      places: placesPayload,
      totals: {
        durationLabel: calculateTotalDuration(),
        durationMinutes: totalDurationMinutes,
      },
      contact: {
        email: packageForm.contactEmail.trim(),
        phone: packageForm.contactPhone.trim(),
        guests: packageForm.guests,
        startDate: packageForm.startDate || null,
        endDate: packageForm.endDate || null,
        foodAndSpecialRequests: packageForm.foodAndSpecialRequests.trim() || null,
        additionalInfo: packageForm.additionalInfo.trim() || null,
      },
    };

    setIsSubmittingPackage(true);

    try {
      const response = await fetch('/api/custom-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const message = data?.message || 'Failed to submit custom package';
        throw new Error(message);
      }

      setSubmitSuccess('🎉 Thank you! Your custom tour request has been submitted successfully. Our team will review your itinerary and send you a detailed quotation within 24 hours. Check your email and "My Trips" in your profile for updates!');
      setSelectedPlaces([]);
      setCurrentStep(1);
      setPackageForm({
        name: '',
        description: '',
        guests: 2,
        contactEmail: '',
        contactPhone: '',
        startDate: '',
        endDate: '',
        foodAndSpecialRequests: '',
        additionalInfo: '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit custom package';
      setSubmitError(message);
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = sectionRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDatePickerOpen &&
        datePickerRef.current &&
        dateTriggerRef.current &&
        !datePickerRef.current.contains(event.target as Node) &&
        !dateTriggerRef.current.contains(event.target as Node)
      ) {
        closeDatePicker();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  // Helper variables for date picker
  const today = new Date().toISOString().split('T')[0];
  const endDateMin = packageForm.startDate || today;
  const selectedDateLabel = packageForm.startDate
    ? packageForm.endDate && packageForm.endDate !== packageForm.startDate
      ? `${packageForm.startDate} to ${packageForm.endDate}`
      : packageForm.startDate
    : 'Select dates';

  // Stats data similar to AboutUs page
  const stats = [
    { number: `${availablePlaces.length}+`, label: 'Amazing Places' },
    { number: '50K+', label: 'Happy Travelers' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="create-package-page">
      {/* Authentication Notice Banner */}
      {!isUserAuthenticated && (
        <div className="auth-notice-banner">
          <div className="auth-notice-content">
            <i className="fas fa-info-circle"></i>
            <span>
              <strong>Browsing Mode:</strong> You can explore places, but you&apos;ll need to{' '}
              <a href="/login?redirect=/create_pkg" className="login-link">log in</a> or{' '}
              <a href="/sign-up?redirect=/create_pkg" className="login-link">sign up</a> to customize and submit your package.
            </span>
          </div>
        </div>
      )}
      
      {/* Hero Section Only - Nav bar removed */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text-content">
            <h1 className="hero-main-title">Create Your Dream Tour</h1>
            <p className="hero-description">
              Build your perfect Brooklyn experience by selecting your favorite places and customizing every detail
            </p>
          </div>
          
          <div className="scroll-indicator">
            <span className="scroll-text">SCROLL TO EXPLORE</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span className="step-label">Choose Places</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span className="step-label">Customize</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span className="step-label">Submit</span>
          </div>
        </div>

        {submitSuccess && (
          <div className="form-feedback success-message">{submitSuccess}</div>
        )}

        {submitError && (
          <div className="form-feedback error-message">{submitError}</div>
        )}

        {/* Step 1: Choose Places */}
        {currentStep === 1 && (
          <section className="places-section" ref={sectionRef}>
            <div className="section-header">
              <h2>Choose Your Places</h2>
              <p>Select the locations you want to visit by clicking the + button</p>
            </div>

            {/* Category Filters */}
            <div className="category-tabs-container">
              <div className="category-tabs">
                <button 
                  className={`tab-button ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('all')}
                >
                  <span className="tab-icon">🏛️</span>
                  <span className="tab-text">All Places</span>
                  <div className="active-indicator"></div>
                </button>
                <button 
                  className={`tab-button ${activeCategory === 'landmark' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('landmark')}
                >
                  <span className="tab-icon">🗽</span>
                  <span className="tab-text">Landmarks</span>
                  <div className="active-indicator"></div>
                </button>
                <button 
                  className={`tab-button ${activeCategory === 'cultural' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('cultural')}
                >
                  <span className="tab-icon">🎭</span>
                  <span className="tab-text">Cultural</span>
                  <div className="active-indicator"></div>
                </button>
                <button 
                  className={`tab-button ${activeCategory === 'nature' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('nature')}
                >
                  <span className="tab-icon">🌳</span>
                  <span className="tab-text">Nature</span>
                  <div className="active-indicator"></div>
                </button>
                <button 
                  className={`tab-button ${activeCategory === 'food' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('food')}
                >
                  <span className="tab-icon">🍽️</span>
                  <span className="tab-text">Food & Drink</span>
                  <div className="active-indicator"></div>
                </button>
              </div>
            </div>

            <div className="selection-area">
              <div className="available-places">
                <h3>Available Places ({filteredPlaces.length})</h3>
                {isLoadingPlaces ? (
                  <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading places...</p>
                  </div>
                ) : filteredPlaces.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-map-marked-alt"></i>
                    <p>No places available</p>
                    <span>Please check back later or contact us for custom options</span>
                  </div>
                ) : (
                  <div className="places-grid">
                    {filteredPlaces.map((place, index) => (
                      <div 
                        key={place.id}
                        className={`place-card fade-in ${isVisible ? 'appear' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="place-image">
                          <Image 
                            src={place.imagePath || '/images/places/placeholder.jpg'} 
                            alt={place.name} 
                            width={300} 
                            height={200} 
                            style={{ objectFit: 'cover' }}
                            unoptimized={!place.imagePath || place.imagePath.startsWith('/uploads/')}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/places/placeholder.jpg';
                            }}
                          />
                          <button 
                            className="add-place-btn"
                            onClick={() => handleAddPlace(place)}
                            disabled={selectedPlaces.find(p => p.id === place.id) !== undefined}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        
                        <div className="place-content">
                          <div className="place-header">
                            <h4>{place.name}</h4>
                            <span className="duration">{place.duration}</span>
                          </div>
                          
                          <p className="place-description">{place.description}</p>
                          
                          <div className="place-location">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{place.location}</span>
                          </div>
                          
                          {place.highlights && place.highlights.length > 0 && (
                            <div className="place-highlights">
                              {place.highlights.map((highlight, idx) => (
                                <span key={idx} className="highlight-tag">#{highlight}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="selected-places">
                <div className="selected-places-header">
                  <h3>Your Itinerary ({selectedPlaces.length})</h3>
                  {selectedPlaces.length > 0 && (
                    <div className="itinerary-summary-card">
                      <div className="summary-item">
                        <span>Total Duration:</span>
                        <span>{calculateTotalDuration()}</span>
                      </div>
                      <div className="summary-item">
                        <span>Places:</span>
                        <span>{selectedPlaces.length}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedPlaces.length === 0 ? (
                  <div className="empty-itinerary">
                    <i className="fas fa-map-marked-alt"></i>
                    <p>No places selected yet</p>
                    <span>Click the + buttons to add places to your itinerary</span>
                  </div>
                ) : (
                  <div className="itinerary-list">
                    {selectedPlaces.map((place, index) => (
                      <div key={place.id} className="itinerary-item">
                        <div className="item-number">{index + 1}</div>
                        <div className="item-content">
                          <h4>{place.name}</h4>
                          <span className="item-duration">{place.duration}</span>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="move-btn"
                            onClick={() => handleMovePlace(index, 'up')}
                            disabled={index === 0}
                          >
                            <i className="fas fa-arrow-up"></i>
                          </button>
                          <button 
                            className="move-btn"
                            onClick={() => handleMovePlace(index, 'down')}
                            disabled={index === selectedPlaces.length - 1}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </button>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemovePlace(place.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      className="next-step-btn"
                      onClick={handleNextStep}
                      disabled={selectedPlaces.length === 0}
                    >
                      Continue to Customize
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Customize Package */}
        {currentStep === 2 && (
          <section className="customize-section">
            <div className="section-header">
              <h2>Customize Your Experience</h2>
              <p>Tell us about your tour preferences and requirements</p>
            </div>

            <div className="customize-content">
              <div className="package-details-card">
                <div className="card-header">
                  <div className="card-icon">📝</div>
                  <h3>Package Details</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="packageName">Tour Name *</label>
                  <input
                    type="text"
                    id="packageName"
                    name="name"
                    value={packageForm.name}
                    onChange={handleFormChange}
                    placeholder="Give your dream tour a name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="packageDescription">What do you expect from this tour? *</label>
                  <textarea
                    id="packageDescription"
                    name="description"
                    value={packageForm.description}
                    onChange={handleFormChange}
                    placeholder="Tell us what you expect from this tour so we can make it better and happen..."
                    rows={5}
                    required
                  />
                </div>
              </div>

              <div className="preferences-card">
                <div className="card-header">
                  <div className="card-icon">⚙️</div>
                  <h3>Tour Information</h3>
                </div>
                <div className="preferences-grid">
                  <div className="form-group">
                    <label htmlFor="guests">Number of Guests *</label>
                    <select
                      id="guests"
                      name="guests"
                      value={packageForm.guests}
                      onChange={handleFormChange}
                      required
                    >
                      {[1,2,3,4,5,6,7,8,9,10,15,20].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactEmail">Email Address *</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={packageForm.contactEmail}
                      onChange={handleFormChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPhone">Phone Number (with country code) *</label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={packageForm.contactPhone}
                      onChange={(value) => setPackageForm(prev => ({...prev, contactPhone: value || ''}))}
                      required
                    />
                  </div>

                  <div className="form-group date-range-field">
                    <label htmlFor="preferred-dates">Preferred Travel Dates *</label>
                    <button
                      type="button"
                      id="preferred-dates"
                      className={`date-range-trigger ${packageForm.startDate ? 'has-value' : ''}`}
                      onClick={handleToggleDatePicker}
                      ref={dateTriggerRef}
                      aria-expanded={isDatePickerOpen}
                      aria-controls="preferred-dates-panel"
                    >
                      <span>{selectedDateLabel}</span>
                      <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                    </button>
                    {isDatePickerOpen && (
                      <div className="date-range-panel" id="preferred-dates-panel" ref={datePickerRef}>
                        <div className="date-range-inputs">
                          <div className="date-input-group">
                            <span>Start</span>
                            <input
                              type="date"
                              name="startDate"
                              value={packageForm.startDate}
                              onChange={handleFormChange}
                              min={today}
                              required
                            />
                          </div>
                          <div className="date-input-group">
                            <span>End</span>
                            <input
                              type="date"
                              name="endDate"
                              value={packageForm.endDate}
                              onChange={handleFormChange}
                              min={endDateMin}
                            />
                          </div>
                        </div>
                        <div className="date-range-actions">
                          <button type="button" className="date-range-clear" onClick={() => {
                            setPackageForm(prev => ({
                              ...prev,
                              startDate: '',
                              endDate: '',
                            }));
                          }}>
                            Clear
                          </button>
                          <button type="button" className="date-range-apply" onClick={closeDatePicker}>
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="foodAndSpecialRequests">Food Preferences, Allergies & Additional Information</label>
                    <textarea
                      id="foodAndSpecialRequests"
                      name="foodAndSpecialRequests"
                      value={packageForm.foodAndSpecialRequests}
                      onChange={handleFormChange}
                      placeholder="Example: 2 guests are vegetarian, 1 guest is vegan, 1 guest has peanut allergy. Please mention any dietary requirements or food preferences..."
                      rows={4}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="additionalInfo">Additional Information</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={packageForm.additionalInfo}
                      onChange={handleFormChange}
                      placeholder="Any other special requests, accessibility needs, or information we should know..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="prev-step-btn" onClick={handlePrevStep}>
                  Back to Places
                </button>
                <button className="next-step-btn" onClick={handleNextStep}>
                  Continue to Submit
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Submit Package */}
        {currentStep === 3 && (
          <section className="submit-section">
            <div className="section-header">
              <h2>🎉 You&apos;re Almost There!</h2>
              <p>Review your dream tour and submit your request</p>
            </div>

            <div className="submit-content">
              <div className="package-summary-card">
                <div className="summary-header">
                  <div className="summary-icon">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <div>
                    <h3>{packageForm.name || 'My Custom Tour'}</h3>
                    <p className="summary-subtitle">{packageForm.description || 'Your personalized Brooklyn experience'}</p>
                  </div>
                </div>
                
                <div className="summary-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{calculateTotalDuration()}</span>
                      <span className="stat-label">Total Duration</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-map-pin"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{selectedPlaces.length}</span>
                      <span className="stat-label">Places to Visit</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{packageForm.guests}</span>
                      <span className="stat-label">{packageForm.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">
                        {selectedDateLabel !== 'Select dates' ? 
                          (packageForm.endDate && packageForm.endDate !== packageForm.startDate ? 
                            `${Math.ceil((new Date(packageForm.endDate).getTime() - new Date(packageForm.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days` : '1 day') : 
                          'TBD'
                        }
                      </span>
                      <span className="stat-label">Travel Dates</span>
                    </div>
                  </div>
                </div>

                <div className="itinerary-preview">
                  <h4><i className="fas fa-route"></i> Your Itinerary</h4>
                  <div className="places-timeline">
                    {selectedPlaces.map((place, index) => (
                      <div key={place.id} className="timeline-item">
                        <div className="timeline-marker">{index + 1}</div>
                        <div className="timeline-content">
                          <div className="timeline-place">
                            <h5>{place.name}</h5>
                            <span className="timeline-duration">
                              <i className="fas fa-clock"></i> {place.duration}
                            </span>
                          </div>
                          <p className="timeline-location">
                            <i className="fas fa-map-marker-alt"></i> {place.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="contact-details-card">
                  <h4><i className="fas fa-address-card"></i> Contact Information</h4>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <span className="contact-label">Email</span>
                        <span className="contact-value">{packageForm.contactEmail}</span>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <div>
                        <span className="contact-label">Phone</span>
                        <span className="contact-value">{packageForm.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                  {selectedDateLabel !== 'Select dates' && (
                    <div className="contact-item full-width">
                      <i className="fas fa-calendar-alt"></i>
                      <div>
                        <span className="contact-label">Preferred Dates</span>
                        <span className="contact-value">{selectedDateLabel}</span>
                      </div>
                    </div>
                  )}
                  {packageForm.foodAndSpecialRequests && (
                    <div className="contact-item full-width">
                      <i className="fas fa-utensils"></i>
                      <div>
                        <span className="contact-label">Dietary Requirements</span>
                        <span className="contact-value">{packageForm.foodAndSpecialRequests}</span>
                      </div>
                    </div>
                  )}
                  {packageForm.additionalInfo && (
                    <div className="contact-item full-width">
                      <i className="fas fa-info-circle"></i>
                      <div>
                        <span className="contact-label">Additional Notes</span>
                        <span className="contact-value">{packageForm.additionalInfo}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="submit-panel">
                <div className="submit-card">
                  <div className="submit-icon-circle">
                    <i className="fas fa-paper-plane"></i>
                  </div>
                  <h3>Ready to Submit?</h3>
                  <p className="submit-description">
                    We&apos;ll review your custom tour request and prepare a detailed quotation tailored to your preferences.
                  </p>

                  <div className="guarantee-badge">
                    <div className="badge-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="badge-content">
                      <strong>24-Hour Response Guarantee</strong>
                      <p>You&apos;ll receive a personalized quotation via email within 24 hours of submission</p>
                    </div>
                  </div>

                  <div className="what-happens-next">
                    <h4>What Happens Next?</h4>
                    <ul className="next-steps-list">
                      <li>
                        <i className="fas fa-check-circle"></i>
                        <span>We&apos;ll review your itinerary and preferences</span>
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        <span>Our team will prepare a detailed quotation</span>
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        <span>You&apos;ll receive pricing and availability via email</span>
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        <span>Confirm your booking and we&apos;ll finalize the details</span>
                      </li>
                    </ul>
                  </div>

                  <form onSubmit={handleSubmitPackage} className="submit-form">
                    <div className="form-actions-submit">
                      <button
                        type="button"
                        className="btn-secondary-large"
                        onClick={handlePrevStep}
                        disabled={isSubmittingPackage}
                      >
                        <i className="fas fa-arrow-left"></i>
                        Back to Customize
                      </button>
                      <button
                        type="submit"
                        className="btn-primary-large"
                        disabled={isSubmittingPackage}
                      >
                        {isSubmittingPackage ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane"></i>
                            Submit My Tour Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <p className="submit-note">
                    <i className="fas fa-lock"></i>
                    Your information is secure and will only be used to prepare your quotation
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Journey?</h2>
            <p>
              Let us craft your perfect Brooklyn adventure. Share your dreams, 
              and we&apos;ll make them a reality.
            </p>
            <div className="cta-buttons">
              <button className="explore-button">Explore Packages</button>
              <button className="contact-button">Contact Us</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatePackagePage;