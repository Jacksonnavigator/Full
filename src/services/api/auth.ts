/**
 * HydraNet Mobile - Auth API Service
 * Centralized authentication API calls
 */

import CONFIG from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { LoginCredentials, AuthResponse, User } from '@/lib/types';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginCredentials) {
    return apiClient.post<AuthResponse>(
      CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
      { disableAuth: true }
    );
  }

  /**
   * Logout user
   */
  static async logout() {
    return apiClient.post(CONFIG.ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Refresh token
   */
  static async refreshToken(refreshToken: string) {
    return apiClient.post<AuthResponse>(
      CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken },
      { disableAuth: true }
    );
  }

  /**
   * Get current user profile
   */
  static async getProfile() {
    return apiClient.get<User>(CONFIG.ENDPOINTS.USERS.PROFILE);
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<User>) {
    return apiClient.put<User>(CONFIG.ENDPOINTS.USERS.UPDATE, data);
  }

  /**
   * Change password
   */
  static async changePassword(oldPassword: string, newPassword: string) {
    return apiClient.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }
}

export default AuthService;
