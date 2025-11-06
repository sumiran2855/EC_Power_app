import { useState, useCallback } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const useSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  ];

  const handleLanguageSelect = useCallback((code: string) => {
    setSelectedLanguage(code);
    // Add your language change logic here
    // e.g., i18n.changeLanguage(code);
  }, []);

  return {
    selectedLanguage,
    languages,
    handleLanguageSelect,
  };
};

export default useSettings;
