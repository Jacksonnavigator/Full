/** Shared Majiscope design tokens — cyan water-brand palette */
export const brand = {
  cyan500: '#06b6d4',
  cyan600: '#0891b2',
  cyan700: '#0e7490',
  cyan800: '#155e75',
  cyan50: '#ecfeff',
  cyan100: '#cffafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  sky50: '#f0f9ff',
  sky100: '#e0f2fe',
  sky200: '#bae6fd',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate600: '#475569',
  slate500: '#64748b',
  slate200: '#e2e8f0',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const gradients = {
  /** Main app background — soft sky wash */
  mesh: ['#e0f7ff', '#f0f9ff', '#ecfeff', '#ffffff'] as const,
  /** Hero headers — deep water */
  hero: ['#0e7490', '#0891b2', '#06b6d4'] as const,
  /** Primary buttons */
  button: ['#0891b2', '#06b6d4', '#22d3ee'] as const,
  /** Splash / onboarding */
  splash: ['#0c4a6e', '#0e7490', '#0891b2', '#06b6d4'] as const,
  /** Card accent strip */
  accent: ['#06b6d4', '#3b82f6'] as const,
  /** Emergency tab */
  emergency: ['#dc2626', '#f97316'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#0e7490',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  soft: {
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  float: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const typography = {
  hero: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.6, textTransform: 'uppercase' as const },
};
