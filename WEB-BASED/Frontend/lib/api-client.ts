/**
 * HydraNet Frontend - Global API Client
 * Handles all HTTP requests to the backend
 * 
 * Features:
 * - Automatic JWT authentication
 * - Request retries with exponential backoff
 * - Request timeout handling
 * - Global error handling and 401 redirect
 * - Type-safe responses
 */

import CONFIG from '@/lib/config';
import { transformKeysToSnakeCase } from '@/lib/transform-data';

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
}

/**
 * API Request Options
 * Extends standard RequestInit with custom options
 */
export interface ApiRequestOptions extends RequestInit {
  disableAuth?: boolean; // Don't include Authorization header
  timeout?: number; // Request timeout in ms
  retries?: number; // Number of retry attempts
}

/**
 * Global API Client Class
 * Singleton instance handles all API communication
 */
class ApiClient {
  private baseUrl: string;
  private timeout: number = CONFIG.request.timeout;

  constructor() {
    this.baseUrl = CONFIG.backend.fullUrl;
  }

  /**
   * Build full URL for endpoint
   * @param endpoint - API endpoint (e.g., '/auth/login')
   * @returns Full URL for the request
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) return endpoint;
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  /**
   * Get authorization header with JWT token
   * @returns Headers object with Authorization bearer token
   */
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem(CONFIG.storage.tokenKey);

    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Fetch with timeout support
   * @param url - Request URL
   * @param options - Request options
   * @param timeout - Timeout in milliseconds
   * @returns Fetch response
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle 401 Unauthorized errors
   * Clears auth tokens and redirects to login
   */
  private handle401(): void {
    // Clear all auth data
    localStorage.removeItem(CONFIG.storage.tokenKey);
    localStorage.removeItem(CONFIG.storage.refreshTokenKey);
    localStorage.removeItem(CONFIG.storage.userKey);

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Main request method
   * Handles authentication, retries, timeouts, and error handling
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      disableAuth = false,
      timeout = this.timeout,
      retries = CONFIG.request.retryAttempts,
      ...restOptions
    } = options;

    const url = this.buildUrl(endpoint);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    };

    // Add auth header if not disabled
    if (!disableAuth) {
      Object.assign(headers, this.getAuthHeader());
    }

    let lastError: any;

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Transform request body from camelCase to snake_case
        const transformedBody = body ? transformKeysToSnakeCase(body) : undefined;
        
        const response = await this.fetchWithTimeout(
          url,
          {
            method,
            headers,
            body: transformedBody ? JSON.stringify(transformedBody) : undefined,
            ...restOptions,
          },
          timeout
        );

        // Handle 401 - Unauthorized
        if (response.status === 401 && !disableAuth) {
          this.handle401();
          throw new Error('Unauthorized - redirecting to login');
        }

        // Parse response
        let data: any;
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        // Handle non-ok responses
        if (!response.ok) {
          return {
            success: false,
            error: data.error || data.detail || `HTTP ${response.status}`,
            code: data.code,
            details: data.details,
          };
        }

        // Success
        return {
          success: true,
          data: data.data || data,
        };
      } catch (error: any) {
        lastError = error;

        // Don't retry on last attempt
        if (attempt === retries) break;

        // Wait before retrying with exponential backoff
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            CONFIG.request.retryDelay * Math.pow(2, attempt)
          )
        );
      }
    }

    // All retries failed
    return {
      success: false,
      error: lastError?.message || 'Network request failed',
      code: 'NETWORK_ERROR',
    };
  }

  /**
   * GET request
   */
  get<T = any>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  put<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  patch<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  delete<T = any>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default apiClient;
