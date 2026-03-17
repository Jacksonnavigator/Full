import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, fontWeight, fontSize, borderRadius, spacing, statusBadgeStyles } from '../theme';

interface StatusBadgeProps {
  label: string;
  variant: 'status' | 'priority';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant, style }) => {
  // Use frontend-synced status badge styles
  const config = getBadgeConfig(label, variant);

  if (config.gradient) {
    return (
      <LinearGradient
        colors={config.gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.badge, style]}
      >
        <Text style={[styles.text, { color: config.textColor }]}>{label}</Text>
      </LinearGradient>
    );
  }
  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor, borderColor: config.borderColor, borderWidth: 1 }, style]}>
      <Text style={[styles.text, { color: config.textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius,
    fontFamily: fontFamily,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily,
    letterSpacing: 0.5,
  }
});

interface BadgeConfig {
  bgColor?: string;
  textColor: string;
  gradient?: string[];
}

const getBadgeConfig = (label: string, variant: 'status' | 'priority'): BadgeConfig => {
  // Use frontend-synced status badge styles
  if (variant === 'status') {
    switch (label.toLowerCase()) {
      case 'active':
        return statusBadgeStyles.active;
      case 'inactive':
        return statusBadgeStyles.inactive;
      case 'pending':
        return statusBadgeStyles.pending;
      default:
        return statusBadgeStyles.inactive;
    }
  }
  // Priority variant fallback
  if (variant === 'priority') {
    switch (label.toLowerCase()) {
      case 'high':
        return {
          backgroundColor: colors.destructive,
          textColor: colors.destructiveForeground,
          borderColor: colors.destructive,
        };
      case 'medium':
        return {
          backgroundColor: colors.primary,
          textColor: colors.primaryForeground,
          borderColor: colors.primary,
        };
      case 'low':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.secondaryForeground,
          borderColor: colors.secondary,
        };
      default:
        return statusBadgeStyles.inactive;
    }
  }
        return statusBadgeStyles.inactive;
};
