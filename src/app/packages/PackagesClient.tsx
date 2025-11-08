"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/auth-client';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import './PackagesPage.css';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text: string | null;
  sort_order: number;
}

interface TourPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_path: string | null;
  category: string;
  highlights: string[];
  includes: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviews: number;
  gallery_images: GalleryImage[];
}

interface PackagesClientProps {
  initialTourPackages: TourPackage[];
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x250?text=Tour+Image';

const PackagesClient = ({ initialTourPackages }: PackagesClientProps) => {
  const [tourPackages] = useState<TourPackage[]>(initialTourPackages);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    guests: 1,
    message: '',
    foodAndSpecialRequests: ''
  });
  const [packageImageIndex, setPackageImageIndex] = useState<Record<number, number>>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration'>('recommended');
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const dateTriggerRef = useRef<HTMLButtonElement | null>(null);

  const availableFilters = useMemo(() => {
    const categorySet = new Set<string>();
    tourPackages.forEach(pkg => {
      if (pkg.category) {
        categorySet.add(pkg.category);
      }
    });
    return ['all', ...Array.from(categorySet).sort((a, b) => a.localeCompare(b))];
  }, [tourPackages]);

  const parseDurationToDays = (value: string) => {
    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
      return Number.POSITIVE_INFINITY;
    }
    return parseFloat(match[1]);
  };

  const filteredPackages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let results = activeFilter === 'all'
      ? [...tourPackages]
      : tourPackages.filter(pkg => pkg.category === activeFilter);

    if (normalizedSearch) {
      results = results.filter(pkg => {
        const haystack = `${pkg.title} ${pkg.description} ${pkg.highlights.join(' ')}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      });
    }

    switch (sortOption) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        results.sort((a, b) => parseDurationToDays(a.duration) - parseDurationToDays(b.duration));
        break;
      default:
        results.sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title));
    }

    return results;
  }, [activeFilter, searchTerm, sortOption, tourPackages]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSearchTerm('');
  };

  const handleViewPackage = (pkg: TourPackage) => {
    // Allow viewing package details without authentication
    // Authentication check happens when submitting booking
    setSelectedPackage(pkg);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as typeof sortOption);
  };

  const handleScrollToPackages = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatFilterLabel = (value: string) => {
    if (value === 'all') {
      return 'All Tours';
    }
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const activeFilterLabel = formatFilterLabel(activeFilter);

  const handleCloseModal = () => {
    setSelectedPackage(null);
    document.body.style.overflow = 'auto'; // Restore background scrolling
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
      guests: 1,
      message: '',
      foodAndSpecialRequests: ''
    });
    setIsDatePickerOpen(false);
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      ...(name === 'guests'
        ? { guests: Number(value) }
        : name === 'startDate'
          ? {
              startDate: value,
              endDate: prev.endDate && prev.endDate >= value ? prev.endDate : value,
            }
          : name === 'endDate'
            ? {
                endDate: !prev.startDate || value >= prev.startDate ? value : prev.startDate,
              }
            : { [name]: value }),
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setBookingForm({
      ...bookingForm,
      phone: value || '',
    });
  };

  const handleToggleDatePicker = () => {
    setIsDatePickerOpen(prev => !prev);
  };

  const closeDatePicker = useCallback(() => {
    setIsDatePickerOpen(false);
  }, []);

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    console.log('[PackagesClient] Starting booking process...');
    console.log('[PackagesClient] Document cookies:', document.cookie);

    // Check if user is authenticated before proceeding
    console.log('[PackagesClient] Checking authentication...');
    
    let authenticated = false;
    try {
      authenticated = await isAuthenticated();
      console.log('[PackagesClient] Authentication result:', authenticated);
    } catch (error) {
      console.error('[PackagesClient] Error during auth check:', error);
      authenticated = false;
    }
    
    if (!authenticated) {
      console.log('[PackagesClient] User not authenticated, showing alert and redirecting');
      alert('Please log in to complete your booking. You will be redirected to the login page.');
      setTimeout(() => {
        router.push(`/login?redirect=/packages`);
      }, 1500);
      return;
    }

    console.log('[PackagesClient] User authenticated, proceeding with booking...');

    const startDate = bookingForm.startDate;
    if (!startDate) {
      alert('Please select your preferred start date.');
      return;
    }

    const normalizedEndDate = bookingForm.endDate && bookingForm.endDate >= startDate
      ? bookingForm.endDate
      : startDate;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          name: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone,
          startDate,
          endDate: normalizedEndDate,
          date: startDate,
          guests: bookingForm.guests,
          message: bookingForm.message,
          foodAndSpecialRequests: bookingForm.foodAndSpecialRequests,
        }),
      });

  const data = await response.json();

      if (!response.ok) throw new Error(data?.message || 'Booking failed');

      const guestsCount = Number(bookingForm.guests) || 1;
      const totalPrice = selectedPackage.price * guestsCount;

      const params = new URLSearchParams({
        packageId: String(selectedPackage.id),
        packageTitle: selectedPackage.title,
        category: selectedPackage.category,
        duration: selectedPackage.duration,
        difficulty: selectedPackage.difficulty,
        pricePerPerson: selectedPackage.price.toString(),
        totalPrice: totalPrice.toString(),
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        startDate,
        endDate: normalizedEndDate,
        guests: guestsCount.toString(),
      });

      const dateLabelStart = formatDateLabel(startDate);
      const dateLabelEnd = formatDateLabel(normalizedEndDate);
      const dateRangeLabel = startDate === normalizedEndDate
        ? dateLabelStart
        : `${dateLabelStart} – ${dateLabelEnd}`;

      params.append('date', dateRangeLabel);
      params.append('dateRange', `${startDate}:${normalizedEndDate}`);

      if (bookingForm.message.trim()) {
        params.append('message', bookingForm.message.trim());
      }

      if (bookingForm.foodAndSpecialRequests.trim()) {
        params.append('foodAndSpecialRequests', bookingForm.foodAndSpecialRequests.trim());
      }

      const bookingRecord = data?.booking;
      const bookingIdValue = bookingRecord?.id ?? bookingRecord?.booking_id ?? data?.bookingId ?? data?.id;

      if (bookingIdValue) {
        params.append('bookingId', String(bookingIdValue));
      }

      const responseReference = data?.reference || bookingRecord?.reference || bookingRecord?.booking_reference || bookingIdValue;
      if (responseReference) {
        params.append('reference', String(responseReference));
      }

      handleCloseModal();

      router.push(`/packages/booking/confirm?${params.toString()}`);

    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('There was an error submitting your booking. Please try again.');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });

    const element = sectionRef.current;
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(target) &&
        dateTriggerRef.current &&
        !dateTriggerRef.current.contains(target)
      ) {
        closeDatePicker();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDatePicker();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDatePickerOpen, closeDatePicker]);

  const getPackageImages = useCallback((pkg: TourPackage) => {
    const images: string[] = [];

    const pushUnique = (src: string | null | undefined) => {
      if (src && !images.includes(src)) {
        images.push(src);
      }
    };

    pushUnique(pkg.image_path);

    if (Array.isArray(pkg.gallery_images)) {
      pkg.gallery_images.forEach((image) => {
        pushUnique(image?.image_path);
      });
    }

    if (!images.length) {
      images.push(PLACEHOLDER_IMAGE);
    }

    return images;
  }, []);

  const getPrimaryImage = useCallback((pkg: TourPackage) => {
    const images = getPackageImages(pkg);
    return images[0] ?? PLACEHOLDER_IMAGE;
  }, [getPackageImages]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push(<i key={i} className="fas fa-star"></i>);
    if (hasHalfStar) stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
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

  const today = new Date().toISOString().split('T')[0];
  const endDateMin = bookingForm.startDate || today;

  const formatDateLabel = useCallback((isoDate: string) => {
    if (!isoDate) {
      return '';
    }
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.valueOf())) {
      return isoDate;
    }
    return parsed.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const selectedDateLabel = useMemo(() => {
    if (!bookingForm.startDate) {
      return 'Select dates';
    }

    const normalizedEnd = bookingForm.endDate && bookingForm.endDate >= bookingForm.startDate
      ? bookingForm.endDate
      : bookingForm.startDate;

    const startLabel = formatDateLabel(bookingForm.startDate);
    const endLabel = formatDateLabel(normalizedEnd);

    return bookingForm.startDate === normalizedEnd ? startLabel : `${startLabel} – ${endLabel}`;
  }, [bookingForm.startDate, bookingForm.endDate, formatDateLabel]);

  useEffect(() => {
    if (!filteredPackages.length) {
      return;
    }

    const interval = window.setInterval(() => {
      setPackageImageIndex((prev) => {
        let updated = false;
        const nextState: Record<number, number> = { ...prev };

        filteredPackages.forEach((pkg) => {
          const images = getPackageImages(pkg);
          const totalImages = images.length;
          if (totalImages > 1) {
            const currentIndex = prev[pkg.id] ?? 0;
            const nextIndex = (currentIndex + 1) % totalImages;
            if (nextState[pkg.id] !== nextIndex) {
              nextState[pkg.id] = nextIndex;
              updated = true;
            }
          }
        });

        return updated ? nextState : prev;
      });
    }, 6000);

    return () => window.clearInterval(interval);
  }, [filteredPackages, getPackageImages]);

  return (
    <div className="packages-page">
      {/* Hero Section and Packages Grid remain the same */}
      <section className="packages-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Brooklyn</h1>
          <p>Experience the best of Brooklyn with our carefully curated tour packages. From historic walks to culinary adventures, we have something for every explorer.</p>
          <button className="cta-button" onClick={handleScrollToPackages}>Explore Tours</button>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </section>

      <div className="container">
        <section className="packages-section" ref={sectionRef}>
        <div className="section-header">
            <h2>Our Tour Packages</h2>
            <p>Choose from our selection of handcrafted Brooklyn experiences</p>
          </div>

          <div className="packages-toolbar">
            <div className="packages-filters">
              {availableFilters.map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => handleFilterClick(filter)}
                >
                  {formatFilterLabel(filter)}
                </button>
              ))}
            </div>
            <div className="packages-inputs">
              <div className="search-wrapper">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by title, highlight, or description"
                  aria-label="Search tour packages"
                />
              </div>
              <label className="sort-wrapper">
                <span className="sr-only">Sort packages</span>
                <select value={sortOption} onChange={handleSortChange} aria-label="Sort tour packages">
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration">Duration: Short to Long</option>
                </select>
              </label>
            </div>
          </div>

          <div className="packages-results-meta">
            <p>
              Showing <strong>{filteredPackages.length}</strong> {filteredPackages.length === 1 ? 'experience' : 'experiences'}
              {activeFilter !== 'all' ? ` in ${activeFilterLabel}` : ''}
              {searchTerm.trim() ? ` for “${searchTerm.trim()}”` : ''}
            </p>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="packages-grid">
              {filteredPackages.map((pkg, index) => {
                const packageImages = getPackageImages(pkg);
                const totalImages = packageImages.length;
                const storedIndex = packageImageIndex[pkg.id] ?? 0;
                const activeIndex = totalImages > 0 ? ((storedIndex % totalImages) + totalImages) % totalImages : 0;
                const showControls = totalImages > 1;

                const handlePrevImage = (event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setPackageImageIndex((prev) => {
                    if (totalImages <= 1) {
                      return prev;
                    }
                    const current = prev[pkg.id] ?? activeIndex;
                    const nextIndex = (current - 1 + totalImages) % totalImages;
                    return { ...prev, [pkg.id]: nextIndex };
                  });
                };

                const handleNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setPackageImageIndex((prev) => {
                    if (totalImages <= 1) {
                      return prev;
                    }
                    const current = prev[pkg.id] ?? activeIndex;
                    const nextIndex = (current + 1) % totalImages;
                    return { ...prev, [pkg.id]: nextIndex };
                  });
                };

                const handleSelectImage = (event: React.MouseEvent<HTMLButtonElement>, imageIndex: number) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setPackageImageIndex((prev) => ({ ...prev, [pkg.id]: imageIndex }));
                };

                return (
                  <div
                    key={pkg.id}
                    className={`package-card fade-in ${isVisible ? 'appear' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="package-image">
                      <div className="package-slider">
                        {packageImages.map((imageSrc, imageIndex) => (
                          <Image
                            key={`${pkg.id}-image-${imageIndex}`}
                            src={imageSrc}
                            alt={`${pkg.title} image ${imageIndex + 1}`}
                            className={`package-slider-image ${imageIndex === activeIndex ? 'active' : ''}`}
                            width={400}
                            height={300}
                            style={{ objectFit: 'cover' }}
                            priority={imageIndex === 0}
                          />
                        ))}
                      </div>

                      {showControls && (
                        <>
                          <button
                            type="button"
                            className="slider-control slider-control-prev"
                            onClick={handlePrevImage}
                            aria-label={`Show previous photo for ${pkg.title}`}
                          >
                            <span className="slider-icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" focusable="false" role="presentation">
                                <path d="M15.41 7.41 14 6 8 12l6 6 1.41-1.41L10.83 12z" />
                              </svg>
                            </span>
                          </button>
                          <button
                            type="button"
                            className="slider-control slider-control-next"
                            onClick={handleNextImage}
                            aria-label={`Show next photo for ${pkg.title}`}
                          >
                            <span className="slider-icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" focusable="false" role="presentation">
                                <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L12.17 12z" />
                              </svg>
                            </span>
                          </button>
                          <div className="slider-dots" role="tablist" aria-label={`${pkg.title} gallery`}>
                            {packageImages.map((_, dotIndex) => (
                              <button
                                key={`dot-${pkg.id}-${dotIndex}`}
                                type="button"
                                className={`slider-dot ${dotIndex === activeIndex ? 'active' : ''}`}
                                onClick={(event) => handleSelectImage(event, dotIndex)}
                                aria-label={`View photo ${dotIndex + 1}`}
                                aria-pressed={dotIndex === activeIndex}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <div className="package-badge">
                        <span className="duration">{pkg.duration}</span>
                        <span className="difficulty" style={{ backgroundColor: getDifficultyColor(pkg.difficulty) }}>{pkg.difficulty}</span>
                      </div>
                      <div className="package-overlay">
                        <button className="view-package-btn" onClick={() => handleViewPackage(pkg)}>View Details</button>
                      </div>
                    </div>
                    <div className="package-content">
                      <div className="package-header">
                        <h3>{pkg.title}</h3>
                    
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
                        <button className="book-now-btn" onClick={() => handleViewPackage(pkg)}>Book Now</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="packages-empty-state">
              <i className="fas fa-search"></i>
              <h3>No tours match your filters</h3>
              <p>Try adjusting your filters or clearing the search to discover more experiences.</p>
              <button type="button" onClick={() => { setActiveFilter('all'); setSearchTerm(''); setSortOption('recommended'); }}>
                Reset filters
              </button>
            </div>
          )}
        </section>

        <section className="features-section">
            <div className="section-header">
                <h2>Why Choose Our Tours?</h2>
                <p>We provide exceptional experiences that you&apos;ll remember forever</p>
            </div>
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon"><i className="fas fa-map-marked-alt"></i></div>
                    <h3>Expert Guides</h3>
                    <p>Our local guides are passionate about Brooklyn and will share hidden gems you won&apos;t find in guidebooks.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i className="fas fa-users"></i></div>
                    <h3>Small Groups</h3>
                    <p>Enjoy personalized attention with our small group sizes, ensuring a more intimate experience.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i className="fas fa-camera"></i></div>
                    <h3>Photo Opportunities</h3>
                    <p>We know all the best spots for amazing photos that will make your friends jealous.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
                    <h3>Safety First</h3>
                    <p>Your safety is our priority. All our tours follow the highest safety standards.</p>
                </div>
            </div>
        </section>
      </div>

      {/* NEW Full-Page Booking Overlay */}
      {/* CHANGE #1: Added onClick to the background overlay */}
      <div className={`booking-overlay ${selectedPackage ? 'show' : ''}`} onClick={handleCloseModal}>
        {selectedPackage && (
          // CHANGE #2: Added onClick to stop clicks inside the container from closing it
          <div className="booking-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-booking" onClick={handleCloseModal}>
              <i className="fas fa-times"></i>
            </button>
            
            {/* Left Panel: Tour Summary */}
            <div className="booking-summary-panel">
              <div className="summary-image" style={{ backgroundImage: `url(${getPrimaryImage(selectedPackage)})` }}></div>
              <div className="summary-content">
                <span className="summary-category">{selectedPackage.category}</span>
                <h2>{selectedPackage.title}</h2>
                <p>{selectedPackage.description}</p>
                <div className="summary-details">
                    <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{selectedPackage.duration}</span>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-shoe-prints"></i>
                        <span style={{ color: getDifficultyColor(selectedPackage.difficulty) }}>{selectedPackage.difficulty}</span>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>{selectedPackage.rating} ({selectedPackage.reviews} reviews)</span>
                    </div>
                </div>
                <div className="summary-highlights">
                  <h4>Tour Highlights</h4>
                  <ul>
                    {selectedPackage.highlights.slice(0, 4).map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Panel: Booking Form */}
            <div className="booking-form-panel">
              <div className="form-header">
                <h3>Enter Your Details</h3>
                <p>Complete the form below to book this tour.</p>
              </div>
              <form className="booking-form" onSubmit={handleBookNow}>
                <div className="form-group-section">
                  <h4>Your Details</h4>
                  <div className="form-group">
                    <label htmlFor="name">Full Name <span className="required-asterisk">*</span></label>
                    <input type="text" id="name" name="name" value={bookingForm.name} onChange={handleBookingChange} placeholder="e.g., John Doe" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required-asterisk">*</span></label>
                    <input type="email" id="email" name="email" value={bookingForm.email} onChange={handleBookingChange} placeholder="e.g., john.doe@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number <span className="required-asterisk">*</span></label>
                    <PhoneInput international defaultCountry="US" value={bookingForm.phone} onChange={handlePhoneChange} id="phone" name="phone" placeholder="Enter phone number" required />
                  </div>
                </div>

                <div className="form-group-section">
                  <h4>Tour Preferences</h4>
                  <div className="form-group date-range-field">
                    <label htmlFor="preferred-dates">Preferred Dates <span className="required-asterisk">*</span></label>
                    <button
                      type="button"
                      id="preferred-dates"
                      className={`date-range-trigger ${bookingForm.startDate ? 'has-value' : ''}`}
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
                              value={bookingForm.startDate}
                              onChange={handleBookingChange}
                              min={today}
                              required
                            />
                          </div>
                          <div className="date-input-group">
                            <span>End</span>
                            <input
                              type="date"
                              name="endDate"
                              value={bookingForm.endDate}
                              onChange={handleBookingChange}
                              min={endDateMin}
                            />
                          </div>
                        </div>
                        <div className="date-range-actions">
                          <button type="button" className="date-range-clear" onClick={() => {
                            setBookingForm(prev => ({
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
                  <div className="form-group">
                    <label htmlFor="guests">Number of Guests <span className="required-asterisk">*</span></label>
                    <select id="guests" name="guests" value={bookingForm.guests} onChange={handleBookingChange} required>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', color: '#1f2937', fontSize: '1rem', fontWeight: 600 }}>
                    <i className="fas fa-utensils" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
                    Food & Special Requirements (for all guests)
                  </h4>
                  
                  <div className="form-group">
                    <label htmlFor="foodAndSpecialRequests">
                      Food Preferences, Allergies & Additional Information
                    </label>
                    <textarea 
                      id="foodAndSpecialRequests" 
                      name="foodAndSpecialRequests" 
                      value={bookingForm.foodAndSpecialRequests} 
                      onChange={handleBookingChange} 
                      placeholder="Example: 2 guests are vegetarian, 1 guest is non-vegan, 1 guest has nut allergy, 1 guest has dairy allergy. Please also mention any other special requests or celebrations..." 
                      rows={5}
                    ></textarea>
                    <small style={{ display: 'block', marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      💡 Tip: Mention the count for each requirement (e.g., &quot;2 vegetarian, 1 has shellfish allergy&quot;)
                    </small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Additional Notes</label>
                    <textarea id="message" name="message" value={bookingForm.message} onChange={handleBookingChange} placeholder="Any other information you&apos;d like to share..." rows={3}></textarea>
                  </div>
                </div>

                <div className="booking-summary-section">
                  <div className="booking-summary">
                    <div className="price-summary">
                      <span className="label">Total Price:</span>
                      <span className="price">${selectedPackage.price * bookingForm.guests}</span>
                    </div>
                    <button type="submit" className="confirm-booking-btn">Confirm Booking</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesClient;