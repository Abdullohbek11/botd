import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { formatPrice } from '../utils/formatters';

export function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { products } = useProducts();
  const { addItem } = useCart();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F5F5]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link to="/" className="flex items-center text-gray-600 hover:text-[#7000FF]">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Orqaga
            </Link>
          </div>
          
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sevimlilar ro'yxati bo'sh</h2>
            <p className="text-gray-600 mb-4">Sizga yoqqan mahsulotlarni sevimlilar ro'yxatiga qo'shing</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7000FF] hover:bg-[#6000E0]"
            >
              Xarid qilishni davom ettirish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F5]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-[#7000FF]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Orqaga
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sevimli mahsulotlar</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoriteProducts.map((product) => (
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
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:text-red-500 z-10"
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-[#7000FF] text-[#7000FF]" />
                </button>
              </div>

              <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-xs sm:text-sm font-medium line-clamp-2 min-h-8 sm:min-h-10">{product.name}</h3>
                  <div className="mt-1 space-y-1">
                    {/* Sharx va yulduzcha olib tashlandi */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm sm:text-base font-semibold">{formatPrice(product.price)}</span>
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