/**
 * Backend Configuration for HydraNet
 * Centralized configuration for API endpoints
 */

export const BACKEND_CONFIG = {
  // NOTE: Use your machine IP, not localhost (localhost doesn't work in React Native)
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://10.30.8.156:8001',
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
