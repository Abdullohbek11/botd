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
    
    const fetchProducts = async () => {
      try {
        // API URL ni aniqlash
        const apiUrl = isTelegramWebApp 
          ? 'https://otkirbekshop.uz/api/products'
          : 'https://otkirbekshop.uz/api/products';
        
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'TelegramWebApp'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products loaded:', data.length);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if API fails
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Mahsulot qo'shish
  const addProduct = async (product: Product) => {
    try {
      const response = await fetch('https://otkirbekshop.uz/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'TelegramWebApp'
        },
        body: JSON.stringify(product)
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts(prev => [...prev, newProduct]);
        console.log('Product added successfully');
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Mahsulot o'chirish
  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`https://otkirbekshop.uz/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'TelegramWebApp'
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        console.log('Product deleted successfully');
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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