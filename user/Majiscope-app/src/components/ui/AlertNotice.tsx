import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { radii } from '../../theme/tokens';

interface AlertNoticeProps {
  title?: string;
  message: string;
  variant?: 'info' | 'warning' | 'success' | 'danger';
  style?: ViewStyle;
}

export default function AlertNotice({ title, message, variant = 'warning', style }: AlertNoticeProps) {
  const { colors } = useTheme();

  const palette =
    variant === 'danger'
      ? { bg: colors.dangerMuted, border: colors.danger, icon: 'error-outline' as const }
      : variant === 'success'
        ? { bg: colors.successMuted, border: colors.success, icon: 'check-circle-outline' as const }
        : variant === 'info'
          ? { bg: colors.primaryMuted, border: colors.primary, icon: 'info-outline' as const }
          : { bg: colors.warningMuted, border: colors.warning, icon: 'warning-amber' as const };

  return (
    <View style={[styles.box, { backgroundColor: palette.bg, borderColor: palette.border }, style]}>
      <MaterialIcons name={palette.icon} size={20} color={palette.border} style={styles.icon} />
      <View style={styles.copy}>
        {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radii.md,
    padding: 12,
    marginVertical: 6,
  },
  icon: {
    marginRight: 10,
    marginTop: 1,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
  },
});
