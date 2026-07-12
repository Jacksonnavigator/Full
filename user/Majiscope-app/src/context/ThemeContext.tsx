import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { brand } from '../theme/tokens';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  surface: string;
  error: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  headerGradientStart: string;
  headerGradientEnd: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: Theme) => void;
}

const lightTheme: ThemeColors = {
  primary: brand.cyan600,
  primaryLight: brand.cyan500,
  primaryDark: brand.cyan700,
  primaryMuted: brand.cyan50,
  accent: brand.cyan100,
  background: brand.sky50,
  text: brand.slate900,
  textSecondary: brand.slate600,
  border: brand.slate200,
  card: brand.white,
  surface: brand.sky100,
  error: brand.danger,
  success: brand.success,
  successMuted: '#ecfdf5',
  warning: brand.warning,
  warningMuted: '#fffbeb',
  danger: brand.danger,
  dangerMuted: '#fef2f2',
  headerGradientStart: brand.cyan600,
  headerGradientEnd: brand.cyan700,
};

const darkTheme: ThemeColors = {
  primary: brand.cyan500,
  primaryLight: '#22d3ee',
  primaryDark: brand.cyan600,
  primaryMuted: '#164e63',
  accent: '#155e75',
  background: '#0c1222',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#1e293b',
  card: '#111827',
  surface: '#1e293b',
  error: '#f87171',
  success: '#34d399',
  successMuted: '#064e3b',
  warning: '#fbbf24',
  warningMuted: '#451a03',
  danger: '#f87171',
  dangerMuted: '#450a0a',
  headerGradientStart: brand.cyan700,
  headerGradientEnd: '#155e75',
};

const THEME_STORAGE_KEY = 'majiscope_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<Theme>('light');

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode =
          (await AsyncStorage.getItem(THEME_STORAGE_KEY)) ||
          (await AsyncStorage.getItem('hydranet_theme_mode'));
        if (savedThemeMode === 'light' || savedThemeMode === 'dark') {
          setThemeModeState(savedThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    void loadThemePreference();
  }, []);

  const colors = themeMode === 'light' ? lightTheme : darkTheme;

  const persistTheme = (mode: Theme) => {
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch((error) => {
      console.error('Error saving theme preference:', error);
    });
  };

  const toggleTheme = () => {
    setThemeModeState((prevMode) => {
      const newMode: Theme = prevMode === 'light' ? 'dark' : 'light';
      persistTheme(newMode);
      return newMode;
    });
  };

  const setThemeModeHandler = (mode: Theme) => {
    setThemeModeState(mode);
    persistTheme(mode);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: themeMode, themeMode, colors, toggleTheme, setThemeMode: setThemeModeHandler }}
    >
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
