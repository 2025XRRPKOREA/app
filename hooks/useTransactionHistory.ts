import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export interface TransactionHistoryItem {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  currency: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  fromAddress?: string;
  toAddress?: string;
}

export const useTransactionHistory = (limit: number = 10) => {
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getTransactionHistory(limit);

      // API 응답을 우리 인터페이스에 맞게 변환
      const formattedTransactions: TransactionHistoryItem[] = response.data.map((item: any) => ({
        id: item.id || item.transactionId || Math.random().toString(),
        type: item.type === 'debit' ? 'sent' : 'received',
        amount: item.amount || '0',
        currency: item.currency || 'KRW',
        timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
        status: item.status === 'success' ? 'completed' : item.status || 'completed',
        fromAddress: item.fromAddress,
        toAddress: item.toAddress,
      }));

      setTransactions(formattedTransactions);
    } catch (err: any) {
      console.error('거래내역 조회 실패:', err);
      setError(err.message || '거래내역을 불러올 수 없습니다.');

      // 에러 시 빈 배열로 설정
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [limit]);

  const refreshTransactions = () => {
    fetchTransactionHistory();
  };

  return {
    transactions,
    loading,
    error,
    refreshTransactions
  };
};