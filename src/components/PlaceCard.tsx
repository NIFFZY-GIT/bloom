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

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: 4,
        duration: 0.3,
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

  return (
    <div 
      className="place-card" 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="card-image-container">
        <div 
          className="card-image"
          style={{ backgroundImage: `url(${place.image})` }}
        />
        <div className="card-overlay" />
        <div className="card-content">
          <h3 className="place-name">{place.name}</h3>
          <p className="place-description">{place.description}</p>
          <button className="explore-button" ref={buttonRef}>
            <span>Explore</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .place-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          width: 100%;
          max-width: 550px;
        }

        .place-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform 0.6s ease;
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
          padding: 2rem;
          color: white;
          transform: translateY(0);
          transition: transform 0.4s ease;
        }

        .place-card:hover .card-content {
          transform: translateY(-8px);
        }

        .place-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .place-description {
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .explore-button {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .explore-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .card-image-container {
            height: 240px;
          }

          .card-content {
            padding: 1.5rem;
          }

          .place-name {
            font-size: 1.3rem;
          }

          .place-description {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}