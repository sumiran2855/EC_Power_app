import TermsAndConditionsModal from "@/components/Modals/TermsAndConditionsModal";
import { FACILITY_TERMS_DATA } from "@/constants/facilityTermsConstants";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../StepperScreen.styles';
import { SalesPartnerInfo, ServiceProviderInfo, SystemRegisterStepProps, country, countryCodes, industries, models } from '../types';

interface SystemRegistrationStepProps extends SystemRegisterStepProps {
    errors: Record<string, string>;
}

const SystemRegistrationStep: React.FC<SystemRegistrationStepProps> = ({
    formData,
    updateFormData,
    showServiceCountryCodePicker,
    setShowServiceCountryCodePicker,
    showSalesCountryCodePicker,
    setShowSalesCountryCodePicker,
    showModelPicker,
    setShowModelPicker,
    showIndustryPicker,
    setShowIndustryPicker,
    showCountryPicker,
    setShowCountryPicker,
    monthlyErrors,
    totalPercentageError,
    updateMonthlyPercentage,
    distributeHoursEvenly,
    calculateTotalHours,
    calculateTotalPercentage,
    onNext,
    onBack,
    errors = {},
}) => {
    const { t } = useTranslation();
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    // Helper function to translate month names
    const translateMonth = (month: string) => {
        const monthKey = month.toLowerCase();
        return t(`systemRegistrationStep.months.${monthKey}`);
    };
    const [pendingSubmit, setPendingSubmit] = useState(false);

    const handleTermsAccept = () => {
        updateFormData('DaSigned', true);
        setPendingSubmit(false);
        onNext();
    };

    const handleNextClick = () => {
        if (!formData.DaSigned) {
            setPendingSubmit(true);
            setIsTermsModalOpen(true);
        } else {
            onNext();
        }
    };

    const handleTermsClose = () => {
        setIsTermsModalOpen(false);
        setPendingSubmit(false);
    };
    return (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <Text style={styles.title}>{t('systemRegistrationStep.header.title')}</Text>
                <Text style={styles.subtitle}>
                    {t('systemRegistrationStep.header.subtitle')}
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Icon name="settings" size={24} color="#003D82" />
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.cardTitle}>{t('systemRegistrationStep.systemDetails.title')}</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('systemRegistrationStep.systemDetails.systemName')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="label" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('systemRegistrationStep.systemDetails.systemNamePlaceholder')}
                            placeholderTextColor="#999"
                            value={formData.name}
                            onChangeText={(text) => updateFormData('name', text)}
                        />
                    </View>
                    {errors.systemName ? (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemName}
                        </Text>
                    ) : (
                        <Text style={styles.helperText}>
                            <Icon name="info-outline" size={12} color="#999" /> {t('systemRegistrationStep.systemDetails.systemNameHelper')}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('systemRegistrationStep.systemDetails.xrgiId')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="fingerprint" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('systemRegistrationStep.systemDetails.xrgiIdPlaceholder')}
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            maxLength={10}
                            value={formData.xrgiID}
                            onChangeText={(text) => updateFormData('xrgiID', text)}
                        />
                    </View>
                    {errors.xrgiIdNumber ? (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.xrgiIdNumber}
                        </Text>
                    ) : (
                        <Text style={styles.helperText}>
                            <Icon name="info-outline" size={12} color="#999" /> {t('systemRegistrationStep.systemDetails.xrgiIdHelper')}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('systemRegistrationStep.systemDetails.selectModel')} *</Text>
                    <TouchableOpacity
                        style={styles.pickerContainer}
                        onPress={() => setShowModelPicker && setShowModelPicker(!showModelPicker)}
                    >
                        <View style={styles.pickerButton}>
                            <Icon name="devices" size={18} color="#999" style={styles.inputIcon} />
                            <Text style={formData.modelNumber ? styles.pickerText : styles.pickerPlaceholder}>
                                {formData.modelNumber || t('systemRegistrationStep.systemDetails.modelPlaceholder')}
                            </Text>
                            <Icon
                                name={showModelPicker ? "expand-less" : "expand-more"}
                                size={24}
                                color="#666"
                            />
                        </View>
                    </TouchableOpacity>
                    {errors.selectedModel && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.selectedModel}
                        </Text>
                    )}
                    {showModelPicker && (
                        <ScrollView style={styles.dropdownOverlay} nestedScrollEnabled>
                            {models.map((model, idx) => (
                                <TouchableOpacity
                                    key={model}
                                    style={[
                                        styles.pickerOption,
                                        idx === models.length - 1 && styles.pickerOptionLast
                                    ]}
                                    onPress={() => {
                                        updateFormData('modelNumber', model);
                                        setShowModelPicker && setShowModelPicker(false);
                                    }}
                                >
                                    <Text style={styles.pickerOptionText}>{model}</Text>
                                    {formData?.modelNumber === model && (
                                        <Icon name="check" size={20} color="#00B050" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                    <Text style={styles.helperText}>
                        <Icon name="info-outline" size={12} color="#999" /> {t('systemRegistrationStep.systemDetails.modelHelper')}
                    </Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Icon name="location-on" size={24} color="#003D82" />
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.cardTitle}>{t('systemRegistrationStep.xrgiSite.title')}</Text>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.address')} *</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="home" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('systemRegistrationStep.xrgiSite.addressPlaceholder')}
                            placeholderTextColor="#999"
                            value={formData.location?.address}
                            onChangeText={(text) => updateFormData('location', {
                                ...formData.location,
                                address: text
                            })}
                        />
                    </View>
                    {errors.systemAddress && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemAddress}
                        </Text>
                    )}
                </View>

                <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.postcode')} *</Text>
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
                                style={styles.input}
                                placeholder={t('systemRegistrationStep.xrgiSite.postcodePlaceholder')}
                                placeholderTextColor="#999"
                                value={formData.location?.postalCode}
                                onChangeText={(text) => updateFormData('location', {
                                    ...formData.location,
                                    postalCode: text
                                })}
                            />
                        </View>
                        {errors.systemPostcode && (
                            <Text style={[styles.errorText, { marginLeft: 0 }]}>
                                <Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemPostcode}
                            </Text>
                        )}
                    </View>

                    <View style={[styles.inputGroup, styles.inputHalf]}>
                        <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.city')} *</Text>
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
                                style={styles.input}
                                placeholder={t('systemRegistrationStep.xrgiSite.cityPlaceholder')}
                                placeholderTextColor="#999"
                                value={formData.location?.city}
                                onChangeText={(text) => updateFormData('location', {
                                    ...formData.location,
                                    city: text
                                })}
                            />
                        </View>
                        {errors.systemCity && (
                            <Text style={[styles.errorText, { marginLeft: 0 }]}>
                                <Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemCity}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={showCountryPicker ? styles.inputGroupActive : styles.inputGroup}>
                    <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.country')} *</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowCountryPicker && setShowCountryPicker(!showCountryPicker)}
                    >
                        <Icon name="public" size={18} color="#999" style={styles.pickerIcon} />
                        <Text style={formData.location?.country ? styles.pickerText : styles.pickerPlaceholder}>
                            {formData.location?.country || t('systemRegistrationStep.xrgiSite.countryPlaceholder')}
                        </Text>
                        <Icon
                            name={showCountryPicker ? "expand-less" : "expand-more"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                    {errors.systemCountry && (
                        <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemCountry}
                        </Text>
                    )}

                    {showCountryPicker && (
                        <View style={styles.dropdownOverlay}>
                            <ScrollView style={styles.countryCodeList} nestedScrollEnabled>
                                {country.map((countryItem) => (
                                    <TouchableOpacity
                                        key={countryItem}
                                        style={styles.pickerOption}
                                        onPress={() => {
                                            updateFormData('location', {
                                                ...formData.location,
                                                country: countryItem
                                            });
                                            setShowCountryPicker && setShowCountryPicker(false);
                                        }}
                                    >
                                        <Text style={styles.pickerOptionText}>{countryItem}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Icon name="handshake" size={24} color="#003D82" />
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.cardTitle}>{t('systemRegistrationStep.serviceContract.title')}</Text>
                    </View>
                </View>

                <Text style={styles.questionText}>
                    {t('systemRegistrationStep.serviceContract.question')}
                </Text>
                <Text style={styles.cardSubtitle}>
                    {t('systemRegistrationStep.serviceContract.description')}
                </Text>

                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            styles.toggleButtonLeft,
                            formData.hasServiceContract === true && styles.toggleButtonActive,
                        ]}
                        onPress={() => updateFormData('hasServiceContract', true)}
                    >
                        <Icon
                            name="check-circle"
                            size={20}
                            color={formData.hasServiceContract === true ? '#fff' : '#999'}
                        />
                        <Text
                            style={[
                                styles.toggleButtonText,
                                formData.hasServiceContract === true && styles.toggleButtonTextActive,
                            ]}
                        >
                            {t('systemRegistrationStep.serviceContract.yes')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            styles.toggleButtonRight,
                            formData.hasServiceContract === false && styles.toggleButtonActive,
                        ]}
                        onPress={() => updateFormData('hasServiceContract', false)}
                    >
                        <Icon
                            name="cancel"
                            size={20}
                            color={formData.hasServiceContract === false ? '#fff' : '#999'}
                        />
                        <Text
                            style={[
                                styles.toggleButtonText,
                                formData.hasServiceContract === false && styles.toggleButtonTextActive,
                            ]}
                        >
                            {t('systemRegistrationStep.serviceContract.no')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Show "Interested in Service Contract" question when user selects NO */}
                {formData.hasServiceContract === false && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.questionText}>
                            {t('systemRegistrationStep.serviceContract.interestedQuestion')}
                        </Text>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    styles.toggleButtonLeft,
                                    formData.needServiceContract === true && styles.toggleButtonActive,
                                ]}
                                onPress={() => updateFormData('needServiceContract', true)}
                            >
                                <Icon
                                    name="check-circle"
                                    size={20}
                                    color={formData.needServiceContract === true ? '#fff' : '#999'}
                                />
                                <Text
                                    style={[
                                        styles.toggleButtonText,
                                        formData.needServiceContract === true && styles.toggleButtonTextActive,
                                    ]}
                                >
                                    {t('systemRegistrationStep.serviceContract.yes')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    styles.toggleButtonRight,
                                    formData.needServiceContract === false && styles.toggleButtonActive,
                                ]}
                                onPress={() => updateFormData('needServiceContract', false)}
                            >
                                <Icon
                                    name="cancel"
                                    size={20}
                                    color={formData.needServiceContract === false ? '#fff' : '#999'}
                                />
                                <Text
                                    style={[
                                        styles.toggleButtonText,
                                        formData.needServiceContract === false && styles.toggleButtonTextActive,
                                    ]}
                                >
                                    {t('systemRegistrationStep.serviceContract.no')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Show service provider details when hasServiceContract is YES */}
                {formData.hasServiceContract === true && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('systemRegistrationStep.serviceContract.providerName')} *</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="business" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('systemRegistrationStep.serviceContract.providerNamePlaceholder')}
                                    placeholderTextColor="#999"
                                    value={formData.serviceProvider?.name}
                                    onChangeText={(text) => updateFormData('serviceProvider', {
                                        name: text,
                                        mailAddress: formData.serviceProvider?.mailAddress || '',
                                        phone: formData.serviceProvider?.phone || '',
                                        countryCode: formData.serviceProvider?.countryCode || ''
                                    } as ServiceProviderInfo)}
                                />
                            </View>
                            {errors.serviceProviderName && (
                                <Text style={styles.errorText}>
                                    <Icon name="error-outline" size={12} color="#EF4444" /> {errors.serviceProviderName}
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('systemRegistrationStep.serviceContract.providerEmail')} *</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="provider@example.com"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={formData.serviceProvider?.mailAddress}
                                    onChangeText={(text) => updateFormData('serviceProvider', {
                                        name: formData.serviceProvider?.name || '',
                                        mailAddress: text,
                                        phone: formData.serviceProvider?.phone || '',
                                        countryCode: formData.serviceProvider?.countryCode || ''
                                    } as ServiceProviderInfo)}
                                />
                            </View>
                            {errors.serviceProviderEmail && (
                                <Text style={styles.errorText}>
                                    <Icon name="error-outline" size={12} color="#EF4444" /> {errors.serviceProviderEmail}
                                </Text>
                            )}
                        </View>

                        <View style={showServiceCountryCodePicker ? styles.inputGroupActive : styles.inputGroup}>
                            <Text style={styles.label}>{t('systemRegistrationStep.serviceContract.providerPhone')} *</Text>
                            <View style={showServiceCountryCodePicker ? styles.phoneInputRowActive : styles.phoneInputRow}>
                                <TouchableOpacity
                                    style={styles.countryCodeButton}
                                    onPress={() => setShowServiceCountryCodePicker && setShowServiceCountryCodePicker(!showServiceCountryCodePicker)}
                                >
                                    <Text style={styles.countryCodeText}>
                                        {countryCodes.find(c => c.code === (formData.serviceProvider?.countryCode || '+45'))?.flag} {formData.serviceProvider?.countryCode || '+45'}
                                    </Text>
                                    <Icon
                                        name={showServiceCountryCodePicker ? "expand-less" : "expand-more"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>

                                <View style={styles.phoneInputWrapper}>
                                    <TextInput
                                        style={styles.phoneInput}
                                        placeholder={t('systemRegistrationStep.serviceContract.providerPhonePlaceholder')}
                                        placeholderTextColor="#999"
                                        keyboardType="phone-pad"
                                        maxLength={15}
                                        value={formData.serviceProvider?.phone}
                                        onChangeText={(text) => {
                                            const cleaned = text.replace(/[^0-9]/g, '');
                                            updateFormData('serviceProvider', {
                                                name: formData.serviceProvider?.name || '',
                                                mailAddress: formData.serviceProvider?.mailAddress || '',
                                                phone: cleaned,
                                                countryCode: formData.serviceProvider?.countryCode || ''
                                            } as ServiceProviderInfo);
                                        }}
                                    />
                                </View>
                            </View>
                            {errors.serviceProviderPhone && (
                                <Text style={styles.errorText}>
                                    <Icon name="error-outline" size={12} color="#EF4444" /> {errors.serviceProviderPhone}
                                </Text>
                            )}

                            {showServiceCountryCodePicker && (
                                <View style={styles.dropdownOverlay}>
                                    <ScrollView style={styles.countryCodeList} nestedScrollEnabled>
                                        {countryCodes.map((country) => (
                                            <TouchableOpacity
                                                key={country.code}
                                                style={styles.countryCodeOption}
                                                onPress={() => {
                                                    updateFormData('serviceProvider', {
                                                        name: formData.serviceProvider?.name || '',
                                                        mailAddress: formData.serviceProvider?.mailAddress || '',
                                                        phone: formData.serviceProvider?.phone || '',
                                                        countryCode: country.code
                                                    } as ServiceProviderInfo);
                                                    setShowServiceCountryCodePicker && setShowServiceCountryCodePicker(false);
                                                }}
                                            >
                                                <Text style={styles.countryCodeOptionText}>
                                                    {country.flag} {country.code} ({country.country})
                                                </Text>
                                                {formData.serviceProvider?.countryCode === country.code && (
                                                    <Icon name="check" size={20} color="#00B050" />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </>
                )}

                {/* Show "Is sales partner same" question when hasServiceContract is YES OR interestedInServiceContract is YES */}
                {(formData.hasServiceContract === true || formData.needServiceContract === true) && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.questionText}>
                            <Text style={styles.checkboxLabel}>{t('systemRegistrationStep.serviceContract.salesPartnerSame')}</Text>
                        </Text>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    styles.toggleButtonLeft,
                                    formData.isSalesPartnerSame === true && styles.toggleButtonActive,
                                ]}
                                onPress={() => updateFormData('isSalesPartnerSame', true)}
                            >
                                <Icon
                                    name="check-circle"
                                    size={20}
                                    color={formData.isSalesPartnerSame === true ? '#fff' : '#999'}
                                />
                                <Text
                                    style={[
                                        styles.toggleButtonText,
                                        formData.isSalesPartnerSame === true && styles.toggleButtonTextActive,
                                    ]}
                                >
                                    {t('systemRegistrationStep.serviceContract.yes')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    styles.toggleButtonRight,
                                    formData.isSalesPartnerSame === false && styles.toggleButtonActive,
                                ]}
                                onPress={() => updateFormData('isSalesPartnerSame', false)}
                            >
                                <Icon
                                    name="cancel"
                                    size={20}
                                    color={formData.isSalesPartnerSame === false ? '#fff' : '#999'}
                                />
                                <Text
                                    style={[
                                        styles.toggleButtonText,
                                        formData.isSalesPartnerSame === false && styles.toggleButtonTextActive,
                                    ]}
                                >
                                    {t('systemRegistrationStep.serviceContract.no')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Show sales partner details when isSalesPartnerSame is NO */}
                        {formData.isSalesPartnerSame === false && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.serviceContract.salesPartnerName')} *</Text>
                                    <View style={styles.inputWrapper}>
                                        <Icon name="business" size={18} color="#999" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t('systemRegistrationStep.serviceContract.salesPartnerNamePlaceholder')}
                                            placeholderTextColor="#999"
                                            value={formData.salesPartner?.name}
                                            onChangeText={(text) => updateFormData('salesPartner', {
                                                name: text,
                                                mailAddress: formData.salesPartner?.mailAddress,
                                                phone: formData.salesPartner?.phone,
                                                countryCode: formData.salesPartner?.countryCode,
                                            } as SalesPartnerInfo)}
                                        />
                                    </View>
                                    {errors.salesPartnerName && (
                                        <Text style={styles.errorText}>
                                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.salesPartnerName}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.serviceContract.salesPartnerEmail')} *</Text>
                                    <View style={styles.inputWrapper}>
                                        <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="sales@example.com"
                                            placeholderTextColor="#999"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={formData.salesPartner?.mailAddress}
                                            onChangeText={(text) => updateFormData('salesPartner', {
                                                name: formData.salesPartner?.name,
                                                mailAddress: text,
                                                phone: formData.salesPartner?.phone,
                                                countryCode: formData.salesPartner?.countryCode || '+45',
                                            } as SalesPartnerInfo)}
                                        />
                                    </View>
                                    {errors.salesPartnerEmail && (
                                        <Text style={styles.errorText}>
                                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.salesPartnerEmail}
                                        </Text>
                                    )}
                                </View>

                                <View style={showSalesCountryCodePicker ? styles.inputGroupActive : styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.serviceContract.salesPartnerPhone')} *</Text>
                                    <View style={showSalesCountryCodePicker ? styles.phoneInputRowActive : styles.phoneInputRow}>
                                        <TouchableOpacity
                                            style={styles.countryCodeButton}
                                            onPress={() => setShowSalesCountryCodePicker && setShowSalesCountryCodePicker(!showSalesCountryCodePicker)}
                                        >
                                            <Text style={styles.countryCodeText}>
                                                {countryCodes.find(c => c.code === (formData.salesPartner?.countryCode || '+45'))?.flag} {formData.salesPartner?.countryCode || '+45'}
                                            </Text>
                                            <Icon
                                                name={showSalesCountryCodePicker ? "expand-less" : "expand-more"}
                                                size={20}
                                                color="#666"
                                            />
                                        </TouchableOpacity>

                                        <View style={styles.phoneInputWrapper}>
                                            <TextInput
                                                style={styles.phoneInput}
                                                placeholder={t('systemRegistrationStep.serviceContract.salesPartnerPhonePlaceholder')}
                                                placeholderTextColor="#999"
                                                keyboardType="phone-pad"
                                                maxLength={15}
                                                value={formData.salesPartner?.phone}
                                                onChangeText={(text) => {
                                                    const cleaned = text.replace(/[^0-9]/g, '');
                                                    updateFormData('salesPartner', {
                                                        name: formData.salesPartner?.name,
                                                        mailAddress: formData.salesPartner?.mailAddress,
                                                        phone: cleaned,
                                                        countryCode: formData.salesPartner?.countryCode || '+45',
                                                    } as SalesPartnerInfo);
                                                }}
                                            />
                                        </View>
                                    </View>
                                    {errors.salesPartnerPhone && (
                                        <Text style={styles.errorText}>
                                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.salesPartnerPhone}
                                        </Text>
                                    )}

                                    {showSalesCountryCodePicker && (
                                        <View style={styles.dropdownOverlay}>
                                            <ScrollView style={styles.countryCodeList} nestedScrollEnabled>
                                                {countryCodes.map((country) => (
                                                    <TouchableOpacity
                                                        key={country.code}
                                                        style={styles.countryCodeOption}
                                                        onPress={() => {
                                                            updateFormData('salesPartner', {
                                                                name: formData.salesPartner?.name,
                                                                mailAddress: formData.salesPartner?.mailAddress,
                                                                phone: formData.salesPartner?.phone,
                                                                countryCode: country.code,
                                                            } as SalesPartnerInfo);
                                                            setShowSalesCountryCodePicker && setShowSalesCountryCodePicker(false);
                                                        }}
                                                    >
                                                        <Text style={styles.countryCodeOptionText}>
                                                            {country.flag} {country.code} ({country.country})
                                                        </Text>
                                                        {formData.salesPartner?.countryCode === country.code && (
                                                            <Icon name="check" size={20} color="#00B050" />
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                            </>
                        )}
                    </>
                )}
            </View>

            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.checkboxCard}
                    onPress={() => updateFormData('isInstalled', !formData.isInstalled)}
                >
                    <View style={[styles.checkbox, formData.isInstalled && styles.checkboxChecked]}>
                        {formData.isInstalled && <Icon name="check" size={16} color="#fff" />}
                    </View>
                    <View style={styles.checkboxContent}>
                        <Text style={styles.checkboxLabel}>{t('systemRegistrationStep.installation.question')}</Text>
                        <Text style={styles.checkboxDescription}>{t('systemRegistrationStep.installation.description')}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {formData.isInstalled && (
                <>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Icon name="analytics" size={24} color="#003D82" />
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>{t('systemRegistrationStep.energyCheckPlus.title')}</Text>
                            </View>
                        </View>
                        <Text style={styles.cardSubtitle}>{t('systemRegistrationStep.energyCheckPlus.subtitle')}</Text>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => {
                                updateFormData('hasEnergyCheckPlus', !formData.hasEnergyCheckPlus);
                            }}
                        >
                            <View style={[styles.checkbox, formData.hasEnergyCheckPlus && styles.checkboxChecked]}>
                                {formData.hasEnergyCheckPlus && <Icon name="check" size={16} color="#fff" />}
                            </View>
                            <View style={styles.checkboxContent}>
                                <Text style={styles.checkboxLabel}>{t('systemRegistrationStep.energyCheckPlus.enable')}</Text>
                            </View>
                        </TouchableOpacity>

                        {formData.hasEnergyCheckPlus && (
                            <>
                                <Text style={styles.checkboxDescription}>
                                    {t('systemRegistrationStep.energyCheckPlus.description1')}
                                </Text>
                                <Text style={styles.checkboxDescription}>
                                    {t('systemRegistrationStep.energyCheckPlus.description2')}
                                </Text>
                                <View style={styles.divider} />

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.energyCheckPlus.expectedSavings')}</Text>
                                    <View style={styles.inputWrapper}>
                                        <Icon name="euro" size={18} color="#999" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t('systemRegistrationStep.energyCheckPlus.savingsPlaceholder')}
                                            placeholderTextColor="#999"
                                            keyboardType="numeric"
                                            value={formData?.EnergyCheck_plus?.annualSavings}
                                            onChangeText={(text) => updateFormData('EnergyCheck_plus', {
                                                ...formData.EnergyCheck_plus,
                                                annualSavings: text
                                            })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.energyCheckPlus.expectedCo2Savings')}</Text>
                                    <View style={styles.inputWrapper}>
                                        <Icon name="eco" size={18} color="#999" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t('systemRegistrationStep.energyCheckPlus.co2SavingsPlaceholder')}
                                            placeholderTextColor="#999"
                                            keyboardType="numeric"
                                            value={formData?.EnergyCheck_plus?.co2Savings}
                                            onChangeText={(text) => updateFormData('EnergyCheck_plus', {
                                                ...formData.EnergyCheck_plus,
                                                co2Savings: text
                                            })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.energyCheckPlus.operatingHoursPerYear')}</Text>
                                    <View style={styles.inputWrapper}>
                                        <Icon name="schedule" size={18} color="#999" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t('systemRegistrationStep.energyCheckPlus.operatingHoursPlaceholder')}
                                            placeholderTextColor="#999"
                                            keyboardType="numeric"
                                            maxLength={4}
                                            value={formData?.EnergyCheck_plus?.operatingHours || ''}
                                            onChangeText={(text) => {
                                                updateFormData('EnergyCheck_plus', {
                                                    ...formData.EnergyCheck_plus,
                                                    operatingHours: text
                                                });
                                                if (formData.distributeHoursEvenly && text) {
                                                    setTimeout(() => distributeHoursEvenly && distributeHoursEvenly(), 100);
                                                }
                                            }}
                                        />
                                    </View>
                                    {errors.expectedOperatingHours ? (
                                        <Text style={styles.errorText}>
                                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.expectedOperatingHours}
                                        </Text>
                                    ) : (
                                        <Text style={styles.helperText}>
                                            <Icon name="info-outline" size={12} color="#999" /> {t('systemRegistrationStep.energyCheckPlus.maxHoursHelper')}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.energyCheckPlus.industry')}</Text>
                                    <TouchableOpacity
                                        style={styles.pickerContainer}
                                        onPress={() => setShowIndustryPicker && setShowIndustryPicker(!showIndustryPicker)}
                                    >
                                        <View style={styles.pickerButton}>
                                            <Icon name="business-center" size={18} color="#999" style={styles.inputIcon} />
                                            <Text style={formData?.EnergyCheck_plus?.industry ? styles.pickerText : styles.pickerPlaceholder}>
                                                {formData?.EnergyCheck_plus?.industry || t('systemRegistrationStep.energyCheckPlus.industryPlaceholder')}
                                            </Text>
                                            <Icon
                                                name={showIndustryPicker ? "expand-less" : "expand-more"}
                                                size={24}
                                                color="#666"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    {showIndustryPicker && (
                                        <View style={styles.dropdownOverlay}>
                                            {industries.map((industry, idx) => (
                                                <TouchableOpacity
                                                    key={industry}
                                                    style={[
                                                        styles.pickerOption,
                                                        idx === industries.length - 1 && styles.pickerOptionLast
                                                    ]}
                                                    onPress={() => {
                                                        updateFormData('EnergyCheck_plus', {
                                                            ...formData.EnergyCheck_plus,
                                                            industry
                                                        });
                                                        setShowIndustryPicker && setShowIndustryPicker(false);
                                                    }}
                                                >
                                                    <Text style={styles.pickerOptionText}>{industry}</Text>
                                                    {formData.EnergyCheck_plus?.industry === industry && (
                                                        <Icon name="check" size={20} color="#00B050" />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('systemRegistrationStep.energyCheckPlus.recipientEmails')}</Text>
                                    <Text style={styles.labelHelper}>{t('systemRegistrationStep.energyCheckPlus.recipientEmailsHelper')}</Text>
                                    <View style={styles.inputWrapper}>
                                        <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            placeholder={t('systemRegistrationStep.energyCheckPlus.recipientEmailsPlaceholder')}
                                            placeholderTextColor="#999"
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                            value={formData.EnergyCheck_plus?.email}
                                            onChangeText={(text) => updateFormData('EnergyCheck_plus', {
                                                ...formData.EnergyCheck_plus,
                                                email: text
                                            })}
                                        />
                                    </View>
                                    {errors.recipientEmails && (
                                        <Text style={styles.errorText}>
                                            <Icon name="error-outline" size={12} color="#EF4444" /> {errors.recipientEmails}
                                        </Text>
                                    )}
                                </View>
                            </>
                        )}
                    </View>

                    {formData.hasEnergyCheckPlus && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Icon name="calendar-today" size={24} color="#003D82" />
                                <View style={styles.cardHeaderText}>
                                    <Text style={styles.cardTitle}>{t('systemRegistrationStep.energyCheckPlus.adjustHours')}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.checkboxCard}
                                onPress={() => {
                                    const newValue = !formData.distributeHoursEvenly;
                                    updateFormData('distributeHoursEvenly', newValue);
                                    if (newValue && distributeHoursEvenly) {
                                        distributeHoursEvenly();
                                    }
                                }}
                            >
                                <View style={[styles.checkbox, formData.distributeHoursEvenly && styles.checkboxChecked]}>
                                    {formData.distributeHoursEvenly && <Icon name="check" size={16} color="#fff" />}
                                </View>
                                <View style={styles.checkboxContent}>
                                    <Text style={styles.checkboxLabel}>{t('systemRegistrationStep.energyCheckPlus.distributeHours')}</Text>
                                    <Text style={styles.checkboxDescription}>{t('systemRegistrationStep.energyCheckPlus.distributeHoursDescription')}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, styles.monthColumn]}>{t('systemRegistrationStep.energyCheckPlus.month')}</Text>
                                    <Text style={[styles.tableHeaderText, styles.percentageColumn]}>{t('systemRegistrationStep.energyCheckPlus.percentage')}</Text>
                                    <Text style={[styles.tableHeaderText, styles.hoursColumn]}>{t('systemRegistrationStep.energyCheckPlus.hours')}</Text>
                                </View>

                                <ScrollView style={styles.tableBody} nestedScrollEnabled>
                                    {formData.monthlyDistribution?.map((item: any, index: number) => (
                                        <View key={item.month}>
                                            <View
                                                style={[
                                                    styles.tableRow,
                                                    index % 2 === 0 && styles.tableRowEven
                                                ]}
                                            >
                                                <Text style={[styles.tableCellText, styles.monthColumn]}>{translateMonth(item.month)}</Text>
                                                {formData.distributeHoursEvenly ? (
                                                    <>
                                                        <Text style={[styles.tableCellText, styles.percentageColumn]}>{item.percentage}%</Text>
                                                        <Text style={[styles.tableCellText, styles.hoursColumn]}>{parseFloat(item.hours).toFixed(0)}h</Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <View style={styles.percentageColumn}>
                                                            <TextInput
                                                                style={styles.tableInput}
                                                                keyboardType="decimal-pad"
                                                                value={item.percentage}
                                                                onChangeText={(text) => updateMonthlyPercentage && updateMonthlyPercentage(item.month, text)}
                                                                placeholder="0.00"
                                                            />
                                                        </View>
                                                        <Text style={[styles.tableCellText, styles.hoursColumn]}>{parseFloat(item.hours).toFixed(0)}h</Text>
                                                    </>
                                                )}
                                            </View>
                                            {monthlyErrors && monthlyErrors[index] && (
                                                <Text style={styles.tableErrorText}>{monthlyErrors[index]}</Text>
                                            )}
                                        </View>
                                    ))}
                                </ScrollView>

                                <View style={styles.tableTotalRow}>
                                    <Text style={[styles.tableTotalText, styles.monthColumn]}>{t('systemRegistrationStep.energyCheckPlus.total')}</Text>
                                    <Text style={[styles.tableTotalText, styles.percentageColumn]}>
                                        {calculateTotalPercentage?.() || '0%'}
                                    </Text>
                                    <Text style={[styles.tableTotalText, styles.hoursColumn]}>
                                        {calculateTotalHours?.() || '0h'}
                                    </Text>
                                </View>
                            </View>

                            {totalPercentageError && (
                                <Text style={styles.errorText}>
                                    <Icon name="error-outline" size={12} color="#EF4444" /> {totalPercentageError}
                                </Text>
                            )}
                        </View>
                    )}
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonSecondary} onPress={onBack}>
                    <Icon name="arrow-back" size={20} color="#003D82" />
                    <Text style={styles.buttonSecondaryText}>{t('systemRegistrationStep.buttons.back')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPrimary} onPress={handleNextClick}>
                    <Text style={styles.buttonPrimaryText}>{t('systemRegistrationStep.buttons.continue')}</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Terms and Conditions Modal */}
            <TermsAndConditionsModal
                isOpen={isTermsModalOpen}
                onClose={handleTermsClose}
                onAccept={handleTermsAccept}
                termsData={{
                    termsAndConsent: FACILITY_TERMS_DATA.termsAndConsent.map(key => t(key)),
                    title: t(FACILITY_TERMS_DATA.title),
                    checkboxLabel: t(FACILITY_TERMS_DATA.checkboxLabel),
                    checkboxLabel2: t(FACILITY_TERMS_DATA.checkboxLabel2),
                    cancelButton: t(FACILITY_TERMS_DATA.cancelButton),
                    acceptButton: t(FACILITY_TERMS_DATA.acceptButton)
                }}
            />
        </ScrollView>
    );
};

export default SystemRegistrationStep;