/**
 * Favorites Context - Quản lý danh sách xe yêu thích
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@favorites';

interface FavoritesContextType {
  favorites: string[]; // Array of vehicle IDs
  isFavorite: (vehicleId: string) => boolean;
  toggleFavorite: (vehicleId: string) => Promise<void>;
  removeMany?: (vehicleIds: string[]) => Promise<void>;
  clearFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        console.log('✅ Favorites loaded:', parsed);
      }
    } catch (error) {
      console.error('❌ Failed to load favorites:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log('💾 Favorites saved:', newFavorites);
    } catch (error) {
      console.error('❌ Failed to save favorites:', error);
    }
  };

  const isFavorite = (vehicleId: string): boolean => {
    return favorites.includes(vehicleId);
  };

  const toggleFavorite = async (vehicleId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId) // Remove
        : [...prev, vehicleId]; // Add
      
      saveFavorites(newFavorites);
      console.log(`${prev.includes(vehicleId) ? '💔' : '❤️'} Favorite toggled:`, vehicleId);
      
      return newFavorites;
    });
  };

  // Remove multiple favorites atomically
  const removeMany = async (vehicleIds: string[]) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => !vehicleIds.includes(id));
      saveFavorites(newFavorites);
      console.log('🧽 Favorites removed (many):', vehicleIds);
      return newFavorites;
    });
  };

  const clearFavorites = async () => {
    setFavorites([]);
    await saveFavorites([]);
    console.log('🧹 Favorites cleared');
  };

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    removeMany,
    clearFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
