import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TermsAndConditionsModal from '../../../../components/Modals/TermsAndConditionsModal';
import { FACILITY_TERMS_DATA } from '../../../../constants/facilityTermsConstants';
import useRegisterForm from '../../../../hooks/useRegisterForm';
import { country, countryCodes, industries, models } from '../../../authScreens/types';
import styles from './RegisterScreen.styles';


const RegisterScreen: React.FC = () => {
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
  } = useRegisterForm();

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
        <Text style={styles.headerTitle}>Register</Text>
        <View style={styles.backButton} /> {/* Empty view for spacing */}
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Register Your XRGI System</Text>
          <Text style={styles.subtitle}>
            If you do not have the system details, save for later at the bottom of the page
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="settings" size={24} color="#003D82" />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>System Details</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>System name *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="label" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter the system name'
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
              />
              {errors.systemName && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemName}</Text>}
            </View>
            <Text style={styles.helperText}>
              <Icon name="info-outline" size={12} color="#999" /> Example: "System in basement 01"
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>XRGI ID Number *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="fingerprint" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit XRGI ID"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={10}
                value={formData.xrgiID}
                onChangeText={(text) => updateFormData('xrgiID', text)}
              />
              {errors.xrgiIdNumber && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.xrgiIdNumber}</Text>}
            </View>
            <Text style={styles.helperText}>
              <Icon name="info-outline" size={12} color="#999" /> The XRGI® ID is a 10 digit number located on the side of the IQ-Control Panel.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select a Model *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowModelPicker(!showModelPicker)}
            >
              <View style={styles.pickerButton}>
                <Icon name="devices" size={18} color="#999" style={styles.inputIcon} />
                <Text style={formData.modelNumber ? styles.pickerText : styles.pickerPlaceholder}>
                  {formData.modelNumber || 'Choose your XRGI model'}
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
              <Icon name="info-outline" size={12} color="#999" /> The model is on the name plate on the back of the Power Unit
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="location-on" size={24} color="#003D82" />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>XRGI® Site</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="home" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="XRGI® Site Address"
                placeholderTextColor="#999"
                value={formData.location.address}
                onChangeText={(text) => updateFormData('location.address', text)}
              />
              {errors.systemAddress && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemAddress}</Text>}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>Postcode *</Text>
              <TextInput
                style={styles.input}
                placeholder="Postcode"
                placeholderTextColor="#999"
                value={formData.location.postalCode}
                onChangeText={(text) => updateFormData('location.postalCode', text)}
              />
              {errors.systemPostcode && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemPostcode}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.inputHalf]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#999"
                value={formData.location.city}
                onChangeText={(text) => updateFormData('location.city', text)}
              />
              {errors.systemCity && <Text style={styles.errorText}><Icon name="error-outline" size={12} color="#EF4444" /> {errors.systemCity}</Text>}
            </View>
          </View>

          <View style={showCountryPicker ? styles.inputGroupActive : styles.inputGroup}>
            <Text style={styles.label}>Country *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Icon name="public" size={18} color="#999" style={styles.pickerIcon} />
              <Text style={formData.location.country ? styles.pickerText : styles.pickerPlaceholder}>
                {formData.location.country || 'Select country'}
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
              <Text style={styles.cardTitle}>Service Contract</Text>
            </View>
          </View>

          <Text style={styles.questionText}>
            Do you have a service contract for your XRGI® system?
          </Text>
          <Text style={styles.cardSubtitle}>
            The information is required to grant your service partner access to our EC POWER Service Database.
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
                Yes
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
                No
              </Text>
            </TouchableOpacity>
          </View>

          {/* Show "Interested in Service Contract" question ONLY AFTER user answers the first question */}
          {hasServiceContractChoice === false && (
            <>
              <View style={styles.divider} />
              <Text style={styles.questionText}>
                Are you interested in a service contract?
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
                    Yes
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
                    No
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
                <Text style={styles.label}>Service Provider Name *</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="business" size={18} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter service provider name"
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
                <Text style={styles.label}>Email *</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="provider@example.com"
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
                <Text style={styles.label}>Phone *</Text>
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
                      placeholder="Enter phone number"
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
                Is your sales partner same as service contract provider?
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
                    Yes
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
                    No
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Show sales partner details when isSalesPartnerSame is NO */}
              {formData.isSalesPartnerSame === false && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sales Partner Name *</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="business" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter sales partner name"
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
                    <Text style={styles.label}>Email *</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="sales@example.com"
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
                    <Text style={styles.label}>Phone *</Text>
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
                          placeholder="Enter phone number"
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
              <Text style={styles.checkboxLabel}>Is your system installed ?</Text>
              <Text style={styles.checkboxDescription}>Check this if your XRGI system is already set up</Text>
            </View>
          </TouchableOpacity>
        </View>

        {formData.isInstalled && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="analytics" size={24} color="#003D82" />
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>EnergyCheck Plus</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>
                Get a monthly overview of how much you have saved with your XRGI System
              </Text>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => updateFormData('EnergyCheck_plus', !formData.EnergyCheck_plus)}
              >
                <View style={[styles.checkbox, formData.EnergyCheck_plus && styles.checkboxChecked]}>
                  {formData.EnergyCheck_plus && <Icon name="check" size={16} color="#fff" />}
                </View>
                <View style={styles.checkboxContent}>
                  <Text style={styles.checkboxLabel}>Enable EnergyCheck Plus</Text>
                </View>
              </TouchableOpacity>

              {formData.EnergyCheck_plus && (
                <>
                  <Text style={styles.checkboxDescription}>
                    We will compare the actual running hours of your XRGI® system to the expected running hours
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    Please find the values in your initial quote* and fill in below
                  </Text>
                  <View style={styles.divider} />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Expected annual savings</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="euro" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Amount in Euro per year"
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
                    <Text style={styles.label}>Expected annual CO₂ savings</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="eco" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Total per year"
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
                    <Text style={styles.label}>Expected operating hours per year</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="schedule" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="0-8760 hours"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        maxLength={4}
                        value={formData.EnergyCheck_plus?.operatingHours}
                        onChangeText={(text) => updateFormData('EnergyCheck_plus.operatingHours', text)}
                      />
                    </View>
                    <Text style={styles.helperText}>
                      <Icon name="info-outline" size={12} color="#999" /> Maximum: 8760 hours per year (24h × 365 days)
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Industry</Text>
                    <TouchableOpacity
                      style={styles.pickerContainer}
                      onPress={() => setShowIndustryPicker(!showIndustryPicker)}
                    >
                      <View style={styles.pickerButton}>
                        <Icon name="business-center" size={18} color="#999" style={styles.inputIcon} />
                        <Text style={formData.EnergyCheck_plus?.industry ? styles.pickerText : styles.pickerPlaceholder}>
                          {formData.EnergyCheck_plus?.industry || 'Select your industry'}
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
                    <Text style={styles.label}>Recipient Email Address(es)</Text>
                    <Text style={styles.labelHelper}>You can enter multiple addresses separated by commas</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="email" size={18} color="#999" style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="user@example.com, admin@example.com"
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
                    <Text style={styles.cardTitle}>Adjust Hours Distribution</Text>
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
                    <Text style={styles.checkboxLabel}>Distribute hours evenly</Text>
                    <Text style={styles.checkboxDescription}>Apply equal hours across all months</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.monthColumn]}>Month</Text>
                    <Text style={[styles.tableHeaderText, styles.percentageColumn]}>Percentage</Text>
                    <Text style={[styles.tableHeaderText, styles.hoursColumn]}>Hours</Text>
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
                    <Text style={[styles.tableTotalText, styles.monthColumn]}>Total</Text>
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
            <Text style={styles.buttonPrimaryText}>Add Facility</Text>
            <Icon name="add-circle-outline" size={20} color="#fff" />
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
          termsData={FACILITY_TERMS_DATA}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;