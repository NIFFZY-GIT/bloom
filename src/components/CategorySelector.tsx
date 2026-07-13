'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
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
  const categoryCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    checkScroll();
    
    // Initial animation for category cards
    gsap.fromTo(
      categoryCardsRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
  }, []);

  // Animate when category selection changes
  useEffect(() => {
    categoryCardsRef.current.forEach((card, index) => {
      if (card) {
        if (categories[index]?.id === selectedCategory.id) {
          gsap.to(card, {
            scale: 1.05,
            y: -20,
            duration: 0.5,
            ease: 'power3.out'
          });
        } else {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
          });
        }
      }
    });
  }, [selectedCategory, categories]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
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
    if (isMobile) return; // Disable drag on mobile
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
    if (!isDragging || isMobile) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isMobile) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCategoryClick = (category: Category, index: number) => {
    const card = categoryCardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          onCategorySelect(category);
        }
      });
    } else {
      onCategorySelect(category);
    }
  };

  return (
    <div className="category-selector-wrapper">
      {!isMobile && showLeftArrow && (
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="categories-track">
          {categories.map((category, index) => (
            <div
              key={category.id}
              ref={el => { categoryCardsRef.current[index] = el; }}
              className={`category-card ${
                selectedCategory.id === category.id ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category, index)}
            >
              <div className="card-inner">
                <div className="category-image-container">
                  <div 
                    className="category-image"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="image-overlay"></div>
                  <div className="selection-ring"></div>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isMobile && showRightArrow && (
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
          padding: 0 clamp(0.5rem, 3vw, 2rem);
          width: 100%;
        }

        .categories-scroll-container {
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: clamp(2rem, 6vh, 4rem) 0 clamp(3rem, 8vh, 5rem) 0;
          margin: 0 clamp(-0.5rem, -3vw, -2rem);
          cursor: grab;
          position: relative;
          -webkit-overflow-scrolling: touch;
        }

        .categories-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .categories-scroll-container:active {
          cursor: grabbing;
        }

        .categories-track {
          display: flex;
          gap: clamp(1rem, 3vw, 2.5rem);
          padding: 0 clamp(0.5rem, 3vw, 2rem);
          min-width: min-content;
          justify-content: flex-start;
        }

        .category-card {
          flex: 0 0 clamp(120px, 25vw, 220px);
          cursor: pointer;
          position: relative;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          touch-action: pan-y;
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
          width: clamp(120px, 25vw, 220px);
          height: clamp(120px, 25vw, 220px);
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 
            0 15px 30px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          backdrop-filter: blur(20px);
        }

        .category-card.active .category-image-container {
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 2px rgba(255, 255, 255, 0.9),
            0 0 30px var(--category-glow, rgba(255,255,255,0.4));
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
          inset: -6px;
          border: 2px solid transparent;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.35s ease, border-color 0.35s ease;
        }

        .category-card.active .selection-ring {
          opacity: 1;
          border-color: rgba(255, 255, 255, 0.92);
        }

        .energy-aura {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px solid;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.6s ease;
          filter: blur(8px);
        }

        .category-card.active .energy-aura {
          opacity: 0.6;
          animation: pulseAura 2s ease-in-out infinite;
        }

        .category-content {
          text-align: center;
          margin-top: clamp(1rem, 3vh, 2rem);
          position: relative;
        }

        .category-name {
          color: white;
          font-weight: 700;
          font-size: clamp(0.8rem, 3vw, 1.2rem);
          margin-bottom: clamp(0.5rem, 2vh, 1rem);
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
          line-height: 1.3;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }

        .category-card.active .category-name {
          transform: scale(1.1);
          text-shadow: 0 6px 20px rgba(0, 0, 0, 1);
        }

        .progress-indicator {
          width: 100%;
          height: 3px;
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
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
          animation: sparkleFloat 3s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.3s);
          opacity: 0;
          top: 50%;
          left: 50%;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: clamp(44px, 8vw, 60px);
          height: clamp(44px, 8vw, 60px);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          z-index: 20;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .nav-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
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

        .arrow-icon svg {
          width: clamp(20px, 4vw, 28px);
          height: clamp(20px, 4vw, 28px);
        }

        .left-arrow {
          left: clamp(0.25rem, 2vw, 1rem);
        }

        .right-arrow {
          right: clamp(0.25rem, 2vw, 1rem);
        }

        .scroll-indicator {
          display: flex;
          justify-content: center;
          margin-top: clamp(1rem, 3vh, 2rem);
          padding: 0 1rem;
        }

        .indicator-dots {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 100%;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          flex-shrink: 0;
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
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) translateX(0) scale(0);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(calc(var(--i) * 45deg)) translateX(60px) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(calc(var(--i) * 45deg + 180deg)) translateX(80px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(calc(var(--i) * 45deg + 360deg)) translateX(100px) scale(0);
          }
        }

        /* Small devices (landscape phones, 576px and up) */
        @media (min-width: 576px) {
          .categories-track {
            justify-content: flex-start;
          }
        }

        /* Medium devices (tablets, 768px and up) */
        @media (min-width: 768px) {
          .category-card:hover .card-inner {
            transform: translateY(-15px);
          }

          .category-card.active .card-inner {
            transform: translateY(-20px) scale(1.05);
          }
        }

        /* Large devices (desktops, 992px and up) */
        @media (min-width: 992px) {
          .categories-track {
            gap: 2.5rem;
          }

          .category-card {
            flex: 0 0 220px;
          }

          .category-image-container {
            width: 220px;
            height: 220px;
          }
        }

        /* Extra small devices (phones, less than 576px) */
        @media (max-width: 480px) {
          .categories-scroll-container {
            padding: 1.5rem 0 2.5rem 0;
          }

          .categories-track {
            gap: 0.75rem;
            padding: 0 0.5rem;
          }

          .category-card {
            flex: 0 0 100px;
          }

          .category-image-container {
            width: 100px;
            height: 100px;
            box-shadow: none;
          }

          .category-content {
            margin-top: 0.75rem;
          }

          .category-name {
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

          .progress-indicator {
            height: 2px;
          }

          .selection-ring {
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
          }

          .energy-aura {
            top: -6px;
            left: -6px;
            right: -6px;
            bottom: -6px;
          }
        }

        /* Support for very small screens */
        @media (max-width: 375px) {
          .categories-track {
            gap: 0.6rem;
          }

          .category-card {
            flex: 0 0 90px;
          }

          .category-image-container {
            width: 90px;
            height: 90px;
          }

          .category-name {
            font-size: 0.7rem;
          }
        }

        /* Landscape mode for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .categories-scroll-container {
            padding: 1rem 0 1.5rem 0;
          }

          .category-content {
            margin-top: 0.5rem;
          }

          .category-name {
            font-size: 0.7rem;
          }
        }

        /* High-density displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .category-image {
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
          
          .card-inner,
          .category-image,
          .category-image-container,
          .category-name {
            transition: none;
          }

          .hover-sparkles,
          .energy-aura,
          .selection-ring {
            display: none;
          }
        }

        /* Safe area insets for notched devices */
        @supports(padding: max(0px)) {
          .category-selector-wrapper {
            padding-left: max(0.5rem, env(safe-area-inset-left));
            padding-right: max(0.5rem, env(safe-area-inset-right));
          }

          .categories-scroll-container {
            margin-left: max(-0.5rem, calc(-1 * env(safe-area-inset-left)));
            margin-right: max(-0.5rem, calc(-1 * env(safe-area-inset-right)));
          }
        }
      `}</style>
    </div>
  );
}