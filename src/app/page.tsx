'use client';

import { useState, useEffect } from 'react';

import footer from '../components/ui/footer';
import HeroCarousel from '../components/HeroCarousel';
import CategorySelector from '../components/CategorySelector';
import CategoryDetails from '../components/CategoryDetails';
import BackgroundAnimation from '../components/BackgroundAnimation';
import { Category, Place } from '../Types';

const categories: Category[] = [
  {
    id: 1,
    name: 'Beaches & Coastal',
    image: '/images/categories/beaches.png',
    color: '#1e40af',
    bgColor: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    description: 'Pristine beaches and coastal destinations with golden sands and turquoise waters',
    animation: 'waves'
  },
  {
    id: 2,
    name: 'Rainforests & Natural',
    image: '/images/categories/rainforests.png',
    color: '#059669',
    bgColor: 'linear-gradient(135deg, #059669, #10b981)',
    description: 'Lush rainforests and natural reserves teeming with biodiversity',
    animation: 'forest'
  },
  {
    id: 3,
    name: 'National Parks & Wildlife',
    image: '/images/categories/wildlife.png',
    color: '#92400e',
    bgColor: 'linear-gradient(135deg, #92400e, #b45309)',
    description: 'Wildlife sanctuaries and national parks for incredible animal encounters',
    animation: 'wildlife'
  },
  {
    id: 4,
    name: 'Cultural Heritage',
    image: '/images/categories/cultural.png',
    color: '#7c3aed',
    bgColor: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    description: 'Ancient cities and UNESCO World Heritage sites',
    animation: 'heritage'
  },
  {
    id: 5,
    name: 'Hill Country',
    image: '/images/categories/hill-country.png',
    color: '#0d9488',
    bgColor: 'linear-gradient(135deg, #0d9488, #14b8a6)',
    description: 'Scenic highlands with tea plantations and cool climates',
    animation: 'mountains'
  },
  {
    id: 6,
    name: 'Religious & Spiritual',
    image: '/images/categories/temples.png',
    color: '#dc2626',
    bgColor: 'linear-gradient(135deg, #dc2626, #ef4444)',
    description: 'Sacred temples, churches, and spiritual sites',
    animation: 'spiritual'
  },
  {
    id: 7,
    name: 'Urban & Modern',
    image: '/images/categories/urban.png',
    color: '#4f46e5',
    bgColor: 'linear-gradient(135deg, #4f46e5, #6366f1)',
    description: 'Modern cities with contemporary attractions',
    animation: 'urban'
  },
  {
    id: 8,
    name: 'Waterfalls & Lakes',
    image: '/images/categories/waterfalls.png',
    color: '#0891b2',
    bgColor: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    description: 'Majestic waterfalls and serene lakes',
    animation: 'waterfalls'
  },
  {
    id: 9,
    name: 'Adventure & Eco',
    image: '/images/categories/adventure.png',
    color: '#65a30d',
    bgColor: 'linear-gradient(135deg, #65a30d, #84cc16)',
    description: 'Thrilling adventures and eco-tourism experiences',
    animation: 'adventure'
  },
  {
    id: 10,
    name: 'Village & Cultural',
    image: '/images/categories/village.png',
    color: '#db2777',
    bgColor: 'linear-gradient(135deg, #db2777, #ec4899)',
    description: 'Traditional village life and cultural experiences',
    animation: 'village'
  },
  {
    id: 11,
    name: 'Fortresses & Colonial',
    image: '/images/categories/fortresses.png',
    color: '#d97706',
    bgColor: 'linear-gradient(135deg, #d97706, #f59e0b)',
    description: 'Historic fortresses and colonial architecture',
    animation: 'fortresses'
  }
];

const places: Place[] = [
  // Beaches & Coastal
  {
    id: 1,
    name: 'Mirissa',
    description: 'A beautiful crescent-shaped beach known for whale watching and vibrant beach cafes. Perfect for surfing and sunset views.',
    image: '/images/places/mirissa.png',
    category: 'Beaches & Coastal'
  },
  {
    id: 2,
    name: 'Hikkaduwa',
    description: 'Famous for its coral reefs, surfing spots, and lively nightlife. A paradise for snorkeling and diving enthusiasts.',
    image: '/images/places/hikkaduwa.png',
    category: 'Beaches & Coastal'
  },
    {
    id: 3,
    name: 'Arugam Bay',
    description: 'World-class surfing destination on the east coast',
    image: '/images/places/Arugam.jpg',
    category: 'Beaches & Coastal'
  },
   {
    id: 4,
    name: 'Arugam Bay',
    description: 'World-class surfing destination on the east coast',
    image: '/images/places/Pasikudah.jpg',
    category: 'Beaches & Coastal'
  },
    {
    id: 5,
    name: 'Arugam Bay',
    description: 'World-class surfing destination on the east coast',
    image: '/images/places/Sinharaja.jpg',
    category: 'Rainforests & Natural'
  },
    {
    id: 6,
    name: 'Arugam Bay',
    description: 'World-class surfing destination on the east coast',
    image: '/images/places/Kanneliya.jpg',
    category: 'Rainforests & Natural'
  },
    {
    id: 7,
    name: 'Mirissa',
    description: 'A beautiful crescent-shaped beach known for whale watching and vibrant beach cafes. Perfect for surfing and sunset views.',
    image: '/images/places/mirissa.png',
    category: 'National Parks & Wildlife'
  },
  {
    id: 8,
    name: 'Hikkaduwa',
    description: 'Famous for its coral reefs, surfing spots, and lively nightlife. A paradise for snorkeling and diving enthusiasts.',
    image: '/images/places/hikkaduwa.png',
    category: 'National Parks & Wildlife'
  },
    {
    id: 9,
    name: 'Arugam Bay',
    description: 'World-class surfing destination on the east coast',
    image: '/images/places/Arugam.jpg',
    category: 'National Parks & Wildlife'
  },
   {
    id: 10,
    name: 'Arugam Bay',
    description: 'World-class surfing destination on the east coast',
    image: '/images/places/Pasikudah.jpg',
    category: 'National Parks & Wildlife'
  },
  // ... other places (same as before)
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [bgColor, setBgColor] = useState<string>(categories[0].bgColor);

  useEffect(() => {
    const categoryPlaces = places.filter(place => 
      place.category === selectedCategory.name
    );
    setFilteredPlaces(categoryPlaces);
    setBgColor(selectedCategory.bgColor);
  }, [selectedCategory]);

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