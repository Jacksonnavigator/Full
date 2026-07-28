import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandWordmark from '../components/BrandWordmark';
import PrimaryButton from '../components/PrimaryButton';
import { GlassCard, GradientBackground, OptionChip } from '../components/ui';
import { setStoredLanguage, getLanguageCopy, AppLanguage } from '../services/languageService';

interface LanguageSelectionScreenProps {
  onComplete: (language: AppLanguage) => void;
}

export default function LanguageSelectionScreen({ onComplete }: LanguageSelectionScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>('sw');
  const copy = getLanguageCopy(selectedLanguage);

  const handleContinue = async () => {
    await setStoredLanguage(selectedLanguage);
    onComplete(selectedLanguage);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.hero}>
            <BrandWordmark size="lg" surface="light" />
            <Text style={styles.heroSub}>Choose your language to continue</Text>
          </View>

          <GlassCard style={styles.card}>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>

            <View style={styles.options}>
              <OptionChip
                label={`🇹🇿  ${copy.swahili}`}
                sublabel="Kiswahili — recommended"
                selected={selectedLanguage === 'sw'}
                onPress={() => setSelectedLanguage('sw')}
              />
              <OptionChip
                label={`🇬🇧  ${copy.english}`}
                sublabel="English"
                selected={selectedLanguage === 'en'}
                onPress={() => setSelectedLanguage('en')}
              />
            </View>

            <PrimaryButton title={copy.continue} onPress={handleContinue} />
          </GlassCard>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  inner: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  hero: { alignItems: 'center', marginBottom: 28 },
  heroSub: { marginTop: 12, fontSize: 14, color: '#0e7490', fontWeight: '600' },
  card: { width: '100%' },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 21, marginBottom: 20 },
  options: { gap: 12, marginBottom: 8 },
});
