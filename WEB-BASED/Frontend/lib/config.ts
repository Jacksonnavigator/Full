/**
 * HydraNet Frontend - Global Configuration
 * Centralized URL management for all API calls
 * 
 * This file is the single source of truth for backend communication
 * All backends calls should flow through this configuration
 */

// ============================================================
// API Base URL Configuration
// ============================================================
// Environment variables loaded from .env.local
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const BACKEND_API_PREFIX = '/api';

/**
 * Global Configuration Object
 * Used throughout the application for API communication
 */
export const CONFIG = {
  // ===== Backend Server Configuration =====
  backend: {
    baseUrl: BACKEND_URL,
    apiPrefix: BACKEND_API_PREFIX,
    fullUrl: `${BACKEND_URL}${BACKEND_API_PREFIX}`,
  },

  // ===== Authentication Endpoints =====
  auth: {
    loginEndpoint: '/auth/login',
    logoutEndpoint: '/auth/logout',
    refreshEndpoint: '/auth/refresh',
    verifyEndpoint: '/auth/verify',
  },

  // ===== Local Storage Keys =====
  storage: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
  },

  // ===== Token Configuration =====
  token: {
    expiryBufferMs: 5 * 60 * 1000, // Refresh 5 mins before expiry
  },

  // ===== Request Configuration =====
  request: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
};

export default CONFIG;
