import { BackendType } from "@/config/api.config";
import AuthHelper from "@/services/AuthHelper";
import { StorageService } from "@/utils/secureStorage";

export class HelpController {
    static async SendQuery(subject: string, body: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: 'send-queries',
                method: 'POST',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.PRODUCT_PORTAL,
                body: {
                    subject,
                    body, 
                },
            });
            return response;
        } catch (error) {
            console.log("Error sending query", error);
        }
    }
}
