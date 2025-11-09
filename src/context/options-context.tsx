"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FORM_OPTIONS, SCENE_FORM_OPTIONS, FormOptionKey, SceneFormOptionKey } from '@/lib/constants';

type Option = { value: string; label: string };
type PromptOptionsState = Record<FormOptionKey, Option[]>;
type SceneOptionsState = Record<SceneFormOptionKey, Option[]>;

interface OptionsContextType {
  promptOptions: PromptOptionsState;
  sceneOptions: SceneOptionsState;
  updatePromptOptions: (key: FormOptionKey, newOptions: Option[]) => void;
  updateSceneOptions: (key: SceneFormOptionKey, newOptions: Option[]) => void;
  isLoaded: boolean;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promptOptions, setPromptOptions] = useState<PromptOptionsState>(FORM_OPTIONS);
  const [sceneOptions, setSceneOptions] = useState<SceneOptionsState>(SCENE_FORM_OPTIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isServer) return;

    try {
      const storedOptions = localStorage.getItem('vision-weaver-options');
      if (storedOptions) {
        const parsedOptions = JSON.parse(storedOptions);
        // Basic validation to ensure the stored data has the expected shape
        if (parsedOptions.promptOptions && parsedOptions.sceneOptions) {
          setPromptOptions(parsedOptions.promptOptions);
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

  const updatePromptOptions = useCallback((key: FormOptionKey, newOptions: Option[]) => {
    setPromptOptions(prev => ({ ...prev, [key]: newOptions }));
  }, []);

  const updateSceneOptions = useCallback((key: SceneFormOptionKey, newOptions: Option[]) => {
    setSceneOptions(prev => ({ ...prev, [key]: newOptions }));
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <OptionsContext.Provider value={{ promptOptions, sceneOptions, updatePromptOptions, updateSceneOptions, isLoaded }}>
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
