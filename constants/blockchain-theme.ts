// XRP & Blockchain 테마 색상 시스템
export const BlockchainColors = {
  // XRP 공식 브랜드 컬러
  xrp: {
    primary: '#00AA87',      // XRP 메인 컬러
    secondary: '#0085C7',    // XRP 보조 컬러
    accent: '#FF6B35',       // 강조 컬러
    light: '#E6F7F4',       // 연한 배경
    dark: '#004D40',        // 진한 배경
  },

  // 블록체인 상태 컬러
  network: {
    connected: '#10B981',    // 연결됨
    connecting: '#F59E0B',   // 연결 중
    disconnected: '#EF4444', // 연결 끊김
    syncing: '#8B5CF6',     // 동기화 중
  },

  // 트랜잭션 상태
  transaction: {
    pending: '#F59E0B',      // 대기 중
    confirmed: '#10B981',    // 확인됨
    failed: '#EF4444',       // 실패
    processing: '#8B5CF6',   // 처리 중
  },

  // 보안/신뢰 컬러
  security: {
    secure: '#059669',       // 보안
    warning: '#D97706',      // 경고
    danger: '#DC2626',       // 위험
    verified: '#2563EB',     // 검증됨
  },

  // 그라데이션
  gradients: {
    xrpPrimary: ['#00AA87', '#0085C7'],
    blockchain: ['#667EEA', '#764BA2'],
    success: ['#10B981', '#059669'],
    warning: ['#F59E0B', '#D97706'],
  }
};

// 블록체인 테마 스타일
export const BlockchainTheme = {
  colors: BlockchainColors,

  // 블록체인 특화 스타일
  styles: {
    // 카드 스타일
    blockchainCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      shadowColor: BlockchainColors.xrp.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: BlockchainColors.xrp.light,
    },

    // 네트워크 상태 인디케이터
    networkIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },

    // 블록체인 버튼
    blockchainButton: {
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },

  // 애니메이션 설정
  animations: {
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    timing: {
      duration: 300,
      easing: 'ease-out',
    },
    pulse: {
      duration: 1500,
      iterations: -1,
    },
  },
};

// 네트워크 상태별 컬러 헬퍼
export const getNetworkStatusColor = (status: 'connected' | 'connecting' | 'disconnected' | 'syncing') => {
  return BlockchainColors.network[status];
};

// 트랜잭션 상태별 컬러 헬퍼
export const getTransactionStatusColor = (status: 'pending' | 'confirmed' | 'failed' | 'processing') => {
  return BlockchainColors.transaction[status];
};