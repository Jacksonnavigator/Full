/**
 * HydraNet Backend Configuration
 * Central configuration for backend API URLs and settings
 * 
 * To change the backend URL:
 * 1. Edit .env at the mobile app root
 * 2. Set EXPO_PUBLIC_API_URL or EXPO_PUBLIC_BACKEND_URL to your server (e.g., http://192.168.x.x:8000)
 * 3. Reload the app with 'r' in Expo terminal
 */

import { Platform } from 'react-native';

// Detect platform-appropriate default
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const defaultPort = 8000;
const defaultBaseUrl = `http://${defaultHost}:${defaultPort}`;

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  '';

const usingFallbackBaseUrl = !configuredBaseUrl;
const rawBaseUrl = configuredBaseUrl || defaultBaseUrl;

// Clean up the URL (remove trailing /api if present)
const sanitizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');

if (usingFallbackBaseUrl && !__DEV__) {
  throw new Error(
    '[BackendConfig] EXPO_PUBLIC_API_URL or EXPO_PUBLIC_BACKEND_URL must be set outside development.'
  );
}

if (usingFallbackBaseUrl) {
  const platformHint =
    Platform.OS === 'android'
      ? 'Android physical devices cannot use 10.0.2.2. Set EXPO_PUBLIC_API_URL to your backend LAN IP.'
      : 'Set EXPO_PUBLIC_API_URL to avoid relying on localhost-only fallback.';
  console.warn('[BackendConfig] No EXPO_PUBLIC_API_URL/EXPO_PUBLIC_BACKEND_URL set. Falling back to:', sanitizedBaseUrl);
  console.warn('[BackendConfig]', platformHint);
} else {
  console.log('[BackendConfig] using baseUrl:', sanitizedBaseUrl);
}

export const BACKEND_CONFIG = {
  baseUrl: sanitizedBaseUrl,
  usingFallbackBaseUrl,
  
  // API endpoints
  endpoints: {
    // Authentication
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    
    // Users
    users: '/api/users',
    getCurrentUser: '/api/users/me',
    
    // Reports
    reports: '/api/reports',
    
    // Utilities
    utilities: '/api/utilities',
    
    // DMAs
    dmas: '/api/dmas',
    
    // Teams
    teams: '/api/teams',
    
    // Engineers
    engineers: '/api/engineers',
    
    // Logs
    logs: '/api/logs',
    
    // Notifications
    notifications: '/api/notifications',

    // Push tokens
    pushTokens: '/api/push-tokens',
  },

  // Request timeouts
  timeout: 30000, // 30 seconds

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
  },
};

/**
 * Get full URL for an endpoint
 */
export function getEndpointUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(BACKEND_CONFIG.baseUrl + endpoint);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}
