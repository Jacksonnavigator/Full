// HydraNet Mobile Theme - Synced with Frontend
// This theme exports the same keys used by Web + the existing mobile UI (for compatibility).

import { colors as baseColors } from './colors';

export const colors = {
  ...baseColors,
  // Override core colors to match the web-based UI.
  background: '#f8fbff', // hsl(210,100%,98%)
  foreground: '#232946', // hsl(222,47%,11%)
  card: '#ffffff',
  cardLight: '#ffffff',
  cardForeground: '#232946',
  textDark: '#0f172a',
  textMuted: '#9ca3af',
  textMedium: '#334155',
  // Web theme palette
  primary: '#06b6d4', // cyan-500
  primaryDark: '#2563eb', // blue-600
  primaryForeground: '#ffffff',
  secondary: '#e5f0fa', // hsl(210,40%,96%)
  secondaryForeground: '#232946',
  muted: '#e5f0fa',
  mutedForeground: '#64748b', // hsl(215,16%,47%)
  accent: '#06b6d4',
  accentForeground: '#ffffff',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#e2e8f0', // hsl(214,32%,91%)
  input: '#e2e8f0',
  ring: '#06b6d4',
  chart1: '#06b6d4',
  chart2: '#22c55e',
  chart3: '#fbbf24',
  chart4: '#ef4444',
  chart5: '#3b82f6',
  sidebarBackground: '#f1f7fa',
  sidebarForeground: '#232946',
  sidebarPrimary: '#06b6d4',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#e5f0fa',
  sidebarAccentForeground: '#232946',
  sidebarBorder: '#e3e8ef',
  sidebarRing: '#06b6d4',
  // Status badge colors
  statusActive: '#10b981', // emerald-400
  statusInactive: '#64748b', // slate-400
  statusPending: '#f59e0b', // amber-400
};

import { borderRadius, spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

export { borderRadius, spacing, shadows, typography };

export const fontFamily = 'Inter, "Helvetica Neue", Arial, sans-serif';
export const fontWeight = typography.fontWeight;
export const fontSize = typography.fontSize;

export const glassStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  // React Native doesn't support backdrop-filter, but we can use blurView for similar effect
};

export const buttonGradient = [colors.primary, colors.primaryDark];

export const statusBadgeStyles = {
  active: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    color: colors.statusActive,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  inactive: {
    backgroundColor: 'rgba(100,116,139,0.1)',
    color: colors.statusInactive,
    borderColor: 'rgba(100,116,139,0.2)',
  },
  pending: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    color: colors.statusPending,
    borderColor: 'rgba(245,158,11,0.2)',
  },
};
