'use client';

import { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CategorySelector from '../components/CategorySelector';
import CategoryDetails from '../components/CategoryDetails';
import BackgroundAnimation from '../components/BackgroundAnimation';
import { Category, Place } from '../Types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          setSelectedCategory(data.categories[0]);
        } else {
          setError('No categories found');
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch places on mount
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/admin-places');
        const data = await response.json();
        
        if (data.success) {
          setPlaces(data.places);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch places:', err);
        setError('Failed to load places');
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Filter places when category changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryPlaces = places.filter(
        (place) => Number(place.categoryId) === Number(selectedCategory.id)
      );
      setFilteredPlaces(categoryPlaces);
    }
  }, [selectedCategory, places]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E293B] p-4">
        <div className="text-white text-xl md:text-2xl font-light text-center tracking-wide">Loading paradise…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-950 p-4">
        <div className="text-white text-xl md:text-2xl font-light text-center tracking-wide">{error}</div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="text-white text-xl md:text-2xl font-light text-center tracking-wide">No categories available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <div className="relative z-10">
        <HeroCarousel />
        
        <main>
          <section className="relative overflow-hidden bg-[#0F172A]">
            {/* Per-category animated background (colour + themed motion), contained to this section */}
            <BackgroundAnimation category={selectedCategory} />
            {/* Readability veil so the heading and cards stay crisp over any scene */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-[#0F172A]/75" />
            {/* Hairline to blend from the hero above */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-[#C5A880]/40 to-transparent" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
              <div className="flex flex-col items-center text-center">
                <span className="mb-5 inline-flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[#C5A880]">
                  <span className="h-px w-8 bg-[#C5A880]/50" />
                  Find your escape
                  <span className="h-px w-8 bg-[#C5A880]/50" />
                </span>
                <h2 className="max-w-3xl text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  What&apos;s your <span className="text-[#C5A880]">journey</span>?
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-300/80 sm:text-base">
                  Pick a theme and we&apos;ll curate the destinations, stays and experiences to match the trip you have in mind.
                </p>
              </div>

              <div className="mt-14 sm:mt-16">
                <CategorySelector
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </div>
            </div>
          </section>

          <CategoryDetails
            category={selectedCategory}
            places={filteredPlaces}
          />
        </main>
      </div>
    </div>
  );
}