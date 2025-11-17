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
import { HorizontalScrollLanguageSelector } from '../../components/common/LanguageSelector';
import { languageStyles } from '../../components/common/LanguageSelector.styles';
import { useLoginLogic } from '../../hooks/useLogin';
import { styles } from './LoginScreen.styles';

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const {
    // State
    isPasswordVisible,
    selectedLanguage,
    isSubmitting,
    rememberMe,
    
    // Form
    control,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    
    // Handlers
    handleLogin,
    handleForgotPassword,
    handleCreateAccount,
    togglePasswordVisibility,
    handleLanguageChange,
    getErrorMessage,
  } = useLoginLogic();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.backgroundTop} />
          <View style={styles.backgroundBottom} />

          <View style={styles.form}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>LOGIN</Text>
              <Text style={styles.subtitle}>
                Enter your username and password{'\n'}to sign in your account
              </Text>
            </View>

            {/* email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }: any) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.email && styles.inputError
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{getErrorMessage('email')}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }: any) => (
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.passwordInput,
                        errors.password && styles.inputError
                      ]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your password"
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
              {errors.password && (
                <Text style={styles.errorText}>{getErrorMessage('password')}</Text>
              )}
            </View>

             {/* Footer Options */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text style={[
                  styles.forgotPasswordText,
                  isSubmitting && styles.disabledText
                ]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!isValid || !isDirty || isSubmitting) && styles.loginButtonDisabled
              ]}
              onPress={handleSubmit(handleLogin)}
              activeOpacity={0.8}
              disabled={!isValid || !isDirty || isSubmitting}
            >
              <Text style={[
                styles.loginButtonText,
                (!isValid || !isDirty || isSubmitting) && styles.loginButtonTextDisabled
              ]}>
                {isSubmitting ? 'Signing In...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Create Account */}
            <TouchableOpacity
              style={styles.createAccountContainer}
              onPress={handleCreateAccount}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={[
                styles.createAccountText,
                isSubmitting && styles.disabledText
              ]}>
                Don't have an account?
                <Text 
                  style={[
                    styles.createAccountLink,
                    isSubmitting && styles.disabledText
                  ]} 
                  onPress={handleCreateAccount}
                > Create Account</Text>
              </Text>
            </TouchableOpacity>

            {/* Language Selection */}
            <HorizontalScrollLanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              styles={languageStyles}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;