"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PROMPT_OPTIONS, INITIAL_SCENE_OPTIONS, FormOption } from '@/lib/constants';

type OptionsState = FormOption[];

interface OptionsContextType {
  promptOptions: OptionsState;
  sceneOptions: OptionsState;
  setPromptOptions: React.Dispatch<React.SetStateAction<OptionsState>>;
  setSceneOptions: React.Dispatch<React.SetStateAction<OptionsState>>;
  isLoaded: boolean;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promptOptions, setPromptOptions] = useState<OptionsState>(INITIAL_PROMPT_OPTIONS);
  const [sceneOptions, setSceneOptions] = useState<OptionsState>(INITIAL_SCENE_OPTIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isServer) return;

    try {
      const storedOptions = localStorage.getItem('vision-weaver-options');
      if (storedOptions) {
        const parsedOptions = JSON.parse(storedOptions);
        if (parsedOptions.promptOptions && Array.isArray(parsedOptions.promptOptions)) {
          setPromptOptions(parsedOptions.promptOptions);
        }
        if (parsedOptions.sceneOptions && Array.isArray(parsedOptions.sceneOptions)) {
          setSceneOptions(parsedOptions.sceneOptions);
        }
      }
    } catch (error) {
      console.error("Failed to parse options from localStorage", error);
      localStorage.removeItem('vision-weaver-options');
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isServer) {
        try {
            const allOptions = { promptOptions, sceneOptions };
            localStorage.setItem('vision-weaver-options', JSON.stringify(allOptions));
        } catch (error) {
            console.error("Failed to save options to localStorage", error);
        }
    }
  }, [promptOptions, sceneOptions, isLoaded]);

  if (!isLoaded && !isServer) {
    return null;
  }

  return (
    <OptionsContext.Provider value={{ promptOptions, sceneOptions, setPromptOptions, setSceneOptions, isLoaded }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (context === undefined) {
    throw new Error('useOptions must be used within an OptionsProvider');
  }
  return context;
};
