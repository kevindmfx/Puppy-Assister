"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  id: string;
  type: 'prompt' | 'scene';
  content: string;
  timestamp: string;
}

interface AddHistoryItemDTO {
  type: 'prompt' | 'scene';
  content: string;
}

interface HistoryContextType {
  promptHistory: HistoryItem[];
  sceneHistory: HistoryItem[];
  addHistoryItem: (item: AddHistoryItemDTO) => void;
  getHistoryItem: (id: string) => HistoryItem | undefined;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';
const MAX_HISTORY_ITEMS = 20;

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promptHistory, setPromptHistory] = useState<HistoryItem[]>([]);
  const [sceneHistory, setSceneHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isServer) return;

    try {
      const storedHistory = localStorage.getItem('generation-history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed.promptHistory)) {
          setPromptHistory(parsed.promptHistory.sort((a: HistoryItem, b: HistoryItem) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
        if (Array.isArray(parsed.sceneHistory)) {
          setSceneHistory(parsed.sceneHistory.sort((a: HistoryItem, b: HistoryItem) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      localStorage.removeItem('generation-history');
    }
  }, []);

  const saveHistory = useCallback((prompts: HistoryItem[], scenes: HistoryItem[]) => {
    if (isServer) return;
    try {
      const historyToStore = {
        promptHistory: prompts,
        sceneHistory: scenes,
      };
      localStorage.setItem('generation-history', JSON.stringify(historyToStore));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, []);

  const addHistoryItem = useCallback((item: AddHistoryItemDTO) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    if (newItem.type === 'prompt') {
      setPromptHistory(prev => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(updated, sceneHistory);
        return updated;
      });
    } else {
      setSceneHistory(prev => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(promptHistory, updated);
        return updated;
      });
    }
  }, [promptHistory, sceneHistory, saveHistory]);
  
  const getHistoryItem = useCallback((id: string): HistoryItem | undefined => {
      const allHistory = [...promptHistory, ...sceneHistory];
      return allHistory.find(item => item.id === id);
  }, [promptHistory, sceneHistory]);


  return (
    <HistoryContext.Provider value={{ promptHistory, sceneHistory, addHistoryItem, getHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
