import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/services/apiClient';

interface User {
  id?: string;
  email: string;
  name?: string;
  walletAddress?: string;
  // 추가 사용자 필드들
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  // 앱 시작 시 저장된 세션 확인
  useEffect(() => {
    checkStoredSession();
  }, []);

  const checkStoredSession = async () => {
    try {
      // API 클라이언트에서 토큰 확인
      const storedToken = apiClient.getCurrentToken();
      const storedUser = await apiClient.getStoredUserData();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Failed to load stored session:', error);
      // 저장된 세션이 손상된 경우 정리
      await apiClient.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);

      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error; // 에러를 다시 throw하여 UI에서 처리할 수 있도록 함
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await apiClient.register(email, password);

      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
      // 로그아웃 실패해도 로컬 상태는 정리
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}