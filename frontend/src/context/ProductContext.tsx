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
    fetch('http://95.130.227.121:8001/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Mahsulot qo'shish
  const addProduct = (product: any) => {
    fetch('http://95.130.227.121:8001/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, id: String(product.id) })
    })
      .then(res => res.json())
      .then(newProduct => setProducts(prev => [...prev, newProduct]));
  };

  // Mahsulot o'chirish (backendga so'rov yuboriladi)
  const deleteProduct = (productId: string) => {
    fetch('http://95.130.227.121:8001/products/' + String(productId), {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => setProducts(prev => prev.filter(p => String(p.id) !== String(productId))));
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