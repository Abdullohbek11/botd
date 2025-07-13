import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Home } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const { favorites } = useFavorites();
  const { items } = useCart();
  const { isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  // Telegram mini-app ichida ekanligini aniqlash
  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+998979960020');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="bg-white border-b">
      {/* Top Bar */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs sm:text-sm">
            <div className="flex items-center space-x-4">
              <a href="https://maps.app.goo.gl/yQwDZz4kunsGgGhy6?g_st=ipc" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#7000FF]">
                <span>Joylashuv</span>
              </a>
              <a href="https://t.me/Bronavia0020" target="_blank" rel="noopener noreferrer" className="hover:text-[#7000FF]">
                Bog‘lanish
              </a>
              {copied && (
                <span style={{color: '#7000FF', fontSize: '12px', marginLeft: '8px'}}>Raqam nusxalandi! Agar telefon ochilmasa, sahifani brauzerda oching.</span>
              )}
            </div>
            <div className="flex items-center">
              <Link to="https://t.me/RAKHMONOV_ABDULLOH" target="_blank" className="text-gray-600 hover:text-[#7000FF]">
                Biz haqimizda
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#7000FF] rounded flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              {/* 'Uy Jihozlari' va unga oid elementlar olib tashlandi */}
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Mahsulotlarni qidiring..."
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full pl-4 pr-10 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7000FF] focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to="/favorites" className="flex flex-col items-center text-gray-600 hover:text-[#7000FF]">
              <div className="relative">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7000FF] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-0.5">Sevimlilar</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-[#7000FF]">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7000FF] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-0.5">Savat</span>
            </Link>
            {isAdmin && (
              <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-[#7000FF]">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[10px] sm:text-xs mt-0.5">Profil</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}