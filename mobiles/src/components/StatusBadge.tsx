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
    <View style={[styles.badge, { backgroundColor: config.backgroundColor, borderColor: config.borderColor, borderWidth: 1 }, style]}>
      <Text style={[styles.text, { color: config.textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily,
    letterSpacing: 0.5,
  }
});

interface BadgeConfig {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  gradient?: string[];
}

const fromThemeBadge = (style: { backgroundColor: string; color: string; borderColor: string }): BadgeConfig => ({
  backgroundColor: style.backgroundColor,
  textColor: style.color,
  borderColor: style.borderColor,
});

const getBadgeConfig = (label: string, variant: 'status' | 'priority'): BadgeConfig => {
  // Use frontend-synced status badge styles
  if (variant === 'status') {
    switch (label.toLowerCase()) {
      case 'assigned':
        return fromThemeBadge(statusBadgeStyles.pending);
      case 'in progress':
      case 'in_progress':
      case 'in progress (leader)':
        return {
          backgroundColor: '#fff7ed',
          textColor: '#c2410c',
          borderColor: '#fdba74',
        };
      case 'submitted':
      case 'submitted by engineer':
      case 'approved by team leader':
      case 'pending approval':
      case 'pending_approval':
        return {
          backgroundColor: '#ecfdf5',
          textColor: '#047857',
          borderColor: '#86efac',
        };
      case 'approved':
      case 'closed by manager':
      case 'closed':
        return fromThemeBadge(statusBadgeStyles.active);
      case 'rejected':
      case 'rejected by team leader':
        return {
          backgroundColor: '#fef2f2',
          textColor: '#b91c1c',
          borderColor: '#fca5a5',
        };
      case 'active':
        return fromThemeBadge(statusBadgeStyles.active);
      case 'inactive':
        return fromThemeBadge(statusBadgeStyles.inactive);
      case 'pending':
        return fromThemeBadge(statusBadgeStyles.pending);
      default:
        return fromThemeBadge(statusBadgeStyles.inactive);
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
      case 'critical':
        return {
          backgroundColor: '#7f1d1d',
          textColor: '#ffffff',
          borderColor: '#7f1d1d',
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
        return fromThemeBadge(statusBadgeStyles.inactive);
    }
  }
  return fromThemeBadge(statusBadgeStyles.inactive);
};
