/**
 * Backend Configuration for HydraNet
 * Centralized configuration for API endpoints
 */

import { Platform } from 'react-native';

const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || `http://${defaultHost}:8000`;
const sanitizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');

if (!process.env.EXPO_PUBLIC_API_URL && !__DEV__) {
  throw new Error('[BackendConfig] EXPO_PUBLIC_API_URL must be set outside development.');
}

export const BACKEND_CONFIG = {
  // NOTE: Use your machine IP, not localhost (localhost doesn't work in React Native)
  baseUrl: sanitizedBaseUrl,
  endpoints: {
    auth: '/api/auth',
    reports: '/api/reports',
    submissions: '/api/submissions',
    notifications: '/api/notifications',
    users: '/api/users',
    utilities: '/api/utilities',
    dmas: '/api/dmas',
    teams: '/api/teams',
    engineers: '/api/engineers',
    logs: '/api/logs',
    health: '/api/health',
  },
};

if (!process.env.EXPO_PUBLIC_API_URL) {
  const platformHint =
    Platform.OS === 'android'
      ? 'Android physical devices cannot use 10.0.2.2. Set EXPO_PUBLIC_API_URL to your backend LAN IP.'
      : 'Set EXPO_PUBLIC_API_URL to avoid relying on localhost-only fallback.';
  console.warn('[BackendConfig] No EXPO_PUBLIC_API_URL set. Falling back to:', BACKEND_CONFIG.baseUrl);
  console.warn('[BackendConfig]', platformHint);
} else {
  console.log('[BackendConfig] using baseUrl:', BACKEND_CONFIG.baseUrl);
}

export function getEndpointUrl(path: string): string {
  return `${BACKEND_CONFIG.baseUrl}${path}`;
}

export function getReportsEndpoint(): string {
  return getEndpointUrl(BACKEND_CONFIG.endpoints.reports);
}

export function getSubmissionsEndpoint(): string {
  return getEndpointUrl(BACKEND_CONFIG.endpoints.submissions);
}

export function getAuthEndpoint(): string {
  return getEndpointUrl(BACKEND_CONFIG.endpoints.auth);
}
