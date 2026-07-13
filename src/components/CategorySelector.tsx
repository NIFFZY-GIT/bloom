'use client';

import { useRef, useEffect } from 'react';
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
  onCategorySelect,
}: CategorySelectorProps) {
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Premium staggered entrance whenever the set of categories changes.
  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 32, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out' }
    );
  }, [categories.length]);

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {categories.map((category, index) => {
        const isActive = selectedCategory.id === category.id;
        return (
          <button
            type="button"
            key={category.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onClick={() => onCategorySelect(category)}
            aria-pressed={isActive}
            className={`group relative aspect-[4/5] overflow-hidden rounded-2xl text-left transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16283b] ${
              isActive
                ? 'ring-2 ring-[#C5A880] shadow-[0_20px_45px_-15px_rgba(197,168,128,0.55)] sm:-translate-y-1'
                : 'ring-1 ring-white/10 hover:ring-white/30 hover:sm:-translate-y-1'
            }`}
          >
            {/* Destination image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url(${category.image})` }}
            />

            {/* Readability gradient */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive
                  ? 'bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/15 to-transparent'
                  : 'bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/25 to-[#0F172A]/5'
              }`}
            />

            {/* Active check badge */}
            {isActive && (
              <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A880] text-[#0F172A] shadow-md sm:h-7 sm:w-7">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            )}

            {/* Label */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <h3
                className={`text-sm font-semibold leading-snug tracking-tight sm:text-base ${
                  isActive ? 'text-[#C5A880]' : 'text-white'
                }`}
              >
                {category.name}
              </h3>
              <span
                className={`mt-2 block h-[3px] rounded-full bg-[#C5A880] transition-all duration-500 ${
                  isActive ? 'w-10 opacity-100' : 'w-0 opacity-0 group-hover:w-6 group-hover:opacity-70'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
