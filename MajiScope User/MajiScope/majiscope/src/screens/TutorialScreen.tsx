import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandWordmark from '../components/BrandWordmark';
import PrimaryButton from '../components/PrimaryButton';
import { GlassCard, GradientBackground } from '../components/ui';
import { gradients, radii, shadows } from '../theme/tokens';

interface TutorialScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const STEPS = [
  { title: 'Pin Your Location', description: 'Drop the map pin on the exact spot so repair crews arrive at the right place.', icon: 'my-location' as const, colors: ['#0891b2', '#06b6d4'] as const },
  { title: 'Capture Evidence', description: 'Take a photo or short video so the utility can see the problem before visiting.', icon: 'photo-camera' as const, colors: ['#2563eb', '#06b6d4'] as const },
  { title: 'Set Priority & Type', description: 'Tell us how urgent it is and whether it is a leak or another water issue.', icon: 'priority-high' as const, colors: ['#d97706', '#f59e0b'] as const },
  { title: 'Submit & Track', description: 'Add a description, send your report, and follow progress in My Reports.', icon: 'track-changes' as const, colors: ['#059669', '#10b981'] as const },
];

export default function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <BrandWordmark size="sm" surface="light" centered={false} />
          <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.progressRow}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.progressSeg, i <= currentStep && styles.progressSegActive]} />
            ))}
          </View>

          <GlassCard style={styles.heroCard} padding={28}>
            <LinearGradient colors={[...step.colors]} style={styles.iconGradient}>
              <MaterialIcons name={step.icon} size={44} color="#fff" />
            </LinearGradient>
            <Text style={styles.stepCount}>{currentStep + 1} / {STEPS.length}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </GlassCard>

          <View style={styles.thumbRow}>
            {STEPS.map((s, i) => (
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

        <View style={styles.footer}>
          {currentStep > 0 ? (
            <PrimaryButton title="Back" variant="secondary" onPress={() => setCurrentStep((s) => s - 1)} />
          ) : null}
          <PrimaryButton title={isLast ? 'Get Started' : 'Continue'} onPress={() => (isLast ? onComplete() : setCurrentStep((s) => s + 1))} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 },
  skipBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: radii.pill },
  skipText: { fontSize: 14, fontWeight: '700', color: '#0891b2' },
  scroll: { padding: 20, paddingBottom: 12 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressSeg: { flex: 1, height: 5, borderRadius: radii.pill, backgroundColor: 'rgba(8,145,178,0.15)' },
  progressSegActive: { backgroundColor: '#0891b2' },
  heroCard: { alignItems: 'center', minHeight: width * 0.68, justifyContent: 'center', ...shadows.float },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...shadows.soft,
  },
  stepCount: { fontSize: 12, fontWeight: '800', color: '#0891b2', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 24, color: '#64748b', textAlign: 'center', maxWidth: 300 },
  thumbRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24 },
  thumb: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: 20, paddingBottom: 28, gap: 4 },
});
