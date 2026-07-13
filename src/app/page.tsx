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
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation category={selectedCategory} />
      
      <div className="relative z-10">
        <HeroCarousel />
        
        <main>
          <section className="journey-section">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="journey-eyebrow">Find your escape</span>
                <h1 className="journey-title text-center">What&apos;s your journey?</h1>
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

      <style jsx global>{`
        /* Default Mobile view styles (up to 767px) */
        .journey-section {
          padding: 6rem 0; /* Expanded padding for clean layout space */
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 75vh; /* Dramatically increased from 40vh for greater mobile height */
        }

        .journey-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C5A880;
          margin-bottom: 1.25rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .journey-title {
          font-size: 2rem;
          font-weight: 300;
          color: white;
          margin-bottom: 2.5rem;
          letter-spacing: -0.01em;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
          width: 100%;
          text-align: center;
        }

        /* Strict small footprint overrides */
        @media (max-width: 375px) {
          .journey-section {
            padding: 5rem 0;
            min-height: 70vh;
          }
          .journey-title {
            font-size: 1.75rem;
          }
        }

        /* Tablet styles */
        @media (min-width: 768px) {
          .journey-section {
            padding: 4rem 0;
            min-height: 50vh;
          }

          .journey-title {
            font-size: 3rem;
            margin-bottom: 2.5rem;
          }
        }

        /* Desktop styles */
        @media (min-width: 1024px) {
          .journey-section {
            padding: 5rem 0;
            min-height: 60vh;
          }

          .journey-title {
            font-size: 3.5rem;
            margin-bottom: 3rem;
          }
        }

        /* Large desktop styles */
        @media (min-width: 1280px) {
          .journey-title {
            font-size: 4rem;
          }
        }
      `}</style>
    </div>
  );
}