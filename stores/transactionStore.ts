import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { transactionService, authService } from '@/services';
import type { Transaction as ServiceTransaction } from '@/services/transactionService';

// Transaction 타입을 서비스 레이어에서 가져와서 확장
export interface Transaction extends ServiceTransaction {
  // 추가 필드가 필요한 경우 여기에 정의
  description?: string;
  transactionHash?: string;
}

interface TransactionState {
  // State
  transactions: Transaction[];
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: number | null;
  hasMore: boolean;
  
  // Actions
  fetchTransactions: (limit?: number, isInitial?: boolean) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  reset: () => void;
  
  // Computed getters
  getPendingTransactions: () => Transaction[];
  getCompletedTransactions: () => Transaction[];
  getTransactionsByType: (type: Transaction['type']) => Transaction[];
}

export const useTransactionStore = create<TransactionState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    transactions: [],
    isLoading: true,
    isRefreshing: false,
    lastUpdated: null,
    hasMore: true,
    
    // Actions
    fetchTransactions: async (limit = 50, isInitial = false) => {
      try {
        if (isInitial) {
          set({ isLoading: true });
        } else {
          set({ isRefreshing: true });
        }
        
        // 인증 상태 확인
        const isAuthenticated = await authService.isAuthenticated();
        
        if (!isAuthenticated) {
          console.error('인증이 필요합니다.');
          set({ 
            isLoading: false, 
            isRefreshing: false 
          });
          return;
        }
        
        // 새로운 서비스 레이어 사용
        const result = await transactionService.getTransactions({ limit });
        
        set({
          transactions: result.transactions,
          lastUpdated: Date.now(),
          isLoading: false,
          isRefreshing: false,
          hasMore: result.hasMore,
        });
      } catch (error) {
        console.error('거래 내역 조회 실패:', error);
        set({
          isLoading: false,
          isRefreshing: false,
        });
      }
    },
    
    refreshTransactions: async () => {
      const { fetchTransactions } = get();
      await fetchTransactions(50, false);
    },
    
    addTransaction: (transaction: Transaction) => {
      const state = get();
      set({
        transactions: [transaction, ...state.transactions],
        lastUpdated: Date.now(),
      });
    },
    
    updateTransaction: (id: string, updates: Partial<Transaction>) => {
      const state = get();
      const updatedTransactions = state.transactions.map(tx =>
        tx.id === id ? { ...tx, ...updates } : tx
      );
      
      set({
        transactions: updatedTransactions,
        lastUpdated: Date.now(),
      });
    },
    
    reset: () => {
      set({
        transactions: [],
        isLoading: true,
        isRefreshing: false,
        lastUpdated: null,
        hasMore: true,
      });
    },
    
    // Computed getters
    getPendingTransactions: () => {
      const state = get();
      return state.transactions.filter(tx => tx.status === 'pending');
    },
    
    getCompletedTransactions: () => {
      const state = get();
      return state.transactions.filter(tx => tx.status === 'confirmed');
    },
    
    getTransactionsByType: (type: Transaction['type']) => {
      const state = get();
      return state.transactions.filter(tx => tx.type === type);
    },
  }))
);

// Selector hooks for optimal performance
export const useTransactions = () => useTransactionStore((state) => state.transactions);
// Split loading state into individual hooks for stability
export const useTransactionIsLoading = () => useTransactionStore((state) => state.isLoading);
export const useTransactionIsRefreshing = () => useTransactionStore((state) => state.isRefreshing);

// Legacy hook with stable reference
export const useTransactionLoading = () => {
  const isLoading = useTransactionIsLoading();
  const isRefreshing = useTransactionIsRefreshing();
  
  return React.useMemo(() => ({
    isLoading,
    isRefreshing,
  }), [isLoading, isRefreshing]);
};
export const usePendingTransactions = () => useTransactionStore((state) => state.getPendingTransactions());
export const useCompletedTransactions = () => useTransactionStore((state) => state.getCompletedTransactions());

// Individual action hooks (stable function references)
export const useFetchTransactions = () => useTransactionStore((state) => state.fetchTransactions);
export const useRefreshTransactions = () => useTransactionStore((state) => state.refreshTransactions);
export const useAddTransaction = () => useTransactionStore((state) => state.addTransaction);
export const useUpdateTransaction = () => useTransactionStore((state) => state.updateTransaction);
export const useResetTransactions = () => useTransactionStore((state) => state.reset);

// Legacy hook for backward compatibility (using useMemo for stable reference)
export const useTransactionActions = () => {
  const fetchTransactions = useFetchTransactions();
  const refreshTransactions = useRefreshTransactions();
  const addTransaction = useAddTransaction();
  const updateTransaction = useUpdateTransaction();
  const reset = useResetTransactions();
  
  return React.useMemo(() => ({
    fetchTransactions,
    refreshTransactions,
    addTransaction,
    updateTransaction,
    reset,
  }), [fetchTransactions, refreshTransactions, addTransaction, updateTransaction, reset]);
};