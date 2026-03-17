/**
 * Authentication Service for HydraNet
 * Optional authentication for personalized reports
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost, saveTokens, clearTokens } from './apiClient';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

/**
 * Login user with email and password
 */
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

    // Save tokens
    await saveTokens(response.access_token, response.refresh_token);

    // Save user info
    await AsyncStorage.setItem('hydranet_user', JSON.stringify(response.user));

    return response.user;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}

/**
 * Register new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<User> {
  try {
    const response = await apiPost<{
      access_token: string;
      refresh_token: string;
      user: User;
    }>('/api/auth/register', {
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone,
      first_name: data.firstName,
      last_name: data.lastName,
    });

    // Save tokens
    await saveTokens(response.access_token, response.refresh_token);

    // Save user info
    await AsyncStorage.setItem('hydranet_user', JSON.stringify(response.user));

    return response.user;
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Try to get from storage first
    const stored = await AsyncStorage.getItem('hydranet_user');
    if (stored) {
      return JSON.parse(stored);
    }

    // Otherwise try to fetch from backend
    const user = await apiPost<User>('/api/users/me', {});
    await AsyncStorage.setItem('hydranet_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  try {
    await clearTokens();
    await AsyncStorage.removeItem('hydranet_user');
    console.log('✅ User logged out');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('hydranet_access_token');
    return !!token;
  } catch (error) {
    return false;
  }
}
