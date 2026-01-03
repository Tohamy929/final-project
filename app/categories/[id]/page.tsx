'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Category } from '@/interfaces/products.interface';

export default function CategoryDetailsPage() {
  const { id } = useParams(); // get category id from URL
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`);
        if (!response.ok) throw new Error('Failed to fetch category details');
        const data = await response.json();
        setCategory(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!category) return <div className="text-center py-12">No category found</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <Image
              src={category.image}
              alt={category.name}
              width={300}
              height={300}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            <p className="text-gray-600 mb-4">{category.slug}</p>
            {/* Add more category details here if available */}
          </div>
        </div>
      </div>
    </div>
  );
}