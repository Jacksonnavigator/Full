/**
 * HydraNet Mobile - Shared Card Component
 * Reusable card container across all screens - Frontend-synced theme
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.card, styles[`variant_${variant}`], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  variant_default: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  variant_elevated: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    ...shadows.md,
  },
  variant_outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});

export default Card;
