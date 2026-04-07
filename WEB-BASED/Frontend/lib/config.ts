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
const DEFAULT_BACKEND_URL = "http://localhost:8000";
const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const usingFallbackBackendUrl = !rawBackendUrl;
const BACKEND_URL = (rawBackendUrl || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
const BACKEND_API_PREFIX = '/api';

const isLoopbackBackendUrl = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(BACKEND_URL);

if (usingFallbackBackendUrl) {
  console.warn(
    `[FrontendConfig] NEXT_PUBLIC_BACKEND_URL is not set. Falling back to ${BACKEND_URL}.`
  );
  console.warn(
    "[FrontendConfig] Set NEXT_PUBLIC_BACKEND_URL to your backend LAN or deployment URL to avoid localhost-only behavior."
  );
}

if (usingFallbackBackendUrl && process.env.NODE_ENV === "production") {
  throw new Error("[FrontendConfig] NEXT_PUBLIC_BACKEND_URL must be set in production.");
}

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
    usingFallbackBaseUrl: usingFallbackBackendUrl,
    isLoopbackBaseUrl: isLoopbackBackendUrl,
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
