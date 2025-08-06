import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API'dan mahsulotlarni olish
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 soniya timeout
        
        const response = await fetch('http://localhost:8001/products', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Mahsulotlarni yuklashda xatolik:', err);
        setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
        
        // Fallback data
        setProducts([
          {
            id: '1',
            name: 'Test mahsulot',
            price: 10000,
            description: 'Test tavsif',
            image: '',
            category_id: '1',
            category: 'Test kategoriya'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mahsulot qo'shish
  const addProduct = async (product: any) => {
    try {
      const response = await fetch('http://localhost:8001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, id: String(product.id) })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Mahsulot qo\'shishda xatolik:', err);
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
    }
  };

  // Mahsulot o'chirish
  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/products/${String(productId)}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await response.json();
      setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));
    } catch (err) {
      console.error('Mahsulot o\'chirishda xatolik:', err);
      setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      setProducts, 
      addProduct, 
      deleteProduct, 
      loading, 
      error 
    }}>
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