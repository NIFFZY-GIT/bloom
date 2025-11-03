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
      
      // Debug logging
      console.log('Selected Category:', selectedCategory);
      console.log('Selected Category ID (type):', typeof selectedCategory.id, selectedCategory.id);
      console.log('All Places:', places);
      console.log('Places categoryId types:', places.map(p => ({ name: p.name, categoryId: p.categoryId, type: typeof p.categoryId })));
      console.log('Filtered Places:', categoryPlaces);
    }
  }, [selectedCategory, places]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
        <div className="text-white text-2xl font-semibold">{error}</div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
        <div className="text-white text-2xl font-semibold">No categories available</div>
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
            <div className="container mx-auto px-4">
              <h1 className="journey-title">What&apos;s your journey?</h1>
              <CategorySelector 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
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
          padding: 4rem 0;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .journey-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 3rem;
          letter-spacing: -0.025em;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .journey-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .journey-title {
            font-size: 2rem;
          }
        }
          
      `}</style>
    </div>
  );
}