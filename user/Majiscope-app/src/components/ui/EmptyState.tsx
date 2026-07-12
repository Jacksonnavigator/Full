import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import PrimaryButton from '../PrimaryButton';
import { gradients, radii, shadows } from '../../theme/tokens';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient colors={[...gradients.button]} style={styles.iconCircle}>
        <MaterialIcons name={icon} size={34} color="#fff" />
      </LinearGradient>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.soft,
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  message: { fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 280 },
  button: { marginTop: 18, alignSelf: 'stretch' },
});
