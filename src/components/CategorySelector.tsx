'use client';

import { useRef, useState, useEffect } from 'react';
import { Category } from '../Types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category;
  onCategorySelect: (category: Category) => void;
}

export default function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategorySelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    checkScroll();
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(checkScroll, 300);
    }
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="category-selector-wrapper">
      {showLeftArrow && (
        <button 
          className="nav-arrow left-arrow"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <div className="arrow-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18L9 12L15 6"/>
            </svg>
          </div>
          <div className="arrow-glow"></div>
        </button>
      )}
      
      <div 
        className="categories-scroll-container"
        ref={scrollContainerRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="categories-track">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${
                selectedCategory.id === category.id ? 'active' : ''
              }`}
              onClick={() => onCategorySelect(category)}
            >
              <div className="card-inner">
                <div className="category-image-container">
                  <div 
                    className="category-image"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="image-overlay"></div>
                  <div className="selection-ring"></div>
                  <div 
                    className="energy-aura"
                    style={{ borderColor: category.color }}
                  ></div>
                </div>
                
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                  <div className="progress-indicator">
                    <div 
                      className="progress-bar"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>
                </div>

                {/* Hover Effect Elements */}
                <div className="hover-sparkles">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="sparkle" style={{ '--i': i } as React.CSSProperties}></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRightArrow && (
        <button 
          className="nav-arrow right-arrow"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <div className="arrow-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6"/>
            </svg>
          </div>
          <div className="arrow-glow"></div>
        </button>
      )}

      <div className="scroll-indicator">
        <div className="indicator-dots">
          {categories.map((_, i) => (
            <div 
              key={i} 
              className={`dot ${Math.floor(i / 3) === Math.floor(categories.findIndex(c => c.id === selectedCategory.id) / 3) ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-selector-wrapper {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .categories-scroll-container {
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 40px 0;
          margin: 0 -20px;
          cursor: grab;
          position: relative;
        }

        .categories-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .categories-scroll-container:active {
          cursor: grabbing;
        }

        .categories-track {
          display: flex;
          gap: 2.5rem;
          padding: 0 20px;
          min-width: min-content;
        }

        .category-card {
          flex: 0 0 220px;
          cursor: pointer;
          position: relative;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-inner {
          position: relative;
          transition: all 0.5s ease;
        }

        .category-card:hover .card-inner {
          transform: translateY(-15px);
        }

        .category-card.active .card-inner {
          transform: translateY(-20px) scale(1.05);
        }

        .category-image-container {
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          backdrop-filter: blur(20px);
        }

        .category-card.active .category-image-container {
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.5),
            0 0 0 3px rgba(255, 255, 255, 0.9),
            0 0 50px var(--category-glow, rgba(255,255,255,0.4));
        }

        .category-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          filter: brightness(0.9) contrast(1.1);
        }

        .category-card:hover .category-image {
          transform: scale(1.2);
          filter: brightness(1.2) contrast(1.2);
        }

        .category-card.active .category-image {
          transform: scale(1.15);
          filter: brightness(1.3) contrast(1.3);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.1) 100%
          );
          transition: all 0.4s ease;
        }

        .category-card.active .image-overlay {
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.05) 100%
          );
        }

        .selection-ring {
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 3px solid transparent;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .category-card.active .selection-ring {
          opacity: 1;
          animation: rotateRing 3s linear infinite;
          border-image: conic-gradient(from 0deg, var(--category-color), transparent, var(--category-color)) 1;
        }

        .energy-aura {
          position: absolute;
          top: -15px;
          left: -15px;
          right: -15px;
          bottom: -15px;
          border: 2px solid;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.6s ease;
          filter: blur(10px);
        }

        .category-card.active .energy-aura {
          opacity: 0.6;
          animation: pulseAura 2s ease-in-out infinite;
        }

        .category-content {
          text-align: center;
          margin-top: 2rem;
          position: relative;
        }

        .category-name {
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
          line-height: 1.3;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .category-card.active .category-name {
          transform: scale(1.1);
          text-shadow: 0 6px 20px rgba(0, 0, 0, 1);
        }

        .progress-indicator {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          width: 0%;
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          overflow: hidden;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        .category-card.active .progress-bar {
          width: 100%;
        }

        .hover-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-card:hover .hover-sparkles {
          opacity: 1;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkleFloat 2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.2s);
          opacity: 0;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 20;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .nav-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .nav-arrow:hover .arrow-glow {
          opacity: 1;
        }

        .arrow-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .arrow-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .left-arrow {
          left: 0;
        }

        .right-arrow {
          right: 0;
        }

        .scroll-indicator {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .indicator-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .dot.active {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.2);
        }

        @keyframes rotateRing {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseAura {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes sparkleFloat {
          0%, 100% {
            opacity: 0;
            transform: translate(calc(var(--i) * 10px - 50px), calc(var(--i) * 5px - 25px)) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(calc(var(--i) * 20px - 100px), calc(var(--i) * 10px - 50px)) scale(1);
          }
        }

        @media (max-width: 768px) {
          .category-selector-wrapper {
            padding: 0 15px;
          }

          .categories-scroll-container {
            margin: 0 -15px;
            padding: 30px 0;
          }

          .categories-track {
            gap: 2rem;
            padding: 0 15px;
          }

          .category-card {
            flex: 0 0 180px;
          }

          .category-image-container {
            width: 180px;
            height: 180px;
          }

          .category-name {
            font-size: 1rem;
          }

          .nav-arrow {
            width: 50px;
            height: 50px;
          }
        }

        @media (max-width: 480px) {
          .category-card {
            flex: 0 0 150px;
          }

          .category-image-container {
            width: 150px;
            height: 150px;
          }

          .category-name {
            font-size: 0.9rem;
          }

          .nav-arrow {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
}