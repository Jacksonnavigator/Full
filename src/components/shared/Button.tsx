/**
 * HydraNet Mobile - Shared Button Component
 * Reusable button across all screens - Frontend-synced theme
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, fontFamily, fontSize, fontWeight, spacing } from '../../theme';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  size = 'medium',
  fullWidth,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: fontSize.xs };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing['2xl'], fontSize: fontSize.lg };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: fontSize.sm };
    }
  };

  const sizeStyles = getSizeStyles();

  // Primary variant with gradient
  if (variant === 'primary' && !isDisabled) {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[fullWidth && { width: '100%' }, style]}
        onPress={onPress}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            { borderRadius: borderRadius.lg, paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.text, { color: colors.primaryForeground, fontSize: sizeStyles.fontSize, fontFamily }, textStyle]}>
              {label}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary and other variants
  const variantStyles: Record<string, any> = {
    primary: { backgroundColor: 'transparent' },
    secondary: { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 },
    danger: { backgroundColor: colors.destructive, borderColor: colors.destructive, borderWidth: 0 },
  };

  const variantTextColor: Record<string, string> = {
    primary: colors.primaryForeground,
    secondary: colors.secondaryForeground,
    danger: colors.destructiveForeground,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant] || variantStyles.secondary,
        { borderRadius: borderRadius.lg, paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variantTextColor[variant] || colors.secondaryForeground} />
      ) : (
        <Text style={[styles.text, { color: variantTextColor[variant] || colors.secondaryForeground, fontSize: sizeStyles.fontSize, fontFamily }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: fontWeight.semibold,
    fontFamily,
  },
});

export default Button;
