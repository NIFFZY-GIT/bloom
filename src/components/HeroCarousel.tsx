'use client';

import { useState, useEffect } from 'react';

const images = [
  '/images/hero1.png',
  '/images/hero2.jpeg', 
  '/images/hero3.jpg',
  '/images/hero4.png',
  '/images/hero5.png'
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left - next slide
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <section className="hero">
      <div 
        className="carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>
      
      {/* Hero Content */}
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Discover Sri Lanka</h1>
          <p className="hero-subtitle">Experience the pearl of the Indian Ocean</p>
          <button className="explore-button">
            Explore Now
            <svg 
              className="button-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {!isMobile && (
        <>
          <button 
            className="carousel-arrow carousel-arrow--prev"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)}
            aria-label="Previous slide"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="carousel-arrow carousel-arrow--next"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % images.length)}
            aria-label="Next slide"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .hero {
          height: 100vh;
          position: relative;
          overflow: hidden;
          margin-top: 0;
          max-height: 100vh;
        }

        .carousel {
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          touch-action: pan-y;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          will-change: opacity;
        }

        .slide.active {
          opacity: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 100%
          );
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .hero-content {
          text-align: center;
          color: white;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          padding: 0 1rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 1s ease-out;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 4vw, 1.8rem);
          margin-bottom: 2rem;
          font-weight: 300;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 1s ease-out 0.2s both;
          line-height: 1.4;
          max-width: 90%;
          margin-left: auto;
          margin-right: auto;
        }

        .explore-button {
          background: #f59e0b;
          color: white;
          border: none;
          padding: clamp(0.875rem, 3vw, 1.2rem) clamp(2rem, 6vw, 3rem);
          font-size: clamp(1rem, 3vw, 1.2rem);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease-out 0.4s both;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 54px;
        }

        .explore-button:hover {
          background: #d97706;
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4);
        }

        .button-icon {
          width: 1.25em;
          height: 1.25em;
          transition: transform 0.3s ease;
        }

        .explore-button:hover .button-icon {
          transform: translateX(3px);
        }

        /* Carousel Navigation Arrows */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
          backdrop-filter: blur(10px);
          color: white;
        }

        .carousel-arrow:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-arrow--prev {
          left: 2rem;
        }

        .carousel-arrow--next {
          right: 2rem;
        }

        .carousel-arrow svg {
          width: 24px;
          height: 24px;
        }

        /* Carousel Indicators */
        .carousel-indicators {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.75rem;
          z-index: 3;
          padding: 0.5rem;
        }

        .indicator {
          width: clamp(10px, 3vw, 14px);
          height: clamp(10px, 3vw, 14px);
          border-radius: 50%;
          border: 2px solid white;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          min-width: 12px;
          min-height: 12px;
        }

        .indicator.active {
          background: #f59e0b;
          border-color: #f59e0b;
          transform: scale(1.3);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Enhanced Responsive Design */
        @media (max-width: 1200px) {
          .hero-content {
            max-width: 900px;
          }
        }

        @media (max-width: 992px) {
          .carousel-arrow--prev {
            left: 1rem;
          }

          .carousel-arrow--next {
            right: 1rem;
          }

          .carousel-arrow {
            width: 45px;
            height: 45px;
          }
        }

        @media (max-width: 768px) {
          .hero {
            height: 80vh;
            min-height: 500px;
          }

          .hero-overlay {
            padding: 2rem 1rem;
          }

          .hero-content {
            padding: 0 0.5rem;
          }

          .hero-subtitle {
            max-width: 100%;
          }

          .carousel-arrow {
            display: none;
          }

          .carousel-indicators {
            bottom: 1.5rem;
            gap: 0.5rem;
          }

          .explore-button {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .hero {
            height: 75vh;
            min-height: 450px;
          }

          .hero-title {
            margin-bottom: 0.75rem;
          }

          .hero-subtitle {
            margin-bottom: 1.5rem;
          }

          .carousel-indicators {
            bottom: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            height: 70vh;
            min-height: 400px;
          }

          .hero-overlay {
            padding: 1.5rem 1rem;
          }

          .hero-content {
            padding: 0 0.25rem;
          }

          .explore-button {
            min-height: 50px;
            padding: 0.875rem 2rem;
          }

          .carousel-indicators {
            gap: 0.4rem;
            padding: 0.25rem;
          }
        }

        @media (max-width: 375px) {
          .hero {
            height: 65vh;
            min-height: 350px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .explore-button {
            font-size: 0.9rem;
            padding: 0.75rem 1.5rem;
          }
        }

        @media (max-width: 320px) {
          .hero {
            height: 60vh;
            min-height: 300px;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .explore-button {
            min-height: 45px;
            padding: 0.75rem 1.25rem;
          }

          .carousel-indicators {
            bottom: 0.75rem;
          }
        }

        /* Landscape mode for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .hero {
            height: 100vh;
            min-height: auto;
          }

          .hero-content {
            transform: scale(0.9);
          }

          .hero-title {
            margin-bottom: 0.5rem;
          }

          .hero-subtitle {
            margin-bottom: 1rem;
          }

          .carousel-indicators {
            bottom: 1rem;
          }
        }

        /* High-density displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .slide {
            image-rendering: -webkit-optimize-contrast;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .slide {
            transition: opacity 0.5s ease;
          }

          .explore-button:hover {
            transform: none;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        }

        /* Safe area insets for notched devices */
        @supports(padding: max(0px)) {
          .hero-overlay {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </section>
  );
}