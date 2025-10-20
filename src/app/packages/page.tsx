// src/app/packages/page.tsx (or wherever your page is located)
import { query } from '@/lib/db';
import PackagesClient from './PackagesClient';

// This interface now includes image_path to match the database column
interface TourPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_path: string; // Updated from imagePath
  category: string;
  highlights: string[];
  includes: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviews: number;
}

// Fetch data on the server side
async function getTourPackages(): Promise<TourPackage[]> {
  const res = await query('SELECT * FROM tour_packages ORDER BY id');
  // Prices are returned as strings from the DB, so we parse them to numbers
  return res.rows.map(pkg => ({
    ...pkg,
    price: parseFloat(pkg.price),
  }));
}

const PackagesPage = async () => {
  const tourPackages = await getTourPackages();

  return <PackagesClient initialTourPackages={tourPackages} />;
};

export default PackagesPage;