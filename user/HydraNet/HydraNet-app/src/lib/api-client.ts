/**
 * HydraNet Mobile - Global API Client
 * Handles all HTTP requests to the backend
 * 
 * Features:
 * - Automatic JWT authentication
 * - Request timeout handling
 * - Global error handling and 401 redirect
 * - Type-safe responses
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '@/lib/config';

/**
 * Standard API Response Format
 * All backend responses should follow this format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
  message?: string;
}

/**
 * API Request Options
 * Extends standard RequestInit with custom options
 */
export interface ApiRequestOptions extends RequestInit {
  disableAuth?: boolean; // Don't include Authorization header
  timeout?: number; // Request timeout in ms
}

/**
 * Global API Client Class
 * Singleton instance handles all API communication
 */
class ApiClient {
  private baseUrl: string;
  private timeout: number = 30000;

  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  /**
   * Get authentication token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error reading auth token:', error);
      return null;
    }
  }

  /**
   * Prepare request headers with authentication
   */
  private async prepareHeaders(
    options: ApiRequestOptions = {}
  ): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.disableAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make a request with timeout
   */
  private async requestWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Main request method
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('[API] Request URL:', url, 'method:', options.method || 'GET');
      console.log('[API] Base URL:', this.baseUrl);
      const timeout = options.timeout || this.timeout;
      const headers = await this.prepareHeaders(options);

      const response = await this.requestWithTimeout(
        url,
        { ...options, headers },
        timeout
      );

      const data = await response.json();

      // Handle 401 Unauthorized
      if (response.status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        // Trigger navigation to login (implement in your app)
        return {
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
        };
      }

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data?.detail || data?.message || 'Unknown error' : undefined,
        code: !response.ok ? data?.code || response.status.toString() : undefined,
        details: data?.details,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
          code: 'TIMEOUT',
        };
      }

      return {
        success: false,
        error: error.message || 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
