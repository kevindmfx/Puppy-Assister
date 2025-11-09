"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PROMPT_OPTIONS, INITIAL_SCENE_OPTIONS, FormOption } from '@/lib/constants';

type OptionsState = FormOption[];

interface OptionsContextType {
  promptOptions: OptionsState;
  sceneOptions: OptionsState;
  setPromptOptions: (options: OptionsState) => void;
  setSceneOptions: (options: OptionsState) => void;
  isLoaded: boolean;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promptOptions, setPromptOptions] = useState<OptionsState>(INITIAL_PROMPT_OPTIONS);
  const [sceneOptions, setSceneOptions] = useState<OptionsState>(INITIAL_SCENE_OPTIONS);
  const [isLoaded, setIsLoaded] = useState(isServer);

  useEffect(() => {
    if (isServer) return;

    try {
      const storedOptions = localStorage.getItem('vision-weaver-options');
      if (storedOptions) {
        const parsedOptions = JSON.parse(storedOptions);
        if (parsedOptions.promptOptions && Array.isArray(parsedOptions.promptOptions)) {
          setPromptOptions(parsedOptions.promptOptions);
        } else {
          setPromptOptions(INITIAL_PROMPT_OPTIONS);
        }
        if (parsedOptions.sceneOptions && Array.isArray(parsedOptions.sceneOptions)) {
          setSceneOptions(parsedOptions.sceneOptions);
        } else {
            setSceneOptions(INITIAL_SCENE_OPTIONS);
        }
      } else {
        setPromptOptions(INITIAL_PROMPT_OPTIONS);
        setSceneOptions(INITIAL_SCENE_OPTIONS);
      }
    } catch (error) {
      console.error("Failed to parse options from localStorage", error);
      localStorage.removeItem('vision-weaver-options');
      setPromptOptions(INITIAL_PROMPT_OPTIONS);
      setSceneOptions(INITIAL_SCENE_OPTIONS);
    }
    setIsLoaded(true);
  }, []);

  const handleSetPromptOptions = useCallback((options: OptionsState) => {
    setPromptOptions(options);
    if (!isServer) {
        try {
            const currentOptions = JSON.parse(localStorage.getItem('vision-weaver-options') || '{}');
            const newOptions = { ...currentOptions, promptOptions: options };
            localStorage.setItem('vision-weaver-options', JSON.stringify(newOptions));
        } catch (error) {
            console.error("Failed to save prompt options to localStorage", error);
        }
    }
  }, []);

  const handleSetSceneOptions = useCallback((options: OptionsState) => {
    setSceneOptions(options);
    if (!isServer) {
        try {
            const currentOptions = JSON.parse(localStorage.getItem('vision-weaver-options') || '{}');
            const newOptions = { ...currentOptions, sceneOptions: options };
            localStorage.setItem('vision-weaver-options', JSON.stringify(newOptions));
        } catch (error) {
            console.error("Failed to save scene options to localStorage", error);
        }
    }
  }, []);


  return (
    <OptionsContext.Provider value={{ promptOptions, sceneOptions, setPromptOptions: handleSetPromptOptions, setSceneOptions: handleSetSceneOptions, isLoaded }}>
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
