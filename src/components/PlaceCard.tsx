'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { Place } from '../Types';

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: 4,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  const handleClick = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  };

  const handleTouchStart = () => {
    // Add touch feedback
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.98,
        duration: 0.1,
        ease: 'power2.out'
      });
    }
  };

  const handleTouchEnd = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.1,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div 
      className="place-card" 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="card-image-container">
        <div 
          className="card-image"
          ref={imageRef}
          style={{ backgroundImage: `url(${place.image})` }}
          aria-label={`Image of ${place.name}`}
        />
        <div className="card-overlay" />
        <div className="card-content">
          <h3 className="place-name">{place.name}</h3>
          <p className="place-description">{place.description}</p>
          <div className="card-footer">
            <button
              className="explore-button"
              ref={buttonRef}
              aria-label={`Explore ${place.name}`}
            >
              <span>Explore</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .place-card {
          background: white;
          border-radius: clamp(16px, 4vw, 24px);
          overflow: hidden;
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          width: 100%;
          max-width: 550px;
          margin: 0 auto;
          outline: none;
        }

        .place-card:focus-visible {
          outline: 3px solid #f59e0b;
          outline-offset: 2px;
        }

        .place-card:hover {
          transform: translateY(-12px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .card-image-container {
          position: relative;
          height: clamp(200px, 50vw, 280px);
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform 0.6s ease;
          will-change: transform;
        }

        .place-card:hover .card-image {
          transform: scale(1.1);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 30%,
            rgba(0, 0, 0, 0.8) 100%
          );
          opacity: 0.8;
        }

        .card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(1rem, 4vw, 2rem);
          color: white;
          transform: translateY(0);
          transition: transform 0.4s ease;
        }

        .place-card:hover .card-content {
          transform: translateY(-8px);
        }

        .place-name {
          font-size: clamp(1.25rem, 4vw, 1.5rem);
          font-weight: 700;
          margin-bottom: clamp(0.5rem, 2vw, 0.75rem);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .place-description {
          font-size: clamp(0.8rem, 3vw, 0.95rem);
          line-height: 1.5;
          margin-bottom: clamp(1rem, 3vw, 1.5rem);
          opacity: 0.9;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .price-tag {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-align: center;
          min-width: 80px;
        }

        .price-amount {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .price-label {
          display: block;
          font-size: 0.7rem;
          opacity: 0.8;
          line-height: 1.2;
        }

        .explore-button {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: clamp(0.8rem, 3vw, 0.9rem);
          min-height: 44px;
          flex-shrink: 0;
        }

        .explore-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateX(4px);
        }

        /* Small devices (landscape phones, 576px and up) */
        @media (min-width: 576px) {
          .card-image-container {
            height: 240px;
          }

          .card-content {
            padding: 1.5rem;
          }
        }

        /* Medium devices (tablets, 768px and up) */
        @media (min-width: 768px) {
          .card-image-container {
            height: 260px;
          }

          .place-card:hover .card-content {
            transform: translateY(-8px);
          }
        }

        /* Large devices (desktops, 992px and up) */
        @media (min-width: 992px) {
          .card-image-container {
            height: 280px;
          }

          .card-content {
            padding: 2rem;
          }
        }

        /* Extra small devices (phones, less than 576px) */
        @media (max-width: 480px) {
          .place-card {
            border-radius: 16px;
          }

          .card-image-container {
            height: 180px;
          }

          .card-content {
            padding: 1rem;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .price-tag {
            align-self: flex-start;
            min-width: 70px;
          }

          .explore-button {
            width: 100%;
            justify-content: center;
          }

          .place-name {
            font-size: 1.1rem;
          }

          .place-description {
            font-size: 0.75rem;
            margin-bottom: 1rem;
            -webkit-line-clamp: 2;
          }
        }

        /* Support for very small screens */
        @media (max-width: 375px) {
          .card-image-container {
            height: 160px;
          }

          .card-content {
            padding: 0.875rem;
          }

          .place-name {
            font-size: 1rem;
            margin-bottom: 0.4rem;
          }

          .place-description {
            font-size: 0.7rem;
            margin-bottom: 0.75rem;
            -webkit-line-clamp: 2;
          }

          .price-tag {
            padding: 0.4rem 0.6rem;
            min-width: 60px;
          }

          .price-amount {
            font-size: 0.9rem;
          }

          .price-label {
            font-size: 0.6rem;
          }

          .explore-button {
            padding: 0.5rem 1rem;
            min-height: 40px;
            font-size: 0.8rem;
          }
        }

        /* Landscape mode for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .card-image-container {
            height: 200px;
          }

          .card-content {
            padding: 1rem;
          }

          .place-description {
            -webkit-line-clamp: 2;
            margin-bottom: 1rem;
          }
        }

        /* High-density displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .card-image {
            image-rendering: -webkit-optimize-contrast;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .place-card,
          .card-image,
          .card-content,
          .explore-button {
            transition: none;
          }

          .place-card:hover {
            transform: none;
          }

          .place-card:hover .card-image {
            transform: none;
          }

          .place-card:hover .card-content {
            transform: none;
          }

          .explore-button:hover {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .place-card {
            background: #1f2937;
          }

          .card-overlay {
            background: linear-gradient(
              to bottom,
              transparent 0%,
              rgba(0, 0, 0, 0.2) 30%,
              rgba(0, 0, 0, 0.9) 100%
            );
          }
        }

        /* Safe area insets for notched devices */
        @supports(padding: max(0px)) {
          .card-content {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }

        /* Print styles */
        @media print {
          .place-card {
            break-inside: avoid;
            box-shadow: none;
            border: 1px solid #ccc;
          }

          .card-overlay {
            background: linear-gradient(
              to bottom,
              transparent 0%,
              rgba(0, 0, 0, 0.3) 100%
            );
          }

          .explore-button {
            display: none;
          }
        }

        /* Focus styles for keyboard navigation */
        .place-card:focus {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .place-card:hover {
            transform: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          }

          .place-card:hover .card-content {
            transform: none;
          }

          .place-card:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}