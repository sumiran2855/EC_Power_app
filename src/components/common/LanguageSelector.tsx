import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const LANGUAGES = [
  { label: 'English', value: 'en', flag: '🇺🇸' },
  { label: 'German', value: 'de', flag: '🇩🇪' },
  { label: 'Danish', value: 'da', flag: '🇩🇰' },
  { label: 'Italian', value: 'it', flag: '🇮🇹' },
  { label: 'French', value: 'fr', flag: '🇫🇷' },
  { label: 'Polish', value: 'pl', flag: '🇵🇱' },
];

export const HorizontalScrollLanguageSelector = ({ selectedLanguage, onLanguageChange, styles }:any) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.languageContainer}>
      <Text style={styles.languageLabel}>{t('settings.languagePreference.title')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.value}
            style={[
              styles.languageChip,
              selectedLanguage === lang.value && styles.selectedChip
            ]}
            onPress={() => onLanguageChange(lang.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipFlag}>{lang.flag}</Text>
            <Text style={[
              styles.chipText,
              selectedLanguage === lang.value && styles.selectedChipText
            ]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};