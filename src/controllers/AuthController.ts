import { BackendType } from '../config/api.config';
import { RegisterFormData } from '../screens/authScreens/types';
import AuthHelper from '../services/AuthHelper';
import { StorageService } from '../utils/secureStorage';
import { LoginFormData } from '../validations/LoginValidation';

export class AuthController {
  static async login(data: LoginFormData): Promise<{
    success: boolean;
    error?: string;
    response?: any;
  }> {
    try {
      const response = await AuthHelper.ApiRequest({
        endpoint: 'login',
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
        },
        backendType: BackendType.SERVICE_DATABASE,
      })

      if (response.success && response.data) {
        const { token, user } = response.data;

        await StorageService.auth.setTokens(token.accessToken, token.idToken);

        if (user) {
          await StorageService.user.setData(user);
        }

        return { success: true , response: response.data.user };
      } else {
        return {
          success: false,
          error: response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.log('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  static async register(data: RegisterFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await AuthHelper.ApiRequest({
        endpoint: 'signup',
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
          phone_number: data.phone_number,
        },
        backendType: BackendType.PRODUCT_PORTAL,
      });

      if (response.success && response.data) {
        if (response.data.user) {
          await StorageService.user.setData(response.data.user);
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.log('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  static async verify(data: { email: string; code: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await AuthHelper.ApiRequest({
        endpoint: 'verifyEmail',
        method: 'POST',
        body: {
          email: data.email,
          code: data.code,
        },
        backendType: BackendType.PRODUCT_PORTAL,
      });

      if (response.success && response.data) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Email verification failed'
        };
      }
    } catch (error) {
      console.log('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  static async ForgotPassword(data: { email: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await AuthHelper.ApiRequest({
        endpoint: 'forgot-password',
        method: 'POST',
        body: {
          email: data.email,
        },
        backendType: BackendType.PRODUCT_PORTAL,
      });

      if (response.success && response.data) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.log('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  static async ResetPassword(data: { email: string; code: string; password: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await AuthHelper.ApiRequest({
        endpoint: 'reset-password',
        method: 'POST',
        body: {
          email: data.email,
          code: data.code,
          newPassword: data.password,
        },
        backendType: BackendType.PRODUCT_PORTAL,
      });

      if (response.success && response.data) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.log('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      await StorageService.logout();
    } catch (error) {
      console.log('Error during logout:', error);
      throw error;
    }
  }

  // Add other auth-related methods as needed
  static async refreshToken(): Promise<boolean> {
    return false;
  }

  static async validateSession(): Promise<boolean> {
    return false;
  }
}
