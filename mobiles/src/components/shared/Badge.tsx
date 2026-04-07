/**
 * HydraNet Mobile - Shared Badge Component
 * Status and label badges - Frontend-synced theme
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, fontSize, fontFamily, spacing } from '../../theme';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}: BadgeProps) {
  const variantBg = {
    success: 'rgba(16,185,129,0.1)',
    warning: 'rgba(245,158,11,0.1)',
    error: 'rgba(239,68,68,0.1)',
    info: 'rgba(59,130,246,0.1)',
    default: colors.muted,
  };

  const variantText = {
    success: colors.chart2,
    warning: colors.chart3,
    error: colors.chart4,
    info: colors.primary,
    default: colors.mutedForeground,
  };

  const sizeStyles = {
    small: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
    medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    large: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  };

  return (
    <View style={[styles.badge, { backgroundColor: variantBg[variant], borderRadius: borderRadius.lg, ...sizeStyles[size] }, style]}>
      <Text style={[styles.text, { color: variantText[variant], fontFamily }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
});

export default Badge;
