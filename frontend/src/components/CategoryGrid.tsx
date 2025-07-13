import React from 'react';
import { categories } from '../data/mockData';

interface CategoryGridProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string | null;
}

export function CategoryGrid({ onCategorySelect, selectedCategory }: CategoryGridProps) {
  return (
    <div className="bg-white rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Kategoriyalar</h2>
        <button className="text-[#7000FF] text-sm hover:underline">
          Barchasini ko'rish
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        <button
          onClick={() => onCategorySelect('')}
          className={`flex flex-col items-center p-4 rounded-xl transition-all ${
            selectedCategory === null || selectedCategory === ''
              ? 'bg-[#F4F5F5]'
              : 'hover:bg-[#F4F5F5]'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7000FF] to-[#9F3FFF] flex items-center justify-center mb-3">
            <span className="text-2xl text-white">🛍️</span>
          </div>
          <div className="text-sm font-medium text-gray-900 text-center">Barchasi</div>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex flex-col items-center p-4 rounded-xl transition-all ${
              selectedCategory === category.id
                ? 'bg-[#F4F5F5]'
                : 'hover:bg-[#F4F5F5]'
            }`}
          >
            <div 
              className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#7000FF] to-[#9F3FFF] flex items-center justify-center mb-2 ${
                selectedCategory === category.id ? 'ring-4 ring-[#7000FF] ring-opacity-20' : ''
              }`}
            >
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded-full" />
              ) : (
                <span className="text-2xl text-white">{category.icon}</span>
              )}
            </div>
            <div className="text-xs font-medium text-gray-900 text-center line-clamp-2 min-h-[32px]">
              {category.name}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {category.productCount} ta mahsulot
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}