import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { formatPrice } from '../utils/formatters';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const { addItem } = useCart();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F5F5]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mahsulot topilmadi</h2>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7000FF] hover:bg-[#6000E0]"
            >
              Bosh sahifaga qaytish
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

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:flex-shrink-0 relative">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full md:h-full md:w-96 object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 md:p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Sharx va yulduzcha olib tashlandi */}

                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {/* Asl narxi (originalPrice) olib tashlandi */}
                </div>

                <div className="prose prose-sm text-gray-600 mb-6">{product.description}</div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    isInFavorites(product.id)
                      ? removeFromFavorites(product.id)
                      : addToFavorites(product.id)
                  }
                  className={`flex items-center justify-center px-6 py-3 rounded-lg border ${
                    isInFavorites(product.id)
                      ? 'border-[#7000FF] text-[#7000FF] bg-[#7000FF]/10'
                      : 'border-gray-300 text-gray-700 hover:border-[#7000FF] hover:text-[#7000FF]'
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 mr-2 ${isInFavorites(product.id) ? 'fill-[#7000FF]' : ''}`}
                  />
                  {isInFavorites(product.id) ? 'Sevimlilarda' : 'Sevimlilarga'}
                </button>

                <button
                  onClick={() => addItem(product)}
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#7000FF] hover:bg-[#6000E0]"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Savatga qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}