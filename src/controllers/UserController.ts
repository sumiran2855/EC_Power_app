import { BackendType } from "@/config/api.config";
import AuthHelper from "@/services/AuthHelper";
import { StorageService } from "@/utils/secureStorage";

export class UserController {
    static async GetUserProfile(userId: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `users/${userId}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.SERVICE_DATABASE,
            });
            return response;
        } catch (error) {
            console.log("Error getting user profile", error);
        }
    }

    static async UpdateUserProfile(email: string, profileData: any) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `create-profile`,
                method: 'POST',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
                body: profileData,
            });
            return response;
        } catch (error) {
            console.log("Error updating user profile", error);
        }
    }

    static async getCustomerDetail(userId:string){
         const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `get-customer-profile?id=${userId}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
            });
            return response;
        } catch (error) {
            console.log("Error getting customer profile", error);
        }
    }
}
