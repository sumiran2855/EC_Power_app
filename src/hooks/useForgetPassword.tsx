import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
  ForgotPasswordEmailFormData,
  ResetPasswordFormData,
  forgotPasswordEmailDefaultValues,
  resetPasswordDefaultValues,
} from '../validations/LoginValidation';
import { AuthController } from '../controllers/AuthController';

export const useForgotPasswordLogic = () => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'verification'>('email');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');
  const navigation = useNavigation();

  // Email form management
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid, isDirty: isEmailDirty },
    watch: emailWatch,
    getValues: getEmailValues,
    reset: resetEmailForm,
  } = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: forgotPasswordEmailDefaultValues,
    mode: 'onChange',
  });

  // Reset password form management
  const {
    control: resetControl,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isValid: isResetValid, isDirty: isResetDirty },
    watch: resetWatch,
    setValue: setResetValue,
    reset: resetPasswordForm,
    clearErrors: clearResetErrors,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
    mode: 'onChange',
  });

  // Handler functions
  const handleSendEmail = async (data: ForgotPasswordEmailFormData): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await AuthController.ForgotPassword(data);
      if (result.success) {
        setCurrentStep('verification');
      }
    } catch (error) {
      console.error('Send email error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndReset = async (data: ResetPasswordFormData): Promise<void> => {
    if (isSubmitting) return;

    // Validate verification code separately
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsSubmitting(true);
    setVerificationError('');

    try {
      const data = {
        email: getEmailValues().email,
        code: verificationCode,
        password: resetWatch().newPassword,
      }
      const result = await AuthController.ResetPassword(data);
      if (result.success) {
        (navigation as any).navigate('Login');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setVerificationError('Invalid verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = (): void => {
    resetEmailForm(forgotPasswordEmailDefaultValues);
    resetPasswordForm(resetPasswordDefaultValues);
    setVerificationCode('');
    setVerificationError('');
    setCurrentStep('email');
    (navigation as any).navigate('Login');
  };

  const handleBackToEmail = (): void => {
    resetPasswordForm(resetPasswordDefaultValues);
    clearResetErrors();
    setVerificationCode('');
    setVerificationError('');
    setCurrentStep('email');
  };

  const toggleNewPasswordVisibility = (): void => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  // Helper function to get error message for email form
  const getEmailErrorMessage = (fieldName: keyof ForgotPasswordEmailFormData): string | undefined => {
    return emailErrors[fieldName]?.message;
  };

  // Helper function to get error message for reset form
  const getResetErrorMessage = (fieldName: keyof ResetPasswordFormData): string | undefined => {
    return resetErrors[fieldName]?.message;
  };

  return {
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
    handleBackToEmail,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    getEmailErrorMessage,
    getResetErrorMessage,
  };
};