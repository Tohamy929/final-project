'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Brand } from '@/interfaces/products.interface';

export default function BrandDetailsPage() {
  const { id } = useParams(); // get brand id from URL
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
        if (!response.ok) throw new Error('Failed to fetch brand details');
        const data = await response.json();
        setBrand(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!brand) return <div className="text-center py-12">No brand found</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <Image
              src={brand.image}
              alt={brand.name}
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{brand.name}</h1>
            <p className="text-gray-600 mb-4">{brand.slug}</p>
            {/* Add more brand details here if available */}
          </div>
        </div>
      </div>
    </div>
  );
}