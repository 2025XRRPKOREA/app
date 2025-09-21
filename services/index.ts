// HTTP Client
export { default as httpClient } from './httpClient';
export type { ApiError, ApiResponse } from './httpClient';

// Service Layer
export { default as authService } from './authService';
export type {
  AuthResponse, LoginRequest,
  RegisterRequest, User
} from './authService';

export { default as walletService } from './walletService';
export type {
  SendTransactionRequest,
  SendTransactionResponse, WalletAccount, WalletBalance
} from './walletService';

export { default as transactionService } from './transactionService';
export type {
  CreateTransactionRequest,
  ExchangeRequest,
  ExchangeResponse, Transaction,
  TransactionFilter,
  TransactionHistory
} from './transactionService';

// Legacy API Client (for gradual migration)
export { default as apiClient } from './apiClient';
