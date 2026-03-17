/**
 * HydraNet Backend Configuration
 * Central configuration for backend API URLs and settings
 */

import { Platform } from 'react-native';

// Backend API base URL - Change this to your backend server
// NOTE: We try to use the same value as the Expo public API URL to keep things consistent.
// If EXPO_PUBLIC_API_URL includes an /api suffix (common), we strip it because endpoints already include /api.
// Default base URL fallback is tuned for common Expo environments:
// - Android emulator: 10.0.2.2 (host loopback)
// - iOS simulator / web: localhost
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const defaultPort = 8000;
const defaultBaseUrl = `http://${defaultHost}:${defaultPort}`;

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl;
const sanitizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');

// Debug: Log the backend base URL used by the app (helps diagnose networking/timeouts)
console.log('[BackendConfig] using baseUrl:', sanitizedBaseUrl);

export const BACKEND_CONFIG = {
  baseUrl: sanitizedBaseUrl,
  
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
    
    // Branches
    branches: '/api/branches',
    
    // Teams
    teams: '/api/teams',
    
    // Engineers
    engineers: '/api/engineers',
    
    // Logs
    logs: '/api/logs',
    
    // Notifications
    notifications: '/api/notifications',
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
