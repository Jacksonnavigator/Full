import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { GlassCard, GradientBackground, OptionChip } from '../components/ui';
import { useAppLanguage } from '../context/LanguageContext';
import { getLanguageCopy, AppLanguage } from '../services/languageService';

interface LanguageSelectionScreenProps {
  onComplete: (language: AppLanguage) => void;
}

export default function LanguageSelectionScreen({ onComplete }: LanguageSelectionScreenProps) {
  const { language: currentLanguage, setLanguage } = useAppLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(currentLanguage);
  const copy = getLanguageCopy(selectedLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleContinue = async () => {
    await setLanguage(selectedLanguage);
    onComplete(selectedLanguage);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          {/* Intentionally no AppHeader here — the screen is presented as a modal without the main app header */}
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
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  inner: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  hero: { alignItems: 'center', marginBottom: 18 },
  heroSub: { marginTop: 8, fontSize: 14, color: '#0e7490', fontWeight: '600' },
  card: { width: '100%' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 14 },
  options: { gap: 10, marginBottom: 6 },
});
