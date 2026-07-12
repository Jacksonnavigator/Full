import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import BrandWordmark from './BrandWordmark';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppLanguage } from '../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onLanguagePress?: () => void;
  style?: ViewStyle;
}

export default function AppHeader({ title, subtitle, rightElement, onLanguagePress, style }: AppHeaderProps) {
  const { colors } = useTheme();
  const { language } = useAppLanguage();
  const navigation = useNavigation<any>();

  const handleLanguagePress = onLanguagePress ?? (() => navigation.navigate('LanguageSelection'));

  return (
    <LinearGradient
      colors={["#CDEFF4", "#A9E4EE", "#DFF8FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <BrandWordmark size="md" surface="light" centered={false} />
        </View>

        <View style={styles.rightCol}>
          {rightElement ? (
            rightElement
          ) : (
            <>
              <TouchableOpacity style={[styles.languagePill, { backgroundColor: colors.card }]} onPress={handleLanguagePress} activeOpacity={0.85}>
                <MaterialIcons name="public" size={18} color={colors.primary} />
                <Text style={[styles.languageText, { color: colors.primary }]}>{language === 'sw' ? 'Kiswahili' : 'English'}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.primary} />
              </TouchableOpacity>
              <View style={styles.poweredSecondary}>
                <Text style={[styles.poweredTextSmall, { color: colors.primary }]}>Powered by</Text>
                <Text style={[styles.poweredBrandSmall, { color: colors.primary }]}>Water Ministry</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}

      <View style={styles.waveWrap} pointerEvents="none">
        <Svg width="100%" height={72} viewBox="0 0 375 72" preserveAspectRatio="none">
          <Path d="M0 30 C60 64 120 12 180 30 C240 48 300 18 360 40 C372 46 384 52 375 56 L375 72 L0 72 Z" fill="rgba(6,139,176,0.22)" />
          <Path d="M0 38 C70 66 140 24 210 38 C280 52 330 30 375 50 L375 72 L0 72 Z" fill="rgba(3,105,121,0.32)" />
        </Svg>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 26,
    paddingHorizontal: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 18,
    overflow: 'visible',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftRow: { flexDirection: 'row', alignItems: 'center' },
  poweredSecondary: { marginTop: 6, alignItems: 'flex-end' },
  poweredTextSmall: { fontSize: 10, fontWeight: '700', opacity: 0.9 },
  poweredBrandSmall: { fontSize: 11, fontWeight: '900', marginTop: -2 },
  rightCol: { alignItems: 'flex-end' },
  languagePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(15,23,42,0.06)', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  languageText: { marginHorizontal: 6, fontSize: 14, fontWeight: '700' },
  title: { marginTop: 22, fontSize: 30, fontWeight: '900' },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 20, fontWeight: '600' },
  waveWrap: { position: 'absolute', left: 0, right: 0, bottom: -8, height: 64, overflow: 'visible' },
});
