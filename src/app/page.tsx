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
      // Convert both to numbers to ensure proper comparison
      const categoryPlaces = places.filter(
        (place) => Number(place.categoryId) === Number(selectedCategory.id)
      );
      setFilteredPlaces(categoryPlaces);
    }
  }, [selectedCategory, places]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-amber-500 to-amber-600 p-4">
        <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        <div className="text-white text-xl md:text-2xl font-semibold text-center">Loading paradise…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 p-4">
        <div className="text-white text-xl md:text-2xl font-semibold text-center">{error}</div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 p-4">
        <div className="text-white text-xl md:text-2xl font-semibold text-center">No categories available</div>
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
                <h2 className="journey-title text-center">What&apos;s your journey?</h2>
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
        .journey-section {
          padding: 2rem 0;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
        }

        .journey-eyebrow {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #e9d8a6;
          margin-bottom: 1rem;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }

        .journey-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
          line-height: 1.15;
          width: 100%;
          text-align: center;
        }

        /* Tablet styles */
        @media (min-width: 768px) {
          .journey-section {
            padding: 3rem 0;
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
            padding: 4rem 0;
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

        /* Extra small devices */
        @media (max-width: 375px) {
          .journey-title {
            font-size: 1.75rem;
            margin-bottom: 1.5rem;
          }
          
          .journey-section {
            padding: 1.5rem 0;
            min-height: 35vh;
          }
        }
      `}</style>
    </div>
  );
}