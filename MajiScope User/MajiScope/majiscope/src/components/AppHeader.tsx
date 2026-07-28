import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BrandWordmark from './BrandWordmark';
import { useTheme } from '../context/ThemeContext';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onLanguagePress?: () => void;
  style?: ViewStyle;
}

export default function AppHeader({ title, subtitle, onLanguagePress, style }: AppHeaderProps) {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const handlePress = onLanguagePress ?? (() => navigation.navigate('LanguageSelection'));

  return (
    <LinearGradient
      colors={[colors.headerGradientStart, colors.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <BrandWordmark size="md" surface="light" centered={false} />
        </View>
        <View style={styles.rightCol}>
          <TouchableOpacity style={[styles.languagePill, { backgroundColor: colors.card }]} onPress={handlePress} activeOpacity={0.85}>
            <MaterialIcons name="public" size={18} color={colors.primary} />
            <Text style={[styles.languageText, { color: colors.primary }]}>Language</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {title ? <Text style={[styles.title, { color: '#fff' }]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.85)' }]}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  languageText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
});
