import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { gradients, radii } from '../../theme/tokens';

interface OptionChipProps {
  label: string;
  sublabel?: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function OptionChip({
  label,
  sublabel,
  selected = false,
  onPress,
  disabled = false,
  style,
}: OptionChipProps) {
  const { colors } = useTheme();

  const inner = (
    <>
      <Text style={[styles.label, { color: selected ? colors.primaryDark : colors.text }]}>{label}</Text>
      {sublabel ? (
        <Text style={[styles.sublabel, { color: colors.textSecondary }]}>{sublabel}</Text>
      ) : null}
    </>
  );

  if (selected) {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress} disabled={disabled} style={[disabled && styles.disabled, style]}>
        <LinearGradient colors={[gradients.mesh[0], gradients.mesh[1], gradients.mesh[2]]} style={styles.chipSelected}>
          <View style={[styles.chipInner, { borderColor: colors.primary }]}>{inner}</View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        { borderColor: colors.border, backgroundColor: colors.surface },
        disabled && styles.disabled,
        style,
      ]}
    >
      {inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  chipSelected: { borderRadius: radii.lg, padding: 2 },
  chipInner: {
    borderWidth: 2,
    borderRadius: radii.lg - 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  label: { fontSize: 16, fontWeight: '800' },
  sublabel: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  disabled: { opacity: 0.55 },
});
