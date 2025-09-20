import Constants from 'expo-constants';

// API 설정
export const API_CONFIG = {
  // 환경 변수에서 서버 호스트를 가져오고, 없으면 기본값 사용
  BASE_URL: Constants.expoConfig?.extra?.serverHost || (__DEV__
    ? 'http://localhost:3000'  // 개발 서버
    : 'https://your-production-api.com'),  // 프로덕션 서버

  // API 엔드포인트들
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
    },
    USER: {
      PROFILE: '/api/user/profile',
      WALLET: '/api/user/wallet',
    },
    TRANSACTIONS: {
      LIST: '/api/transactions',
      SEND: '/api/transactions/send',
      RECEIVE: '/api/transactions/receive',
    },
    EXCHANGE: {
      RATES: '/api/exchange/rates',
      SWAP: '/api/exchange/swap',
    },
  },

  // 요청 타임아웃 (밀리초) - 환경 변수에서 가져오거나 기본값 사용
  TIMEOUT: parseInt(Constants.expoConfig?.extra?.apiTimeout || '30000', 10),

  // 재시도 설정
  RETRY: {
    COUNT: 3,
    DELAY: 1000,
  },
};

// 스토리지 키들
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  SETTINGS: 'app_settings',
  BIOMETRIC_ENABLED: 'biometric_enabled',
};

// 앱 설정
export const APP_CONFIG = {
  APP_NAME: 'RipplePay',
  VERSION: '1.0.0',

  // 기본 통화 설정
  DEFAULT_CURRENCY: 'KRW',
  SUPPORTED_CURRENCIES: ['KRW', 'XRP', 'USD'],

  // 거래 제한
  TRANSACTION_LIMITS: {
    MIN_AMOUNT: 100,      // 최소 거래 금액 (KRW)
    MAX_AMOUNT: 10000000, // 최대 거래 금액 (KRW)
    DAILY_LIMIT: 50000000, // 일일 거래 한도 (KRW)
  },

  // UI 설정
  UI: {
    LOADING_TIMEOUT: 5000,
    TOAST_DURATION: 3000,
    ANIMATION_DURATION: 300,
  },
};

// 개발 모드 설정
export const DEV_CONFIG = {
  ENABLE_FLIPPER: __DEV__,
  ENABLE_LOGS: __DEV__,
  MOCK_API: false, // API 모킹 여부
};