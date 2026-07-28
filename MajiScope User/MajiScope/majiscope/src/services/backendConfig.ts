/**
 * Backend configuration for the public MajiScope user app.
 *
 * This app should talk to the live production backend by default. Local
 * overrides are still supported through EXPO_PUBLIC_API_URL when needed.
 */

const productionBaseUrl = 'https://majiscope.onrender.com';
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || productionBaseUrl;
const sanitizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');

export const BACKEND_CONFIG = {
  baseUrl: sanitizedBaseUrl,
  endpoints: {
    auth: '/api/auth',
    reports: '/api/reports',
    submissions: '/api/reports',
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
  console.warn('[BackendConfig] No EXPO_PUBLIC_API_URL set. Using production backend:', BACKEND_CONFIG.baseUrl);
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
