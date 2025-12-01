import { Platform } from 'react-native';

export enum BackendType {
  PRODUCT_PORTAL = 'PRODUCT_PORTAL',
  SERVICE_DATABASE = 'SERVICE_DATABASE'
}

const getBaseUrl = (localPort: number, endpoint: string = 'api') => {
  const envUrl = process.env[`${endpoint.toUpperCase()}_URL`];
  if (envUrl) {
    return envUrl;
  }

  // Platform-specific URLs
  if (Platform.OS === 'web') {
    // return `http://localhost:${localPort}/${endpoint}`;
    return `http://34.254.33.35:${localPort}/${endpoint}`;
  }
  // return `http://192.168.3.138:${localPort}/${endpoint}`;
  return `http://34.254.33.35:${localPort}/${endpoint}`;
};

// Backend configurations
const BACKEND_CONFIGS = {
  [BackendType.PRODUCT_PORTAL]: {
    BASE_URL: getBaseUrl(4001, 'api1'),
    TIMEOUT: 30000,
    HEADERS: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  [BackendType.SERVICE_DATABASE]: {
    BASE_URL: getBaseUrl(4000, 'api'),
    TIMEOUT: 30000,
    HEADERS: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
};

const DEFAULT_BACKEND: BackendType = BackendType.PRODUCT_PORTAL;

export const API_CONFIG = BACKEND_CONFIGS[DEFAULT_BACKEND];

export const getApiConfig = (backend: BackendType = DEFAULT_BACKEND) => {
  return BACKEND_CONFIGS[backend] || BACKEND_CONFIGS[DEFAULT_BACKEND];
};

export type ApiConfig = typeof API_CONFIG;