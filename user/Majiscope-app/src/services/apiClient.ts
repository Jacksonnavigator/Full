import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_CONFIG } from './backendConfig';

interface ApiRequestOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('majiscope_access_token');
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('majiscope_refresh_token');
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      ['majiscope_access_token', accessToken],
      ['majiscope_refresh_token', refreshToken],
    ]);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['majiscope_access_token', 'majiscope_refresh_token']);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

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

export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown,
  options: ApiRequestOptions = {}
): Promise<T> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_CONFIG.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.requiresAuth !== false) {
      const token = await getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    let finalUrl = url;
    if (options.params) {
      const query = Object.entries(options.params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');

      if (query) {
        finalUrl = `${url}?${query}`;
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    let response = await fetch(finalUrl, requestOptions);

    if (response.status === 401 && options.requiresAuth !== false) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(finalUrl, { ...requestOptions, headers });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detail = errorData.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((item) => item?.msg || JSON.stringify(item)).join('; ')
          : errorData.message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error(`API error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

export async function apiGet<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
  return apiRequest<T>(endpoint, 'GET', undefined, options);
}

export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: ApiRequestOptions
): Promise<T> {
  return apiRequest<T>(endpoint, 'POST', body, options);
}

export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
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
