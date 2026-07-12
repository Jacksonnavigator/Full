import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppLanguage, getStoredLanguage, setStoredLanguage } from '../services/languageService';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const stored = await getStoredLanguage();
      if (stored) {
        setLanguageState(stored);
      }
    };

    void loadLanguage();
  }, []);

  const setLanguage = async (nextLanguage: AppLanguage) => {
    await setStoredLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useAppLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useAppLanguage must be used within a LanguageProvider');
  }
  return context;
};
