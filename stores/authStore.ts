import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { authService } from '@/services';
import type { User } from '@/services/authService';

// User interface is now imported from authService

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
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
    
    
    // Actions
    login: async (email: string, password: string) => {
      try {
        const response = await authService.login({ email, password });
        
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
        const response = await authService.register({ email, password });
        
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
        await authService.logout();
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
        // 인증 서비스에서 토큰과 사용자 정보 확인
        const storedToken = await authService.getCurrentToken();
        const storedUser = await authService.getStoredUserData();

        if (storedToken && storedUser) {
          set({
            token: storedToken,
            user: storedUser,
          });
        }
      } catch (error) {
        console.error('Failed to load stored session:', error);
        // 저장된 세션이 손상된 경우 정리
        await authService.logout();
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
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user && !!state.token);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Individual action hooks (stable function references)
export const useLogin = () => useAuthStore((state) => state.login);
export const useRegister = () => useAuthStore((state) => state.register);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useInitializeAuth = () => useAuthStore((state) => state.initializeAuth);

// Legacy hook for backward compatibility (using useMemo for stable reference)
export const useAuthActions = () => {
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();
  const initializeAuth = useInitializeAuth();
  
  return React.useMemo(() => ({
    login,
    register, 
    logout,
    initializeAuth
  }), [login, register, logout, initializeAuth]);
};