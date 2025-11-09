import { notFound } from 'next/navigation';

import PackageForm from '@/components/admin/PackageForm';
import { query } from '@/lib/db';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPackagePage({ params }: Params) {
  // Await params in Next.js 15
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const result = await query(
    `SELECT
        tp.id,
        tp.title,
        tp.description,
        tp.price,
        tp.duration,
        tp.image_path,
        tp.category,
        tp.highlights,
        tp.includes,
        tp.difficulty,
        COALESCE(
          (
            SELECT json_agg(tpi.image_path ORDER BY tpi.sort_order, tpi.id)
            FROM tour_package_images tpi
            WHERE tpi.package_id = tp.id
          ),
          '[]'::json
        ) AS gallery_images
     FROM tour_packages tp
     WHERE tp.id = $1`,
    [numericId],
  );

  if (result.rowCount === 0) {
    notFound();
  }

  const pkg = result.rows[0] as {
    title: string;
    description: string;
    price: number;
    duration: number;
    image_path: string | null;
    category: string;
    highlights: string[] | null;
    includes: string[] | null;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
    gallery_images: string[];
  };

  return (
    <PackageForm
      mode="edit"
      packageId={numericId}
      initialData={{
        title: pkg.title,
        description: pkg.description,
        price: Number(pkg.price),
        duration: pkg.duration,
        image_path: pkg.image_path,
        category: pkg.category,
        highlights: pkg.highlights,
        includes: pkg.includes,
        difficulty: pkg.difficulty,
        galleryImages: pkg.gallery_images ?? [],
      }}
    />
  );
}
