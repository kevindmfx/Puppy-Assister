"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FORM_OPTIONS, FormOptionKey } from '@/lib/constants';

type Option = { value: string; label: string };
type OptionsState = Record<FormOptionKey, Option[]>;

interface OptionsContextType {
  options: OptionsState;
  updateOptions: (key: FormOptionKey, newOptions: Option[]) => void;
  getOptionsAsString: (key: FormOptionKey) => string;
  isLoaded: boolean;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<OptionsState>(FORM_OPTIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isServer) return;

    try {
      const storedOptions = localStorage.getItem('vision-weaver-options');
      if (storedOptions) {
        setOptions(JSON.parse(storedOptions));
      }
    } catch (error) {
      console.error("Failed to parse options from localStorage", error);
      // If parsing fails, localStorage might be corrupt, clear it.
      localStorage.removeItem('vision-weaver-options');
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isServer) {
        try {
            localStorage.setItem('vision-weaver-options', JSON.stringify(options));
        } catch (error) {
            console.error("Failed to save options to localStorage", error);
        }
    }
  }, [options, isLoaded]);

  const updateOptions = (key: FormOptionKey, newOptions: Option[]) => {
    setOptions(prev => ({ ...prev, [key]: newOptions }));
  };

  const getOptionsAsString = (key: FormOptionKey): string => {
    if (!options[key]) {
        return '';
    }
    return options[key].map(opt => `${opt.value}:${opt.label}`).join(';');
  }

  // We don't render the children until the options are loaded from localStorage
  // to prevent hydration mismatches and race conditions.
  if (!isLoaded) {
    return null;
  }

  return (
    <OptionsContext.Provider value={{ options, updateOptions, getOptionsAsString, isLoaded }}>
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
