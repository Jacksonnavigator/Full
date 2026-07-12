import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { radii, shadows } from '../../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ children, style, variant = 'elevated', padding = 'md' }: CardProps) {
  const { colors } = useTheme();

  const paddingStyle =
    padding === 'none' ? null : padding === 'sm' ? styles.padSm : padding === 'md' ? styles.padMd : styles.padLg;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.card, borderColor: colors.border },
        variant === 'elevated' && shadows.card,
        variant === 'outlined' && styles.outlined,
        variant === 'flat' && styles.flat,
        paddingStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  outlined: {
    borderWidth: 1.5,
  },
  flat: {
    borderWidth: 0,
  },
  padSm: { padding: 10 },
  padMd: { padding: 14 },
  padLg: { padding: 18 },
});
