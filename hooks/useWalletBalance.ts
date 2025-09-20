import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { ApiWalletBalanceGet200Response } from '../api';

export const useWalletBalance = () => {
  const [balance, setBalance] = useState<ApiWalletBalanceGet200Response | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      
      // 직접 API 호출로 변경 (거래내역과 동일한 방식)
      const apiUrl = 'http://122.40.46.59/api/wallet/balance';
      const token = apiClient.getCurrentToken();
      
      console.log('토큰 상태:', token ? '있음' : '없음');
      
      if (!token) {
        console.error('토큰이 없습니다. 로그인이 필요합니다.');
        setLoading(false);
        return;
      }
      
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
      setBalance(data);
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