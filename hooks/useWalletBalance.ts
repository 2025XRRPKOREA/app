import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { ApiWalletBalanceGet200Response } from '../api';

export const useWalletBalance = () => {
  const [balance, setBalance] = useState<ApiWalletBalanceGet200Response | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBalance = async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      // 직접 API 호출로 변경 (거래내역과 동일한 방식)
      const apiUrl = 'http://122.40.46.59/api/wallet/balance';
      const token = apiClient.getCurrentToken();
      
      console.log('토큰 상태:', token ? '있음' : '없음');
      
      if (!token) {
        console.error('토큰이 없습니다. 로그인이 필요합니다.');
        setIsInitialLoading(false);
        setIsRefreshing(false);
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
      setIsInitialLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('잔고 조회 실패:', error);
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBalance(true); // 초기 로딩

    const interval = setInterval(() => fetchBalance(false), 30000); // 백그라운드 새로고침

    return () => clearInterval(interval);
  }, []);

  return { balance, isInitialLoading, isRefreshing };
};