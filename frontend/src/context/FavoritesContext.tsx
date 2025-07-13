import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (productId: number) => void;
  removeFromFavorites: (productId: number) => void;
  isInFavorites: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isInFavorites: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (productId: number) => {
    setFavorites((prev) => [...prev, productId]);
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  };

  const isInFavorites = (productId: number) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
} 