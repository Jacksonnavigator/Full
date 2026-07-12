import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import BrandWordmark from './BrandWordmark';
import { useAppLanguage } from '../context/LanguageContext';

type Props = {
  onLanguagePress?: () => void;
};

export default function ReportHeader({ onLanguagePress }: Props) {
  const { colors } = useTheme();
  const { language } = useAppLanguage();

  return (
    <LinearGradient
      colors={["#EAF8FF", "#D6F1FF", "#C8ECFA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.topRow}>
        <View style={styles.logoSection}>
          <BrandWordmark size="md" surface="light" centered={false} />
          <Text style={[styles.brand, { color: colors.primary }]}>DAWASA</Text>
        </View>

        <TouchableOpacity style={styles.languageButton} onPress={onLanguagePress} activeOpacity={0.85}>
          <Ionicons name="language-outline" size={18} color={colors.primary} />
          <Text style={[styles.languageText, { color: colors.primary }]}>{language === 'sw' ? 'Kiswahili' : 'English'}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">
        {language === 'sw' ? 'Ripoti Tatizo la Maji' : 'Report a Problem'}
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2} ellipsizeMode="tail">
        {language === 'sw'
          ? 'Tusaidie kuboresha huduma za maji kwa kuripoti matatizo kwa haraka.'
          : 'Help us improve water services by reporting problems quickly.'}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brand: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: '700',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  languageText: {
    marginHorizontal: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '800',
    color: '#102A43',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#52667A',
  },
});
