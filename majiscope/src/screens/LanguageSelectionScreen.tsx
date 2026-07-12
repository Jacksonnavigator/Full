import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppLanguage } from '../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { AppLanguage, getLanguageCopy } from '../services/languageService';
import { colors, spacing, borderRadius } from '../theme';

export default function LanguageSelectionScreen() {
  const { language: currentLanguage, setLanguage } = useAppLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(currentLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();
  const copy = getLanguageCopy(selectedLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await setLanguage(selectedLanguage);
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionCard, selectedLanguage === 'sw' && styles.optionCardSelected]}
            onPress={() => setSelectedLanguage('sw')}
            activeOpacity={0.7}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionFlag}>🇹🇿</Text>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Kiswahili</Text>
                  <Text style={styles.optionSubtitle}>
                    {selectedLanguage === 'sw' ? 'Karibu — inshallah' : 'Recommended'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radio,
                  selectedLanguage === 'sw' && styles.radioSelected,
                  selectedLanguage === 'sw' && { backgroundColor: colors.primary },
                ]}
              >
                {selectedLanguage === 'sw' && (
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, selectedLanguage === 'en' && styles.optionCardSelected]}
            onPress={() => setSelectedLanguage('en')}
            activeOpacity={0.7}
          >
            <View style={styles.optionHeader}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionFlag}>🇬🇧</Text>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>English</Text>
                  <Text style={styles.optionSubtitle}>Global language</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radio,
                  selectedLanguage === 'en' && styles.radioSelected,
                  selectedLanguage === 'en' && { backgroundColor: colors.primary },
                ]}
              >
                {selectedLanguage === 'en' && (
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? copy.continue + '...' : copy.continue}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>{copy.description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 440,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 440,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  optionCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionFlag: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  continueButton: {
    width: '100%',
    maxWidth: 440,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 440,
  },
});
