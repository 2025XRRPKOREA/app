import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import apiClient from '@/services/apiClient';

export interface User {
  id?: string;
  email: string;
  name?: string;
  walletAddress?: string;
  [key: string]: any;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
  // Computed
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  
  // Internal actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    user: null,
    token: null,
    isLoading: true,
    
    // Computed values
    get isAuthenticated() {
      const state = get();
      return !!state.user && !!state.token;
    },
    
    // Actions
    login: async (email: string, password: string) => {
      try {
        const response = await apiClient.login(email, password);
        
        set({
          token: response.token,
          user: response.user,
        });
      } catch (error) {
        console.error('Login error in AuthStore:', error);
        throw error;
      }
    },
    
    register: async (email: string, password: string) => {
      try {
        const response = await apiClient.register(email, password);
        
        set({
          token: response.token,
          user: response.user,
        });
      } catch (error) {
        console.error('Registration error in AuthStore:', error);
        throw error;
      }
    },
    
    logout: async () => {
      try {
        await apiClient.logout();
        set({
          token: null,
          user: null,
        });
      } catch (error) {
        console.error('Failed to logout:', error);
        // 로그아웃 실패해도 로컬 상태는 정리
        set({
          token: null,
          user: null,
        });
      }
    },
    
    initializeAuth: async () => {
      try {
        // API 클라이언트에서 토큰 확인
        const storedToken = apiClient.getCurrentToken();
        const storedUser = await apiClient.getStoredUserData();

        if (storedToken && storedUser) {
          set({
            token: storedToken,
            user: storedUser,
          });
        }
      } catch (error) {
        console.error('Failed to load stored session:', error);
        // 저장된 세션이 손상된 경우 정리
        await apiClient.logout();
      } finally {
        set({ isLoading: false });
      }
    },
    
    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
    
    // Internal setters
    setUser: (user: User | null) => {
      set({ user });
    },
    
    setToken: (token: string | null) => {
      set({ token });
    },
  }))
);

// Selector hooks for optimal performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Action hooks
export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  initializeAuth: state.initializeAuth,
}));