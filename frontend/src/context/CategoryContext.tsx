import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../types';

interface CategoryContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  // API'dan kategoriyalarni olish
  useEffect(() => {
    fetch('http://localhost:8000/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Kategoriya qo‘shish
  const addCategory = (category: any) => {
    fetch('http://localhost:8000/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, id: String(category.id) })
    })
      .then(res => res.json())
      .then(newCategory => setCategories(prev => [...prev, newCategory]));
  };

  // Kategoriya o‘chirish (backendga so‘rov yuboriladi)
  const deleteCategory = (categoryId: string) => {
    fetch('http://localhost:8000/categories/' + String(categoryId), {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => setCategories(prev => prev.filter(c => String(c.id) !== String(categoryId))));
  };

  return (
    <CategoryContext.Provider value={{ categories, setCategories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
} 