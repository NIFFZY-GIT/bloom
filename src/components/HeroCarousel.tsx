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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="carousel">
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
          <button className="explore-button">Explore Now</button>
        </div>
      </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        .hero {
          height: 100vh;
          position: relative;
          overflow: hidden;
          margin-top: 0;
        }

        .carousel {
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
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
        }

        .hero-content {
          text-align: center;
          color: white;
          z-index: 2;
          width: 90%;
          max-width: 800px;
          padding: 0 2rem;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.025em;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 1s ease-out;
        }

        .hero-subtitle {
          font-size: 1.8rem;
          margin-bottom: 2.5rem;
          font-weight: 300;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .explore-button {
          background: #f59e0b; /* Solid yellow */
          color: white;
          border: none;
          padding: 1.2rem 3rem;
          font-size: 1.2rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease-out 0.4s both;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .explore-button:hover {
          background: #d97706; /* Darker yellow on hover */
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4);
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
        }

        .indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .indicator.active {
          background: #f59e0b; /* Yellow for active indicator */
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }

          .hero-subtitle {
            font-size: 1.4rem;
          }

          .explore-button {
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .explore-button {
            padding: 1rem 2rem;
            font-size: 1.1rem;
          }

          .hero-content {
            padding: 0 1rem;
          }
        }
      `}</style>
    </section>
  );
}