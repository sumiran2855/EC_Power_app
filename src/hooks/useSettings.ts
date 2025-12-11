import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import i18n from '../../languages/i18n.config';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGE_STORAGE_KEY = '@app_language';

const useSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadSavedLanguage();
  }, []);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  ];

  const handleLanguageSelect = useCallback(async (code: string) => {
    setSelectedLanguage(code);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      await i18n.changeLanguage(code);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  return {
    selectedLanguage,
    languages,
    handleLanguageSelect,
  };
};

export default useSettings;
