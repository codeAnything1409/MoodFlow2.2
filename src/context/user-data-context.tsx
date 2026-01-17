'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { UserInteraction } from '@/lib/types';

interface UserDataContextType {
  interactions: UserInteraction[];
  addInteraction: (interaction: Omit<UserInteraction, 'contentCategory'> & { contentCategory?: string }) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'anshika-user-interactions';

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedInteractions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedInteractions) {
        setInteractions(JSON.parse(storedInteractions));
      }
    } catch (error) {
        console.error("Failed to load interactions from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(interactions));
      } catch (error) {
        console.error("Failed to save interactions to local storage", error);
      }
    }
  }, [interactions, isLoaded]);

  const addInteraction = useCallback((interaction: Omit<UserInteraction, 'contentCategory'> & { contentCategory?: string }) => {
    const fullInteraction: UserInteraction = {
      ...interaction,
      contentCategory: interaction.contentCategory as any,
    };
    setInteractions((prev) => [...prev, fullInteraction]);
  }, []);

  return (
    <UserDataContext.Provider value={{ interactions, addInteraction }}>
      {isLoaded ? children : null}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
