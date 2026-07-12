import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
};

export const PaginationBar: React.FC<Props> = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPrev,
  onNext,
  disabled = false,
}) => {
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalItems);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={[styles.button, (page === 0 || disabled) && styles.buttonDisabled]}
        onPress={onPrev}
        disabled={page === 0 || disabled}
        activeOpacity={0.85}
      >
        <Ionicons name="chevron-back" size={16} color={page === 0 || disabled ? colors.textMuted : colors.primary} />
        <Text style={[styles.buttonText, (page === 0 || disabled) && styles.buttonTextDisabled]}>Prev</Text>
      </TouchableOpacity>

      <View style={styles.meta}>
        <Text style={styles.metaPrimary}>
          {start}-{end} of {totalItems}
        </Text>
        <Text style={styles.metaSecondary}>
          Page {page + 1} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, (page >= totalPages - 1 || disabled) && styles.buttonDisabled]}
        onPress={onNext}
        disabled={page >= totalPages - 1 || disabled}
        activeOpacity={0.85}
      >
        <Text style={[styles.buttonText, (page >= totalPages - 1 || disabled) && styles.buttonTextDisabled]}>Next</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={page >= totalPages - 1 || disabled ? colors.textMuted : colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.textMuted,
  },
  meta: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  metaPrimary: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.foreground,
  },
  metaSecondary: {
    marginTop: 2,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.semibold,
  },
});
