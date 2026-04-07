/**
 * HydraNet Mobile - Authentication Utilities
 * Token management, user session handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { AuthResponse, User, LoginCredentials } from '@/lib/types';

export class AuthManager {
  private static instance: AuthManager;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      console.log(`[Auth] Logging in: ${credentials.email}`);
      const response = await apiClient.post<AuthResponse>(CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);

      if (!response.success) {
        console.error(`[Auth] Login failed: ${response.error}`);
        return {
          success: false,
          error: response.error || 'Login failed',
        };
      }

      const authData = response.data;
      if (!authData) {
        console.error('[Auth] Invalid response from server - no authData');
        return {
          success: false,
          error: 'Invalid response from server',
        };
      }

      console.log(`[Auth] Login successful, storing tokens`);
      // Store tokens
      await this.storeToken(authData.access_token);
      console.log(`[Auth] Token stored: ${authData.access_token.substring(0, 20)}...`);
      
      if (authData.refresh_token) {
        await this.storeRefreshToken(authData.refresh_token);
        console.log(`[Auth] Refresh token stored`);
      }

      // Store user data
      await this.storeUserData(authData.user);
      console.log(`[Auth] User data stored: ${authData.user.email}`);

      return {
        success: true,
        user: authData.user,
      };
    } catch (error: any) {
      console.error(`[Auth] Login error: ${error.message}`);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      await apiClient.post(CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      await AsyncStorage.removeItem(CONFIG.JWT_TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(CONFIG.REFRESH_TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(CONFIG.USER_DATA_STORAGE_KEY);
    }
  }

  /**
   * Get stored auth token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CONFIG.JWT_TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error reading token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CONFIG.REFRESH_TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error reading refresh token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<{ success: boolean; error?: string }> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        return { success: false, error: 'No refresh token available' };
      }

      const response = await apiClient.post<AuthResponse>(
        CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken },
        { disableAuth: true }
      );

      if (!response.success) {
        return { success: false, error: response.error };
      }

      const authData = response.data;
      if (!authData) {
        return { success: false, error: 'Invalid response' };
      }

      await this.storeToken(authData.access_token);
      if (authData.refresh_token) {
        await this.storeRefreshToken(authData.refresh_token);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(CONFIG.USER_DATA_STORAGE_KEY);
      if (!data) return null;

      const user: User = JSON.parse(data);
      return {
        ...user,
        role: (this.normalizeRole(user.role) || 'Engineer') as User['role'],
      };
    } catch (error) {
      console.error('Error reading user data:', error);
      return null;
    }
  }

  /**
   * Store auth token
   */
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CONFIG.JWT_TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  /**
   * Store refresh token
   */
  private async storeRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CONFIG.REFRESH_TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error storing refresh token:', error);
    }
  }

  /**
   * Normalize role strings returned from backend into the app's internal format.
   *
   * The backend uses snake_case (e.g. "team_leader"), while the app expects title-case
   * values (e.g. "Team Leader") for role checks and UI.
   */
  private normalizeRole(role?: string | null): string | null {
    if (!role) return null;

    const normalized = role.trim().toLowerCase();
    if (normalized === 'team_leader' || normalized === 'team leader') {
      return 'Team Leader';
    }
    if (normalized === 'engineer') {
      return 'Engineer';
    }
    if (normalized === 'dma_manager' || normalized === 'dma manager') {
      return 'DMA Manager';
    }

    // Keep the original casing for unknown/other roles
    return role;
  }

  /**
   * Store user data
   */
  private async storeUserData(user: User): Promise<void> {
    try {
      const normalizedUser = {
        ...user,
        role: this.normalizeRole(user.role),
      };
      await AsyncStorage.setItem(CONFIG.USER_DATA_STORAGE_KEY, JSON.stringify(normalizedUser));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Check if JWT token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1]));
      const expiresIn = payload.exp;
      if (!expiresIn) return false;

      return Date.now() >= expiresIn * 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}

export const authManager = AuthManager.getInstance();
export default authManager;
