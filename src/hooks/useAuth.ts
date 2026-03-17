/**
 * HydraNet Mobile - useAuth Hook
 * Authentication state and methods
 */

import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, AuthState } from '@/lib/types';
import { authManager } from '@/lib/auth';
import { useTaskStore } from '@/store/taskStore';

const normalizeRoleForStore = (role?: string | null) => {
  if (!role) return 'Engineer';
  const normalized = role.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized === 'teamleader' || normalized === 'team_leader') return 'Team Leader';
  if (normalized === 'engineer') return 'Engineer';
  // Fallback to Engineer for any unknown role to avoid access issues
  return 'Engineer';
};

const mapToStoreUser = (user: User) => ({
  name: `${user.firstName} ${user.lastName}`,
  role: normalizeRoleForStore(user.role),
  team: user.teamId,
  branch: user.branchId,
});

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    currentUser: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = await authManager.isAuthenticated();
        if (isAuth) {
          const userData = await authManager.getUserData();
          setState({
            currentUser: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // Update the task store
          useTaskStore.getState().setCurrentUser(userData ? mapToStoreUser(userData) : null);
        } else {
          setState({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error: any) {
        setState({
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message || 'Failed to initialize auth',
        });
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await authManager.login(credentials);
      
      if (result.success && result.user) {
        // Ensure we use the normalized role values stored by AuthManager
        const storedUser = await authManager.getUserData();
        const userToUse = storedUser ?? result.user;

        setState({
          currentUser: userToUse,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Update the task store
        useTaskStore.getState().setCurrentUser(userToUse ? mapToStoreUser(userToUse) : null);

        return { success: true, user: userToUse };
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Login failed',
        }));
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      return { success: false, error: errorMsg };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      await authManager.logout();
      setState({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      // Clear the task store user
      useTaskStore.getState().logout();
      return { success: true };
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Logout failed',
      }));
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const result = await authManager.refreshToken();
      return result.success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshToken,
    clearError,
  };
}

export default useAuth;
