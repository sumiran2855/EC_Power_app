import { useChangePasswordAlert } from '@/hooks/useChangePasswordAlert';
import StorageService from '@/utils/secureStorage';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ChangePasswordModal from '../../components/Modals/ChangePasswordModal';
import Alert from '../../components/Modals/LoginAlert';
import { AuthController } from '../../controllers/AuthController';
import useProfile from '../../hooks/useProfile';
import styles from './ProfileScreen.styles';

interface ProfileScreenProps {
    navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
    
    // Initialize change password alert hook
    const { alert, hideAlert, showPasswordUpdateSuccess, showPasswordUpdateError } = useChangePasswordAlert();
    
    const {
        profileData,
        showCountryPicker,
        selectedCountry,
        countries,
        handleInputChange,
        handleCountrySelect,
        handleSaveChanges,
        setShowCountryPicker,
        loading
    } = useProfile();

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleChangePassword = () => {
        setShowChangePasswordModal(true);
    };

    const handlePasswordUpdate = async (oldPassword: string, newPassword: string) => {
        setPasswordUpdateLoading(true);
        try {
            const userData = await StorageService.user.getData<{ email: string }>();
            
            if (!userData?.email) {
                showPasswordUpdateError(t('login.alerts.passwordUpdateFailed.message'));
                return;
            }

            const result = await AuthController.ChangePassword({
                oldPassword,
                newPassword
            });

            if (result.success) {
                showPasswordUpdateSuccess();
                setShowChangePasswordModal(false);
            } else {
                showPasswordUpdateError(result.error);
            }
        } catch (error) {
            console.error('Password update failed:', error);
            showPasswordUpdateError(t('login.alerts.passwordUpdateFailed.message'));
        } finally {
            setPasswordUpdateLoading(false);
            setShowChangePasswordModal(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a5490" />
                <Text style={styles.loadingText}>{t('profile.loading')}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('profile.title')}</Text>
                <TouchableOpacity
                    style={styles.changePasswordButton}
                    onPress={handleChangePassword}
                >
                    <Ionicons name="key-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Business Information Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="business-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.cardTitle}>{t('profile.businessInformation.title')}</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('profile.businessInformation.businessName')}</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.companyInfo.name}
                                onChangeText={(value) => handleInputChange('name', value)}
                                placeholder={t('profile.businessInformation.businessNamePlaceholder')}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('profile.businessInformation.cvrNumber')}</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.companyInfo.cvrNumber}
                                onChangeText={(value) => handleInputChange('cvrNumber', value)}
                                placeholder={t('profile.businessInformation.cvrNumberPlaceholder')}
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('profile.businessInformation.address')}</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.companyInfo.address}
                                onChangeText={(value) => handleInputChange('address', value)}
                                placeholder={t('profile.businessInformation.addressPlaceholder')}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>{t('profile.businessInformation.postalCode')}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.companyInfo.postal_code}
                                    onChangeText={(value) => handleInputChange('postal_code', value)}
                                    placeholder={t('profile.businessInformation.postalCodePlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>{t('profile.businessInformation.city')}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.companyInfo.city}
                                    onChangeText={(value) => handleInputChange('city', value)}
                                    placeholder={t('profile.businessInformation.cityPlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Contact Person Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="person-outline" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.cardTitle}>{t('profile.contactPerson.title')}</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.inputRow}>
                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>{t('profile.contactPerson.firstName')}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.contactPerson.firstName}
                                    onChangeText={(value) => handleInputChange('firstName', value)}
                                    placeholder={t('profile.contactPerson.firstNamePlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>

                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>{t('profile.contactPerson.lastName')}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.contactPerson.lastName}
                                    onChangeText={(value) => handleInputChange('lastName', value)}
                                    placeholder={t('profile.contactPerson.lastNamePlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('profile.contactPerson.emailAddress')}</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.inputWithIconField}
                                    value={profileData.contactPerson.personalEmail}
                                    onChangeText={(value) => handleInputChange('personalEmail', value)}
                                    placeholder={t('profile.contactPerson.emailAddressPlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('profile.contactPerson.mobileNumber')}</Text>
                            <View style={styles.phoneInputContainer}>
                                <TouchableOpacity
                                    style={styles.countryCodeContainer}
                                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                                >
                                    <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                                    <Text style={styles.countryCodeInput}>{selectedCountry.code}</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.phoneInput}
                                    value={profileData.contactPerson.personalPhone}
                                    onChangeText={(value) => handleInputChange('personalPhone', value)}
                                    placeholder={t('profile.contactPerson.mobileNumberPlaceholder')}
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* Country Picker Dropdown */}
                            {showCountryPicker && (
                                <View style={styles.countryDropdown}>
                                    <ScrollView
                                        style={styles.countryList}
                                        nestedScrollEnabled={true}
                                    >
                                        {countries.map((country, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.countryItem}
                                                onPress={() => handleCountrySelect(country)}
                                            >
                                                <Text style={styles.countryFlag}>{country.flag}</Text>
                                                <Text style={styles.countryName}>{country.name}</Text>
                                                <Text style={styles.countryCode}>{country.code}</Text>
                                                {selectedCountry.code === country.code && (
                                                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Account Deletion Section */}
                <View style={[styles.dangerCard, showCountryPicker && { marginTop: 220 }]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.dangerIconContainer}>
                            <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.dangerCardTitle}>{t('profile.accountDeletion.title')}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.dangerDescription}>
                            {t('profile.accountDeletion.description', { email: 'productportal@ecpower.dk' })}
                        </Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveChanges}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>{t('profile.saveChanges')}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isVisible={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                onSubmit={handlePasswordUpdate}
                loading={passwordUpdateLoading}
            />
            
            {/* Change Password Alert */}
            <Alert
                isVisible={alert.isVisible}
                onClose={hideAlert}
                title={alert.title}
                message={alert.message}
                type={alert.type}
            />
        </SafeAreaView>
    );
}

export default ProfileScreen;