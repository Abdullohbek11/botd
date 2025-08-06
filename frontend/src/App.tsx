import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { CategoryProvider } from './context/CategoryContext';
import { ProductProvider } from './context/ProductContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Lazy loading - sahifalarni kerak bo'lganda yuklash
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(module => ({ default: module.OrdersPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(module => ({ default: module.FavoritesPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));

// Loading komponenti
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#F4F5F5] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7000FF] mx-auto mb-4"></div>
      <p className="text-gray-600">Yuklanmoqda...</p>
    </div>
  </div>
);

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        sendData: (data: string) => void;
        close: () => void;
      };
    };
  }
}

function App() {
  const [webApp, setWebApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Telegram Web App
    const telegram = window.Telegram.WebApp;
    setWebApp(telegram);
    telegram.ready();
    telegram.expand();

    // Set custom User-Agent for ngrok
    const meta = document.createElement('meta');
    meta.httpEquiv = 'User-Agent';
    meta.content = 'TelegramWebApp';
    document.head.appendChild(meta);

    // Add ngrok skip warning header
    const ngrokMeta = document.createElement('meta');
    ngrokMeta.name = 'ngrok-skip-browser-warning';
    ngrokMeta.content = 'true';
    document.head.appendChild(ngrokMeta);

    // Asosiy ranglarni o'rnatish
    document.documentElement.style.setProperty('--primary-color', '#7000FF');
    document.documentElement.style.setProperty('--secondary-color', '#FF0000');
    document.documentElement.style.setProperty('--background-color', '#F4F5F5');

    // Loading vaqtini qisqartirish
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrderProvider>
                <Router>
                  <div className="min-h-screen bg-[#F4F5F5]">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                      </Routes>
                    </Suspense>
                  </div>
                </Router>
              </OrderProvider>
            </CartProvider>
          </FavoritesProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;