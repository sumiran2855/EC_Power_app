import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    Image,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForgotPasswordLogic } from '../../hooks/useForgetPassword';
import { styles } from './LoginScreen.styles';

interface ForgotPasswordScreenProps {}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
  const { t } = useTranslation();
  const {
    // State
    isNewPasswordVisible,
    isConfirmPasswordVisible,
    currentStep,
    isSubmitting,
    verificationCode,
    setVerificationCode,
    verificationError,

    // Email form
    emailControl,
    handleEmailSubmit,
    emailErrors,
    isEmailValid,
    isEmailDirty,

    // Reset form
    resetControl,
    handleResetSubmit,
    resetErrors,
    isResetValid,
    isResetDirty,

    // Handlers
    handleSendEmail,
    handleVerifyAndReset,
    handleBackToLogin,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    getEmailErrorMessage,
    getResetErrorMessage,
  } = useForgotPasswordLogic();

  const renderEmailStep = () => (
    <>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('forgotPassword.title')}</Text>
        <Text style={styles.subtitle}>
          {t('forgotPassword.subtitle')}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('forgotPassword.emailLabel')}</Text>
        <Controller
          control={emailControl}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                emailErrors.email && styles.inputError
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('forgotPassword.emailPlaceholder')}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          )}
        />
        {emailErrors.email && (
          <Text style={styles.errorText}>{getEmailErrorMessage('email')}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          (!isEmailValid || !isEmailDirty || isSubmitting) && styles.loginButtonDisabled
        ]}
        onPress={handleEmailSubmit(handleSendEmail)}
        activeOpacity={0.8}
        disabled={!isEmailValid || !isEmailDirty || isSubmitting}
      >
        <Text style={[
          styles.loginButtonText,
          (!isEmailValid || !isEmailDirty || isSubmitting) && styles.loginButtonTextDisabled
        ]}>
          {isSubmitting ? t('forgotPassword.sendingCode') : t('forgotPassword.sendCodeButton')}
        </Text>
      </TouchableOpacity>

      <View style={styles.ForgetPasswordfooter}>
        <TouchableOpacity>
          <Text style={styles.createAccountText}>{t('forgotPassword.rememberedPassword')}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.ForgetPasswordfooter}>
        <TouchableOpacity
          onPress={handleBackToLogin}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Text style={[
            styles.forgotPasswordText,
            isSubmitting && styles.disabledText
          ]}>
            {t('forgotPassword.backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderVerificationStep = () => (
    <>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('forgotPassword.resetTitle')}</Text>
        <Text style={styles.subtitle}>
          {t('forgotPassword.resetSubtitle')}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('forgotPassword.verificationCodeLabel')}</Text>
        <TextInput
          style={[
            styles.verificationInput,
            verificationError && styles.inputError
          ]}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder={t('forgotPassword.verificationCodePlaceholder')}
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          maxLength={6}
          autoCorrect={false}
          editable={!isSubmitting}
        />
        {verificationError && (
          <Text style={styles.errorText}>{verificationError}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('forgotPassword.newPasswordLabel')}</Text>
        <Controller
          control={resetControl}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  resetErrors.newPassword && styles.inputError
                ]}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('forgotPassword.newPasswordPlaceholder')}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!isNewPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={toggleNewPasswordVisibility}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text style={styles.eyeIcon}>
                  {isNewPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {resetErrors.newPassword && (
          <Text style={styles.errorText}>{getResetErrorMessage('newPassword')}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('forgotPassword.confirmNewPasswordLabel')}</Text>
        <Controller
          control={resetControl}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  resetErrors.confirmPassword && styles.inputError
                ]}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('forgotPassword.confirmNewPasswordPlaceholder')}
                placeholderTextColor="#9ca3af"
                secureTextEntry={!isConfirmPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
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
        {resetErrors.confirmPassword && (
          <Text style={styles.errorText}>{getResetErrorMessage('confirmPassword')}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.loginButton,
          (!isResetValid || !isResetDirty || isSubmitting) && styles.loginButtonDisabled
        ]}
        onPress={handleResetSubmit(handleVerifyAndReset)}
        activeOpacity={0.8}
        disabled={!isResetValid || !isResetDirty || isSubmitting}
      >
        <Text style={[
          styles.loginButtonText,
          (!isResetValid || !isResetDirty || isSubmitting) && styles.loginButtonTextDisabled
        ]}>
          {isSubmitting ? t('forgotPassword.resettingPassword') : t('forgotPassword.resetPasswordButton')}
        </Text>
      </TouchableOpacity>

      <View style={styles.ForgetPasswordfooter}>
        <TouchableOpacity
          onPress={handleBackToLogin}
          activeOpacity={0.7}
          disabled={isSubmitting}
        >
          <Text style={[
            styles.forgotPasswordText,
            isSubmitting && styles.disabledText
          ]}>
            {t('forgotPassword.backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.backgroundTop} />
          <View style={styles.backgroundBottom} />
          <View style={styles.form}>
            {currentStep === 'email' ? renderEmailStep() : renderVerificationStep()}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ForgotPasswordScreen;