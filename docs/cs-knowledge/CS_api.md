# API 통신 패턴 및 Axios 마이그레이션

> **기술 면접 포인트**: HTTP 클라이언트 선택과 API 아키텍처 설계

## 🎯 API 통신 전략의 중요성

### 모바일 앱에서 API 통신의 특수성
- **네트워크 불안정성**: 모바일 네트워크의 연결 끊김과 지연
- **배터리 효율성**: 불필요한 네트워크 요청으로 인한 배터리 소모
- **사용자 경험**: 로딩 상태와 에러 처리의 중요성
- **보안**: 토큰 관리와 HTTPS 통신
- **오프라인 지원**: 캐싱과 동기화 전략

### 현재 RipplePay의 API 통신 구조
```typescript
// services/apiClient.ts에서 발견된 혼재 패턴
// 1. OpenAPI Generated Client (axios 기반)
import { AuthApi, WalletApi, MarketApi, Configuration } from '@/api';

// 2. 직접 fetch 호출 (해커톤 모드)
const response = await fetch('http://122.40.46.59/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

// 문제점: 두 가지 방식이 혼재하여 일관성 부족
```

## 📊 HTTP 클라이언트 비교 분석

### 1. Fetch API (현재 일부 사용)

#### 장점과 사용 사례
```typescript
// 브라우저 내장 API
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(userData),
});

// 장점:
// ✅ 브라우저/React Native 내장 (의존성 없음)
// ✅ Promise 기반
// ✅ 가벼운 footprint
// ✅ 스트림 지원
```

#### 단점과 제약사항
```typescript
// 문제점들:
// ❌ 기본 기능만 제공 (인터셉터 없음)
// ❌ 요청/응답 변환 수동 구현 필요
// ❌ 에러 처리 복잡성
// ❌ 타임아웃 설정 복잡
// ❌ 요청 취소 복잡함 (AbortController 필요)

// 에러 처리의 복잡성
const apiCall = async () => {
  try {
    const response = await fetch('/api/data');
    
    // HTTP 에러 상태 수동 체크 필요
    if (!response.ok) {
      if (response.status === 401) {
        // 인증 에러 처리
      } else if (response.status >= 500) {
        // 서버 에러 처리
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // 네트워크 에러와 HTTP 에러 구분 어려움
    throw error;
  }
};
```

### 2. Axios (마이그레이션 대상)

#### 핵심 기능과 장점
```typescript
import axios from 'axios';

// 인스턴스 생성과 기본 설정
const apiClient = axios.create({
  baseURL: 'https://api.ripplepay.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 장점:
// ✅ 풍부한 기능 (인터셉터, 변환기, 에러 처리)
// ✅ 요청/응답 인터셉터
// ✅ 자동 JSON 변환
// ✅ 타임아웃 내장
// ✅ 요청 취소 지원
// ✅ 브라우저/Node.js 모두 지원
```

#### 고급 기능 활용
```typescript
// 요청 인터셉터 (토큰 자동 추가)
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 (에러 처리 및 토큰 갱신)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 자동 갱신
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 3. 다른 HTTP 클라이언트들

#### React Query/TanStack Query
```typescript
// 서버 상태 관리에 특화
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['balance'],
  queryFn: () => apiClient.get('/wallet/balance'),
  staleTime: 5 * 60 * 1000, // 5분간 fresh
});

// 장점: 캐싱, 동기화, 백그라운드 업데이트
// 단점: 러닝 커브, 추가 복잡성
```

#### SWR (Stale-While-Revalidate)
```typescript
import useSWR from 'swr';

const { data, error } = useSWR('/api/balance', fetcher, {
  refreshInterval: 30000, // 30초마다 갱신
});

// 장점: 간단한 사용법, 자동 갱신
// 단점: 기본 HTTP 클라이언트 여전히 필요
```

## 🔄 RipplePay API 마이그레이션 전략

### 현재 문제 분석
```typescript
// services/apiClient.ts 분석 결과
class ApiClient {
  // 문제 1: OpenAPI Client와 fetch 혼재
  async login(email: string, password: string) {
    // 직접 fetch 사용 (해커톤 모드)
    const response = await fetch(apiUrl, { /* ... */ });
  }

  async register(email: string, password: string) {
    // OpenAPI 생성된 클라이언트 사용
    const response = await this.authApi.apiAuthRegisterPost(registerRequest);
  }

  // 문제 2: 토큰 관리 복잡성
  private updateConfiguration(): void {
    // 매번 새로운 Configuration 객체 생성
    this.configuration = new Configuration({ /* ... */ });
  }

  // 문제 3: 에러 처리 중복
  // 각 메서드마다 비슷한 try-catch 패턴 반복
}
```

### 마이그레이션 계획

#### 1단계: Axios 인스턴스 통합
```typescript
// services/httpClient.ts (새로 생성)
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      (response) => response.data, // 자동으로 data 추출
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance.request(originalRequest);
          } catch (refreshError) {
            // 갱신 실패 시 로그아웃 처리
            await this.clearTokens();
            // 로그인 화면으로 리다이렉트 로직
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private async getStoredToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      } else {
        return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  private handleError(error: any) {
    if (error.response) {
      // 서버 응답 에러 (4xx, 5xx)
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Server error',
        data: error.response.data,
      };
    } else if (error.request) {
      // 네트워크 에러
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      };
    } else {
      // 기타 에러
      return {
        status: -1,
        message: error.message || 'Unknown error',
      };
    }
  }

  // HTTP 메서드들
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config);
  }
}

export const httpClient = new HttpClient();
```

#### 2단계: API 서비스 레이어 재구성
```typescript
// services/authService.ts
import { httpClient } from './httpClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', credentials);
  }

  static async register(credentials: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/register', credentials);
  }

  static async refreshToken(): Promise<{ token: string }> {
    return httpClient.post<{ token: string }>('/auth/refresh');
  }

  static async logout(): Promise<void> {
    return httpClient.post<void>('/auth/logout');
  }
}

// services/walletService.ts
export class WalletService {
  static async getBalance(): Promise<WalletBalance> {
    return httpClient.get<WalletBalance>('/wallet/balance');
  }

  static async getAccount(): Promise<WalletAccount> {
    return httpClient.get<WalletAccount>('/wallet/account');
  }

  static async getKrwBalance(): Promise<{ amount: number }> {
    return httpClient.get<{ amount: number }>('/wallet/krw-balance');
  }
}

// services/transactionService.ts
export class TransactionService {
  static async getHistory(limit?: number): Promise<Transaction[]> {
    const params = limit ? { limit } : {};
    return httpClient.get<Transaction[]>('/transactions/history', { params });
  }

  static async sendPayment(data: SendPaymentRequest): Promise<Transaction> {
    return httpClient.post<Transaction>('/transactions/send', data);
  }
}
```

#### 3단계: 기존 apiClient 점진적 교체
```typescript
// services/apiClient.ts (리팩토링)
import { AuthService, WalletService, TransactionService } from './';

class ApiClient {
  // 기존 메서드들을 새로운 서비스로 위임
  async login(email: string, password: string) {
    try {
      const response = await AuthService.login({ email, password });
      await this.saveTokenToStorage(response.token);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async getWalletBalance() {
    return WalletService.getBalance();
  }

  async getTransactionHistory(limit?: number) {
    return TransactionService.getHistory(limit);
  }

  private handleAuthError(error: any) {
    // 통합된 에러 처리
    if (error.status === 401) {
      return new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else if (error.status === 404) {
      return new Error('해당 이메일로 등록된 사용자를 찾을 수 없습니다.');
    } else if (error.isNetworkError) {
      return new Error('네트워크 연결을 확인해주세요.');
    }
    return new Error('로그인 중 오류가 발생했습니다.');
  }
}
```

## 🚀 고급 기능 구현

### 1. 요청 중복 제거 (Request Deduplication)
```typescript
class RequestManager {
  private pendingRequests = new Map<string, Promise<any>>();

  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// 사용 예시
const requestManager = new RequestManager();

const getBalance = () => requestManager.request(
  'wallet-balance',
  () => httpClient.get('/wallet/balance')
);
```

### 2. 오프라인 지원과 캐싱
```typescript
import NetInfo from '@react-native-community/netinfo';

class OfflineManager {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private isOnline = true;

  constructor() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
    });
  }

  async cachedRequest<T>(
    key: string, 
    requestFn: () => Promise<T>,
    cacheTime = 5 * 60 * 1000 // 5분
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // 캐시된 데이터가 유효한 경우
    if (cached && (now - cached.timestamp) < cacheTime) {
      return cached.data;
    }

    // 온라인 상태에서만 새로운 요청
    if (this.isOnline) {
      try {
        const data = await requestFn();
        this.cache.set(key, { data, timestamp: now });
        return data;
      } catch (error) {
        // 네트워크 에러 시 캐시된 데이터 반환
        if (cached) {
          return cached.data;
        }
        throw error;
      }
    } else {
      // 오프라인 시 캐시된 데이터 반환
      if (cached) {
        return cached.data;
      }
      throw new Error('No cached data available offline');
    }
  }
}
```

### 3. 요청 재시도 로직
```typescript
class RetryManager {
  async withRetry<T>(
    requestFn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error: any) {
        lastError = error;

        // 재시도 불가능한 에러들
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        // 마지막 시도가 아닌 경우 대기
        if (attempt < maxRetries) {
          await this.wait(delay * Math.pow(2, attempt)); // 지수 백오프
        }
      }
    }

    throw lastError;
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## 📊 성능 최적화

### 1. 요청 배치 처리
```typescript
class BatchRequestManager {
  private batchQueue: Array<{ 
    endpoint: string; 
    resolve: (data: any) => void; 
    reject: (error: any) => void;
  }> = [];
  private batchTimer: NodeJS.Timeout | null = null;

  async batchRequest(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ endpoint, resolve, reject });

      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatch();
        }, 100); // 100ms 내 요청들을 배치로 처리
      }
    });
  }

  private async processBatch() {
    const batch = [...this.batchQueue];
    this.batchQueue.length = 0;
    this.batchTimer = null;

    try {
      const endpoints = batch.map(item => item.endpoint);
      const responses = await httpClient.post('/batch', { endpoints });

      batch.forEach((item, index) => {
        item.resolve(responses[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }
}
```

### 2. 응답 압축 및 최적화
```typescript
// HTTP 클라이언트에 압축 지원 추가
const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Encoding': 'gzip',
  },
  // 응답 크기 제한
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024,
});
```

## 💡 면접 질문 예상 답변

### Q: "Fetch 대신 Axios를 선택한 이유는?"
**A**: "Fetch는 기본 제공되지만 인터셉터, 자동 JSON 변환, 에러 처리 등이 부족했습니다. 특히 토큰 갱신과 에러 처리를 각 API 호출마다 반복 구현해야 했어요. Axios는 인터셉터를 통해 이런 공통 로직을 중앙화할 수 있고, 타임아웃이나 요청 취소도 간단하게 처리할 수 있었습니다."

### Q: "API 에러 처리 전략은?"
**A**: "네트워크 에러, HTTP 상태 에러, 비즈니스 로직 에러를 구분해서 처리했습니다. 401 에러는 자동으로 토큰을 갱신하고, 네트워크 에러는 재시도 로직을 적용했어요. 사용자에게는 상황에 맞는 명확한 메시지를 보여주도록 했습니다."

### Q: "모바일 환경에서 API 최적화는 어떻게 했나요?"
**A**: "요청 중복 제거, 오프라인 캐싱, 배치 처리를 적용했습니다. NetInfo로 네트워크 상태를 감지해서 오프라인일 때는 캐시된 데이터를 보여주고, 온라인이 되면 자동으로 동기화하도록 했어요. 또한 불필요한 폴링을 줄이고 WebSocket을 활용해서 실시간 데이터는 효율적으로 받았습니다."

## 🔗 참고 자료

- [Axios 공식 문서](https://axios-http.com/)
- [React Native 네트워킹](https://reactnative.dev/docs/network)
- [HTTP 클라이언트 비교](https://blog.logrocket.com/axios-vs-fetch-best-http-requests/)

---

**다음 학습**: [모바일 앱 배포 전략](./CS_deployment.md)