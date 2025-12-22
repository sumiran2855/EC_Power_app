import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '../../languages/i18n.config';
import { AuthController } from '../controllers/AuthController';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LoginFormData, loginDefaultValues, loginSchema } from '../validations/LoginValidation';
import { useLoginAlert } from './useLoginAlert';

type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;

export const useLoginLogic = () => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute<LoginRouteProp>();
  const portalType = route.params?.portalType || 'PRODUCT';
  
  // Initialize login alert hook
  const { alert, hideAlert, showLoginSuccess, showLoginError } = useLoginAlert();

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@app_language');
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Error loading language:', error);
      }
    };
    loadSavedLanguage();
  }, []);

  // Form management
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: 'onChange',
  });

  const rememberMe = watch('rememberMe');

  // Handler functions
  const handleLogin = async (data: LoginFormData): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await AuthController.login(data);
      if (result.success) {
        showLoginSuccess();
        setTimeout(() => {
          if (result.response?.journeyStatus === "completed") {
            (navigation as any).navigate('Home');
          } else {
            (navigation as any).navigate('Stepper');
          }
        }, 1500);
      } else {
        showLoginError(result.error);
      }
    } catch (error) {
      console.log('Login error:', error);
      showLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleForgotPassword = (): void => {
    (navigation as any).navigate('ForgotPassword', { portalType });
  };

  const handleCreateAccount = (): void => {
    (navigation as any).navigate('SignUp', { portalType });
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRememberMe = (): void => {
    setValue('rememberMe', !rememberMe, { shouldValidate: true });
  };

  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    setSelectedLanguage(languageCode);
    try {
      await AsyncStorage.setItem('@app_language', languageCode);
      await i18n.changeLanguage(languageCode);
    } catch (error) {
      console.log('Error changing language:', error);
    }
  };

  // Helper function to get error message
  const getErrorMessage = (fieldName: keyof LoginFormData): string | undefined => {
    const message = errors[fieldName]?.message;
    if (message && message.startsWith('validation.')) {
      return t(message);
    }
    return message;
  };

  return {
    // State
    isPasswordVisible,
    selectedLanguage,
    isSubmitting,
    portalType,
    rememberMe,
    // Alert state
    alert,
    
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
    toggleRememberMe,
    handleLanguageChange,
    getErrorMessage,
    hideAlert,
  };
};