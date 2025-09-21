import httpClient from './httpClient';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface User {
  id?: string;
  email: string;
  name?: string;
  walletAddress?: string;
  [key: string]: any;
}

class AuthService {
  /**
   * 사용자 로그인
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        request
      );

      // 토큰과 사용자 정보 저장
      if (response.token) {
        await httpClient.setToken(response.token);
        await this.saveUserData(response.user);
      }

      return response;
    } catch (error: any) {
      // 에러 메시지 개선
      if (error.status === 401) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (error.status === 404) {
        throw new Error('해당 이메일로 등록된 사용자를 찾을 수 없습니다.');
      }
      
      throw new Error(error.message || '로그인 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자 회원가입
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        request
      );

      // 토큰과 사용자 정보 저장
      if (response.token) {
        await httpClient.setToken(response.token);
        await this.saveUserData(response.user);
      }

      return response;
    } catch (error: any) {
      // 에러 메시지 개선
      if (error.status === 409) {
        throw new Error('이미 등록된 이메일입니다.');
      }
      
      throw new Error(error.message || '회원가입 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자 로그아웃
   */
  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청 (선택적)
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // 로그아웃 API 실패해도 로컬 정리는 진행
      console.warn('Logout API failed, but clearing local data:', error);
    } finally {
      // 로컬 토큰과 사용자 데이터 정리
      await httpClient.clearToken();
      await this.clearUserData();
    }
  }

  /**
   * 토큰 새로고침
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await httpClient.post<{ token: string }>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH
      );

      if (response.token) {
        await httpClient.setToken(response.token);
        return response.token;
      }

      throw new Error('새로운 토큰을 받지 못했습니다.');
    } catch (error: any) {
      throw new Error(error.message || '토큰 새로고침에 실패했습니다.');
    }
  }

  /**
   * 현재 토큰 유효성 검사
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = await httpClient.getToken();
      if (!token) return false;

      // 간단한 API 호출로 토큰 유효성 검사
      await httpClient.get('/api/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 현재 토큰 반환
   */
  async getCurrentToken(): Promise<string | null> {
    return await httpClient.getToken();
  }

  /**
   * 사용자 데이터 저장
   */
  private async saveUserData(user: User): Promise<void> {
    try {
      const userData = JSON.stringify(user);
      
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  /**
   * 저장된 사용자 데이터 로드
   */
  async getStoredUserData(): Promise<User | null> {
    try {
      let userData: string | null = null;

      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      } else {
        userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      }

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }

  /**
   * 사용자 데이터 정리
   */
  private async clearUserData(): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * 인증 상태 확인
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await httpClient.getToken();
    const user = await this.getStoredUserData();
    return !!(token && user);
  }
}

// 싱글톤 인스턴스 생성
export const authService = new AuthService();
export default authService;