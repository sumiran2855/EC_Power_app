import AuthHelper from '../services/AuthHelper';
import { StorageService } from '../services/StorageService';
import { LoginFormData } from '../validations/LoginValidation';

export class AuthController {
  static async login(data: LoginFormData): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await AuthHelper.ApiRequest({
        endpoint: 'login',
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
        },
      });

      if (response.success && response.data) {
        const { token, user } = response.data;

        // Store the auth tokens
        await StorageService.setAuthTokens({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          idToken: token.idToken,
        });

        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  }

  static async logout(): Promise<void> {
    await StorageService.clearAuthTokens();
    await StorageService.clearUserData();
  }

  // Add other auth-related methods as needed
  static async refreshToken(): Promise<boolean> {
    return false;
  }

  static async validateSession(): Promise<boolean> {
    return false;
  }
}
