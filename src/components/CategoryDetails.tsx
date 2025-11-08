'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Category, Place } from '../Types';
import PlaceCard from './PlaceCard';

interface CategoryDetailsProps {
  category: Category;
  places: Place[];
}

export default function CategoryDetails({ category, places }: CategoryDetailsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const placesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate header on category change
    if (headerRef.current && badgeRef.current && infoRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        badgeRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      ).fromTo(
        infoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      );
    }
  }, [category]);

  useEffect(() => {
    // Animate places grid when places change
    if (placesGridRef.current) {
      const placeCards = placesGridRef.current.children;
      gsap.fromTo(
        placeCards,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [places]);

  return (
    <section className="category-details">
      <div className="container">
        <div className="category-header" ref={headerRef}>
          <div className="category-badge" ref={badgeRef}>
            <div 
              className="badge-icon"
              style={{ backgroundColor: category.color }}
            >
              <div 
                className="badge-image"
                style={{ backgroundImage: `url(${category.image})` }}
              />
            </div>
          </div>
          <div className="category-info" ref={infoRef}>
            <h2 className="category-title">{category.name}</h2>
            <p className="category-description">{category.description}</p>
          </div>
        </div>

        {places.length > 0 ? (
          <div className="places-section">
            <h3 className="places-title">Featured Destinations</h3>
            <div className="places-grid" ref={placesGridRef}>
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        ) : (
          <div className="no-places">
            <div className="no-places-content">
              <div className="no-places-icon">🌴</div>
              <h3 className="no-places-title">Coming Soon</h3>
              <p className="no-places-text">
                We&apos;re adding more amazing places for {category.name}. 
                Check back soon for new destinations!
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .category-details {
          padding: 2rem 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          min-height: 60vh;
          width: 100%;
          overflow-x: hidden;
        }

        .container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .category-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          width: 100%;
          text-align: center;
        }

        .category-badge {
          flex-shrink: 0;
        }

        .badge-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          margin: 0 auto;
        }

        .badge-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }

        .badge-icon:hover .badge-image {
          transform: scale(1.05);
        }

        .category-info {
          width: 100%;
          max-width: 100%;
        }

        .category-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .category-description {
          font-size: 1.1rem;
          color: #6b7280;
          line-height: 1.6;
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .places-section {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }

        .places-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .places-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
        }

        .no-places {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 250px;
          width: 100%;
          padding: 1rem;
        }

        .no-places-content {
          text-align: center;
          max-width: 100%;
          width: 100%;
          padding: 0 1rem;
        }

        .no-places-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-places-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .no-places-text {
          color: #6b7280;
          line-height: 1.6;
          font-size: 1rem;
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Small devices (landscape phones, 576px and up) */
        @media (min-width: 576px) {
          .category-details {
            padding: 2.5rem 0;
          }

          .container {
            padding: 0 1.5rem;
          }

          .category-title {
            font-size: 2.25rem;
          }

          .places-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .badge-icon {
            width: 90px;
            height: 90px;
          }

          .places-title {
            font-size: 1.875rem;
          }
        }

        /* Medium devices (tablets, 768px and up) */
        @media (min-width: 768px) {
          .category-details {
            padding: 3rem 0;
          }

          .category-header {
            flex-direction: row;
            text-align: left;
            gap: 2rem;
            margin-bottom: 3rem;
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
          }

          .category-info {
            flex: 1;
          }

          .category-title {
            font-size: 2.5rem;
          }

          .category-description {
            font-size: 1.2rem;
          }

          .places-title {
            font-size: 2rem;
            margin-bottom: 2rem;
          }

          .places-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }

          .badge-icon {
            width: 100px;
            height: 100px;
            margin: 0;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }

          .no-places {
            min-height: 300px;
          }

          .no-places-icon {
            font-size: 4rem;
          }

          .no-places-title {
            font-size: 1.5rem;
          }
        }

        /* Large devices (desktops, 992px and up) */
        @media (min-width: 992px) {
          .category-details {
            padding: 4rem 0;
          }

          .container {
            max-width: 1200px;
            padding: 0 2rem;
          }

          .places-section {
            max-width: 1200px;
          }

          .places-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }

          .category-title {
            font-size: 3rem;
          }

          .category-header {
            max-width: 1000px;
          }
        }

        /* Extra large devices (large desktops, 1200px and up) */
        @media (min-width: 1200px) {
          .places-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2.5rem;
          }

          .container {
            max-width: 1320px;
          }
        }

        /* Extra small devices (phones, less than 576px) */
        @media (max-width: 375px) {
          .category-details {
            padding: 1.5rem 0;
          }

          .container {
            padding: 0 0.75rem;
          }

          .category-title {
            font-size: 1.75rem;
          }

          .category-description {
            font-size: 1rem;
          }

          .places-title {
            font-size: 1.5rem;
          }

          .badge-icon {
            width: 70px;
            height: 70px;
          }

          .no-places-icon {
            font-size: 2.5rem;
          }

          .no-places-title {
            font-size: 1.25rem;
          }

          .places-grid {
            gap: 1.25rem;
          }
        }

        /* Support for very small screens */
        @media (max-width: 320px) {
          .container {
            padding: 0 0.5rem;
          }

          .category-title {
            font-size: 1.5rem;
          }

          .places-grid {
            gap: 1rem;
          }

          .badge-icon {
            width: 60px;
            height: 60px;
          }

          .category-header {
            gap: 1.25rem;
            margin-bottom: 2rem;
          }
        }

        /* Prevent horizontal scrolling on all devices */
        .category-details {
          max-width: 100vw;
          overflow-x: hidden;
        }

        /* High-density displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .badge-image {
            background-size: cover;
            image-rendering: -webkit-optimize-contrast;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .category-details * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .badge-image {
            transition: none;
          }
        }

        /* Landscape mode for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .category-details {
            padding: 1.5rem 0;
          }

          .category-header {
            margin-bottom: 2rem;
          }

          .no-places {
            min-height: 200px;
          }
        }

        /* Safe area insets for notched devices */
        @supports(padding: max(0px)) {
          .container {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }
        }
      `}</style>
    </section>
  );
}