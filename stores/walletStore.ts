import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { walletService, authService } from '@/services';
import type { WalletBalance } from '@/services/walletService';

interface WalletState {
  // State
  balance: WalletBalance | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: number | null;
  
  // Actions
  fetchBalance: (isInitial?: boolean) => Promise<void>;
  refreshBalance: () => Promise<void>;
  setBalance: (balance: WalletBalance | null) => void;
  reset: () => void;
  
  // Auto-refresh management
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

// Auto-refresh interval (30 seconds)
const AUTO_REFRESH_INTERVAL = 30000;
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export const useWalletStore = create<WalletState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    balance: null,
    isInitialLoading: true,
    isRefreshing: false,
    lastUpdated: null,
    
    // Actions
    fetchBalance: async (isInitial = false) => {
      try {
        if (isInitial) {
          set({ isInitialLoading: true });
        } else {
          set({ isRefreshing: true });
        }
        
        // 인증 상태 확인
        const isAuthenticated = await authService.isAuthenticated();
        
        if (!isAuthenticated) {
          console.error('인증이 필요합니다.');
          set({ 
            isInitialLoading: false, 
            isRefreshing: false 
          });
          return;
        }
        
        // 새로운 서비스 레이어 사용
        const balance = await walletService.getBalance();
        
        set({
          balance,
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
    
    setBalance: (balance: WalletBalance | null) => {
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
// Split loading state into individual hooks for stability
export const useWalletInitialLoading = () => useWalletStore((state) => state.isInitialLoading);
export const useWalletRefreshing = () => useWalletStore((state) => state.isRefreshing);

// Legacy hook with stable reference
export const useWalletLoading = () => {
  const isInitialLoading = useWalletInitialLoading();
  const isRefreshing = useWalletRefreshing();
  
  return React.useMemo(() => ({
    isInitialLoading,
    isRefreshing,
  }), [isInitialLoading, isRefreshing]);
};
export const useWalletLastUpdated = () => useWalletStore((state) => state.lastUpdated);

// Individual action hooks (stable function references)
export const useFetchBalance = () => useWalletStore((state) => state.fetchBalance);
export const useRefreshBalance = () => useWalletStore((state) => state.refreshBalance);
export const useStartAutoRefresh = () => useWalletStore((state) => state.startAutoRefresh);
export const useStopAutoRefresh = () => useWalletStore((state) => state.stopAutoRefresh);
export const useResetWallet = () => useWalletStore((state) => state.reset);

// Legacy hook for backward compatibility (using useMemo for stable reference)
export const useWalletActions = () => {
  const fetchBalance = useFetchBalance();
  const refreshBalance = useRefreshBalance();
  const startAutoRefresh = useStartAutoRefresh();
  const stopAutoRefresh = useStopAutoRefresh();
  const reset = useResetWallet();
  
  return React.useMemo(() => ({
    fetchBalance,
    refreshBalance,
    startAutoRefresh,
    stopAutoRefresh,
    reset,
  }), [fetchBalance, refreshBalance, startAutoRefresh, stopAutoRefresh, reset]);
};