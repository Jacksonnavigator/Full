/**
 * HydraNet Mobile - Design System
 * Unified color palette matching frontend
 */

// ============================================================
// COLOR PALETTE
// ============================================================

export const COLORS = {
  // Light Mode (Default)
  light: {
    // Background
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    // Foreground
    foreground: '#000000',
    foregroundSecondary: '#64748b',
    foregroundTertiary: '#94a3b8',
    
    // Card
    card: '#ffffff',
    cardForeground: '#000000',
    
    // Primary
    primary: '#000000',
    primaryForeground: '#ffffff',
    primaryLight: '#f1f5f9',
    primaryHover: '#1e293b',
    
    // Secondary
    secondary: '#f1f5f9',
    secondaryForeground: '#000000',
    secondaryHover: '#e2e8f0',
    
    // Accent
    accent: '#f1f5f9',
    accentForeground: '#000000',
    
    // Border
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    
    // Semantic
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },

  // Dark Mode
  dark: {
    // Background
    background: '#000000',
    backgroundSecondary: '#0f172a',
    backgroundTertiary: '#1e293b',
    
    // Foreground
    foreground: '#f9fafb',
    foregroundSecondary: '#cbd5e1',
    foregroundTertiary: '#94a3b8',
    
    // Card
    card: '#000000',
    cardForeground: '#f9fafb',
    
    // Primary
    primary: '#f9fafb',
    primaryForeground: '#000000',
    primaryLight: '#1e293b',
    primaryHover: '#334155',
    
    // Secondary
    secondary: '#1e293b',
    secondaryForeground: '#f9fafb',
    secondaryHover: '#334155',
    
    // Accent
    accent: '#1e293b',
    accentForeground: '#f9fafb',
    
    // Border
    border: '#1e293b',
    borderLight: '#334155',
    
    // Semantic
    success: '#10b981',
    successLight: '#064e3b',
    warning: '#f59e0b',
    warningLight: '#451a03',
    error: '#ef4444',
    errorLight: '#7f1d1d',
    info: '#3b82f6',
    infoLight: '#0c2340',
  },
};

// ============================================================
// TYPOGRAPHY
// ============================================================

export const TYPOGRAPHY = {
  // Font Families
  families: {
    primary: 'System',
    mono: 'Menlo',
  },

  // Font Sizes (in points for iOS, sp for Android)
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font Weights
  weights: {
    light: '300' as any,
    normal: '400' as any,
    medium: '500' as any,
    semibold: '600' as any,
    bold: '700' as any,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// ============================================================
// SPACING
// ============================================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

// ============================================================
// BORDER RADIUS
// ============================================================

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ============================================================
// SHADOWS
// ============================================================

export const SHADOWS = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  },
};

// ============================================================
// ANIMATIONS
// ============================================================

export const ANIMATIONS = {
  duration: {
    fast: 150,
    base: 200,
    slow: 300,
    slower: 500,
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
};

// ============================================================
// BREAKPOINTS (for responsive design)
// ============================================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// ============================================================
// THEME PRESETS
// ============================================================

export const createTheme = (isDark: boolean = false) => {
  const palette = isDark ? COLORS.dark : COLORS.light;

  return {
    colors: palette,
    typography: TYPOGRAPHY,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    animations: ANIMATIONS,
  };
};

// Default light theme
export const lightTheme = createTheme(false);

// Dark theme
export const darkTheme = createTheme(true);

// ============================================================
// COMPONENT-SPECIFIC STYLES
// ============================================================

export const COMPONENT_STYLES = {
  button: {
    primary: {
      light: {
        backgroundColor: COLORS.light.primary,
        color: COLORS.light.primaryForeground,
      },
      dark: {
        backgroundColor: COLORS.dark.primary,
        color: COLORS.dark.primaryForeground,
      },
    },
    secondary: {
      light: {
        backgroundColor: COLORS.light.secondary,
        color: COLORS.light.secondaryForeground,
      },
      dark: {
        backgroundColor: COLORS.dark.secondary,
        color: COLORS.dark.secondaryForeground,
      },
    },
  },
  input: {
    light: {
      backgroundColor: COLORS.light.backgroundSecondary,
      borderColor: COLORS.light.border,
      color: COLORS.light.foreground,
      placeholderColor: COLORS.light.foregroundTertiary,
    },
    dark: {
      backgroundColor: COLORS.dark.backgroundSecondary,
      borderColor: COLORS.dark.border,
      color: COLORS.dark.foreground,
      placeholderColor: COLORS.dark.foregroundTertiary,
    },
  },
  card: {
    light: {
      backgroundColor: COLORS.light.card,
      borderColor: COLORS.light.border,
      shadowOpacity: 0.1,
    },
    dark: {
      backgroundColor: COLORS.dark.card,
      borderColor: COLORS.dark.border,
      shadowOpacity: 0.3,
    },
  },
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  BREAKPOINTS,
  createTheme,
  lightTheme,
  darkTheme,
  COMPONENT_STYLES,
};
