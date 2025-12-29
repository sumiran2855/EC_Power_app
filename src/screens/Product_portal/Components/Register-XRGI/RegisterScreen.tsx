import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TermsAndConditionsModal from '../../../../components/Modals/TermsAndConditionsModal';
import { FACILITY_TERMS_DATA } from '../../../../constants/facilityTermsConstants';
import useRegisterForm from '../../../../hooks/useRegisterForm';
import { RootStackParamList } from '../../../../navigation/AppNavigator';
import { country, countryCodes, industries, models } from '../../../authScreens/types';
import styles from './RegisterScreen.styles';

type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;
type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  route: RegisterScreenRouteProp;
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ route }) => {
  const { t } = useTranslation();
  const Icon = MaterialIcons;
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const {
    // Form state
    formData,
    updateFormData,

    // UI state
    showModelPicker,
    setShowModelPicker,
    showCountryPicker,
    setShowCountryPicker,
    showServiceCountryCodePicker,
    setShowServiceCountryCodePicker,
    showSalesCountryCodePicker,
    setShowSalesCountryCodePicker,
    showIndustryPicker,
    setShowIndustryPicker,
    distributeEvenly,

    // Validation
    monthlyErrors,
    totalPercentageError,
    errors,

    // Methods
    handleSubmit,
    calculateTotalHours,
    calculateTotalPercentage,
    handleBackPress,
    handleDistributeEvenlyChange,
    handleMonthlyPercentageChange,
    inputValues,
    hasServiceContractChoice,
    needServiceContractChoice,
  } = useRegisterForm(route);

  const handleAddFacilityClick = () => {
    setIsTermsModalOpen(true);
    setPendingSubmit(true);
  };

  const handleTermsAccept = () => {
    setIsTermsModalOpen(false);
    setPendingSubmit(false);

    updateFormData('DaSigned', true);

    setTimeout(() => {
      handleSubmit(formData.isInstalled === true);
    }, 100);
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Update header with centered title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#1a5490" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('systemRegistrationStep.header.title')}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
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
              {errors.systemName && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemName}</Text>}
            </View>
            <Text style={styles.helperText}>
              <Icon name="info-outline" size={12} color="#999" /> <Text>{t('systemRegistrationStep.systemDetails.systemNameHelper')}</Text>
            </Text>
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
              {errors.xrgiIdNumber && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.xrgiIdNumber}</Text>}
            </View>
            <Text style={styles.helperText}>
              <Icon name="info-outline" size={12} color="#999" /> <Text>{t('systemRegistrationStep.systemDetails.xrgiIdHelper')}</Text>
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('systemRegistrationStep.systemDetails.selectModel')} *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowModelPicker(!showModelPicker)}
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
              {errors.selectedModel && <Text style={[styles.errorText, { marginTop: 4 }]}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.selectedModel}</Text>}
            </TouchableOpacity>
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
                      setShowModelPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{model}</Text>
                    {formData.modelNumber === model && (
                      <Icon name="check" size={20} color="#00B050" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <Text style={styles.helperText}>
              <Icon name="info-outline" size={12} color="#999" /> <Text>{t('systemRegistrationStep.systemDetails.modelHelper')}</Text>
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
                value={formData.location.address}
                onChangeText={(text) => updateFormData('location.address', text)}
              />
              {errors.systemAddress && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemAddress}</Text>}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.postcode')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('systemRegistrationStep.xrgiSite.postcodePlaceholder')}
                placeholderTextColor="#999"
                value={formData.location.postalCode}
                onChangeText={(text) => updateFormData('location.postalCode', text)}
              />
              {errors.systemPostcode && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemPostcode}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.city')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('systemRegistrationStep.xrgiSite.cityPlaceholder')}
                placeholderTextColor="#999"
                value={formData.location.city}
                onChangeText={(text) => updateFormData('location.city', text)}
              />
              {errors.systemCity && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemCity}</Text>}
            </View>
          </View>

          <View style={showCountryPicker ? styles.inputGroupActive : styles.inputGroup}>
            <Text style={styles.label}>{t('systemRegistrationStep.xrgiSite.country')} *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Icon name="public" size={18} color="#999" style={styles.pickerIcon} />
              <Text style={formData.location.country ? styles.pickerText : styles.pickerPlaceholder}>
                {formData.location.country || t('systemRegistrationStep.xrgiSite.countryPlaceholder')}
              </Text>
              <Icon
                name={showCountryPicker ? "expand-less" : "expand-more"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {showCountryPicker && (
              <View style={styles.dropdownOverlay}>
                <ScrollView style={styles.countryCodeList} nestedScrollEnabled>
                  {country.map((countryItem) => (
                    <TouchableOpacity
                      key={countryItem}
                      style={styles.pickerOption}
                      onPress={() => {
                        updateFormData('location.country', countryItem);
                        setShowCountryPicker(false);
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
                hasServiceContractChoice === true && styles.toggleButtonActive,
              ]}
              onPress={() => updateFormData('hasServiceContract', true)}
            >
              <Icon
                name="check-circle"
                size={20}
                color={hasServiceContractChoice === true ? '#fff' : '#999'}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  hasServiceContractChoice === true && styles.toggleButtonTextActive,
                ]}
              >
                {t('systemRegistrationStep.serviceContract.yes')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonRight,
                hasServiceContractChoice === false && styles.toggleButtonActive,
              ]}
              onPress={() => updateFormData('hasServiceContract', false)}
            >
              <Icon
                name="cancel"
                size={20}
                color={hasServiceContractChoice === false ? '#fff' : '#999'}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  hasServiceContractChoice === false && styles.toggleButtonTextActive,
                ]}
              >
                {t('systemRegistrationStep.serviceContract.no')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show "Interested in Service Contract" question ONLY AFTER user answers the first question */}
          {hasServiceContractChoice === false && (
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
                    needServiceContractChoice === true && styles.toggleButtonActive,
                  ]}
                  onPress={() => updateFormData('needServiceContract', true)}
                >
                  <Icon
                    name="check-circle"
                    size={20}
                    color={needServiceContractChoice === true ? '#fff' : '#999'}
                  />
                  <Text
                    style={[
                      styles.toggleButtonText,
                      needServiceContractChoice === true && styles.toggleButtonTextActive,
                    ]}
                  >
                    {t('systemRegistrationStep.serviceContract.yes')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    styles.toggleButtonRight,
                    needServiceContractChoice === false && styles.toggleButtonActive,
                  ]}
                  onPress={() => updateFormData('needServiceContract', false)}
                >
                  <Icon
                    name="cancel"
                    size={20}
                    color={needServiceContractChoice === false ? '#fff' : '#999'}
                  />
                  <Text
                    style={[
                      styles.toggleButtonText,
                      needServiceContractChoice === false && styles.toggleButtonTextActive,
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
                    onChangeText={(text) => updateFormData('serviceProvider.name', text)}
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
                    placeholder={t('systemRegistrationStep.serviceContract.providerEmailPlaceholder')}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.serviceProvider?.mailAddress}
                    onChangeText={(text) => updateFormData('serviceProvider.mailAddress', text)}
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
                    onPress={() => setShowServiceCountryCodePicker(!showServiceCountryCodePicker)}
                  >
                    <Text style={styles.countryCodeText}>
                      {countryCodes.find(c => c.code === formData.serviceProvider?.countryCode)?.flag} {formData.serviceProvider?.countryCode}
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
                        updateFormData('serviceProvider.phone', cleaned);
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
                            updateFormData('serviceProvider.countryCode', country.code);
                            setShowServiceCountryCodePicker(false);
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
                {t('systemRegistrationStep.serviceContract.salesPartnerSame')}
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
                        onChangeText={(text) => updateFormData('salesPartner.name', text)}
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
                        placeholder={t('systemRegistrationStep.serviceContract.salesPartnerEmailPlaceholder')}
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formData.salesPartner?.mailAddress}
                        onChangeText={(text) => updateFormData('salesPartner.mailAddress', text)}
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
                        onPress={() => setShowSalesCountryCodePicker(!showSalesCountryCodePicker)}
                      >
                        <Text style={styles.countryCodeText}>
                          {countryCodes.find(c => c.code === formData.salesPartner?.countryCode)?.flag} {formData.salesPartner?.countryCode}
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
                            updateFormData('salesPartner.phone', cleaned);
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
                                updateFormData('salesPartner.countryCode', country.code);
                                setShowSalesCountryCodePicker(false);
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
              <Text style={styles.cardSubtitle}>
                {t('systemRegistrationStep.energyCheckPlus.subtitle')}
              </Text>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => updateFormData('EnergyCheck_plus', !formData.EnergyCheck_plus)}
              >
                <View style={[styles.checkbox, formData.EnergyCheck_plus && styles.checkboxChecked]}>
                  {formData.EnergyCheck_plus && <Icon name="check" size={16} color="#fff" />}
                </View>
                <View style={styles.checkboxContent}>
                  <Text style={styles.checkboxLabel}>{t('systemRegistrationStep.energyCheckPlus.enable')}</Text>
                </View>
              </TouchableOpacity>

              {formData.EnergyCheck_plus && (
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
                      <Icon name={formData.location.country === 'USA' ? 'attach-money' : 'euro'} size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder={t('systemRegistrationStep.energyCheckPlus.savingsPlaceholder')}
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={formData.EnergyCheck_plus?.annualSavings}
                        onChangeText={(text) => updateFormData('EnergyCheck_plus.annualSavings', text)}
                      />
                    </View>
                    {errors.expectedAnnualSavings && (
                      <Text style={styles.errorText}>
                        <Icon name="error-outline" size={12} color="#EF4444" /> {errors.expectedAnnualSavings}
                      </Text>
                    )}
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
                        value={formData.EnergyCheck_plus?.co2Savings}
                        onChangeText={(text) => updateFormData('EnergyCheck_plus.co2Savings', text)}
                      />
                    </View>
                    {errors.expectedCO2Savings && (
                      <Text style={styles.errorText}>
                        <Icon name="error-outline" size={12} color="#EF4444" /> {errors.expectedCO2Savings}
                      </Text>
                    )}
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
                        value={formData.EnergyCheck_plus?.operatingHours}
                        onChangeText={(text) => updateFormData('EnergyCheck_plus.operatingHours', text)}
                      />
                    </View>
                    <Text style={styles.helperText}>
                      <Icon name="info-outline" size={12} color="#999" /> {t('systemRegistrationStep.energyCheckPlus.maxHoursHelper')}
                    </Text>
                    {errors.expectedOperatingHours && (
                      <Text style={styles.errorText}>
                        <Icon name="error-outline" size={12} color="#EF4444" /> {errors.expectedOperatingHours}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('systemRegistrationStep.energyCheckPlus.industry')}</Text>
                    <TouchableOpacity
                      style={styles.pickerContainer}
                      onPress={() => setShowIndustryPicker(!showIndustryPicker)}
                    >
                      <View style={styles.pickerButton}>
                        <Icon name="business-center" size={18} color="#999" style={styles.inputIcon} />
                        <Text style={formData.EnergyCheck_plus?.industry ? styles.pickerText : styles.pickerPlaceholder}>
                          {formData.EnergyCheck_plus?.industry || t('systemRegistrationStep.energyCheckPlus.industryPlaceholder')}
                        </Text>
                        <Icon
                          name={showIndustryPicker ? "expand-less" : "expand-more"}
                          size={24}
                          color="#666"
                        />
                      </View>
                    </TouchableOpacity>
                    {showIndustryPicker && (
                      <ScrollView style={styles.dropdownOverlay} nestedScrollEnabled>
                        {industries.map((industry, idx) => (
                          <TouchableOpacity
                            key={industry}
                            style={[
                              styles.pickerOption,
                              idx === industries.length - 1 && styles.pickerOptionLast
                            ]}
                            onPress={() => {
                              updateFormData('EnergyCheck_plus.industry', industry);
                              setShowIndustryPicker(false);
                            }}
                          >
                            <Text style={styles.pickerOptionText}>{industry}</Text>
                            {formData.EnergyCheck_plus?.industry === industry && (
                              <Text>
                                <Icon name="check" size={20} color="#00B050" />
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
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
                        onChangeText={(text) => updateFormData('EnergyCheck_plus.email', text)}
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

            {formData.EnergyCheck_plus && (
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
                    const newValue = !distributeEvenly;
                    handleDistributeEvenlyChange(newValue);
                  }}
                >
                  <View style={[styles.checkbox, distributeEvenly && styles.checkboxChecked]}>
                    {distributeEvenly && (
                      <Text>
                        <Icon name="check" size={16} color="#fff" />
                      </Text>
                    )}
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
                    {formData.EnergyCheck_plus?.monthlyDistribution?.map((item: any, index: any) => (
                      <View key={item.month}>
                        <View
                          style={[
                            styles.tableRow,
                            index % 2 === 0 && styles.tableRowEven
                          ]}
                        >
                          <Text style={[styles.tableCellText, styles.monthColumn]}>{item.month}</Text>
                          {distributeEvenly ? (
                            <>
                              <Text style={[styles.tableCellText, styles.percentageColumn]}>
                                {item.percentage.toFixed(2)}%
                              </Text>
                              <Text style={[styles.tableCellText, styles.hoursColumn]}>
                                {parseFloat(item.hours).toFixed(0)}h
                              </Text>
                            </>
                          ) : (
                            <>
                              <View style={styles.percentageColumn}>
                                <TextInput
                                  style={styles.tableInput}
                                  keyboardType="decimal-pad"
                                  value={inputValues[item.month] !== undefined ? inputValues[item.month] : ''}
                                  onChangeText={(text) => handleMonthlyPercentageChange(item.month, text)}
                                  placeholder="0.00"
                                  placeholderTextColor="#999"
                                />
                              </View>
                              <Text style={[styles.tableCellText, styles.hoursColumn]}>
                                {parseFloat(item.hours).toFixed(0)}h
                              </Text>
                            </>
                          )}
                        </View>
                        {monthlyErrors[item.month] && (
                          <Text style={styles.errorText}>
                            <Icon name="error-outline" size={12} color="#EF4444" /> {monthlyErrors[item.month]}
                          </Text>
                        )}
                      </View>
                    ))}
                  </ScrollView>

                  <View style={styles.tableTotalRow}>
                    <Text style={[styles.tableTotalText, styles.monthColumn]}>{t('systemRegistrationStep.energyCheckPlus.total')}</Text>
                    <Text style={[styles.tableTotalText, styles.percentageColumn]}>
                      {calculateTotalPercentage()}
                    </Text>
                    <Text style={[styles.tableTotalText, styles.hoursColumn]}>
                      {calculateTotalHours()}
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
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleAddFacilityClick}
          >
            <Text style={styles.buttonPrimaryText}>
              {route?.params?.editMode ? t('systemRegistrationStep.buttons.saveChanges') : t('systemRegistrationStep.buttons.addFacility')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions Modal */}
        <TermsAndConditionsModal
          isOpen={isTermsModalOpen}
          onClose={() => {
            setIsTermsModalOpen(false);
            setPendingSubmit(false);
          }}
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
    </SafeAreaView>
  );
};

export default RegisterScreen;