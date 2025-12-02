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

    static async UpdateFacility(formData: FormData, facilityId: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `create-facility?id=${facilityId}`,
                method: 'POST',
                body: formData,
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
            });
            return response;
        } catch (error) {
            console.log("Error updating facility", error);
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

    static async GetFacilityByXrgiId(xrgiId: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `dealer/get-facilitiesByXrgi/${xrgiId}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.SERVICE_DATABASE,
            });
            return response;
        } catch (error) {
            console.log(`Error getting facility by xrgi id ${xrgiId}`, error);
        }
    }

    static async GetAllDealers() {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `dealer/getAll-dealer`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.SERVICE_DATABASE,
            });
            return response;
        } catch (error) {
            console.log(`Error getting all dealers`, error);
        }
    }
}