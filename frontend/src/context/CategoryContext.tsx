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
    
    // Telegram mini app da ishlayotganini aniqlash
    const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;
    console.log('Is Telegram WebApp:', isTelegramWebApp);
    
    const fetchCategories = async () => {
      try {
        // API URL ni aniqlash
        const apiUrl = 'https://otkirbekshop.uz/api/categories';
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'TelegramWebApp/1.0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories loaded:', data.length);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data if API fails
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Kategoriya qo'shish
  const addCategory = async (category: Category) => {
    try {
      const apiUrl = 'https://otkirbekshop.uz/api/categories';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'TelegramWebApp/1.0'
        },
        body: JSON.stringify(category)
      });
      
      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory]);
        console.log('Category added successfully');
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Kategoriya o'chirish
  const deleteCategory = async (categoryId: string) => {
    try {
      const apiUrl = `https://otkirbekshop.uz/api/categories/${categoryId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'TelegramWebApp/1.0'
        }
      });
      
      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        console.log('Category deleted successfully');
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
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