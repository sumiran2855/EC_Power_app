import { useTranslation } from 'react-i18next';
import { z } from 'zod';

// Helper function to get translated validation messages
export const getValidationSchemas = () => {
  const { t } = useTranslation();
  
  return {
    loginSchema: z.object({
      email: z
        .string()
        .min(1, t('validation.email.required'))
        .email(t('validation.email.invalid'))
        .max(254, t('validation.email.maxLength'))
        .toLowerCase(),
      password: z
        .string()
        .min(1, t('validation.password.required'))
        .min(8, t('validation.password.minLength'))
        .max(128, t('validation.password.maxLength'))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          t('validation.password.pattern')
        ),
      rememberMe: z.boolean(),
    }),
    
    signupSchema: z.object({
      firstName: z
        .string()
        .min(1, t('validation.firstName.required'))
        .min(2, t('validation.firstName.minLength'))
        .max(50, t('validation.firstName.maxLength'))
        .regex(
          /^[a-zA-Z\s'-]+$/,
          t('validation.firstName.pattern')
        ),
      lastName: z
        .string()
        .min(1, t('validation.lastName.required'))
        .min(2, t('validation.lastName.minLength'))
        .max(50, t('validation.lastName.maxLength'))
        .regex(
          /^[a-zA-Z\s'-]+$/,
          t('validation.lastName.pattern')
        ),
      email: z
        .string()
        .min(1, t('validation.email.required'))
        .email(t('validation.email.invalid'))
        .max(254, t('validation.email.maxLength'))
        .toLowerCase(),
      countryCode: z
        .string()
        .min(1, t('validation.countryCode.required'))
        .regex(/^\+\d{1,4}$/, t('validation.countryCode.invalid')),
      phoneNumber: z
        .string()
        .min(1, t('validation.phoneNumber.required'))
        .min(8, t('validation.phoneNumber.minLength'))
        .max(15, t('validation.phoneNumber.maxLength'))
        .regex(/^\d+$/, t('validation.phoneNumber.pattern')),
      password: z
        .string()
        .min(1, t('validation.password.required'))
        .min(8, t('validation.password.minLength'))
        .max(128, t('validation.password.maxLength'))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          t('validation.password.pattern')
        ),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPassword.required')),
    }).refine((data) => data.password === data.confirmPassword, {
      message: t('validation.confirmPassword.match'),
      path: ["confirmPassword"],
    }),
    
    verificationSchema: z.object({
      verificationCode: z
        .string()
        .min(1, t('validation.verificationCode.required'))
        .length(6, t('validation.verificationCode.length'))
        .regex(/^\d{6}$/, t('validation.verificationCode.pattern')),
    }),
    
    forgotPasswordEmailSchema: z.object({
      email: z
        .string()
        .min(1, t('validation.email.required'))
        .email(t('validation.email.invalid'))
        .max(254, t('validation.email.maxLength'))
        .toLowerCase(),
    }),
    
    resetPasswordSchema: z.object({
      newPassword: z
        .string()
        .min(1, t('validation.newPassword.required'))
        .min(8, t('validation.newPassword.minLength'))
        .max(128, t('validation.newPassword.maxLength'))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          t('validation.newPassword.pattern')
        ),
      confirmPassword: z
        .string()
        .min(1, t('validation.resetConfirmPassword.required')),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.resetConfirmPassword.match'),
      path: ["confirmPassword"],
    }),
  };
};

// Legacy exports for backward compatibility
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'validation.email.required')
        .email('validation.email.invalid')
        .max(254, 'validation.email.maxLength')
        .toLowerCase(),
    password: z
        .string()
        .min(1, 'validation.password.required')
        .min(8, 'validation.password.minLength')
        .max(128, 'validation.password.maxLength')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'validation.password.pattern'
        ),
    rememberMe: z.boolean(),
});

// Signup validation schema
export const signupSchema = z.object({
    firstName: z
        .string()
        .min(1, 'validation.firstName.required')
        .min(2, 'validation.firstName.minLength')
        .max(50, 'validation.firstName.maxLength')
        .regex(
            /^[a-zA-Z\s'-]+$/,
            'validation.firstName.pattern'
        ),
    lastName: z
        .string()
        .min(1, 'validation.lastName.required')
        .min(2, 'validation.lastName.minLength')
        .max(50, 'validation.lastName.maxLength')
        .regex(
            /^[a-zA-Z\s'-]+$/,
            'validation.lastName.pattern'
        ),
    email: z
        .string()
        .min(1, 'validation.email.required')
        .email('validation.email.invalid')
        .max(254, 'validation.email.maxLength')
        .toLowerCase(),
    countryCode: z
        .string()
        .min(1, 'validation.countryCode.required')
        .regex(/^\+\d{1,4}$/, 'validation.countryCode.invalid'),
    phoneNumber: z
        .string()
        .min(1, 'validation.phoneNumber.required')
        .min(8, 'validation.phoneNumber.minLength')
        .max(15, 'validation.phoneNumber.maxLength')
        .regex(/^\d+$/, 'validation.phoneNumber.pattern'),
    password: z
        .string()
        .min(1, 'validation.password.required')
        .min(8, 'validation.password.minLength')
        .max(128, 'validation.password.maxLength')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'validation.password.pattern'
        ),
    confirmPassword: z
        .string()
        .min(1, 'validation.confirmPassword.required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'validation.confirmPassword.match',
    path: ["confirmPassword"],
});

// Verification validation schema
export const verificationSchema = z.object({
    verificationCode: z
        .string()
        .min(1, 'validation.verificationCode.required')
        .length(6, 'validation.verificationCode.length')
        .regex(/^\d{6}$/, 'validation.verificationCode.pattern'),
});

// Forgot Password Email validation schema
export const forgotPasswordEmailSchema = z.object({
    email: z
        .string()
        .min(1, 'validation.email.required')
        .email('validation.email.invalid')
        .max(254, 'validation.email.maxLength')
        .toLowerCase(),
});

// Reset Password validation schema (without verificationCode)
export const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(1, 'validation.newPassword.required')
        .min(8, 'validation.newPassword.minLength')
        .max(128, 'validation.newPassword.maxLength')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'validation.newPassword.pattern'
        ),
    confirmPassword: z
        .string()
        .min(1, 'validation.resetConfirmPassword.required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'validation.resetConfirmPassword.match',
    path: ["confirmPassword"],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Default values for the forms
export const loginDefaultValues: LoginFormData = {
    email: '',
    password: '',
    rememberMe: false,
};

export const signupDefaultValues: SignupFormData = {
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+49',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
};

export const verificationDefaultValues: VerificationFormData = {
    verificationCode: '',
};

export const forgotPasswordEmailDefaultValues: ForgotPasswordEmailFormData = {
    email: '',
};

// Updated default values (without verificationCode)
export const resetPasswordDefaultValues: ResetPasswordFormData = {
    newPassword: '',
    confirmPassword: '',
};

// Validation messages for better error handling
export const validationMessages = {
    username: {
        required: 'validation.username.required',
        minLength: 'validation.username.minLength',
        maxLength: 'validation.username.maxLength',
        pattern: 'validation.username.pattern',
    },
    password: {
        required: 'validation.password.required',
        minLength: 'validation.password.minLength',
        maxLength: 'validation.password.maxLength',
        pattern: 'validation.password.pattern',
    },
    firstName: {
        required: 'validation.firstName.required',
        minLength: 'validation.firstName.minLength',
        maxLength: 'validation.firstName.maxLength',
        pattern: 'validation.firstName.pattern',
    },
    lastName: {
        required: 'validation.lastName.required',
        minLength: 'validation.lastName.minLength',
        maxLength: 'validation.lastName.maxLength',
        pattern: 'validation.lastName.pattern',
    },
    email: {
        required: 'validation.email.required',
        invalid: 'validation.email.invalid',
        maxLength: 'validation.email.maxLength',
    },
    phoneNumber: {
        required: 'validation.phoneNumber.required',
        minLength: 'validation.phoneNumber.minLength',
        maxLength: 'validation.phoneNumber.maxLength',
        pattern: 'validation.phoneNumber.pattern',
    },
    confirmPassword: {
        required: 'validation.confirmPassword.required',
        match: 'validation.confirmPassword.match',
    },
    verificationCode: {
        required: 'validation.verificationCode.required',
        length: 'validation.verificationCode.length',
        pattern: 'validation.verificationCode.pattern',
    },
    forgotPasswordEmail: {
        required: 'validation.email.required',
        invalid: 'validation.email.invalid',
        maxLength: 'validation.email.maxLength',
    },
    newPassword: {
        required: 'validation.newPassword.required',
        minLength: 'validation.newPassword.minLength',
        maxLength: 'validation.newPassword.maxLength',
        pattern: 'validation.newPassword.pattern',
    },
    resetConfirmPassword: {
        required: 'validation.resetConfirmPassword.required',
        match: 'validation.resetConfirmPassword.match',
    },
} as const;

// Helper function for password strength checking
export const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    if (length < 8) return 'weak';
    if (hasLower && hasUpper && hasNumber && hasSpecial && length >= 12) return 'strong';
    if ((hasLower && hasUpper && hasNumber) || (hasLower && hasUpper && hasSpecial) || (hasLower && hasNumber && hasSpecial) || (hasUpper && hasNumber && hasSpecial)) return 'medium';
    return 'weak';
};

// Country codes data
export const countryCodes = [
    { label: 'United States (+1)', value: '+1' },
    { label: 'India (+91)', value: '+91' },
    { label: 'Germany (+49)', value: '+49' },
    { label: 'France (+33)', value: '+33' },
    { label: 'United Kingdom (+44)', value: '+44' },
] as const;