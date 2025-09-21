import httpClient from './httpClient';
import { API_CONFIG } from '@/constants/config';

export interface Transaction {
  id: string;
  hash?: string;
  type: 'send' | 'receive' | 'exchange';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  fee?: number;
  fromAddress?: string;
  toAddress?: string;
  memo?: string;
  timestamp: string;
  confirmations?: number;
  blockHeight?: number;
  
  // 상대방 정보 (UI 표시용)
  counterpartyName?: string;
  counterpartyAddress?: string;
  
  // 환율 정보 (환전 거래인 경우)
  exchangeRate?: number;
  fromCurrency?: string;
  toCurrency?: string;
  originalAmount?: number;
}

export interface TransactionFilter {
  type?: 'send' | 'receive' | 'exchange';
  status?: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  currency?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface TransactionHistory {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
}

export interface CreateTransactionRequest {
  type: 'send' | 'receive';
  toAddress: string;
  amount: number;
  currency: string;
  memo?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface ExchangeRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  slippage?: number; // 슬리피지 허용도 (%)
}

export interface ExchangeResponse {
  transactionId: string;
  rate: number;
  fromAmount: number;
  toAmount: number;
  fee: number;
  estimatedTime: string;
  status: 'pending' | 'confirmed' | 'failed';
}

class TransactionService {
  /**
   * 거래 내역 조회
   */
  async getTransactions(filter?: TransactionFilter): Promise<TransactionHistory> {
    try {
      const response = await httpClient.get<TransactionHistory>(
        API_CONFIG.ENDPOINTS.TRANSACTIONS.LIST,
        { params: filter }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '거래 내역 조회에 실패했습니다.');
    }
  }

  /**
   * 특정 거래 상세 조회
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const response = await httpClient.get<Transaction>(`/api/transactions/${transactionId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || '거래 상세 조회에 실패했습니다.');
    }
  }

  /**
   * 새 거래 생성 (송금)
   */
  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    try {
      const response = await httpClient.post<Transaction>(
        API_CONFIG.ENDPOINTS.TRANSACTIONS.SEND,
        request
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '거래 생성에 실패했습니다.');
    }
  }

  /**
   * 환전 거래 생성
   */
  async exchangeCurrency(request: ExchangeRequest): Promise<ExchangeResponse> {
    try {
      const response = await httpClient.post<ExchangeResponse>(
        API_CONFIG.ENDPOINTS.EXCHANGE.SWAP,
        request
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '환전에 실패했습니다.');
    }
  }

  /**
   * 현재 환율 조회
   */
  async getExchangeRates(): Promise<{ [key: string]: number }> {
    try {
      const response = await httpClient.get<{ [key: string]: number }>(
        API_CONFIG.ENDPOINTS.EXCHANGE.RATES
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '환율 조회에 실패했습니다.');
    }
  }

  /**
   * 특정 통화 쌍의 환율 조회
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<{ rate: number; timestamp: string }> {
    try {
      const response = await httpClient.get<{ rate: number; timestamp: string }>(
        `${API_CONFIG.ENDPOINTS.EXCHANGE.RATES}/${fromCurrency}/${toCurrency}`
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '환율 조회에 실패했습니다.');
    }
  }

  /**
   * 거래 상태 추적
   */
  async trackTransaction(transactionId: string): Promise<Transaction> {
    try {
      const response = await httpClient.get<Transaction>(`/api/transactions/${transactionId}/status`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || '거래 상태 조회에 실패했습니다.');
    }
  }

  /**
   * 거래 취소 (가능한 경우)
   */
  async cancelTransaction(transactionId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.post<{ success: boolean; message: string }>(
        `/api/transactions/${transactionId}/cancel`
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '거래 취소에 실패했습니다.');
    }
  }

  /**
   * 거래 수수료 예상
   */
  async estimateFee(
    currency: string, 
    amount: number, 
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<{ fee: number; estimatedTime: string }> {
    try {
      const response = await httpClient.get<{ fee: number; estimatedTime: string }>(
        '/api/transactions/estimate-fee',
        {
          params: { currency, amount, priority }
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '수수료 예상에 실패했습니다.');
    }
  }

  /**
   * QR 코드로 거래 정보 파싱
   */
  async parseQrCode(qrData: string): Promise<{
    address: string;
    amount?: number;
    currency?: string;
    memo?: string;
  }> {
    try {
      const response = await httpClient.post<{
        address: string;
        amount?: number;
        currency?: string;
        memo?: string;
      }>('/api/transactions/parse-qr', { qrData });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'QR 코드 분석에 실패했습니다.');
    }
  }

  /**
   * 거래 내역 내보내기 (CSV, PDF 등)
   */
  async exportTransactions(
    format: 'csv' | 'pdf',
    filter?: TransactionFilter
  ): Promise<{ downloadUrl: string; fileName: string }> {
    try {
      const response = await httpClient.post<{ downloadUrl: string; fileName: string }>(
        '/api/transactions/export',
        { format, filter }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '거래 내역 내보내기에 실패했습니다.');
    }
  }

  /**
   * 통계 데이터 조회
   */
  async getTransactionStats(period: 'week' | 'month' | 'year'): Promise<{
    totalSent: number;
    totalReceived: number;
    totalFees: number;
    transactionCount: number;
    averageAmount: number;
    topCurrencies: Array<{ currency: string; count: number; amount: number }>;
  }> {
    try {
      const response = await httpClient.get<{
        totalSent: number;
        totalReceived: number;
        totalFees: number;
        transactionCount: number;
        averageAmount: number;
        topCurrencies: Array<{ currency: string; count: number; amount: number }>;
      }>(`/api/transactions/stats/${period}`);
      return response;
    } catch (error: any) {
      throw new Error(error.message || '통계 조회에 실패했습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성
export const transactionService = new TransactionService();
export default transactionService;