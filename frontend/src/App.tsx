import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { CategoryProvider } from './context/CategoryContext';
import { ProductProvider } from './context/ProductContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import './App.css';

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

    setIsLoading(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
                    <Routes>
                      <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
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