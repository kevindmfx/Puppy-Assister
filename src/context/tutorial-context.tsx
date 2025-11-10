"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface TutorialContextType {
  isTutorialOpen: boolean;
  showTutorial: () => void;
  closeTutorial: () => void;
  completeTutorial: (pageKey: string) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const pathname = usePathname();

  const getPageKey = useCallback(() => {
    if (pathname === '/prompt-generator') return 'prompt-generator';
    if (pathname === '/scene-generator') return 'scene-generator';
    return null;
  }, [pathname]);

  useEffect(() => {
    if (isServer) return;

    const pageKey = getPageKey();
    if (!pageKey) return;
    
    try {
      const tutorialsCompleted = JSON.parse(localStorage.getItem('tutorials-completed') || '{}');
      if (!tutorialsCompleted[pageKey]) {
        setIsTutorialOpen(true);
      }
    } catch (error) {
      console.error("Failed to check tutorial status from localStorage", error);
    }
  }, [pathname, getPageKey]);

  const showTutorial = useCallback(() => {
    setIsTutorialOpen(true);
  }, []);

  const closeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
  }, []);

  const completeTutorial = useCallback((pageKey: string) => {
    if (isServer) return;
    try {
        const tutorialsCompleted = JSON.parse(localStorage.getItem('tutorials-completed') || '{}');
        tutorialsCompleted[pageKey] = true;
        localStorage.setItem('tutorials-completed', JSON.stringify(tutorialsCompleted));
    } catch (error) {
        console.error("Failed to save tutorial status to localStorage", error);
    }
  }, []);


  return (
    <TutorialContext.Provider value={{ isTutorialOpen, showTutorial, closeTutorial, completeTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
