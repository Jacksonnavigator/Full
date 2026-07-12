import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguage = 'sw' | 'en';

const LANGUAGE_STORAGE_KEY = 'majiscope_app_language';

export async function getStoredLanguage(): Promise<AppLanguage | null> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'sw' || saved === 'en') {
      return saved;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getResolvedLanguage(): Promise<AppLanguage> {
  const stored = await getStoredLanguage();
  return stored ?? 'en';
}

export async function setStoredLanguage(language: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function getLanguageLabel(language: AppLanguage): string {
  return language === 'sw' ? 'Kiswahili' : 'English';
}

export function getText(language: AppLanguage, englishText: string, swahiliText: string): string {
  return language === 'sw' ? swahiliText : englishText;
}

export function getLanguageCopy(language: AppLanguage) {
  if (language === 'sw') {
    return {
      title: 'Chagua Lugha',
      subtitle: 'Chagua lugha unayotaka kutumia kwenye MajiScope.',
      english: 'Kiingereza',
      swahili: 'Kiswahili',
      continue: 'Endelea',
      description: 'Baada ya kusakinisha, chagua lugha yako ya kwanza kabla ya kuanza.',
    };
  }

  return {
    title: 'Choose Language',
    subtitle: 'Select the language you want to use in MajiScope.',
    english: 'English',
    swahili: 'Swahili',
    continue: 'Continue',
    description: 'After installation, choose your preferred language before you begin.',
  };
}
