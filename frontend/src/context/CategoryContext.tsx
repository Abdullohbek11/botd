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
    console.log('Fetching categories from API...');
    fetch('http://95.130.227.121:8000/api/categories')
      .then(res => {
        console.log('API response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Categories loaded:', data.length);
        setCategories(data);
      })
      .catch(error => {
        console.error('Error loading categories:', error);
        setCategories([]);
      });
  }, []);

  // Kategoriya qo'shish
  const addCategory = (category: any) => {
    fetch('http://95.130.227.121:8000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, id: String(category.id) })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(newCategory => setCategories(prev => [...prev, newCategory]))
      .catch(error => {
        console.error('Error adding category:', error);
      });
  };

  // Kategoriya o'chirish (backendga so'rov yuboriladi)
  const deleteCategory = (categoryId: string) => {
    fetch('http://95.130.227.121:8000/api/categories/' + String(categoryId), {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => setCategories(prev => prev.filter(c => String(c.id) !== String(categoryId))))
      .catch(error => {
        console.error('Error deleting category:', error);
      });
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