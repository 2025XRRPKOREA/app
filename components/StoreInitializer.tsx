import React, { useEffect } from 'react';
import { useAuthStore, useWalletStore } from '@/stores';

interface StoreInitializerProps {
  children: React.ReactNode;
}

export default function StoreInitializer({ children }: StoreInitializerProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const fetchBalance = useWalletStore((state) => state.fetchBalance);
  const startAutoRefresh = useWalletStore((state) => state.startAutoRefresh);
  const stopAutoRefresh = useWalletStore((state) => state.stopAutoRefresh);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 앱 시작 시 인증 상태 초기화
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 인증 상태에 따른 지갑 데이터 관리
  useEffect(() => {
    if (isAuthenticated) {
      // 로그인 시 지갑 잔고 조회 및 자동 새로고침 시작
      fetchBalance(true);
      startAutoRefresh();
    } else {
      // 로그아웃 시 자동 새로고침 정지
      stopAutoRefresh();
    }
  }, [isAuthenticated, fetchBalance, startAutoRefresh, stopAutoRefresh]);

  return <>{children}</>;
}