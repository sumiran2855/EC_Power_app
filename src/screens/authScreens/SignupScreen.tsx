import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignupLogic } from '../../hooks/useSignup';
import { styles } from './LoginScreen.styles';

interface SignupScreenProps { }

const SignupScreen: React.FC<SignupScreenProps> = () => {
  const { t } = useTranslation();
  const {
    // State
    isPasswordVisible,
    isConfirmPasswordVisible,
    currentStep,
    showCountryPicker,
    isSubmitting,
    countryCode,

    // Signup form
    signupControl,
    handleSignupSubmit,
    signupErrors,
    isSignupValid,
    isSignupDirty,

    // Verification form
    verificationControl,
    handleVerificationSubmit,
    verificationErrors,
    isVerificationValid,
    isVerificationDirty,

    // Handlers
    handleSignup,
    handleVerifyCode,
    handleBackToLogin,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleCountryCodeSelect,
    toggleCountryPicker,
    getSignupErrorMessage,
    getVerificationErrorMessage,

    // Data
    countryCodes,
  } = useSignupLogic();

  const renderSignupStep = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('signup.title')}</Text>
        <Text style={styles.subtitle}>
          {t('signup.subtitle')}
        </Text>
      </View>

      {/* Name Fields */}
      <View style={styles.nameContainer}>
        <View style={styles.nameField}>
          <Text style={styles.label}>{t('signup.firstNameLabel')}</Text>
          <Controller
            control={signupControl}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  signupErrors.firstName && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('signup.firstNamePlaceholder')}
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            )}
          />
          {signupErrors.firstName && (
            <Text style={styles.errorText}>{getSignupErrorMessage('firstName')}</Text>
          )}
        </View>

        <View style={styles.nameField}>
          <Text style={styles.label}>{t('signup.lastNameLabel')}</Text>
          <Controller
            control={signupControl}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  signupErrors.lastName && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('signup.lastNamePlaceholder')}
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            )}
          />
          {signupErrors.lastName && (
            <Text style={styles.errorText}>{getSignupErrorMessage('lastName')}</Text>
          )}
        </View>
      </View>

      {/* Email Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('signup.emailLabel')}</Text>
        <Controller
          control={signupControl}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                signupErrors.email && styles.inputError
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('signup.emailPlaceholder')}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          )}
        />
        {signupErrors.email && (
          <Text style={styles.errorText}>{getSignupErrorMessage('email')}</Text>
        )}
      </View>

      {/* Phone Number Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('signup.phoneLabel')}</Text>
        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countryCodeButton}
            onPress={toggleCountryPicker}
            disabled={isSubmitting}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <Controller
            control={signupControl}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.phoneInput,
                  signupErrors.phoneNumber && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('signup.phonePlaceholder')}
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            )}
          />
        </View>

        {showCountryPicker && (
          <View style={styles.countryDropdownWrapper}>
            <ScrollView
              style={styles.countryDropdown}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {countryCodes.map((country: { value: string; label: string }) => (
                <TouchableOpacity
                  key={country.value}
                  style={styles.countryOption}
                  onPress={() => handleCountryCodeSelect(country.value)}
                >
                  <Text style={styles.countryOptionText}>{country.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {signupErrors.phoneNumber && (
          <Text style={styles.errorText}>{getSignupErrorMessage('phoneNumber')}</Text>
        )}
      </View>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('signup.passwordLabel')}</Text>
        <Controller
          control={signupControl}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  signupErrors.password && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('signup.passwordPlaceholder')}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text style={styles.eyeIcon}>
                  {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {signupErrors.password && (
          <Text style={styles.errorText}>{getSignupErrorMessage('password')}</Text>
        )}
      </View>

      {/* Confirm Password Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('signup.confirmPasswordLabel')}</Text>
        <Controller
          control={signupControl}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  signupErrors.confirmPassword && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('signup.confirmPasswordPlaceholder')}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!isConfirmPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={toggleConfirmPasswordVisibility}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text style={styles.eyeIcon}>
                  {isConfirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {signupErrors.confirmPassword && (
          <Text style={styles.errorText}>{getSignupErrorMessage('confirmPassword')}</Text>
        )}
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={[
          styles.loginButton,
          (!isSignupValid || !isSignupDirty || isSubmitting) && styles.loginButtonDisabled
        ]}
        onPress={handleSignupSubmit(handleSignup)}
        activeOpacity={0.8}
        disabled={!isSignupValid || !isSignupDirty || isSubmitting}
      >
        <Text style={[
          styles.loginButtonText,
          (!isSignupValid || !isSignupDirty || isSubmitting) && styles.loginButtonTextDisabled
        ]}>
          {isSubmitting ? t('signup.creatingAccount') : t('signup.createAccountButton')}
        </Text>
      </TouchableOpacity>

      {/* Footer - Back to Login */}
      <View style={styles.signupFooter}>
        <Text style={styles.alreadyHaveAccountText}>
          {t('signup.alreadyHaveAccount')}
        </Text>
        <TouchableOpacity
          onPress={handleBackToLogin}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Text style={[
            styles.backToLoginText,
            isSubmitting && styles.disabledText
          ]}>
            {t('signup.backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderVerificationStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{t('signup.verifyTitle')}</Text>
        <Text style={styles.subtitle}>
          {t('signup.verifySubtitle')}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('signup.verificationCodeLabel')}</Text>
        <Controller
          control={verificationControl}
          name="verificationCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.verificationInput,
                verificationErrors.verificationCode && styles.inputError
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('signup.verificationCodePlaceholder')}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={6}
              autoCorrect={false}
              editable={!isSubmitting}
            />
          )}
        />
        {verificationErrors.verificationCode && (
          <Text style={styles.errorText}>{getVerificationErrorMessage('verificationCode')}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          (!isVerificationValid || !isVerificationDirty || isSubmitting) && styles.loginButtonDisabled
        ]}
        onPress={handleVerificationSubmit(handleVerifyCode)}
        activeOpacity={0.8}
        disabled={!isVerificationValid || !isVerificationDirty || isSubmitting}
      >
        <Text style={[
          styles.loginButtonText,
          (!isVerificationValid || !isVerificationDirty || isSubmitting) && styles.loginButtonTextDisabled
        ]}>
          {isSubmitting ? t('signup.verifying') : t('signup.verifyButton')}
        </Text>
      </TouchableOpacity>

      <View style={styles.signupFooter}>
        <TouchableOpacity
          onPress={handleBackToLogin}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Text style={[
            styles.backToLoginText,
            isSubmitting && styles.disabledText
          ]}>
            {t('signup.backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.backgroundTop} />
            <View style={styles.backgroundBottom} />
            <View style={styles.form}>
              {currentStep === 'signup' ? renderSignupStep() : renderVerificationStep()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default SignupScreen;