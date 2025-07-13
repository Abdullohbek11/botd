import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
}

export function ProductGrid({ products, loading, title }: ProductGridProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button className="text-[#7000FF] text-sm hover:underline">
              Barchasini ko'rish
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <div className="text-gray-900 text-lg font-medium mb-2">Mahsulot topilmadi</div>
        <div className="text-gray-500 text-center max-w-md">
          Boshqa kategoriyani tanlang yoki qidiruv so'rovini o'zgartiring
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl p-4">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button className="text-[#7000FF] text-sm hover:underline">
            Barchasini ko'rish
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}