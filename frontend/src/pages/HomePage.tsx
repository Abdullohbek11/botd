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
    const matchesCategory = !selectedCategory || String(product.category_id) === String(selectedCategory);
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

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <Link to={`/product/${product.id}`} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-t-lg"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </Link>
                <button
                  onClick={() =>
                    isInFavorites(product.id)
                      ? removeFromFavorites(product.id)
                      : addToFavorites(product.id)
                  }
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:text-red-500 z-10"
                >
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isInFavorites(product.id) ? 'fill-[#7000FF] text-[#7000FF]' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-8 sm:min-h-10">
                    {product.name}
                  </h3>
                  <div className="mt-1 space-y-1">
                    {/* Sharx va yulduzcha olib tashlandi */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm sm:text-base font-semibold">
                        {formatPrice(product.price)}
                      </span>
                      {/* Asl narxi (originalPrice) olib tashlandi */}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => addItem(product)}
                  className="w-full mt-1 sm:mt-2 bg-gray-100 hover:bg-[#7000FF] hover:text-white text-gray-800 rounded-lg py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-center space-x-1 sm:space-x-2 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">Savatga</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}