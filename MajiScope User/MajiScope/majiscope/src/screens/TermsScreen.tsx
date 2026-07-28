import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';
import { AlertNotice, Card, HeroHeader } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { gradients } from '../theme/tokens';

const SECTIONS = [
  { icon: 'water-drop' as const, title: 'What MajiScope Does', body: 'Report water problems — leakage, contamination, supply issues — so the responsible team can follow up faster.' },
  { icon: 'location-on' as const, title: 'Location and Media', body: 'Your GPS pin and photos help crews find and understand the problem. Data is used only for your report.' },
  { icon: 'verified-user' as const, title: 'Use It Responsibly', body: 'Submit genuine reports with accurate location, clear description, and useful media. No false or offensive content.' },
  { icon: 'lock' as const, title: 'Your Privacy', body: 'Report details stay within the reporting process and are not used for unrelated purposes.' },
];

export default function TermsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppHeader title="Guidelines" subtitle="Quick guide to using MajiScope correctly." />
        <HeroHeader title="Before You Report" subtitle="Quick guide to using MajiScope correctly." icon="gavel" badge="Guidelines" />

        {SECTIONS.map((section) => (
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

        <AlertNotice title="Important" message="Response time depends on the utility team. Urgent cases may be handled first." variant="warning" />

        <LinearGradient colors={[...gradients.button]} style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to use MajiScope for genuine water problem reporting.</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  section: { marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '800', flex: 1 },
  paragraph: { fontSize: 14, lineHeight: 22 },
  footer: { padding: 18, borderRadius: 20, marginTop: 8 },
  footerText: { fontSize: 14, lineHeight: 21, textAlign: 'center', color: '#fff', fontWeight: '700' },
});
