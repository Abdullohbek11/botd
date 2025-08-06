import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products } = useProducts();
  const { categories } = useCategories();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const { addItem } = useCart();
  const [scrollPosition, setScrollPosition] = useState(0);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    // category_id va selectedCategory har doim string bo'lishi uchun
    const productCategoryId = String(product.category_id);
    const selectedCat = selectedCategory ? String(selectedCategory) : null;
    const matchesCategory = !selectedCat || productCategoryId === selectedCat;
    return matchesSearch && matchesCategory;
  });

  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('categories-container');
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F5]">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={() => scrollCategories('left')}
              className="p-1 rounded-full bg-white shadow-md hover:bg-gray-50 text-gray-600"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          
          <div 
            id="categories-container"
            className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide px-8"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* 'Hammasi' kategoriyasi */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-1 rounded-2xl border-2 transition-all ${
                !selectedCategory
                  ? 'bg-[#7000FF] border-[#7000FF] text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:text-[#7000FF]'
              }`}
              style={{ width: '100px' }}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mt-2 mb-2 ${
                !selectedCategory ? 'bg-white' : 'bg-gray-200'
              }`}>
                <span className={`text-2xl ${!selectedCategory ? 'text-[#7000FF]' : 'text-gray-700'}`}>🛍️</span>
              </div>
              <span className="text-sm font-semibold mt-1">Hammasi</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-1 rounded-2xl border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#7000FF] border-[#7000FF] text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:text-[#7000FF]'
                }`}
                style={{ width: '100px' }}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mt-2 mb-2 ${
                  selectedCategory === category.id ? 'bg-white' : 'bg-gray-200'
                }`}>
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded-full" />
                  ) : (
                    <span className={`text-2xl ${selectedCategory === category.id ? 'text-[#7000FF]' : 'text-gray-700'}`}>{category.icon}</span>
                  )}
                </div>
                <span className="text-sm font-semibold mt-1 text-center w-full truncate">{category.name}</span>
              </button>
            ))}
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={() => scrollCategories('right')}
              className="p-1 rounded-full bg-white shadow-md hover:bg-gray-50 text-gray-600"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/product/${product.id}`}>
                <div className="relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-t-lg" />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">📦</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isInFavorites(product.id)) {
                        removeFromFavorites(product.id);
                      } else {
                        addToFavorites(product);
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        isInFavorites(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[#7000FF] font-bold text-sm">
                    {formatPrice(product.price)} so'm
                  </p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  onClick={() => addItem(product)}
                  className="w-full bg-[#7000FF] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#6000E0] transition-colors flex items-center justify-center space-x-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Savatga</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Mahsulot topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
}