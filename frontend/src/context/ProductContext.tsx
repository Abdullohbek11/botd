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
    fetch('http://95.130.227.121:8000/api/products')
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
    fetch('http://95.130.227.121:8000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    fetch('http://95.130.227.121:8000/api/products/' + String(productId), {
      method: 'DELETE'
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