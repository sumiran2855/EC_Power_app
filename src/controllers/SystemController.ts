import { BackendType } from "@/config/api.config";
import AuthHelper from "@/services/AuthHelper";
import StorageService from "@/utils/secureStorage";

export class SystemController {
    static async GetSystemStatus() {
        try {
            const response = await fetch('https://service.ecpower.dk/rest/service/v1/plant/statistics/api/status', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error getting system status", error);
        }
    }

    static async getSystemConfiguration(id: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();

        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `xrgi/data/${id}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.SERVICE_DATABASE,
            });

            if (response.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    error: response.message || 'System configuration failed'
                };
            }
        } catch (error) {
            console.error('System configuration error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred while getting system configuration'
            };
        }
    }
}
