import httpClient from './httpClient';
import { API_CONFIG } from '@/constants/config';

export interface WalletBalance {
  XRP?: number;
  KRW?: number;
  USD?: number;
  [key: string]: number | undefined;
}

export interface WalletAccount {
  address: string;
  publicKey?: string;
  balance: WalletBalance;
  accountInfo?: any;
}

export interface SendTransactionRequest {
  toAddress: string;
  amount: number;
  currency: string;
  memo?: string;
}

export interface SendTransactionResponse {
  transactionId: string;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  fee?: number;
}

class WalletService {
  /**
   * 지갑 잔고 조회
   */
  async getBalance(): Promise<WalletBalance> {
    try {
      const response = await httpClient.get<WalletBalance>('/api/wallet/balance');
      return response;
    } catch (error: any) {
      throw new Error(error.message || '잔고 조회에 실패했습니다.');
    }
  }

  /**
   * 지갑 계정 정보 조회
   */
  async getAccount(): Promise<WalletAccount> {
    try {
      const response = await httpClient.get<WalletAccount>('/api/wallet/account');
      return response;
    } catch (error: any) {
      throw new Error(error.message || '계정 정보 조회에 실패했습니다.');
    }
  }

  /**
   * KRW 잔고 조회 (IOU)
   */
  async getKrwBalance(): Promise<{ balance: number }> {
    try {
      const response = await httpClient.get<{ balance: number }>('/api/wallet/krw-balance');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'KRW 잔고 조회에 실패했습니다.');
    }
  }

  /**
   * XRP 송금
   */
  async sendXrp(request: SendTransactionRequest): Promise<SendTransactionResponse> {
    try {
      const response = await httpClient.post<SendTransactionResponse>(
        '/api/wallet/send-xrp',
        request
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'XRP 송금에 실패했습니다.');
    }
  }

  /**
   * KRW IOU 송금
   */
  async sendKrw(request: SendTransactionRequest): Promise<SendTransactionResponse> {
    try {
      const response = await httpClient.post<SendTransactionResponse>(
        '/api/wallet/send-krw',
        request
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'KRW 송금에 실패했습니다.');
    }
  }

  /**
   * 수수료 계산
   */
  async calculateFee(amount: number, currency: string): Promise<{ fee: number; estimatedTime: string }> {
    try {
      const response = await httpClient.get<{ fee: number; estimatedTime: string }>(
        '/api/wallet/calculate-fee',
        {
          params: { amount, currency }
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '수수료 계산에 실패했습니다.');
    }
  }

  /**
   * 지갑 주소 검증
   */
  async validateAddress(address: string): Promise<{ isValid: boolean; type?: string }> {
    try {
      const response = await httpClient.post<{ isValid: boolean; type?: string }>(
        '/api/wallet/validate-address',
        { address }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '주소 검증에 실패했습니다.');
    }
  }

  /**
   * 지갑 QR 코드 생성용 정보
   */
  async getReceiveInfo(): Promise<{ address: string; qrData: string }> {
    try {
      const response = await httpClient.get<{ address: string; qrData: string }>('/api/wallet/receive-info');
      return response;
    } catch (error: any) {
      throw new Error(error.message || '받기 정보 조회에 실패했습니다.');
    }
  }

  /**
   * 지갑 잠금/해제 (보안)
   */
  async lockWallet(): Promise<void> {
    try {
      await httpClient.post('/api/wallet/lock');
    } catch (error: any) {
      throw new Error(error.message || '지갑 잠금에 실패했습니다.');
    }
  }

  async unlockWallet(password: string): Promise<void> {
    try {
      await httpClient.post('/api/wallet/unlock', { password });
    } catch (error: any) {
      throw new Error(error.message || '지갑 잠금 해제에 실패했습니다.');
    }
  }

  /**
   * 지갑 백업 생성
   */
  async createBackup(): Promise<{ seed: string; backupData: string }> {
    try {
      const response = await httpClient.post<{ seed: string; backupData: string }>('/api/wallet/backup');
      return response;
    } catch (error: any) {
      throw new Error(error.message || '지갑 백업 생성에 실패했습니다.');
    }
  }

  /**
   * 지갑 복원
   */
  async restoreWallet(seed: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.post<{ success: boolean; message: string }>(
        '/api/wallet/restore',
        { seed }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || '지갑 복원에 실패했습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성
export const walletService = new WalletService();
export default walletService;