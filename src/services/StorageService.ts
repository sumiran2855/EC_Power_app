import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
    ACCESS_TOKEN: '@auth_access_token',
    REFRESH_TOKEN: '@auth_refresh_token',
    TOKEN: '@auth_token',
    ID_TOKEN: '@auth_id_token',
    USER_DATA: '@user_data',
}; export class StorageService {

    static async setItem(key: string, value: string): Promise<void> {
        await AsyncStorage.setItem(key, value);
    }

    static async setAuthTokens(tokens: { accessToken: string; refreshToken: string; idToken: string }): Promise<void> {
        try {
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
                AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
                AsyncStorage.setItem(STORAGE_KEYS.ID_TOKEN, tokens.idToken),
            ]);
        } catch (error) {
            console.error('Error storing auth tokens:', error);
            throw error;
        }
    } static async setUserData(userData: any): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        } catch (error) {
            console.error('Error storing user data:', error);
            throw error;
        }
    }

    static async getAuthTokens(): Promise<{ accessToken: string; refreshToken: string; idToken: string }> {
        try {
            const [accessToken, refreshToken, idToken] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
                AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
                AsyncStorage.getItem(STORAGE_KEYS.ID_TOKEN),
                AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
            ]);

            return {
                accessToken: accessToken || '',
                refreshToken: refreshToken || '',
                idToken: idToken || '',
            };
        } catch (error) {
            console.error('Error retrieving auth tokens:', error);
            return { accessToken: '', refreshToken: '', idToken: '' };
        }
    } static async clearAuthTokens(): Promise<void> {
        try {
            await Promise.all([
                AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
                AsyncStorage.removeItem(STORAGE_KEYS.ID_TOKEN),
                AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
                AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
            ]);
        } catch (error) {
            console.error('Error clearing auth tokens:', error);
            throw error;
        }
    }

    static async clearUserData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        } catch (error) {
            console.error('Error clearing user data:', error);
            throw error;
        }
    }
}