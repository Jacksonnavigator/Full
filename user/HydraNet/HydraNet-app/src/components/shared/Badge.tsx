/**
 * HydraNet Mobile - Shared Badge Component
 * Status and label badges
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

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
  return (
    <View style={[styles.badge, styles[`variant_${variant}`], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  variant_success: {
    backgroundColor: '#d1fae5',
  },
  variant_warning: {
    backgroundColor: '#fef3c7',
  },
  variant_error: {
    backgroundColor: '#fee2e2',
  },
  variant_info: {
    backgroundColor: '#dbeafe',
  },
  variant_default: {
    backgroundColor: '#f3f4f6',
  },
  size_small: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  size_medium: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  size_large: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  text_success: {
    color: '#047857',
  },
  text_warning: {
    color: '#b45309',
  },
  text_error: {
    color: '#dc2626',
  },
  text_info: {
    color: '#0369a1',
  },
  text_default: {
    color: '#4b5563',
  },
});

export default Badge;
