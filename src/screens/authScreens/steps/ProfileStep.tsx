import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { countryCodes, ProfileStepProps } from '../types';
import { styles } from '../StepperScreen.styles';

const ProfileStep: React.FC<ProfileStepProps> = ({
    formData,
    updateFormData,
    showCountryCodePicker,
    setShowCountryCodePicker,
    showContactCountryCodePicker,
    setShowContactCountryCodePicker,
    onNext,
    onSaveForLater,
    errors = {},
}) => {
    const { t } = useTranslation();
    return (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <Text style={styles.title}>{t('profileStep.header.title')}</Text>
                <Text style={styles.subtitle}>{t('profileStep.header.subtitle')}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Icon name="business" size={24} color="#003D82" />
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.cardTitle}>{t('profileStep.companyInfo.title')}</Text>
                        <Text style={styles.cardSubtitle}>{t('profileStep.companyInfo.subtitle')}</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profileStep.companyInfo.companyName')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="business" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('profileStep.companyInfo.companyNamePlaceholder')}
                            placeholderTextColor="#999"
                            value={formData.companyInfo?.name || ''}
                            onChangeText={(text) => {
                                updateFormData('companyInfo', {
                                    ...formData.companyInfo,
                                    name: text
                                });
                            }}
                        />
                    </View>
                    {errors.companyName && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.companyName}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profileStep.companyInfo.vatNo')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="receipt" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('profileStep.companyInfo.vatNoPlaceholder')}
                            placeholderTextColor="#999"
                            value={formData.companyInfo?.cvrNumber || ''}
                            onChangeText={(text) => {
                                updateFormData('companyInfo', {
                                    ...formData.companyInfo,
                                    cvrNumber: text
                                });
                            }}
                        />
                    </View>
                    {errors.vatNo && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.vatNo}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profileStep.companyInfo.address')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="location-on" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('profileStep.companyInfo.addressPlaceholder')}
                            placeholderTextColor="#999"
                            value={formData.companyInfo?.address || ''}
                            onChangeText={(text) => {
                                updateFormData('companyInfo', {
                                    ...formData.companyInfo,
                                    address: text
                                });
                            }}
                        />
                    </View>
                    {errors.address && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.address}
                        </Text>
                    )}
                </View>

                <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.label}>{t('profileStep.companyInfo.postcode')} *</Text>
                        <View style={[
                            styles.inputWrapper
                        ]}>
                            <Icon
                                name="markunread-mailbox"
                                size={18}
                                color="#999"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input]}
                                placeholder={t('profileStep.companyInfo.postcodePlaceholder')}
                                placeholderTextColor="#999"
                                value={formData.companyInfo?.postal_code || ''}
                                onChangeText={(text) => {
                                    updateFormData('companyInfo', {
                                        ...formData.companyInfo,
                                        postal_code: text
                                    });
                                }}
                            />
                        </View>
                        {errors.postcode && (
                            <Text style={[styles.errorText]}>
                                <Icon name="error-outline" size={12} color="#EF4444" /> {errors.postcode}
                            </Text>
                        )}
                    </View>

                    <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.label}>{t('profileStep.companyInfo.city')} *</Text>
                        <View style={[
                            styles.inputWrapper
                        ]}>
                            <Icon
                                name="location-city"
                                size={18}
                                color="#999"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input]}
                                placeholder={t('profileStep.companyInfo.cityPlaceholder')}
                                placeholderTextColor="#999"
                                value={formData.companyInfo?.city || ''}
                                onChangeText={(text) => {
                                    updateFormData('companyInfo', {
                                        ...formData.companyInfo,
                                        city: text
                                    });
                                }}
                            />
                        </View>
                        {errors.city && (
                            <Text style={[styles.errorText]}>
                                <Icon name="error-outline" size={12} color="#EF4444" /> {errors.city}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profileStep.companyInfo.email')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('profileStep.companyInfo.emailPlaceholder')}
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.companyInfo?.email || ''}
                            onChangeText={(text) => {
                                updateFormData('companyInfo', {
                                    ...formData.companyInfo,
                                    email: text
                                });
                            }}
                        />
                    </View>
                    {errors.email && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.email}
                        </Text>
                    )}
                </View>

                <View style={[
                    showCountryCodePicker ? styles.inputGroupActive : styles.inputGroup
                ]}>
                    <Text style={styles.label}>{t('profileStep.companyInfo.phone')} *</Text>
                    <View style={[
                        showCountryCodePicker ? styles.phoneInputRowActive : styles.phoneInputRow,
                    ]}>
                        <TouchableOpacity
                            style={[
                                styles.countryCodeButton,
                            ]}
                            onPress={() => setShowCountryCodePicker(!showCountryCodePicker)}
                        >
                            <Text style={[
                                styles.countryCodeText,
                            ]}>
                                {countryCodes.find(c => c.code === formData.companyInfo?.countryCode)?.flag} {formData.companyInfo?.countryCode}
                            </Text>
                            <Icon
                                name={showCountryCodePicker ? "expand-less" : "expand-more"}
                                size={20}
                                color={errors.phone ? '#EF4444' : "#666"}
                            />
                        </TouchableOpacity>

                        <View style={[
                            styles.phoneInputWrapper
                        ]}>
                            <TextInput
                                style={[
                                    styles.phoneInput
                                ]}
                                placeholder={t('profileStep.companyInfo.phonePlaceholder')}
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                maxLength={15}
                                value={formData.companyInfo?.phone || ''}
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/[^0-9]/g, '');
                                    updateFormData('companyInfo', {
                                        ...formData.companyInfo,
                                        phone: cleaned
                                    });
                                }}
                            />
                        </View>
                    </View>

                    {showCountryCodePicker && (
                        <View style={styles.dropdownOverlay}>
                            <ScrollView style={styles.countryCodeList} nestedScrollEnabled>
                                {countryCodes.map((country) => (
                                    <TouchableOpacity
                                        key={country.code}
                                        style={styles.countryCodeOption}
                                        onPress={() => {
                                            updateFormData('companyInfo', {
                                                ...formData.companyInfo,
                                                countryCode: country.code
                                            });
                                            setShowCountryCodePicker(false);
                                        }}
                                    >
                                        <Text style={styles.countryCodeOptionText}>
                                            {country.flag} {country.code} ({country.country})
                                        </Text>
                                        {formData.companyInfo.countryCode === country.code && (
                                            <Icon name="check" size={20} color="#00B050" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {errors.phone ? (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.phone}
                        </Text>
                    ) : formData.companyInfo.phone && formData.companyInfo.phone.length >= 8 ? (
                        <Text style={styles.successText}>
                            <Icon name="check-circle" size={12} color="#00B050" /> {t('profileStep.companyInfo.validPhone')}
                        </Text>
                    ) : null}
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Icon name="person" size={24} color="#003D82" />
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.cardTitle}>{t('profileStep.contactPerson.title')}</Text>
                        <Text style={styles.cardSubtitle}>{t('profileStep.contactPerson.subtitle')}</Text>
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.label}>{t('profileStep.contactPerson.firstName')} *</Text>
                        <View style={[
                            styles.inputWrapper
                        ]}>
                            <TextInput
                                style={[styles.input, { paddingLeft: 10 }]}
                                placeholder={t('profileStep.contactPerson.firstNamePlaceholder')}
                                placeholderTextColor="#999"
                                value={formData.contactPerson?.firstName || ''}
                                onChangeText={(text) => {
                                    updateFormData('contactPerson', {
                                        ...formData.contactPerson,
                                        firstName: text
                                    });
                                }}
                            />
                        </View>
                        {errors.firstName && (
                            <Text style={[styles.errorText]}>
                                <Icon name="error-outline" size={12} color="#EF4444" /> {errors.firstName}
                            </Text>
                        )}
                    </View>

                    <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.label}>{t('profileStep.contactPerson.lastName')} *</Text>
                        <View style={[
                            styles.inputWrapper
                        ]}>
                            <TextInput
                                style={[styles.input, { paddingLeft: 10 }]}
                                placeholder={t('profileStep.contactPerson.lastNamePlaceholder')}
                                placeholderTextColor="#999"
                                value={formData.contactPerson?.lastName || ''}
                                onChangeText={(text) => {
                                    updateFormData('contactPerson', {
                                        ...formData.contactPerson,
                                        lastName: text
                                    });
                                }}
                            />
                        </View>
                        {errors.lastName && (
                            <Text style={[styles.errorText]}>
                                <Icon name="error-outline" size={12} color="#EF4444" /> {errors.lastName}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profileStep.contactPerson.email')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('profileStep.contactPerson.emailPlaceholder')}
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.contactPerson?.email || ''}
                            onChangeText={(text) => {
                                updateFormData('contactPerson', {
                                    ...formData.contactPerson,
                                    email: text
                                });
                            }}
                        />
                    </View>
                    {errors.contactEmail && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.contactEmail}
                        </Text>
                    )}
                </View>

                <View style={[
                    showContactCountryCodePicker ? styles.inputGroupActive : styles.inputGroup
                ]}>
                    <Text style={styles.label}>{t('profileStep.contactPerson.phone')} *</Text>
                    <View style={[
                        showContactCountryCodePicker ? styles.phoneInputRowActive : styles.phoneInputRow,
                    ]}>
                        <TouchableOpacity
                            style={[
                                styles.countryCodeButton,
                            ]}
                            onPress={() => setShowContactCountryCodePicker && setShowContactCountryCodePicker(!showContactCountryCodePicker)}
                        >
                            <Text style={[
                                styles.countryCodeText,
                            ]}>
                                {countryCodes.find(c => c.code === formData.contactPerson?.countryCode)?.flag} {formData.contactPerson?.countryCode}
                            </Text>
                            <Icon
                                name={showContactCountryCodePicker ? "expand-less" : "expand-more"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        <View style={[
                            styles.phoneInputWrapper
                        ]}>
                            <TextInput
                                style={[
                                    styles.phoneInput
                                ]}
                                placeholder={t('profileStep.contactPerson.phonePlaceholder')}
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                maxLength={15}
                                value={formData.contactPerson?.phone || ''}
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/[^0-9]/g, '');
                                    updateFormData('contactPerson', {
                                        ...formData.contactPerson,
                                        phone: cleaned
                                    });
                                }}
                            />
                        </View>
                    </View>

                    {showContactCountryCodePicker && (
                        <View style={styles.dropdownOverlay}>
                            <ScrollView style={styles.countryCodeList} nestedScrollEnabled>
                                {countryCodes.map((country) => (
                                    <TouchableOpacity
                                        key={country.code}
                                        style={styles.countryCodeOption}
                                        onPress={() => {
                                            updateFormData('contactPerson', {
                                                ...formData.contactPerson,
                                                countryCode: country.code
                                            });
                                            setShowContactCountryCodePicker && setShowContactCountryCodePicker(false);
                                        }}
                                    >
                                        <Text style={styles.countryCodeOptionText}>
                                            {country.flag} {country.code} ({country.country})
                                        </Text>
                                        {formData.contactPerson.countryCode === country.code && (
                                            <Icon name="check" size={20} color="#00B050" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {errors.contactPhone ? (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.contactPhone}
                        </Text>
                    ) : formData.contactPerson.phone && formData.contactPerson.phone.length >= 8 ? (
                        <Text style={styles.successText}>
                            <Icon name="check-circle" size={12} color="#00B050" /> {t('profileStep.contactPerson.validPhone')}
                        </Text>
                    ) : null}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonSecondary} onPress={onSaveForLater}>
                    <Icon name="bookmark-border" size={20} color="#003D82" />
                    <Text style={styles.buttonSecondaryText}>{t('profileStep.buttons.saveForLater')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPrimary} onPress={onNext}>
                    <Text style={styles.buttonPrimaryText}>{t('profileStep.buttons.continue')}</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileStep;
