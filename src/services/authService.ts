/**
 * HydraNet Authentication Service
 * Handles user login, registration, and role-based authentication
 * Uses HydraNet Backend API (FastAPI)
 */

import {
  apiPost,
  apiGet,
  saveTokens,
  getCurrentUser as getStoredUser,
  clearTokens,
  saveCurrentUser,
} from './apiClient';
import { User, UserRole } from './types';


/**
 * Register a new user (called by administrators for internal users)
 */
export async function registerUser(
  email: string,
  password: string,
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
): Promise<User> {
  try {
    const response = await apiPost<User>('/api/users', {
      email,
      password,
      name: `${userData.firstName} ${userData.lastName}`,
      phone: userData.phoneNumber,
      role: userData.role,
      utility_id: userData.utilityId,
      dma_id: userData.dmaId,
      branch_id: userData.branchId,
      team_id: userData.teamId,
      is_approved: userData.isApproved || false,
    }, { requiresAuth: false });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Public report submission (anonymous users)
 * No authentication required
 */
export async function submitPublicReport(reportData: any): Promise<string> {
  try {
    // This is handled by reportService.submitReport with null userId
    return '';
  } catch (error) {
    console.error('Public report submission error:', error);
    throw error;
  }
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    // Call backend login endpoint
    const response = await apiPost<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      user: any; // Backend response format
    }>(
      '/api/auth/login',
      { email, password },
      { requiresAuth: false }
    );

    // Map backend response to our User type (handle snake_case from backend)
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      firstName: response.user.first_name || response.user.name?.split(' ')[0] || '',
      lastName: response.user.last_name || response.user.name?.split(' ')[1] || '',
      phoneNumber: response.user.phone,
      role: response.user.role,
      utilityId: response.user.utility_id,
      dmaId: response.user.dma_id,
      branchId: response.user.branch_id,
      teamId: response.user.team_id,
      isApproved: response.user.is_approved,
      createdAt: response.user.created_at,
      updatedAt: response.user.updated_at,
      profilePhotoUrl: response.user.avatar,
    };

    // Save tokens
    await saveTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });

    // Save user data
    await saveCurrentUser(user);

    // Verify user is approved
    if (!user.isApproved && user.role !== 'Administrator') {
      await clearTokens();
      throw new Error('User account not yet approved by administrator');
    }

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  try {
    await clearTokens();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await getStoredUser();
    if (!user) return null;

    // Optionally refresh user data from backend
    try {
      const backendUser = await apiGet<any>('/api/users/me');
      
      // Map backend response to our User type
      const mappedUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.first_name || backendUser.name?.split(' ')[0] || '',
        lastName: backendUser.last_name || backendUser.name?.split(' ')[1] || '',
        phoneNumber: backendUser.phone,
        role: backendUser.role,
        utilityId: backendUser.utility_id,
        dmaId: backendUser.dma_id,
        branchId: backendUser.branch_id,
        teamId: backendUser.team_id,
        isApproved: backendUser.is_approved,
        createdAt: backendUser.created_at,
        updatedAt: backendUser.updated_at,
        profilePhotoUrl: backendUser.avatar,
      };
      
      await saveCurrentUser(mappedUser);
      return mappedUser;
    } catch {
      // If fetch fails, return cached user
      return user;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get Firebase Auth user
 */
export function getAuthUser(): any {
  // Return null since we're not using Firebase anymore
  // Use getCurrentUser() instead
  return null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
  try {
    await apiPut(`/api/users/${userId}`, updates);
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

/**
 * Verify user is approved
 */
export async function isUserApproved(userId: string): Promise<boolean> {
  try {
    const backendUser = await apiGet<any>(`/api/users/${userId}`);
    return backendUser.is_approved || false;
  } catch (error) {
    console.error('Error checking user approval:', error);
    return false;
  }
}

/**
 * Import apiPut for update operations
 */
import { apiPut } from './apiClient';

/**
 * Get users by role and DMA
 */
export async function getUsersByRoleAndDMA(role: UserRole, dmaId: string): Promise<User[]> {
  try {
    const response = await apiGet<User[]>('/api/users', {
      params: { role, dma_id: dmaId },
    });
    return response;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

/**
 * Approve a user (Administrator only)
 */
export async function approveUser(userId: string): Promise<void> {
  try {
    await apiPut(`/api/users/${userId}`, { is_approved: true });
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
}
