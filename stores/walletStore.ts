import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ApiWalletBalanceGet200Response } from '../api';
import apiClient from '@/services/apiClient';

interface WalletState {
  // State
  balance: ApiWalletBalanceGet200Response | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: number | null;
  
  // Actions
  fetchBalance: (isInitial?: boolean) => Promise<void>;
  refreshBalance: () => Promise<void>;
  setBalance: (balance: ApiWalletBalanceGet200Response | null) => void;
  reset: () => void;
  
  // Auto-refresh management
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

// Auto-refresh interval (30 seconds)
const AUTO_REFRESH_INTERVAL = 30000;
let refreshInterval: NodeJS.Timeout | null = null;

export const useWalletStore = create<WalletState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    balance: null,
    isInitialLoading: true,
    isRefreshing: false,
    lastUpdated: null,
    
    // Actions
    fetchBalance: async (isInitial = false) => {
      const state = get();
      
      try {
        if (isInitial) {
          set({ isInitialLoading: true });
        } else {
          set({ isRefreshing: true });
        }
        
        // API 호출을 위한 토큰 확인
        const token = apiClient.getCurrentToken();
        
        console.log('토큰 상태:', token ? '있음' : '없음');
        
        if (!token) {
          console.error('토큰이 없습니다. 로그인이 필요합니다.');
          set({ 
            isInitialLoading: false, 
            isRefreshing: false 
          });
          return;
        }
        
        // 직접 API 호출 (기존 방식 유지)
        const apiUrl = 'http://122.40.46.59/api/wallet/balance';
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('인증 실패 - 토큰이 유효하지 않습니다.');
          }
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        
        set({
          balance: data,
          lastUpdated: Date.now(),
          isInitialLoading: false,
          isRefreshing: false,
        });
      } catch (error) {
        console.error('잔고 조회 실패:', error);
        set({
          isInitialLoading: false,
          isRefreshing: false,
        });
      }
    },
    
    refreshBalance: async () => {
      const { fetchBalance } = get();
      await fetchBalance(false);
    },
    
    setBalance: (balance: ApiWalletBalanceGet200Response | null) => {
      set({ 
        balance, 
        lastUpdated: balance ? Date.now() : null 
      });
    },
    
    reset: () => {
      // Auto-refresh 정지
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
      
      set({
        balance: null,
        isInitialLoading: true,
        isRefreshing: false,
        lastUpdated: null,
      });
    },
    
    startAutoRefresh: () => {
      const { fetchBalance } = get();
      
      // 기존 interval 정리
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      
      // 새로운 interval 시작
      refreshInterval = setInterval(() => {
        fetchBalance(false);
      }, AUTO_REFRESH_INTERVAL);
    },
    
    stopAutoRefresh: () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
    },
  }))
);

// Selector hooks for optimal performance
export const useWalletBalance = () => useWalletStore((state) => state.balance);
export const useWalletLoading = () => useWalletStore((state) => ({
  isInitialLoading: state.isInitialLoading,
  isRefreshing: state.isRefreshing,
}));
export const useWalletLastUpdated = () => useWalletStore((state) => state.lastUpdated);

// Action hooks
export const useWalletActions = () => useWalletStore((state) => ({
  fetchBalance: state.fetchBalance,
  refreshBalance: state.refreshBalance,
  startAutoRefresh: state.startAutoRefresh,
  stopAutoRefresh: state.stopAutoRefresh,
  reset: state.reset,
}));