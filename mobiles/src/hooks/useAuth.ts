/**
 * HydraNet Mobile - useAuth Hook
 * Authentication state and methods (uses global Zustand store)
 */

import { useEffect, useCallback } from 'react';
import { User, LoginCredentials } from '@/lib/types';
import { authManager } from '@/lib/auth';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import {
  registerPushNotificationsForCurrentUser,
  unregisterPushNotificationsForCurrentUser,
} from '@/services/pushNotificationService';

const normalizeRoleForStore = (role?: string | null) => {
  if (!role) return 'Engineer';
  const normalized = role.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized === 'teamleader' || normalized === 'team_leader') return 'Team Leader';
  if (normalized === 'dmamanager' || normalized === 'dma_manager' || normalized === 'dma') {
    return 'DMA Manager';
  }
  if (normalized === 'engineer') return 'Engineer';
  return 'Engineer';
};

const isMobileAppRoleAllowed = (role?: string | null) => {
  const normalizedRole = normalizeRoleForStore(role);
  return normalizedRole === 'Engineer' || normalizedRole === 'Team Leader';
};

const mapToStoreUser = (user: User) => ({
  id: user.id,
  name: user.name || user.email,
  role: normalizeRoleForStore(user.role) as 'Engineer' | 'Team Leader',
  email: user.email,
  team: (user as any).team_name || (user as any).teamName || (user as any).team_id || (user as any).teamId,
  teamId: (user as any).team_id || (user as any).teamId,
  dmaId: (user as any).dma_id || (user as any).dmaId,
  dmaName: (user as any).dma_name || (user as any).dmaName,
});

export function useAuth() {
  // Use global auth store
  const { 
    currentUser, 
    isAuthenticated, 
    isLoading, 
    error,
    setCurrentUser,
    setIsLoading,
    setError,
    logout: logoutStore,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const isAuth = await authManager.isAuthenticated();
        if (isAuth) {
          const userData = await authManager.getUserData();
          if (userData && !isMobileAppRoleAllowed(userData.role)) {
            await authManager.logout();
            setCurrentUser(null);
            useTaskStore.getState().logout();
            setError('This mobile app is only available to engineers and team leaders.');
          } else {
            setCurrentUser(userData as any);
            useTaskStore.getState().setCurrentUser(userData ? mapToStoreUser(userData) : null);
            if (userData) {
              void registerPushNotificationsForCurrentUser(userData);
            }
          }
          if (userData && isMobileAppRoleAllowed(userData.role)) {
            await useTaskStore.getState().fetchTasks();
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to initialize auth');
      }
      setIsLoading(false);
    };

    initAuth();
  }, [setCurrentUser, setIsLoading, setError]);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authManager.login(credentials);
      
      if (result.success && result.user) {
        // Get stored user to ensure normalized role
        const storedUser = await authManager.getUserData();
        const userToUse = storedUser ?? result.user;

        if (!isMobileAppRoleAllowed(userToUse.role)) {
          await authManager.logout();
          useTaskStore.getState().logout();
          const errorMessage = 'This mobile app is only available to engineers and team leaders.';
          setCurrentUser(null);
          setError(errorMessage);
          setIsLoading(false);
          return { success: false, error: errorMessage };
        }

        // Update global auth store
        setCurrentUser(userToUse as any);
        
        // Update the task store
        useTaskStore.getState().setCurrentUser(userToUse ? mapToStoreUser(userToUse) : null);
        await useTaskStore.getState().fetchTasks();
        void registerPushNotificationsForCurrentUser(userToUse);

        setIsLoading(false);
        return { success: true, user: userToUse };
      } else {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, [setCurrentUser, setIsLoading, setError]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await unregisterPushNotificationsForCurrentUser();
      await authManager.logout();
      logoutStore();
      // Clear the task store user
      useTaskStore.getState().logout();
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Logout failed');
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, [setIsLoading, setError, logoutStore]);

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
    setError(null);
  }, [setError]);

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    clearError,
  };
}

export default useAuth;
