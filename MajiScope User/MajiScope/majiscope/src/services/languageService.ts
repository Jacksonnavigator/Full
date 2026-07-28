import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguage = 'sw' | 'en';

const LANGUAGE_STORAGE_KEY = 'majiscope_app_language';

export async function getStoredLanguage(): Promise<AppLanguage> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'sw' ? 'sw' : 'en';
  } catch {
    return 'en';
  }
}

export async function setStoredLanguage(language: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function getLanguageLabel(language: AppLanguage): string {
  return language === 'sw' ? 'Kiswahili' : 'English';
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
