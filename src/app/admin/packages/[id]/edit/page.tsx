import { notFound } from 'next/navigation';

import PackageForm from '@/components/admin/PackageForm';
import { query } from '@/lib/db';

type Params = {
  params: {
    id: string;
  };
};

export default async function EditPackagePage({ params }: Params) {
  const numericId = Number(params.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const result = await query(
    `SELECT id, title, description, price, duration, image_path, category, highlights, includes, difficulty
     FROM tour_packages
     WHERE id = $1`,
    [numericId],
  );

  if (result.rowCount === 0) {
    notFound();
  }

  const pkg = result.rows[0] as {
    title: string;
    description: string;
    price: number;
    duration: string;
    image_path: string | null;
    category: string;
    highlights: string[] | null;
    includes: string[] | null;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
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
      }}
    />
  );
}
