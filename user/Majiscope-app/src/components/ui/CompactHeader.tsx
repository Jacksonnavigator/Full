import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { radii } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

interface CompactHeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export default function CompactHeader({ title, subtitle, icon }: CompactHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
        </View>
        {icon ? (
          <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
            <MaterialIcons name={icon} size={20} color="#fff" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  title: { fontSize: 28, fontWeight: '900', lineHeight: 34 },
  subtitle: { fontSize: 15, marginTop: 6 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
});
