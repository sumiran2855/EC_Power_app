import { Feather, Ionicons } from '@expo/vector-icons';
import React from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useSettings from '../../hooks/useSettings';
import styles from './SettingScreen.styles';

interface SettingScreenProps {
    navigation: any;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const { selectedLanguage, languages, handleLanguageSelect } = useSettings();

    const handleBackButton = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackButton}
                    activeOpacity={0.6}
                >
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings.title')}</Text>
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
                        <Text style={styles.sectionTitle}>{t('settings.languagePreference.title')}</Text>
                        <Text style={styles.sectionDescription}>
                            {t('settings.languagePreference.description')}
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
                        {t('settings.info.text')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SettingScreen;
