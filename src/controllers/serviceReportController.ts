import { BackendType, getApiConfig } from "@/config/api.config";
import { UploadedFile } from "@/screens/Service_portal/Components/service-report/tabs/uploadTab";
import AuthHelper from "@/services/AuthHelper";
import StorageService from "@/utils/secureStorage";

export class serviceReportController {
    static async GetServiceReport(xrgiID: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `service-report/get-services/${xrgiID}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.SERVICE_DATABASE,
            });

            if (response.success && response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Failed to get service report:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }

    static async GetUploadedServiceReport(xrgiID: string) {
        const { authToken, idToken } = await StorageService.auth.getTokens();
        try {
            const response = await AuthHelper.ApiRequest({
                endpoint: `service-report/get-upload-service-report/${xrgiID}`,
                method: 'GET',
                token: authToken,
                IdToken: idToken,
                backendType: BackendType.SERVICE_DATABASE,
            });

            if (response.success && response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Failed to get uploaded service report:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }

    static async UploadServiceReport(xrgiID: string, fileData: {
        file: UploadedFile;
        creationDate: string;
        deliveryDate: string;
        serviceType: string;
        serviceReportNumber: string;
        customerID: string;
        xrgiID: string;
    }) {
        const { authToken, idToken } = await StorageService.auth.getTokens();

        try {
            const config = getApiConfig(BackendType.SERVICE_DATABASE);
            const url = `${config.BASE_URL}/service-report/upload-service`;

            const fileUri = fileData.file.uri;
            const response = await fetch(fileUri);
            const blob = await response.blob();

            // Create FormData with actual binary file
            const formData = new FormData();
            formData.append('file', blob, fileData.file.name);
            formData.append('creationDate', fileData.creationDate);
            formData.append('deliveryDate', fileData.deliveryDate);
            formData.append('serviceType', fileData.serviceType);
            formData.append('serviceReportNumber', fileData.serviceReportNumber);
            formData.append('customerID', fileData.customerID);
            formData.append('xrgiID', fileData.xrgiID);

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open('POST', url);
                xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
                xhr.setRequestHeader('x-id-token', idToken);

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve({ success: true, data: response });
                        } catch (e) {
                            resolve({ success: true, data: xhr.responseText });
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Network request failed'));
                xhr.ontimeout = () => reject(new Error('Request timeout'));

                xhr.send(formData);
            });

        } catch (error) {
            console.error('Failed to upload service report:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }
};
