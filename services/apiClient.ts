import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Configuration, AuthApi, ApiAuthLoginPostRequest, ApiAuthRegisterPost201Response } from '@/api';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';

class ApiClient {
  private configuration: Configuration;
  private authApi: AuthApi;
  private token: string | null = null;

  constructor() {
    this.configuration = new Configuration({
      basePath: API_CONFIG.BASE_URL,
      accessToken: () => this.getToken(),
      baseOptions: {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // ngrok 브라우저 경고 스킵
        },
      },
    });
    this.authApi = new AuthApi(this.configuration);
    this.loadTokenFromStorage();
  }

  // 토큰 관리 메서드들
  private async loadTokenFromStorage(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // 웹에서는 localStorage 사용
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (storedToken) {
          this.token = storedToken;
          this.updateConfiguration();
        }
      } else {
        // 모바일에서는 AsyncStorage 사용
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (storedToken) {
          this.token = storedToken;
          this.updateConfiguration();
        }
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
    }
  }

  private async saveTokenToStorage(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // 웹에서는 localStorage 사용
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        // 모바일에서는 AsyncStorage 사용
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }
      this.token = token;
      this.updateConfiguration();
    } catch (error) {
      console.error('Failed to save token to storage:', error);
      throw error;
    }
  }

  private async removeTokenFromStorage(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // 웹에서는 localStorage 사용
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } else {
        // 모바일에서는 AsyncStorage 사용
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
      this.token = null;
      this.updateConfiguration();
    } catch (error) {
      console.error('Failed to remove token from storage:', error);
    }
  }

  private updateConfiguration(): void {
    this.configuration = new Configuration({
      basePath: API_CONFIG.BASE_URL,
      accessToken: () => this.getToken(),
      baseOptions: {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // ngrok 브라우저 경고 스킵
        },
      },
    });
    this.authApi = new AuthApi(this.configuration);
  }

  private getToken(): string {
    return this.token ? `Bearer ${this.token}` : '';
  }

  // 인증 관련 메서드들
  async login(email: string, password: string): Promise<{
    token: string;
    user: any;
    message?: string;
  }> {
    try {
      const loginRequest: ApiAuthLoginPostRequest = {
        email,
        password,
      };

      const response = await this.authApi.apiAuthLoginPost(loginRequest);
      const data = response.data;

      if (data.token) {
        await this.saveTokenToStorage(data.token);

        // 사용자 정보도 저장
        if (data.user) {
          if (Platform.OS === 'web') {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
          } else {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
          }
        }

        return {
          token: data.token,
          user: data.user || { email },
          message: data.message,
        };
      } else {
        throw new Error('토큰이 응답에 포함되지 않았습니다.');
      }
    } catch (error: any) {
      console.error('Login failed:', error);

      // 에러 메시지 처리
      if (error.response?.status === 401) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (error.response?.status === 404) {
        throw new Error('해당 이메일로 등록된 사용자를 찾을 수 없습니다.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  }

  async logout(): Promise<void> {
    await this.removeTokenFromStorage();
  }

  async register(email: string, password: string): Promise<{
    token: string;
    user: any;
    message?: string;
  }> {
    try {
      const registerRequest = {
        email,
        password,
      };

      const response = await this.authApi.apiAuthRegisterPost(registerRequest);
      const data = response.data;

      if (data.token) {
        await this.saveTokenToStorage(data.token);

        if (data.user) {
          if (Platform.OS === 'web') {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
          } else {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
          }
        }

        return {
          token: data.token,
          user: data.user || { email },
          message: data.message,
        };
      } else {
        throw new Error('토큰이 응답에 포함되지 않았습니다.');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);

      if (error.response?.status === 409) {
        throw new Error('이미 등록된 이메일입니다.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  }

  // 토큰 유효성 검사
  hasValidToken(): boolean {
    return !!this.token;
  }

  // 현재 토큰 반환
  getCurrentToken(): string | null {
    return this.token;
  }


  // 저장된 사용자 정보 로드
  async getStoredUserData(): Promise<any | null> {
    try {
      let userData: string | null = null;

      if (Platform.OS === 'web') {
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

  // API 설정 업데이트 (개발/프로덕션 환경 변경 시)
  updateBaseUrl(baseUrl: string): void {
    this.configuration = new Configuration({
      basePath: baseUrl,
      accessToken: () => this.getToken(),
      baseOptions: {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // ngrok 브라우저 경고 스킵
        },
      },
    });
    this.authApi = new AuthApi(this.configuration);
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 편의를 위한 export
export default apiClient;