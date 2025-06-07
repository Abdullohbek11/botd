import React from 'react';
import { categories } from '../data/mockData';

interface CategoryGridProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string | null;
}

export function CategoryGrid({ onCategorySelect, selectedCategory }: CategoryGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategoriyalar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-4">
        <button
          onClick={() => onCategorySelect('')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedCategory === null || selectedCategory === ''
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <div className="text-2xl mb-2">🛍️</div>
          <div className="text-sm font-medium text-gray-900">Barchasi</div>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCategory === category.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-500">{category.productCount}</div>
          </button>
        ))}
      </div>
    </div>
  );
}