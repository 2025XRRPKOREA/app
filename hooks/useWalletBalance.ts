import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { ApiWalletBalanceGet200Response } from '../api';

export const useWalletBalance = () => {
  const [balance, setBalance] = useState<ApiWalletBalanceGet200Response | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const response = await apiClient.getWalletBalance();
      setBalance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('잔고 조회 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    const interval = setInterval(fetchBalance, 30000); // 30초로 변경

    return () => clearInterval(interval);
  }, []);

  return { balance, loading };
};