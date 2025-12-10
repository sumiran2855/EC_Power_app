import { BackendType } from "@/config/api.config";
import AuthHelper from "@/services/AuthHelper";
import StorageService from "@/utils/secureStorage";

export class StepperController {
    static async CreateProfile(data: any): Promise<{ success: boolean; error?: string }> {
        const { authToken, idToken } = await StorageService.auth.getTokens();

        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: 'create-profile',
                method: 'POST',
                body: data,
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
            });
            console.log("response", response);

            if (response.success && response.data) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.message || 'Profile creation failed'
                };
            }
        } catch (error) {
            console.error('Profile creation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }

    static async UpdateProfile(data: any, userId: string): Promise<{ success: boolean; error?: string }> {
        const { authToken, idToken } = await StorageService.auth.getTokens();

        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `update-profile/${userId}`,
                method: 'PUT',
                body: data,
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
            });
            console.log("Update profile response:", response);

            if (response.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.message || 'Profile update failed'
                };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred while updating profile'
            };
        }
    }
}
