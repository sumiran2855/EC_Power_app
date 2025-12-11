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
            console.log('Failed to get service report:', error);
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
            console.log('Failed to get uploaded service report:', error);
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

            const formData = new FormData();

            const fileUri = fileData.file.uri;
            const filename = fileUri.split('/').pop() || 'file';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image';

            const file = {
                uri: fileUri,
                name: fileData.file.name || filename,
                type: fileData.file.type || type,
            };

            // Append all data to formData
            formData.append('file', file as any);
            formData.append('creationDate', fileData.creationDate);
            formData.append('deliveryDate', fileData.deliveryDate);
            formData.append('serviceType', fileData.serviceType);
            formData.append('serviceReportNumber', fileData.serviceReportNumber);
            formData.append('customerID', fileData.customerID);
            formData.append('xrgiID', fileData.xrgiID);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'x-id-token': idToken,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
            }

            const responseData = await response.json();
            return { success: true, data: responseData };
        } catch (error) {
            console.log('Failed to upload service report:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }
};
