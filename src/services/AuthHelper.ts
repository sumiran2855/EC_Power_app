import { API_CONFIG, BackendType, getApiConfig } from '../config/api.config';

interface RequestOptions {
    endpoint: string;
    method: string;
    body?: object | FormData;
    token?: string;
    IdToken?: string;
    timeoutDuration?: number;
    backendType?: BackendType;
}

class AuthHelper {
    private apiUrl: string;
    private defaultTimeout: number;

    constructor() {
        this.apiUrl = API_CONFIG.BASE_URL;
        this.defaultTimeout = API_CONFIG.TIMEOUT;

        if (!this.apiUrl) {
            throw new Error('API base URL is not defined in the configuration.');
        }
    }

    private getHeaders(body?: object | FormData, token?: string, IdToken?: string): HeadersInit {
        const isFormData = body instanceof FormData;

        const headers: HeadersInit = {
            ...API_CONFIG.HEADERS,
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(IdToken && { 'x-id-token': IdToken }),
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return headers;
    }

    private timeout(ms: number): Promise<never> {
        return new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), ms)
        );
    }

    public async ApiRequest({
        endpoint,
        method,
        body,
        token,
        IdToken,
        timeoutDuration,
        backendType,
    }: RequestOptions): Promise<{ success: boolean; data?: any; message?: string; details?: string }> {
        let requestUrl = '';
        try {
            const config = getApiConfig(backendType);
            requestUrl = `${config.BASE_URL}/${endpoint}`;
            const isFormData = body instanceof FormData;
            const fetchPromise = fetch(requestUrl, {
                method,
                headers: this.getHeaders(body, token, IdToken),
                body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
            });
            console.log('Request URL:', requestUrl);
            console.log('Request headers:', fetchPromise);

            const response = await Promise.race([
                fetchPromise,
                this.timeout(timeoutDuration || this.defaultTimeout),
            ]);
            console.log('Response received:', response);

            const contentType = response.headers.get('content-type');
            console.log('Content type:', contentType);

            // Handle Excel file downloads
            if (contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                const blob = await response.blob();
                return { success: response.ok, data: blob };
            }

            // Handle JSON responses
            if (contentType?.includes('application/json')) {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Request failed');
                }
                return { success: true, data };
            }

            // Handle unexpected response types
            const text = await response.text();
            console.error('Expected JSON but received:', text.slice(0, 300));
            return { success: false, message: 'Received non-JSON response' };

        } catch (error: any) {
            if (error.message === 'Request timeout') {
                return { success: false, message: 'Request timed out' };
            }
            return { success: false, message: error.message };
        }
    }
}

export default new AuthHelper();