import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type StorageKey =
    | 'authToken'
    | 'refreshToken'
    | 'userData'
    | 'appSettings'
    | 'lastLogin'
    | 'idToken';


const ALL_STORAGE_KEYS: StorageKey[] = [
    'authToken',
    'refreshToken',
    'userData',
    'appSettings',
    'lastLogin',
    'idToken',
];

export const storeSecureValue = async <T>(
    key: StorageKey,
    value: T
): Promise<void> => {
    try {
        const stringValue = typeof value === 'string'
            ? value
            : JSON.stringify(value);

        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, stringValue);
        } else {
            await SecureStore.setItemAsync(key, stringValue);
        }
    } catch (error) {
        console.log(`Failed to store '${key}':`, error);
        throw new Error(`Storage operation failed for key: ${key}`);
    }
};


export const getSecureValue = async <T = string>(
    key: StorageKey
): Promise<T | null> => {
    try {
        const value = Platform.OS === 'web'
            ? await AsyncStorage.getItem(key)
            : await SecureStore.getItemAsync(key);

        if (!value) return null;

        return parseStoredValue<T>(value);
    } catch (error) {
        console.log(`Failed to retrieve '${key}':`, error);
        return null;
    }
};

export const removeSecureValue = async (key: StorageKey): Promise<void> => {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.log(`Failed to remove '${key}':`, error);
        throw new Error(`Removal operation failed for key: ${key}`);
    }
};


export const clearSecureStore = async (): Promise<void> => {
    try {
        const removePromises = ALL_STORAGE_KEYS.map(key =>
            removeSecureValue(key).catch(err => {
                console.warn(`Failed to remove '${key}':`, err);
            })
        );
        await Promise.all(removePromises);
    } catch (error) {
        console.log('Failed to clear secure store:', error);
        throw new Error('Clear storage operation failed');
    }
};

export const hasSecureValue = async (key: StorageKey): Promise<boolean> => {
    const value = await getSecureValue(key);
    return value !== null;
};


export const storeMultipleValues = async (
    items: Array<[StorageKey, any]>
): Promise<void> => {
    try {
        await Promise.all(
            items.map(([key, value]) => storeSecureValue(key, value))
        );
    } catch (error) {
        console.log('Failed to store multiple values:', error);
        throw new Error('Batch storage operation failed');
    }
};


export const getMultipleValues = async <K extends StorageKey>(
    keys: K[]
): Promise<Record<K, any>> => {
    try {
        const values = await Promise.all(
            keys.map(key => getSecureValue(key))
        );

        return keys.reduce((acc, key, index) => {
            acc[key] = values[index];
            return acc;
        }, {} as Record<K, any>);
    } catch (error) {
        console.log('Failed to retrieve multiple values:', error);
        return {} as Record<K, any>;
    }
};


const parseStoredValue = <T>(value: string): T => {
    try {
        return JSON.parse(value) as T;
    } catch {
        return value as unknown as T;
    }
};

export const StorageService = {
    auth: {
        setTokens: async (accessToken: string, idToken: string) => {
            await storeMultipleValues([
                ['authToken', accessToken],
                ['idToken', idToken],
            ]);
        },
        getTokens: async () => {
            return await getMultipleValues(['authToken', 'idToken']);
        },
        clearTokens: async () => {
            await Promise.all([
                removeSecureValue('authToken'),
                removeSecureValue('refreshToken'),
            ]);
        },
        isAuthenticated: async (): Promise<boolean> => {
            return await hasSecureValue('authToken');
        },
    },

    user: {
        setData: async <T>(userData: T) => {
            await storeSecureValue('userData', userData);
        },
        getData: async <T>(): Promise<T | null> => {
            return await getSecureValue<T>('userData');
        },
        clearData: async () => {
            await removeSecureValue('userData');
        },
    },

    logout: async () => {
        await clearSecureStore();
    },
};

export default StorageService;