import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { GlassCard, GradientBackground } from '../components/ui';
import { gradients, radii, shadows } from '../theme/tokens';
import { useAppLanguage } from '../context/LanguageContext';

interface TutorialScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const STEPS_EN = [
  { title: 'Capture Evidence', description: 'Take a clear photo or short video so the utility can see the problem before visiting.', icon: 'photo-camera' as const, colors: ['#2563eb', '#06b6d4'] as const },
  { title: 'Pin Your Location', description: 'Capture GPS, then drag the red pin on the map to the exact spot.', icon: 'my-location' as const, colors: ['#0891b2', '#06b6d4'] as const },
  { title: 'Set Priority', description: 'Choose how urgent the issue is so the team can plan the response.', icon: 'priority-high' as const, colors: ['#d97706', '#f59e0b'] as const },
  { title: 'Choose Report Type', description: 'Select whether it is a leak or another water issue, and choose the leakage type if needed.', icon: 'category' as const, colors: ['#7c3aed', '#a855f7'] as const },
  { title: 'Submit & Track', description: 'Add a short description, send your report, and follow progress in My Reports.', icon: 'track-changes' as const, colors: ['#059669', '#10b981'] as const },
];

const STEPS_SW = [
  { title: 'Chukua Ushahidi', description: 'Chukua picha wazi au video fupi ili huduma ya maji ione shida kabla ya kufika.', icon: 'photo-camera' as const, colors: ['#2563eb', '#06b6d4'] as const },
  { title: 'Weka Eneo Lako', description: 'Pata GPS, kisha buruta alama nyekundu kwenye ramani hadi mahali halisi.', icon: 'my-location' as const, colors: ['#0891b2', '#06b6d4'] as const },
  { title: 'Weka Kipaumbele', description: 'Chagua jinsi shida ilivyo ya haraka ili timu ipange majibu.', icon: 'priority-high' as const, colors: ['#d97706', '#f59e0b'] as const },
  { title: 'Chagua Aina ya Ripoti', description: 'Chagua kama ni uvujaji au shida nyingine ya maji, kisha chagua aina ya uvujaji ikihitajika.', icon: 'category' as const, colors: ['#7c3aed', '#a855f7'] as const },
  { title: 'Wasilisha na Ufuate', description: 'Ongeza maelezo mafupi, tuma ripoti yako, na ufuate maendeleo katika Ripoti Zangu.', icon: 'track-changes' as const, colors: ['#059669', '#10b981'] as const },
];

export default function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const { language } = useAppLanguage();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = language === 'sw' ? STEPS_SW : STEPS_EN;
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
            <Text style={styles.skipText}>{language === 'sw' ? 'Ruka' : 'Skip'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(8, insets.bottom + 8) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressRow}>
            {steps.map((_, i) => (
              <View key={i} style={[styles.progressSeg, i <= currentStep && styles.progressSegActive]} />
            ))}
          </View>

          <GlassCard style={styles.heroCard} padding={20}>
            <LinearGradient colors={[...step.colors]} style={styles.iconGradient}>
              <MaterialIcons name={step.icon} size={44} color="#fff" />
            </LinearGradient>
            <Text style={styles.stepCount}>{currentStep + 1} / {steps.length}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </GlassCard>

          <View style={styles.thumbRow}>
            {steps.map((s, i) => (
              <TouchableOpacity key={s.title} onPress={() => setCurrentStep(i)} activeOpacity={0.85}>
                <LinearGradient
                  colors={i === currentStep ? [...s.colors] : ['#e2e8f0', '#f1f5f9']}
                  style={styles.thumb}
                >
                  <MaterialIcons name={s.icon} size={20} color={i === currentStep ? '#fff' : '#94a3b8'} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 12) }]}> 
          {currentStep > 0 ? (
            <PrimaryButton title={language === 'sw' ? 'Rudi' : 'Back'} variant="secondary" onPress={() => setCurrentStep((s) => s - 1)} />
          ) : null}
          <PrimaryButton title={isLast ? (language === 'sw' ? 'Anza Sasa' : 'Get Started') : (language === 'sw' ? 'Endelea' : 'Continue')} onPress={() => (isLast ? onComplete() : setCurrentStep((s) => s + 1))} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4 },
  skipBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: radii.pill },
  skipText: { fontSize: 14, fontWeight: '700', color: '#0891b2' },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  progressSeg: { flex: 1, height: 4, borderRadius: radii.pill, backgroundColor: 'rgba(8,145,178,0.15)' },
  progressSegActive: { backgroundColor: '#0891b2' },
  heroCard: { alignItems: 'center', minHeight: width * 0.52, justifyContent: 'center', ...shadows.float },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...shadows.soft,
  },
  stepCount: { fontSize: 12, fontWeight: '800', color: '#0891b2', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 10 },
  description: { fontSize: 15, lineHeight: 22, color: '#64748b', textAlign: 'center', maxWidth: 300 },
  thumbRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 16 },
  thumb: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, gap: 4 },
});
