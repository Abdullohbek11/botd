import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';
import { products } from '../data/mockData';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryGrid 
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? 'Tanlangan kategoriya' : 'Barcha mahsulotlar'}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} ta mahsulot topildi
          </p>
        </div>
        
        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
}