import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(254, 'Email must not exceed 254 characters')
        .toLowerCase(),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
        ),
    rememberMe: z.boolean(),
});

// Signup validation schema
export const signupSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .regex(
            /^[a-zA-Z\s'-]+$/,
            'First name can only contain letters, spaces, apostrophes, and hyphens'
        ),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .regex(
            /^[a-zA-Z\s'-]+$/,
            'Last name can only contain letters, spaces, apostrophes, and hyphens'
        ),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(254, 'Email must not exceed 254 characters')
        .toLowerCase(),
    countryCode: z
        .string()
        .min(1, 'Country code is required')
        .regex(/^\+\d{1,4}$/, 'Invalid country code format'),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .min(8, 'Phone number must be at least 8 digits')
        .max(15, 'Phone number must not exceed 15 digits')
        .regex(/^\d+$/, 'Phone number can only contain digits'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Verification validation schema
export const verificationSchema = z.object({
    verificationCode: z
        .string()
        .min(1, 'Verification code is required')
        .length(6, 'Verification code must be exactly 6 digits')
        .regex(/^\d{6}$/, 'Verification code must contain only digits'),
});

// Forgot Password Email validation schema
export const forgotPasswordEmailSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(254, 'Email must not exceed 254 characters')
        .toLowerCase(),
});

// Reset Password validation schema (without verificationCode)
export const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(1, 'New password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
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
        required: 'Username is required',
        minLength: 'Username must be at least 3 characters',
        maxLength: 'Username must not exceed 50 characters',
        pattern: 'Username can only contain letters, numbers, dots, hyphens, and underscores',
    },
    password: {
        required: 'Password is required',
        minLength: 'Password must be at least 8 characters',
        maxLength: 'Password must not exceed 128 characters',
        pattern: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
    firstName: {
        required: 'First name is required',
        minLength: 'First name must be at least 2 characters',
        maxLength: 'First name must not exceed 50 characters',
        pattern: 'First name can only contain letters, spaces, apostrophes, and hyphens',
    },
    lastName: {
        required: 'Last name is required',
        minLength: 'Last name must be at least 2 characters',
        maxLength: 'Last name must not exceed 50 characters',
        pattern: 'Last name can only contain letters, spaces, apostrophes, and hyphens',
    },
    email: {
        required: 'Email is required',
        invalid: 'Please enter a valid email address',
        maxLength: 'Email must not exceed 254 characters',
    },
    phoneNumber: {
        required: 'Phone number is required',
        minLength: 'Phone number must be at least 5 digits',
        maxLength: 'Phone number must not exceed 15 digits',
        pattern: 'Phone number can only contain digits',
    },
    confirmPassword: {
        required: 'Please confirm your password',
        match: "Passwords don't match",
    },
    verificationCode: {
        required: 'Verification code is required',
        length: 'Verification code must be exactly 6 digits',
        pattern: 'Verification code must contain only digits',
    },
    forgotPasswordEmail: {
        required: 'Email is required',
        invalid: 'Please enter a valid email address',
        maxLength: 'Email must not exceed 254 characters',
    },
    newPassword: {
        required: 'New password is required',
        minLength: 'Password must be at least 8 characters',
        maxLength: 'Password must not exceed 128 characters',
        pattern: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    },
    resetConfirmPassword: {
        required: 'Please confirm your new password',
        match: "Passwords don't match",
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