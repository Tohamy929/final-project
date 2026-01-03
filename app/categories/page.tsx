'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/interfaces/products.interface';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category._id} href={`/categories/${category._id}`}>
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <Image
                src={category.image}
                alt={category.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.slug}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}