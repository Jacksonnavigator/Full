// Primary Colors
export const colors = {
  // Brand Colors
  brandDark: '#031525',
  brandPrimary: '#0f5fff',
  brandPrimarySoft: '#e4edff',
  brandPrimaryLight: '#60a5fa',
  brandAccent: '#2dd4bf',
  brandAccentLight: '#5eead4',
  brandDanger: '#ef4444',
  brandWarning: '#f97316',
  brandSuccess: '#10b981',

  // Backgrounds
  background: '#050816',
  backgroundSoft: '#0b1220',
  backgroundLight: '#f8fafc',
  backgroundGray: '#f3f6ff',

  // Cards
  card: '#0b1220',
  cardSoft: '#111827',
  cardLight: '#ffffff',

  // Borders
  borderSubtle: '#1f2937',
  borderLight: '#e5e7eb',
  borderMedium: '#d1d5db',

  // Text
  textMain: '#f9fafb',
  textMuted: '#9ca3af',
  textSoft: '#6b7280',
  textDark: '#0f172a',
  textMedium: '#334155',
  textLight: '#64748b',

  // Chips & Badges
  chipBg: '#111827',
  chipBgSelected: '#1f2937',
  chipBgLight: '#e5e7eb',
  chipBgSelectedLight: '#0f5fff',

  // Status Colors
  status: {
    assigned: '#3b82f6',
    inProgress: '#f59e0b',
    submitted: '#8b5cf6',
    approved: '#10b981',
    rejected: '#ef4444',
    closed: '#6b7280',
  },

  // Priority Colors
  priority: {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  },

  // Gradients
  gradients: {
    primary: ['#0f5fff', '#0ea5e9'],
    primaryVertical: ['#1e40af', '#3b82f6', '#60a5fa'],
    accent: ['#2dd4bf', '#14b8a6'],
    success: ['#10b981', '#059669'],
    danger: ['#ef4444', '#dc2626'],
    warning: ['#f59e0b', '#d97706'],
    sunset: ['#f97316', '#fb923c', '#fbbf24'],
    ocean: ['#0ea5e9', '#06b6d4', '#2dd4bf'],
    purple: ['#8b5cf6', '#a78bfa'],
    background: ['#e0f2ff', '#f0f9ff', '#ffffff'],
    backgroundDark: ['#050816', '#0b1220', '#111827'],
    card: ['#ffffff', '#f8fafc'],
    header: ['#dbeafe', '#e0f2ff'],
  },
};

// Gradient definitions for LinearGradient component
export const gradientColors = {
  primary: {
    colors: colors.gradients.primary,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  primaryVertical: {
    colors: colors.gradients.primaryVertical,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  accent: {
    colors: colors.gradients.accent,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  success: {
    colors: colors.gradients.success,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  danger: {
    colors: colors.gradients.danger,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  warning: {
    colors: colors.gradients.warning,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  sunset: {
    colors: colors.gradients.sunset,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  ocean: {
    colors: colors.gradients.ocean,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  purple: {
    colors: colors.gradients.purple,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  background: {
    colors: colors.gradients.background,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  backgroundDark: {
    colors: colors.gradients.backgroundDark,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  card: {
    colors: colors.gradients.card,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  header: {
    colors: colors.gradients.header,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

