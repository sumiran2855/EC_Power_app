export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000/api',
  TIMEOUT: 30000, 
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};