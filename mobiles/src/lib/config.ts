/**
 * HydraNet Mobile - Configuration
 * Centralized app configuration
 */

import { BACKEND_CONFIG } from '@/services/backendConfig';

const API_BASE_URL = `${BACKEND_CONFIG.baseUrl}/api`;

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
      LIST: '/reports',  // Use reports endpoint for tasks
      DETAIL: '/reports/:id',
      CREATE: '/reports',
      UPDATE: '/reports/:id',
    },
    REPORTS: {
      LIST: '/reports',
      DETAIL: '/reports/:id',
      TRACKING: '/reports/tracking/:trackingId',
      UPDATE: '/reports/:id',
      ASSIGN: '/reports/:id/assign',
      APPROVE: '/reports/:id/approve',
      REJECT: '/reports/:id/reject',
      DELETE: '/reports/:id',
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
