import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import useProfile from '../../hooks/useProfile';
import styles from './ProfileScreen.styles';

interface ProfileScreenProps {
    navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
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
        console.log('Change password...');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a5490" />
                <Text style={styles.loadingText}>Loading facilities...</Text>
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
                <Text style={styles.headerTitle}>Profile Settings</Text>
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
                        <Text style={styles.cardTitle}>Business Information</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Name</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.companyInfo.companyName}
                                onChangeText={(value) => handleInputChange('companyName', value)}
                                placeholder="Enter business name"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CVR Number</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.companyInfo.cvrNumber}
                                onChangeText={(value) => handleInputChange('cvrNumber', value)}
                                placeholder="Enter CVR number"
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={styles.input}
                                value={profileData.companyInfo.address}
                                onChangeText={(value) => handleInputChange('address', value)}
                                placeholder="Enter address"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>Postal Code</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.companyInfo.postal_code}
                                    onChangeText={(value) => handleInputChange('postal_code', value)}
                                    placeholder="Enter code"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.companyInfo.city}
                                    onChangeText={(value) => handleInputChange('city', value)}
                                    placeholder="Enter city"
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
                        <Text style={styles.cardTitle}>Contact Person</Text>
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.inputRow}>
                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.firstName}
                                    onChangeText={(value) => handleInputChange('firstName', value)}
                                    placeholder="First name"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>

                            <View style={styles.inputHalf}>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={profileData.lastName}
                                    onChangeText={(value) => handleInputChange('lastName', value)}
                                    placeholder="Last name"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.inputWithIconField}
                                    value={profileData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="Enter email address"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
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
                                    value={profileData.phone_number}
                                    onChangeText={(value) => handleInputChange('phone_number', value)}
                                    placeholder="Enter mobile number"
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
                        <Text style={styles.dangerCardTitle}>Account Deletion</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.dangerDescription}>
                            To permanently delete your account, send an email to{' '}
                            <Text style={styles.emailLink}>productportal@ecpower.dk</Text>
                            {' '}requesting account removal. You'll receive confirmation upon completion.
                        </Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveChanges}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileScreen;