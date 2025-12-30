import { API_CONFIG, BackendType, getApiConfig } from '../config/api.config';
import { AuthController } from '../controllers/AuthController';
import { StorageService } from '../utils/secureStorage';

interface RequestOptions {
    endpoint: string;
    method: string;
    body?: object | FormData;
    token?: string;
    IdToken?: string;
    x_api_token?: string;
    timeoutDuration?: number;
    backendType?: BackendType;
    isRetry?: boolean;
}

class AuthHelper {
    private apiUrl: string;
    private defaultTimeout: number;
    private tokenExpiryTime: number | null = null;
    private isRefreshing = false;
    private failedQueue: Array<{
        request: () => Promise<{ success: boolean; data?: any; message?: string; details?: string; status?: number }>;
        resolve: (value: { success: boolean; data?: any; message?: string; details?: string; status?: number }) => void;
        reject: (reason: any) => void;
    }> = [];

    constructor() {
        this.apiUrl = API_CONFIG.BASE_URL;
        this.defaultTimeout = API_CONFIG.TIMEOUT;

        if (!this.apiUrl) {
            throw new Error('API base URL is not defined in the configuration.');
        }
    }

    private getHeaders(body?: object | FormData, token?: string, IdToken?: string, x_api_token?: string): HeadersInit {
        const isFormData = body instanceof FormData;

        const headers: HeadersInit = {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(IdToken && { 'x-id-token': IdToken }),
            ...(x_api_token && { 'x-api-token': x_api_token }),
        };

        // IMPORTANT: Don't set Content-Type for FormData
        // Let the browser/React Native set it with the boundary
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
            (Object.keys(API_CONFIG.HEADERS) as Array<keyof typeof API_CONFIG.HEADERS>).forEach(key => {
                if (key !== 'Content-Type') {
                    headers[key] = API_CONFIG.HEADERS[key];
                }
            });
        }

        return headers;
    }

    private timeout(ms: number): Promise<never> {
        return new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), ms)
        );
    }

    private processQueue(error: any) {
        this.failedQueue.forEach(({ request, resolve, reject }) => {
            if (error) {
                reject(error);
                return;
            }

            request()
                .then(resolve)
                .catch(reject);
        });
        this.failedQueue = [];
    }

    private async ensureValidToken(): Promise<boolean> {
        if (this.tokenExpiryTime && Date.now() >= this.tokenExpiryTime) {
            const refreshed = await AuthController.refreshToken();
            return refreshed;
        }
        return true;
    }

    public setTokenExpiry(expiryTime: number): void {
        this.tokenExpiryTime = expiryTime;
    }

    public async ApiRequest({
        endpoint,
        method,
        body,
        token,
        IdToken,
        x_api_token,
        timeoutDuration,
        backendType,
        isRetry
    }: RequestOptions): Promise<{ success: boolean; data?: any; message?: string; details?: string; status?: number }> {
        let requestUrl = '';

        if (token && !isRetry && endpoint !== 'login') {
            const isValid = await this.ensureValidToken();
            if (!isValid) {
                return { success: false, status: 401, message: 'Session expired - please login again' };
            }
        }

        try {
            const config = getApiConfig(backendType);
            requestUrl = `${config.BASE_URL}/${endpoint}`;
            const isFormData = body instanceof FormData;
            const fetchOptions: RequestInit = {
                method,
                headers: this.getHeaders(body, token, IdToken, x_api_token),
                body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
            };

            const fetchPromise = fetch(requestUrl, fetchOptions);

            const response = await Promise.race([
                fetchPromise,
                this.timeout(timeoutDuration || this.defaultTimeout),
            ]);

            // Handle 401 Unauthorized - attempt token refresh (only once)
            if (!response.ok && response.status === 401 && endpoint !== 'login' && !isRetry) {
                if (this.isRefreshing) {
                    // Queue the request while refreshing
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({
                            request: async () => {
                                const { authToken, idToken } = await StorageService.auth.getTokens();
                                return this.ApiRequest({
                                    endpoint,
                                    method,
                                    body,
                                    token: authToken,
                                    IdToken: idToken,
                                    x_api_token,
                                    timeoutDuration,
                                    backendType,
                                    isRetry: true,
                                });
                            },
                            resolve,
                            reject,
                        });
                    });
                }

                this.isRefreshing = true;
                try {
                    const refreshed = await AuthController.refreshToken();
                    console.log("refreshed", refreshed)
                    if (refreshed) {
                        // Get new tokens and retry the request
                        const { authToken, idToken } = await StorageService.auth.getTokens();
                        this.processQueue(null);
                        return this.ApiRequest({
                            endpoint,
                            method,
                            body,
                            token: authToken,
                            IdToken: idToken,
                            x_api_token,
                            timeoutDuration,
                            backendType,
                            isRetry: true
                        });
                    } else {
                        // Refresh failed, process queue with error
                        this.processQueue(new Error('Session expired'));
                        return { success: false, status: 401, message: 'Session expired - please login again' };
                    }
                } catch (error) {
                    this.processQueue(error);
                    return { success: false, message: 'Failed to refresh token' };
                } finally {
                    this.isRefreshing = false;
                }
            }

            const contentType = response.headers.get('content-type');

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
            console.log('Response text:', text.slice(0, 300));

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return { success: false, message: 'Received non-JSON response', details: text };

        } catch (error: any) {
            if (error.message === 'Request timeout') {
                return { success: false, message: 'Request timed out' };
            }
            return { success: false, message: error.message };
        }
    }
}

export default new AuthHelper();