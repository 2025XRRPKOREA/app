import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

class HttpClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  private setupInterceptors(): void {
    // Request interceptor - 모든 요청에 토큰 추가
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // 개발 모드에서 요청 로깅
        if (__DEV__) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - 응답 처리 및 에러 핸들링
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 개발 모드에서 응답 로깅
        if (__DEV__) {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // 개발 모드에서 에러 로깅
        if (__DEV__) {
          console.error('[API Response Error]', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: originalRequest?.url,
          });
        }

        // 401 에러 (Unauthorized) 처리
        if (error.response?.status === 401) {
          // 토큰이 만료되었거나 유효하지 않음
          await this.clearToken();
          
          // 로그인 페이지로 리다이렉트가 필요할 수 있지만, 
          // 여기서는 에러만 던지고 상위 컴포넌트에서 처리
          const apiError: ApiError = {
            message: '인증이 만료되었습니다. 다시 로그인해주세요.',
            code: 'UNAUTHORIZED',
            status: 401,
          };
          return Promise.reject(apiError);
        }

        // 기타 HTTP 에러 처리
        const apiError: ApiError = {
          message: this.getErrorMessage(error),
          code: error.code,
          status: error.response?.status,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    switch (error.response?.status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 409:
        return '이미 존재하는 데이터입니다.';
      case 429:
        return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 500:
        return '서버 내부 오류가 발생했습니다.';
      case 502:
        return '서버에 연결할 수 없습니다.';
      case 503:
        return '서비스를 사용할 수 없습니다.';
      default:
        if (error.code === 'ECONNABORTED') {
          return '요청 시간이 초과되었습니다.';
        }
        if (error.code === 'NETWORK_ERROR' || !error.response) {
          return '네트워크 연결을 확인해주세요.';
        }
        return '알 수 없는 오류가 발생했습니다.';
    }
  }

  // 토큰 관리 메서드들
  async setToken(token: string): Promise<void> {
    this.token = token;
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        this.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      } else {
        this.token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      return this.token;
    } catch (error) {
      console.error('Failed to load token:', error);
      return null;
    }
  }

  async clearToken(): Promise<void> {
    this.token = null;
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  private async loadTokenFromStorage(): Promise<void> {
    await this.getToken();
  }

  // HTTP 메서드들
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // 베이스 URL 업데이트 (환경 변경 시)
  updateBaseUrl(baseUrl: string): void {
    this.instance.defaults.baseURL = baseUrl;
  }

  // 인스턴스 접근 (필요한 경우)
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 싱글톤 인스턴스 생성
export const httpClient = new HttpClient();
export default httpClient;