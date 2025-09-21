// HTTP Client
export { default as httpClient } from './httpClient';
export type { ApiResponse, ApiError } from './httpClient';

// Service Layer
export { default as authService } from './authService';
export type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from './authService';

export { default as walletService } from './walletService';
export type { 
  WalletBalance, 
  WalletAccount, 
  SendTransactionRequest, 
  SendTransactionResponse 
} from './walletService';

export { default as transactionService } from './transactionService';
export type { 
  Transaction, 
  TransactionFilter, 
  TransactionHistory, 
  CreateTransactionRequest, 
  ExchangeRequest, 
  ExchangeResponse 
} from './transactionService';

// Legacy API Client (for gradual migration)
export { default as apiClient } from './apiClient';