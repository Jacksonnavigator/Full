import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import BrandWordmark from '../BrandWordmark';
import { typography } from '../../theme/tokens';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBrand?: boolean;
  centered?: boolean;
  style?: ViewStyle;
}

export default function ScreenHeader({
  title,
  subtitle,
  showBrand = false,
  centered = true,
  style,
}: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, centered && styles.centered, style]}>
      {showBrand ? (
        <View style={styles.brand}>
          <BrandWordmark size="sm" surface="light" centered={centered} />
        </View>
      ) : null}
      <Text style={[styles.title, { color: colors.text }, centered && styles.titleCentered]}>{title}</Text>
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary },
            centered && styles.subtitleCentered,
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  centered: {
    alignItems: 'center',
  },
  brand: {
    marginBottom: 12,
  },
  title: {
    ...typography.hero,
    fontSize: 26,
  },
  titleCentered: {
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: 8,
    fontSize: 14,
  },
  subtitleCentered: {
    textAlign: 'center',
  },
});
