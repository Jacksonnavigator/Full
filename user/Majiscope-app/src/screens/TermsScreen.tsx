import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertNotice, Card } from '../components/ui';
import AppHeader from '../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { SCREEN_PADDING_H, SCREEN_PADDING_TOP, SCREEN_SECTION_GAP } from '../theme/screenLayout';
import { gradients } from '../theme/tokens';
import { useAppLanguage } from '../context/LanguageContext';

const SECTIONS = [
  { icon: 'water-drop' as const, title: 'What MajiScope Does', body: 'Report water problems — leakage, contamination, supply issues — so the responsible team can follow up faster.' },
  { icon: 'location-on' as const, title: 'Location and Media', body: 'Your GPS pin and photos help crews find and understand the problem. Data is used only for your report.' },
  { icon: 'verified-user' as const, title: 'Use It Responsibly', body: 'Submit genuine reports with accurate location, clear description, and useful media. No false or offensive content.' },
  { icon: 'lock' as const, title: 'Your Privacy', body: 'Report details stay within the reporting process and are not used for unrelated purposes.' },
];

const SECTIONS_SW = [
  { icon: 'water-drop' as const, title: 'MajiScope Inafanya Nini', body: 'Ripoti matatizo ya maji — uvujaji, uchafuzi, na matatizo ya usambazaji — ili timu husika iweze kufuatilia haraka.' },
  { icon: 'location-on' as const, title: 'Eneo na Midia', body: 'Alama yako ya GPS na picha husaidia wafanyakazi kupata na kuelewa tatizo. Data hutumiwa tu kwa ripoti yako.' },
  { icon: 'verified-user' as const, title: 'Tumia Kwa Uwajibikaji', body: 'Wasilisha ripoti za kweli zenye eneo sahihi, maelezo ya wazi, na midia muhimu. Hakuna maudhui ya uongo au ya kukera.' },
  { icon: 'lock' as const, title: 'Faragha Yako', body: 'Maelezo ya ripoti hukaa ndani ya mchakato wa kuripoti na hayatumiwi kwa madhumuni mengine.' },
];

export default function TermsScreen() {
  const { colors } = useTheme();
  const { language } = useAppLanguage();
  const navigation = useNavigation<any>();
  const sections = language === 'sw' ? SECTIONS_SW : SECTIONS;
  const bottomPadding = useBottomTabPadding();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}>
        <AppHeader title={language === 'sw' ? 'Kabla ya Kuripoti' : 'Before You Report'} subtitle={language === 'sw' ? 'Mwongozo wa haraka wa kutumia MajiScope kwa usahihi.' : 'Quick guide to using MajiScope correctly.'} onLanguagePress={() => navigation.navigate('LanguageSelection')} />

        {sections.map((section) => (
          <Card key={section.title} style={styles.section} padding="md">
            <View style={styles.sectionHeader}>
              <LinearGradient colors={[...gradients.accent]} style={styles.iconWrap}>
                <MaterialIcons name={section.icon} size={20} color="#fff" />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            </View>
            <Text style={[styles.paragraph, { color: colors.textSecondary }]}>{section.body}</Text>
          </Card>
        ))}

        <AlertNotice title={language === 'sw' ? 'Muhimu' : 'Important'} message={language === 'sw' ? 'Muda wa majibu unategemea timu ya huduma ya maji. Kesi za dharura zinaweza kushughulikiwa kwanza.' : 'Response time depends on the utility team. Urgent cases may be handled first.'} variant="warning" />

        <LinearGradient colors={[...gradients.button]} style={styles.footer}>
          <Text style={styles.footerText}>{language === 'sw' ? 'Kwa kuendelea, unakubali kutumia MajiScope kwa kuripoti matatizo ya maji ya kweli.' : 'By continuing, you agree to use MajiScope for genuine water problem reporting.'}</Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: SCREEN_PADDING_H, paddingTop: SCREEN_PADDING_TOP },
  section: { marginBottom: SCREEN_SECTION_GAP },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', flex: 1 },
  paragraph: { fontSize: 14, lineHeight: 21 },
  footer: { padding: 14, borderRadius: 16, marginTop: 6 },
  footerText: { fontSize: 14, lineHeight: 21, textAlign: 'center', color: '#fff', fontWeight: '700' },
});
