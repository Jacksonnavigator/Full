import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { radii } from '../../theme/tokens';

export type SelectDropdownOption<T extends string> = {
  value: T;
  label: string;
  sublabel?: string;
  description?: string;
};

type SelectDropdownProps<T extends string> = {
  placeholder: string;
  value: T | null;
  options: SelectDropdownOption<T>[];
  onSelect: (value: T) => void;
  disabled?: boolean;
  sheetTitle?: string;
};

export default function SelectDropdown<T extends string>({
  placeholder,
  value,
  options,
  onSelect,
  disabled = false,
  sheetTitle,
}: SelectDropdownProps<T>) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const close = () => setOpen(false);

  const handleSelect = (nextValue: T) => {
    onSelect(nextValue);
    close();
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            borderColor: selected ? colors.primary : colors.border,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
      >
        <View style={styles.triggerCopy}>
          <Text
            style={[
              styles.triggerText,
              { color: selected ? colors.text : colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {selected ? selected.label : placeholder}
          </Text>
          {selected?.sublabel ? (
            <Text style={[styles.triggerSubtext, { color: colors.textSecondary }]} numberOfLines={1}>
              {selected.sublabel}
            </Text>
          ) : null}
        </View>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable
          style={[styles.backdrop, { paddingBottom: Math.max(insets.bottom, 16) }]}
          onPress={close}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: Math.max(insets.bottom, 16) }]}
            onPress={() => undefined}
          >
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                {sheetTitle || placeholder}
              </Text>
              <TouchableOpacity onPress={close} hitSlop={12} accessibilityLabel="Close">
                <MaterialIcons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={[styles.optionsContent, { paddingBottom: Math.max(insets.bottom, 18) }]}
              keyboardShouldPersistTaps="handled"
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? `${colors.primary}12` : colors.surface,
                      },
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.optionCopy}>
                      <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                      {option.sublabel ? (
                        <Text style={[styles.optionSublabel, { color: colors.textSecondary }]}>
                          {option.sublabel}
                        </Text>
                      ) : null}
                      {option.description ? (
                        <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected ? (
                      <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    marginTop: 8,
    minHeight: 46,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  triggerCopy: {
    flex: 1,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '700',
  },
  triggerSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.55,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  sheet: {
    borderRadius: radii.xl,
    maxHeight: '78%',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    paddingRight: 12,
  },
  optionsList: {
    paddingHorizontal: 12,
  },
  optionsContent: {
    paddingBottom: 18,
  },
  option: {
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionCopy: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionSublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
});
