import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { gradients, radii, shadows } from '../theme/tokens';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  icon,
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const content = loading ? (
    <ActivityIndicator color={isPrimary || isDanger ? '#fff' : colors.primary} />
  ) : (
    <View style={styles.labelRow}>
      {icon}
      <Text
        style={[
          styles.text,
          (isPrimary || isDanger) && styles.textPrimary,
          variant === 'secondary' && { color: colors.primary },
          isGhost && { color: colors.primary },
        ]}
      >
        {title}
      </Text>
    </View>
  );

  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.88} style={[styles.wrap, style]}>
        <LinearGradient
          colors={[...gradients.button]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, disabled && styles.disabled]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (isDanger && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.88} style={[styles.wrap, style]}>
        <LinearGradient
          colors={['#dc2626', '#ef4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.wrap,
        styles.button,
        variant === 'secondary' && {
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: colors.primary,
        },
        isGhost && { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 4, ...shadows.soft },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  textPrimary: { color: '#fff' },
  disabled: { opacity: 0.45 },
});
