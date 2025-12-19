import Alert from '@/components/Modals/Alert';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useContact from '../../hooks/useContact';
import { styles } from './ContactScreen.styles';

interface ContactScreenProps {
    navigation: any;
}

const ContactScreen: React.FC<ContactScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const {
        formData,
        dropdownOpen,
        subjects,
        handleInputChange,
        handleSubmit,
        toggleDropdown,
        handleBack,
        isSubmitting,
        alert,
        handleAlertClose,
        setDropdownOpen
    } = useContact(navigation, t);

    const { selectedSubject, description } = formData;

    if (isSubmitting) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>{t('contact.loading')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Contact Form Section */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>{t('contact.title')}</Text>
                    <Text style={styles.sectionSubtitle}>
                        {t('contact.subtitle')}
                    </Text>

                    {/* Subject Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {t('contact.subjectLabel')} <Text style={styles.required}>{t('contact.required')}</Text>
                        </Text>
                        <TouchableOpacity
                            style={styles.selectInput}
                            onPress={toggleDropdown}
                        >
                            <Text style={selectedSubject ? styles.selectedText : styles.placeholderText}>
                                {selectedSubject || t('contact.selectSubject')}
                            </Text>
                            <Text style={[styles.dropdownIcon, dropdownOpen && styles.dropdownIconOpen]}>
                                ▼
                            </Text>
                        </TouchableOpacity>

                        {/* Dropdown Options */}
                        {dropdownOpen && (
                            <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                                {subjects.map((subject, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dropdownItem,
                                            selectedSubject === subject && styles.dropdownItemSelected,
                                        ]}
                                        onPress={() => {
                                            handleInputChange('selectedSubject', subject);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.dropdownText,
                                                selectedSubject === subject && styles.dropdownTextSelected,
                                            ]}
                                        >
                                            {subject}
                                        </Text>
                                        {selectedSubject === subject && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* Description Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {t('contact.descriptionLabel')} <Text style={styles.required}>{t('contact.required')}</Text>
                        </Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder={t('contact.descriptionPlaceholder')}
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={6}
                            value={description}
                            onChangeText={(text) => handleInputChange('description', text)}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>{t('contact.charCount', { count: description.length })}</Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!selectedSubject || !description) && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedSubject || !description}
                    >
                        <Text style={styles.submitButtonText}>{t('contact.submitButton')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Success Alert */}
            <Alert
                isVisible={alert.visible}
                onClose={handleAlertClose}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                buttonText={t('contact.alerts.okButton')}
            />
        </SafeAreaView>
    );
};

export default ContactScreen;