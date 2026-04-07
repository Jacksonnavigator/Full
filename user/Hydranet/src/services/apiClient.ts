/**
 * API Client for HydraNet
 * Handles HTTP requests with JWT authentication and auto-refresh
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_CONFIG } from './backendConfig';

interface ApiRequestOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  params?: Record<string, any>;
}

/**
 * Get access token from storage
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('hydranet_access_token');
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get refresh token from storage
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('hydranet_refresh_token');
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Save tokens to storage
 */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      ['hydranet_access_token', accessToken],
      ['hydranet_refresh_token', refreshToken],
    ]);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
}

/**
 * Clear tokens from storage
 */
export async function clearTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['hydranet_access_token', 'hydranet_refresh_token']);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      await clearTokens();
      return null;
    }

    const data = await response.json();
    if (data.access_token) {
      await saveTokens(data.access_token, refreshToken);
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Main API request function with auth and auto-refresh
 */
export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  options: ApiRequestOptions = {}
): Promise<T> {
  try {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${BACKEND_CONFIG.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if auth is required
    if (options.requiresAuth !== false) {
      const token = await getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Build URL with query params
    let finalUrl = url;
    if (options.params) {
      const queryString = Object.entries(options.params)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');
      finalUrl = `${url}?${queryString}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    let response = await fetch(finalUrl, requestOptions);

    // Handle 401 - try to refresh token and retry
    if (response.status === 401 && options.requiresAuth !== false) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(finalUrl, { ...requestOptions, headers });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Convenience functions for common HTTP methods
 */
export async function apiGet<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, 'GET', undefined, options);
}

export async function apiPost<T>(
  endpoint: string,
  body?: any,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, 'POST', body, options);
}

export async function apiPut<T>(
  endpoint: string,
  body?: any,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, 'PUT', body, options);
}

export async function apiDelete<T>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, 'DELETE', undefined, options);
}
