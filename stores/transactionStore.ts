import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import apiClient from '@/services/apiClient';

// Transaction 타입 정의 (기존 API 응답에 맞춤)
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'send' | 'receive' | 'exchange';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description?: string;
  fromAddress?: string;
  toAddress?: string;
  transactionHash?: string;
  [key: string]: any;
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
      const state = get();
      
      try {
        if (isInitial) {
          set({ isLoading: true });
        } else {
          set({ isRefreshing: true });
        }
        
        // API 호출을 위한 토큰 확인
        const token = apiClient.getCurrentToken();
        
        if (!token) {
          console.error('토큰이 없습니다. 로그인이 필요합니다.');
          set({ 
            isLoading: false, 
            isRefreshing: false 
          });
          return;
        }
        
        // API 호출 (기존 방식과 유사하게 구현)
        const apiUrl = `http://122.40.46.59/api/transaction/history?limit=${limit}`;
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
          throw new Error(`거래 내역 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        
        // 응답 데이터 구조에 따라 조정
        const transactions = Array.isArray(data) ? data : data.transactions || [];
        
        set({
          transactions,
          lastUpdated: Date.now(),
          isLoading: false,
          isRefreshing: false,
          hasMore: transactions.length === limit, // 받은 데이터가 limit와 같으면 더 있을 가능성
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
      return state.transactions.filter(tx => tx.status === 'completed');
    },
    
    getTransactionsByType: (type: Transaction['type']) => {
      const state = get();
      return state.transactions.filter(tx => tx.type === type);
    },
  }))
);

// Selector hooks for optimal performance
export const useTransactions = () => useTransactionStore((state) => state.transactions);
export const useTransactionLoading = () => useTransactionStore((state) => ({
  isLoading: state.isLoading,
  isRefreshing: state.isRefreshing,
}));
export const usePendingTransactions = () => useTransactionStore((state) => state.getPendingTransactions());
export const useCompletedTransactions = () => useTransactionStore((state) => state.getCompletedTransactions());

// Action hooks
export const useTransactionActions = () => useTransactionStore((state) => ({
  fetchTransactions: state.fetchTransactions,
  refreshTransactions: state.refreshTransactions,
  addTransaction: state.addTransaction,
  updateTransaction: state.updateTransaction,
  reset: state.reset,
}));