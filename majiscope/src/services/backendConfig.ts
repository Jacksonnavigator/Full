/**
 * Majiscope Backend Configuration
 * Central configuration for backend API URLs and settings
 * 
 * To change the backend URL:
 * 1. Edit .env at the mobile app root
 * 2. Set EXPO_PUBLIC_API_URL or EXPO_PUBLIC_BACKEND_URL if you need to override production
 * 3. Reload the app with 'r' in Expo terminal
 */

const productionBaseUrl = 'https://majiscope.onrender.com';

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  '';

const usingFallbackBaseUrl = !configuredBaseUrl;
const rawBaseUrl = configuredBaseUrl || productionBaseUrl;

// Clean up the URL (remove trailing /api if present)
const sanitizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '');

if (usingFallbackBaseUrl) {
  console.warn('[BackendConfig] No EXPO_PUBLIC_API_URL/EXPO_PUBLIC_BACKEND_URL set. Falling back to:', sanitizedBaseUrl);
  console.warn('[BackendConfig]', `Using production fallback backend: ${sanitizedBaseUrl}`);
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
