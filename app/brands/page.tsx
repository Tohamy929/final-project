'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/interfaces/products.interface';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data = await response.json();
        setBrands(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Brands</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          { brands.map((brand: Brand) => (
            <Link key={brand._id} href={`/brands/${brand._id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{brand.slug}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}