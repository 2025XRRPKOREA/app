import { AuthApi, WalletApi, MarketApi, Configuration } from '@/api';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authService, walletService, transactionService } from './';
import type { User } from './authService';

class ApiClient {
  private configuration: Configuration;
  private authApi: AuthApi;
  private walletApi: WalletApi;
  private marketApi: MarketApi;
  private token: string | null = null;

  constructor() {
    this.configuration = new Configuration({
      basePath: API_CONFIG.BASE_URL,
      accessToken: () => this.getToken(),
      baseOptions: {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });
    this.authApi = new AuthApi(this.configuration);
    this.walletApi = new WalletApi(this.configuration);
    this.marketApi = new MarketApi(this.configuration);
    this.loadTokenFromStorage();
  }

  // 토큰 관리 메서드들
  private async loadTokenFromStorage(): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
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
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
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
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
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
        },
      },
    });
    this.authApi = new AuthApi(this.configuration);
    this.walletApi = new WalletApi(this.configuration);
    this.marketApi = new MarketApi(this.configuration);
  }

  private getToken(): string {
    return this.token ? this.token : '';
  }

  // 인증 관련 메서드들 - 새로운 서비스 레이어 사용
  async login(email: string, password: string): Promise<{
    token: string;
    user: User;
    message?: string;
  }> {
    try {
      const response = await authService.login({ email, password });
      
      // 기존 토큰 관리 시스템 동기화
      this.token = response.token;
      this.updateConfiguration();
      
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await authService.logout();
    this.token = null;
    this.updateConfiguration();
  }

  async register(email: string, password: string): Promise<{
    token: string;
    user: User;
    message?: string;
  }> {
    try {
      const response = await authService.register({ email, password });
      
      // 기존 토큰 관리 시스템 동기화
      this.token = response.token;
      this.updateConfiguration();
      
      return response;
    } catch (error: any) {
      throw error;
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

  // 저장된 사용자 정보 로드 - 새로운 서비스 레이어 사용
  async getStoredUserData(): Promise<User | null> {
    return await authService.getStoredUserData();
  }

  // 지갑 관련 메서드들 - 새로운 서비스 레이어 사용
  async getWalletBalance() {
    return await walletService.getBalance();
  }

  async getWalletAccount() {
    return await walletService.getAccount();
  }

  async getKrwBalance() {
    return await walletService.getKrwBalance();
  }

  // 거래 관련 메서드들 - 새로운 서비스 레이어 사용
  async getTransactionHistory(limit?: number) {
    const filter = limit ? { limit } : undefined;
    const result = await transactionService.getTransactions(filter);
    return { data: result }; // 기존 API 호환성 유지
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
        },
      },
    });
    this.authApi = new AuthApi(this.configuration);
    this.walletApi = new WalletApi(this.configuration);
    this.marketApi = new MarketApi(this.configuration);
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 편의를 위한 export
export default apiClient;