"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './GalleryPage.css';

interface GalleryItem {
  id: number;
  category: string;
  imagePath: string;
  title: string;
  description: string;
}

interface Review {
  id: number;
  name: string;
  position: string;
  avatar: string;
  rating: number;
  text: string;
}

const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToGallery = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadGalleryData = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch('/api/gallery', {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setGalleryItems(Array.isArray(data.items) ? data.items : []);
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
          setLoadError(null);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
  console.error('Failed to load gallery data:', error);
  setLoadError('Unable to load tour highlights right now. Please try again later.');
        setGalleryItems([]);
        setReviews([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingData(false);
        }
      }
    };

    loadGalleryData();

    return () => controller.abort();
  }, []);

  const availableFilters = useMemo(() => {
    const categories = new Set<string>();
    galleryItems.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return ['all', ...Array.from(categories).sort((a, b) => a.localeCompare(b))];
  }, [galleryItems]);

  useEffect(() => {
    if (activeFilter !== 'all' && !availableFilters.includes(activeFilter)) {
      setActiveFilter('all');
    }
  }, [activeFilter, availableFilters]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return galleryItems;
    }
    return galleryItems.filter(item => item.category === activeFilter);
  }, [activeFilter, galleryItems]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const formatFilterLabel = (value: string) => {
    if (value === 'all') {
      return 'All Experiences';
    }
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const renderStars = (rating: number) => {
    const safeRating = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0;
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5 && fullStars < 5;
    const totalStars = 5;
    const starGlyph = '\u2605';

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star star-full" aria-hidden="true">
          {starGlyph}
        </span>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star star-half" aria-hidden="true">
          {starGlyph}
        </span>,
      );
    }

    while (stars.length < totalStars) {
      const index = stars.length;
      stars.push(
        <span key={`empty-${index}`} className="star star-empty" aria-hidden="true">
          {starGlyph}
        </span>,
      );
    }

    return (
      <>
        <span className="sr-only">Rated {safeRating.toFixed(1)} out of 5</span>
        {stars}
      </>
    );
  };

  return (
    <div className="gallery-page">
      {/* Full Screen Hero Section */}
      <section className="gallery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Brooklyn Moments</h1>
          <p>Step into the sights, flavours, and stories our guests experience on tour. From street art walks to waterfront sunsets, this gallery celebrates the joy of exploring Brooklyn.</p>
          <button className="cta-button" onClick={handleScrollToGallery}>Plan Your Adventure</button>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </section>

      <div className="container">
        <section className="gallery-section" ref={sectionRef}>
          <div className="section-header">
            <h2>Signature Experiences</h2>
            <p>Browse curated highlights from recent tours and bespoke itineraries that delighted our guests</p>
          </div>

          <div className="gallery-filters">
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

          {isLoadingData ? (
            <div className="gallery-state">Loading experiences&hellip;</div>
          ) : loadError ? (
            <div className="gallery-state gallery-state-error" role="alert">{loadError}</div>
          ) : filteredItems.length > 0 ? (
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`gallery-item fade-in ${isVisible ? 'appear' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-category={item.category}
                >
                  <div className="gallery-image">
                    <img src={item.imagePath} alt={item.title} />
                  </div>
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <button className="view-project-btn">View Experience</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery-state gallery-state-empty">
              <h3>No experiences to show yet</h3>
              <p>We&apos;re busy crafting more adventures. Check back soon for fresh tour highlights.</p>
            </div>
          )}
        </section>

        <section className="reviews-section">
          <div className="section-header">
            <h2>Traveler Stories</h2>
            <p>Hear how fellow explorers felt after spending the day uncovering Brooklyn with our guides</p>
          </div>
          {isLoadingData ? (
            <div className="gallery-state">Gathering traveler stories&hellip;</div>
          ) : loadError ? (
            <div className="gallery-state gallery-state-error" role="status">
              Unable to load traveler stories right now.
            </div>
          ) : reviews.length > 0 ? (
            <div className="reviews-container">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`review-card fade-in ${isVisible ? 'appear' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="review-header">
                    <div className="review-avatar">
                      <img src={review.avatar} alt={review.name} />
                    </div>
                    <div className="review-info">
                      <h3>{review.name}</h3>
                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                      <p>{review.position}</p>
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery-state gallery-state-empty">
              <h3>No traveler stories yet</h3>
              <p>Invite recent guests to share their favourite Brooklyn moments so we can feature them here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GalleryPage;