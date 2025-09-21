import { API_CONFIG } from '@/constants/config';

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number;
  timestamp: string;
}

export interface ConvertResponse {
  rate: number;
  convertedAmount: number;
  timestamp: string;
}

class ExchangeRateService {
  private rates: ExchangeRate[] = [];
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private subscribers: ((rates: ExchangeRate[]) => void)[] = [];

  // 기본 fallback 환율 (API 실패 시 사용)
  private fallbackRates: ExchangeRate[] = [
    { from: 'XRP', to: 'KRW', rate: 4162, change: 0, timestamp: new Date().toISOString() },
    { from: 'KRW', to: 'XRP', rate: 0.00024038, change: 0, timestamp: new Date().toISOString() }, // 1/4162
  ];

  constructor() {
    this.rates = [...this.fallbackRates];
  }

  // 환율 변환 API 호출
  async convertKrwToXrp(krwAmount: number): Promise<ConvertResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/transaction/convert/krw-to-xrp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ krwAmount }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      // 실시간 환율 계산: xrpAmount/krwAmount
      let rate: number;
      let convertedAmount: number;
      
      if (data.xrpAmount && data.krwAmount && data.krwAmount !== 0) {
        rate = data.xrpAmount / data.krwAmount;
        convertedAmount = krwAmount * rate;
      } else {
        // API 응답에 필요한 필드가 없거나 0인 경우 fallback 사용
        rate = data.rate || this.getCurrentRate('KRW', 'XRP');
        convertedAmount = data.convertedAmount || krwAmount * rate;
      }
      
      return {
        rate,
        convertedAmount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('KRW to XRP conversion API failed, using fallback:', error);
      const rate = this.getCurrentRate('KRW', 'XRP');
      return {
        rate,
        convertedAmount: krwAmount * rate,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async convertXrpToKrw(xrpAmount: number): Promise<ConvertResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/transaction/convert/xrp-to-krw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xrpAmount }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      // 실시간 환율 계산: krwAmount/xrpAmount
      let rate: number;
      let convertedAmount: number;
      
      if (data.krwAmount && data.xrpAmount && data.xrpAmount !== 0) {
        rate = data.krwAmount / data.xrpAmount;
        convertedAmount = xrpAmount * rate;
      } else {
        // API 응답에 필요한 필드가 없거나 0인 경우 fallback 사용
        rate = data.rate || this.getCurrentRate('XRP', 'KRW');
        convertedAmount = data.convertedAmount || xrpAmount * rate;
      }
      
      return {
        rate,
        convertedAmount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('XRP to KRW conversion API failed, using fallback:', error);
      const rate = this.getCurrentRate('XRP', 'KRW');
      return {
        rate,
        convertedAmount: xrpAmount * rate,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 현재 환율 조회
  getCurrentRate(from: string, to: string): number {
    const rate = this.rates.find(r => r.from === from && r.to === to);
    return rate ? rate.rate : 0;
  }

  // 모든 환율 조회
  getAllRates(): ExchangeRate[] {
    return [...this.rates];
  }

  // 환율 업데이트 (API에서 최신 환율 가져오기)
  async updateRates(): Promise<void> {
    try {
      // 두 API 모두 호출하여 정확한 환율 얻기
      const [xrpToKrwResult, krwToXrpResult] = await Promise.all([
        this.convertXrpToKrw(1), // 1 XRP -> KRW
        this.convertKrwToXrp(1), // 1 KRW -> XRP
      ]);

      // 기존 환율과 비교하여 변화율 계산
      const oldXrpToKrw = this.getCurrentRate('XRP', 'KRW');
      const oldKrwToXrp = this.getCurrentRate('KRW', 'XRP');

      const xrpToKrwChange = oldXrpToKrw > 0 ? ((xrpToKrwResult.rate - oldXrpToKrw) / oldXrpToKrw) * 100 : 0;
      const krwToXrpChange = oldKrwToXrp > 0 ? ((krwToXrpResult.rate - oldKrwToXrp) / oldKrwToXrp) * 100 : 0;

      this.rates = [
        {
          from: 'XRP',
          to: 'KRW',
          rate: xrpToKrwResult.rate,
          change: Number(xrpToKrwChange.toFixed(2)),
          timestamp: xrpToKrwResult.timestamp,
        },
        {
          from: 'KRW',
          to: 'XRP',
          rate: krwToXrpResult.rate,
          change: Number(krwToXrpChange.toFixed(2)),
          timestamp: krwToXrpResult.timestamp,
        },
      ];

      // 구독자들에게 업데이트 알림
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      // 실패 시 fallback 환율 사용
      this.rates = [...this.fallbackRates];
      this.notifySubscribers();
    }
  }

  // 자동 업데이트 시작 (30초마다)
  startAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // 즉시 한 번 업데이트
    this.updateRates();

    // 30초마다 업데이트
    this.updateInterval = setInterval(() => {
      this.updateRates();
    }, 30000);
  }

  // 자동 업데이트 중지
  stopAutoUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // 환율 변경 구독
  subscribe(callback: (rates: ExchangeRate[]) => void): () => void {
    this.subscribers.push(callback);
    
    // 구독 해제 함수 반환
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // 구독자들에게 알림
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback([...this.rates]);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // 수동 새로고침
  async refresh(): Promise<void> {
    await this.updateRates();
  }
}

// 싱글톤 인스턴스
export const exchangeRateService = new ExchangeRateService();
export default exchangeRateService;