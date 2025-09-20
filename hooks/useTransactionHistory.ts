import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export interface TransactionHistoryItem {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  currency: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  price: number;
  isSuccess: boolean;
  isReceiver: boolean;
}

export const useTransactionHistory = (limit: number = 10) => {
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 직접 API 호출로 변경 (해커톤 모드)
      const apiUrl = `http://122.40.46.59/api/transaction/history?page=1&size=${limit}`;
      const token = apiClient.getCurrentToken();
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();

      // API 응답을 우리 인터페이스에 맞게 변환
      const formattedTransactions: TransactionHistoryItem[] = data.map((item: any, index: number) => ({
        id: `${item.transactionDate}-${index}`, // 고유 ID 생성
        type: item.isReceiver ? 'received' : 'sent',
        amount: item.amount,
        currency: item.iou,
        timestamp: item.transactionDate,
        status: item.isSuccess ? 'completed' : 'failed',
        price: item.price,
        isSuccess: item.isSuccess,
        isReceiver: item.isReceiver,
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