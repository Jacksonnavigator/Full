import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  dma_id?: string;
  dma_name?: string;
  utility_id?: string;
  utility_name?: string;
  team?: string;
  team_id?: string;
  teamId?: string;
  user_type?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthStoreState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: AuthUser | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      
      setCurrentUser: (user) => set({
        currentUser: user,
        isAuthenticated: !!user,
      }),
      
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      
      setIsLoading: (value) => set({ isLoading: value }),
      
      setError: (error) => set({ error }),
      
      logout: () => set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
      }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
