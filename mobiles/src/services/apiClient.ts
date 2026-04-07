/**
 * HydraNet API Client
 * Handles all HTTP communication with the backend API
 * Includes authentication, error handling, and token management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_CONFIG, getEndpointUrl } from './backendConfig';
import CONFIG from '@/lib/config';

// Use centralized storage keys from CONFIG
const ACCESS_TOKEN_KEY = CONFIG.JWT_TOKEN_STORAGE_KEY;
const REFRESH_TOKEN_KEY = CONFIG.REFRESH_TOKEN_STORAGE_KEY;
const USER_KEY = CONFIG.USER_DATA_STORAGE_KEY;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
}

/**
 * Get stored access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    console.log(`[apiClient] getAccessToken: token=${token ? 'present (' + token.substring(0,20) + '...)' : 'null'}, key=${ACCESS_TOKEN_KEY}`);
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get stored refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Save tokens to storage
 */
export async function saveTokens(tokens: TokenPair): Promise<void> {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    if (tokens.refresh_token) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
}

/**
 * Clear all stored tokens and user data
 */
export async function clearTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

/**
 * Save current user to storage
 */
export async function saveCurrentUser(user: any): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

/**
 * Get current user from storage
 */
export async function getCurrentUser(): Promise<any | null> {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Make an API request with authentication
 */
export async function apiRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  options: {
    body?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
  } = {}
): Promise<T> {
  const {
    body,
    params,
    headers = {},
    requiresAuth = true,
  } = options;

  try {
    // Build URL
    const url = getEndpointUrl(endpoint, params);

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = await getAccessToken();
      if (!token) {
        console.error(`[apiClient] requestAuth=true but no token available for ${endpoint}`);
        throw new Error('No authentication token available');
      }
      requestHeaders['Authorization'] = `Bearer ${token}`;
      console.log(`[apiClient] Authorization header added for ${endpoint}`);
    }

    // Prepare request init
    const init: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      init.body = JSON.stringify(body);
    }

    // Make request
    console.log(`[API] ${method} ${url}`);
    const response = await fetch(url, init);

    // Handle response
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = { success: false, error: 'Invalid response from server' };
    }

    // Check for 401 (Unauthorized) and try to refresh token
    if (response.status === 401 && requiresAuth) {
      console.log('[API] Token expired, attempting refresh...');
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        return apiRequest(method, endpoint, options);
      } else {
        // Refresh failed, trigger logout
        await clearTokens();
        throw new Error('Session expired. Please login again.');
      }
    }

    // Check for errors
    if (!response.ok) {
      const errorMessage =
        responseData?.error ||
        responseData?.message ||
        `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error) {
    console.error(`[API ERROR] ${method} ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(
      getEndpointUrl('/api/auth/refresh'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as TokenPair;
    await saveTokens(data);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

/**
 * Convenience methods
 */

export async function apiGet<T = any>(
  endpoint: string,
  options?: {
    params?: Record<string, any>;
    requiresAuth?: boolean;
  }
): Promise<T> {
  return apiRequest('GET', endpoint, { ...options, requiresAuth: options?.requiresAuth !== false });
}

export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: {
    params?: Record<string, any>;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
  }
): Promise<T> {
  return apiRequest('POST', endpoint, { body, ...options, requiresAuth: options?.requiresAuth !== false });
}

export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: {
    params?: Record<string, any>;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
  }
): Promise<T> {
  return apiRequest('PUT', endpoint, { body, ...options, requiresAuth: options?.requiresAuth !== false });
}

export async function apiDelete<T = any>(
  endpoint: string,
  options?: {
    params?: Record<string, any>;
    requiresAuth?: boolean;
  }
): Promise<T> {
  return apiRequest('DELETE', endpoint, { ...options, requiresAuth: options?.requiresAuth !== false });
}
