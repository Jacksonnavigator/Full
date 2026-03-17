/**
 * HydraNet Mobile - Configuration
 * Centralized app configuration
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

const CONFIG = {
  API_BASE_URL,
  API_TIMEOUT: 30000,
  JWT_TOKEN_STORAGE_KEY: 'authToken',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
  USER_DATA_STORAGE_KEY: 'userData',
  
  // Feature flags
  FEATURES: {
    OFFLINE_MODE: true,
    PUSH_NOTIFICATIONS: true,
    GEOLOCATION: true,
    IMAGE_UPLOAD: true,
  },

  // UI Configuration
  UI: {
    THEME: 'light',
    ANIMATION_DURATION: 300,
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE: '/users/update',
    },
    TASKS: {
      LIST: '/tasks',
      DETAIL: '/tasks/:id',
      CREATE: '/tasks',
      UPDATE: '/tasks/:id',
    },
    UTILITIES: {
      LIST: '/utilities',
    },
    DMAS: {
      LIST: '/dmas',
    },
    MANAGERS: {
      UTILITY: '/utility-managers',
      DMA: '/dma-managers',
    },
  },
};

export default CONFIG;
