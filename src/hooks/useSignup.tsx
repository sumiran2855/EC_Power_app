import { zodResolver } from '@hookform/resolvers/zod';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthController } from '../controllers/AuthController';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
    SignupFormData,
    VerificationFormData,
    countryCodes,
    signupDefaultValues,
    signupSchema,
    verificationDefaultValues,
    verificationSchema,
} from '../validations/LoginValidation';
import { useTranslation } from 'react-i18next';

export const useSignupLogic = () => {
  const { t } = useTranslation(); 
  // State management
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'signup' | 'verification'>('signup');
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Signup form management
  const {
    control: signupControl,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isValid: isSignupValid, isDirty: isSignupDirty },
    watch: signupWatch,
    setValue: setSignupValue,
    getValues: getSignupValues,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaultValues,
    mode: 'onChange',
  });

  // Verification form management
  const {
    control: verificationControl,
    handleSubmit: handleVerificationSubmit,
    formState: { errors: verificationErrors, isValid: isVerificationValid, isDirty: isVerificationDirty },
    watch: verificationWatch,
    setValue: setVerificationValue,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: verificationDefaultValues,
    mode: 'onChange',
  });

  // Watch form values
  const countryCode = signupWatch('countryCode');

  // Handler functions
  const handleSignup = async (data: SignupFormData): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const registrationData = {
        email: data.email,
        phone_number: `${countryCode}${data.phoneNumber}`,
        name: `${data.firstName} ${data.lastName}`,
        password: data.password,
      };

      const result = await AuthController.register(registrationData);

      if (result.success) {
        setCurrentStep('verification');
      }
    } catch (error) {
      console.log('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (data: VerificationFormData): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const verificationData = {
        email: getSignupValues().email,
        code: data.verificationCode,
      };
      const result = await AuthController.verify(verificationData);
      if (result.success) {
        navigation.navigate('Login' as never);
      }
    } catch (error) {
      console.log('Verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = (): void => {
    navigation.goBack();
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleCountryCodeSelect = (code: string): void => {
    setSignupValue('countryCode', code, { shouldValidate: true });
    setShowCountryPicker(false);
  };

  const toggleCountryPicker = (): void => {
    setShowCountryPicker(!showCountryPicker);
  };

  const handleBackToSignup = (): void => {
    setCurrentStep('signup');
  };

  // Helper function to get error message for signup form
  const getSignupErrorMessage = (fieldName: keyof SignupFormData): string | undefined => {
    const message = signupErrors[fieldName]?.message;
    if (message && message.startsWith('validation.')) {
      return t(message);
    }
    return message;
  };

  // Helper function to get error message for verification form
  const getVerificationErrorMessage = (fieldName: keyof VerificationFormData): string | undefined => {
    const message = verificationErrors[fieldName]?.message;
    if (message && message.startsWith('validation.')) {
      return t(message);
    }
    return message;
  };

  return {
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
    handleBackToSignup,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleCountryCodeSelect,
    toggleCountryPicker,
    getSignupErrorMessage,
    getVerificationErrorMessage,

    // Data
    countryCodes,
  };
};