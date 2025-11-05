import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from './SettingScreen.styles';
import React, { useState } from "react";

interface SettingScreenProps {
    navigation: any;
}

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    const languages: Language[] = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
        { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
        { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    ];

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguage(code);
        // Add your language change logic here
        // e.g., i18n.changeLanguage(code);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={handleBackButton}
                    activeOpacity={0.6}
                >
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Section Header */}
                <View style={styles.sectionHeader}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="globe-outline" size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.sectionTextContainer}>
                        <Text style={styles.sectionTitle}>Language Preference</Text>
                        <Text style={styles.sectionDescription}>
                            Select your preferred language for the app
                        </Text>
                    </View>
                </View>

                {/* Language List */}
                <View style={styles.languageList}>
                    {languages.map((language, index) => (
                        <TouchableOpacity
                            key={language.code}
                            style={[
                                styles.languageItem,
                                selectedLanguage === language.code && styles.languageItemSelected,
                            ]}
                            onPress={() => handleLanguageSelect(language.code)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.languageContent}>
                                <Text style={styles.languageFlag}>{language.flag}</Text>
                                <View style={styles.languageTextContainer}>
                                    <Text style={[
                                        styles.languageName,
                                        selectedLanguage === language.code && styles.languageNameSelected
                                    ]}>
                                        {language.nativeName}
                                    </Text>
                                    <Text style={styles.languageSubtext}>{language.name}</Text>
                                </View>
                            </View>

                            <View style={styles.selectionIndicator}>
                                {selectedLanguage === language.code ? (
                                    <View style={styles.selectedDot}>
                                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                    </View>
                                ) : (
                                    <View style={styles.unselectedDot} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <Feather name="info" size={18} color="#3B82F6" />
                    </View>
                    <Text style={styles.infoText}>
                        Language changes will take effect immediately. Some content may require an app restart.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default SettingScreen;
