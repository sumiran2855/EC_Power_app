import React from 'react';
import { Controller } from 'react-hook-form';
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
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          To reset your password, enter the email address{'\n'}you use to sign in to this website.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
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
              placeholder="Enter your email"
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
          {isSubmitting ? 'Sending...' : 'Send'}
        </Text>
      </TouchableOpacity>

      <View style={styles.ForgetPasswordfooter}>
        <TouchableOpacity>
          <Text style={styles.createAccountText}>Remembered your Password?</Text>
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
            Back to Login
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
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email{'\n'}and create a new password.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={[
            styles.verificationInput,
            verificationError && styles.inputError
          ]}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="Enter 6-digit code"
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
        <Text style={styles.label}>New Password</Text>
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
                placeholder="Enter new password"
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
        <Text style={styles.label}>Confirm Password</Text>
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
                placeholder="Confirm new password"
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
          {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
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
            Back to Login
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