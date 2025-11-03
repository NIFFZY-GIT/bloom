// src/app/packages/page.tsx (or wherever your page is located)
import { query } from '@/lib/db';
import PackagesClient from './PackagesClient';

interface GalleryImage {
  id: number;
  image_path: string;
  alt_text: string | null;
  sort_order: number;
}

interface TourPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_path: string | null;
  category: string;
  highlights: string[];
  includes: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviews: number;
  gallery_images: GalleryImage[];
}

const LIST_PACKAGES_WITH_GALLERY_SQL = `
  SELECT
    tp.*,
    COALESCE(
      (
        SELECT json_agg(
                 json_build_object(
                   'id', tpi.id,
                   'image_path', tpi.image_path,
                   'alt_text', tpi.alt_text,
                   'sort_order', tpi.sort_order
                 )
                 ORDER BY tpi.sort_order, tpi.id
               )
        FROM tour_package_images tpi
        WHERE tpi.package_id = tp.id
      ),
      '[]'::json
    ) AS gallery_images
  FROM tour_packages tp
  ORDER BY tp.id DESC
`;

// Fetch data on the server side
async function getTourPackages(): Promise<TourPackage[]> {
  const res = await query(LIST_PACKAGES_WITH_GALLERY_SQL);

  return res.rows.map((pkg): TourPackage => {
    const galleryRaw = Array.isArray(pkg.gallery_images) ? pkg.gallery_images : [];
    const gallery: GalleryImage[] = galleryRaw.map((img: Record<string, unknown>) => ({
      id: typeof img.id === 'number' ? img.id : 0,
      image_path: typeof img.image_path === 'string' ? img.image_path : '',
      alt_text: typeof img.alt_text === 'string' ? img.alt_text : null,
      sort_order: typeof img.sort_order === 'number' ? img.sort_order : 0,
    }));

    const numericPrice = typeof pkg.price === 'number' ? pkg.price : Number.parseFloat(pkg.price);
    const numericRating = typeof pkg.rating === 'number' ? pkg.rating : Number.parseFloat(pkg.rating ?? '0');
    const numericReviews = typeof pkg.reviews === 'number'
      ? pkg.reviews
      : Number.parseInt(pkg.reviews ?? '0', 10) || 0;

    return {
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      price: Number.isFinite(numericPrice) ? numericPrice : 0,
      duration: typeof pkg.duration === 'string' ? pkg.duration : String(pkg.duration ?? ''),
      image_path: pkg.image_path ?? gallery[0]?.image_path ?? null,
      category: pkg.category,
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
      includes: Array.isArray(pkg.includes) ? pkg.includes : [],
      difficulty: pkg.difficulty,
      rating: Number.isFinite(numericRating) ? numericRating : 0,
      reviews: numericReviews,
      gallery_images: gallery,
    };
  });
}

const PackagesPage = async () => {
  const tourPackages = await getTourPackages();

  return <PackagesClient initialTourPackages={tourPackages} />;
};

export default PackagesPage;