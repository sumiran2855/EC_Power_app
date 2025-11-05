import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './ContactScreen.styles';
import useContact from '../../hooks/useContact';

interface ContactScreenProps {
    navigation: any;
}

const ContactScreen: React.FC<ContactScreenProps> = ({ navigation }) => {
    const {
        formData,
        dropdownOpen,
        subjects,
        handleInputChange,
        handleSubmit,
        toggleDropdown,
        handleBack,
        setDropdownOpen
    } = useContact(navigation);

    const { selectedSubject, description } = formData;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* User Guide Section */}
                <View style={styles.guideCard}>
                    <View style={styles.guideHeader}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📄</Text>
                        </View>
                        <Text style={styles.guideTitle}>User Guide Available</Text>
                    </View>

                    <Text style={styles.guideDescription}>
                        View our comprehensive user guide to find answers to common questions before submitting a query.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.guideButton}>
                            <Text style={styles.buttonIcon}>🌐</Text>
                            <Text style={styles.guideButtonText}>View English Guide</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.guideButton}>
                            <Text style={styles.buttonIcon}>🌐</Text>
                            <Text style={styles.guideButtonText}>View German Guide</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Contact Form Section */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.sectionSubtitle}>
                        We're here to help! Fill out the form below and we'll get back to you soon.
                    </Text>

                    {/* Subject Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Subject <Text style={styles.required}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={styles.selectInput}
                            onPress={toggleDropdown}
                        >
                            <Text style={selectedSubject ? styles.selectedText : styles.placeholderText}>
                                {selectedSubject || 'Select a subject'}
                            </Text>
                            <Text style={[styles.dropdownIcon, dropdownOpen && styles.dropdownIconOpen]}>
                                ▼
                            </Text>
                        </TouchableOpacity>

                        {/* Dropdown Options */}
                        {dropdownOpen && (
                            <ScrollView style={styles.dropdownList}>
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
                            Description <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Please describe your issue or question in detail..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={6}
                            value={description}
                            onChangeText={(text) => handleInputChange('description', text)}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>{description.length} / 500</Text>
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
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactScreen;