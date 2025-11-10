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
  history: HistoryItem[];
  addHistoryItem: (item: AddHistoryItemDTO) => void;
  getHistoryItem: (id: string) => HistoryItem | undefined;
  getPromptSnippet: (item: HistoryItem) => string;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';
const MAX_HISTORY_ITEMS = 50;

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isServer) return;

    try {
      const storedHistory = localStorage.getItem('generation-history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
            setHistory(parsed.sort((a: HistoryItem, b: HistoryItem) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      localStorage.removeItem('generation-history');
    }
  }, []);

  const saveHistory = useCallback((historyItems: HistoryItem[]) => {
    if (isServer) return;
    try {
      localStorage.setItem('generation-history', JSON.stringify(historyItems));
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

    setHistory(prev => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(updated);
        return updated;
    });

  }, [saveHistory]);
  
  const getHistoryItem = useCallback((id: string): HistoryItem | undefined => {
      return history.find(item => item.id === id);
  }, [history]);

  const getPromptSnippet = (item: HistoryItem): string => {
    try {
      const parsedContent = JSON.parse(item.content);
      if (item.type === 'prompt' && parsedContent.prompt) {
        return parsedContent.prompt;
      }
      if (item.type === 'prompt' && typeof parsedContent.midjourneyPrompt === 'string') {
        return parsedContent.midjourneyPrompt.split('--')[0].trim();
      }
      if (item.type === 'scene' && parsedContent.clip_01 && parsedContent.clip_01.prompt) {
        return parsedContent.clip_01.prompt;
      }
    } catch (e) {
      // Fallback for old string-only midjourney format
      if(item.type === 'prompt' && typeof item.content === 'string') {
        return item.content.split('--')[0].trim();
      }
      return 'Conteúdo inválido';
    }
    return 'Nenhum prompt encontrado';
  };

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (!isServer) {
        try {
            localStorage.removeItem('generation-history');
        } catch (error) {
            console.error("Failed to clear history from localStorage", error);
        }
    }
  }, []);


  return (
    <HistoryContext.Provider value={{ history, addHistoryItem, getHistoryItem, getPromptSnippet, clearHistory }}>
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
