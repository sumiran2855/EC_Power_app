import { BackendType } from "@/config/api.config";
import AuthHelper from "@/services/AuthHelper";
import { FormData } from "../screens/authScreens/types";
import { StorageService } from "@/utils/secureStorage";

export class RegisterController {
    static async AddFacility(formData: FormData) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: 'create-facility',
                method: 'POST',
                body: formData,
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
            });
            return response;
        } catch (error) {
            console.log("Error adding facility", error);
        }
    }
    
    static async GetFacilityList(userId: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `get-user-facility?id=${userId}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
            });
            return response;
        } catch (error) {
            console.log("Error getting facility list", error);
        }
    }
}