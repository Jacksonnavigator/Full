/**
 * Optional authentication helpers for future signed-in public users.
 *
 * The current live user app works anonymously, but these helpers now match the
 * backend routes that actually exist.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPost, saveTokens, clearTokens } from './apiClient';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  role?: string | null;
  user_type?: string;
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const response = await apiPost<{
      access_token: string;
      refresh_token: string;
      user: User;
    }>('/api/auth/login', {
      email: email.toLowerCase(),
      password,
    });

    await saveTokens(response.access_token, response.refresh_token);
    await AsyncStorage.setItem('hydranet_user', JSON.stringify(response.user));
    return response.user;
  } catch (error) {
    console.error('[authService] Login error:', error);
    throw error;
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<User> {
  try {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email;

    await apiPost<User>('/api/users', {
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone,
      name: fullName,
      status: 'active',
    });

    return await loginUser(data.email, data.password);
  } catch (error) {
    console.error('[authService] Registration error:', error);
    throw error;
  }
}

export async function requestPasswordReset(email: string): Promise<{ message: string; deliveryMessage?: string; resetUrl?: string | null }> {
  try {
    const response = await apiPost<{
      message?: string;
      delivery_message?: string;
      reset_url?: string | null;
    }>('/api/auth/password-reset/request', {
      email: email.trim().toLowerCase(),
    });

    return {
      message: response.message || 'If your account exists, a reset link has been sent.',
      deliveryMessage: response.delivery_message,
      resetUrl: response.reset_url ?? null,
    };
  } catch (error) {
    console.error('[authService] Password reset request error:', error);
    throw error;
  }
}

export async function validatePasswordResetToken(token: string): Promise<{
  valid: boolean;
  message: string;
  account_type?: string;
  email?: string;
  role?: string;
  expires_at?: string;
}> {
  try {
    return await apiGet('/api/auth/password-reset/validate', {
      requiresAuth: false,
      params: { token },
    });
  } catch (error) {
    console.error('[authService] Password reset validation error:', error);
    throw error;
  }
}

export async function completePasswordReset(data: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<{ message: string; email?: string; account_type?: string }> {
  try {
    return await apiPost('/api/auth/password-reset/complete', {
      token: data.token,
      password: data.password,
      confirm_password: data.confirmPassword,
    });
  } catch (error) {
    console.error('[authService] Password reset completion error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const stored = await AsyncStorage.getItem('hydranet_user');
    if (stored) {
      return JSON.parse(stored) as User;
    }

    const user = await apiGet<User>('/api/users/me');
    await AsyncStorage.setItem('hydranet_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('[authService] Error getting current user:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await clearTokens();
    await AsyncStorage.removeItem('hydranet_user');
  } catch (error) {
    console.error('[authService] Error logging out:', error);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('hydranet_access_token');
    return !!token;
  } catch (error) {
    return false;
  }
}
