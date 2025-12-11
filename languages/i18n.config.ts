import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import da from './locales/da.json';
import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import pl from './locales/pl.json';


const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  da: { translation: da },
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
  pl: { translation: pl },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (!savedLanguage) {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    savedLanguage = deviceLanguage;
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage || 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

initI18n();

export default i18n;