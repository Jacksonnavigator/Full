import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  surface: string;
  error: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: Theme) => void;
}

const lightTheme: ThemeColors = {
  primary: '#1e40af',
  background: '#f5f5f5',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  card: '#ffffff',
  surface: '#f9fafb',
  error: '#dc2626',
};

const darkTheme: ThemeColors = {
  primary: '#3b82f6',
  background: '#1a1a1a',
  text: '#f5f5f5',
  textSecondary: '#d1d5db',
  border: '#444444',
  card: '#2d2d2d',
  surface: '#333333',
  error: '#ef4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<Theme>('light');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('hydranet_theme_mode');
        if (savedThemeMode === 'light' || savedThemeMode === 'dark') {
          setThemeModeState(savedThemeMode);
        } else {
          // Default to light mode
          setThemeModeState('light');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const colors = themeMode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setThemeModeState((prevMode) => {
      const newMode: Theme = prevMode === 'light' ? 'dark' : 'light';
      
      // Save preference
      AsyncStorage.setItem('hydranet_theme_mode', newMode).catch((error) => {
        console.error('Error saving theme preference:', error);
      });

      return newMode;
    });
  };

  const setThemeModeHandler = (mode: Theme) => {
    setThemeModeState(mode);
    AsyncStorage.setItem('hydranet_theme_mode', mode).catch((error) => {
      console.error('Error saving theme preference:', error);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: themeMode, themeMode, colors, toggleTheme, setThemeMode: setThemeModeHandler }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
