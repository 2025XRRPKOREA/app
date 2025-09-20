import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface WalletBalance {
  address: string;
  XRP: number;
  KRW: number;
}

export const useWalletBalance = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const response = await apiClient.get('/wallet/balance');
      setBalance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('잔고 조회 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    const interval = setInterval(fetchBalance, 3000);

    return () => clearInterval(interval);
  }, []);

  return { balance, loading };
};