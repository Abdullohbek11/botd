import React, { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };
  
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden group relative">
        {/* Image container */}
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Discount badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-[#FF0000] text-white px-2 py-1 rounded-lg text-sm font-medium">
              -{product.discount}%
            </div>
          )}
          {/* Like button */}
          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? 'fill-[#FF0000] text-[#FF0000]' : 'text-gray-400'}`}
            />
          </button>
          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <span className="text-gray-900 font-medium">Mavjud emas</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-3xl font-extrabold text-gray-900 line-clamp-2 mb-1 min-h-[40px]">
            {product.name}
          </h3>
          
          {/* Sharx va yulduzcha olib tashlandi */}
          
          {/* Installment */}
          <div className="bg-[#F4F5F5] rounded-lg p-1.5 mb-2">
            <div className="text-xs text-gray-600">
              {Math.ceil(product.price / 12)} so'm/oyiga
            </div>
          </div>
          
          {/* Price and action */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)} so'm
              </div>
              {/* Asl narxi (originalPrice) olib tashlandi */}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="p-2 bg-[#7000FF] text-white rounded-lg hover:bg-[#6000E0] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>

          {/* Express delivery badge */}
          {product.express && (
            <div className="mt-2 flex items-center">
              <img
                src="/express-badge.svg"
                alt="Express delivery"
                className="h-4 w-4 mr-1"
              />
              <span className="text-xs text-[#FF0000]">Tezkor yetkazib berish</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}