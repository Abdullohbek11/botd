import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // API'dan mahsulotlarni olish
  useEffect(() => {
    console.log('Fetching products from API...');
    
    // Telegram mini app da ishlayotganini aniqlash
    const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;
    console.log('Is Telegram WebApp:', isTelegramWebApp);
    
    fetch('https://otkirbekshop.uz/api/products', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'TelegramWebApp'
      }
    })
      .then(res => {
        console.log('API response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Products loaded:', data.length);
        setProducts(data);
      })
      .catch(error => {
        console.error('Error loading products:', error);
        setProducts([]);
      });
  }, []);

  // Mahsulot qo'shish
  const addProduct = (product: any) => {
    fetch('https://otkirbekshop.uz/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'TelegramWebApp'
      },
      body: JSON.stringify({ ...product, id: String(product.id) })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(newProduct => setProducts(prev => [...prev, newProduct]))
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  // Mahsulot o'chirish (backendga so'rov yuboriladi)
  const deleteProduct = (productId: string) => {
    fetch('https://otkirbekshop.uz/api/products/' + String(productId), {
      method: 'DELETE',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'TelegramWebApp'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => setProducts(prev => prev.filter(p => String(p.id) !== String(productId))))
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <ProductContext.Provider value={{ products, setProducts, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
} 