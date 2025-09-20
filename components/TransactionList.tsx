import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRightIcon, ArrowDownLeftIcon } from './icons';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

interface TransactionListProps {
  limit?: number;
  showRefresh?: boolean;
  title?: string;
  onRefresh?: () => void;
  showCard?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  limit = 10,
  showRefresh = false,
  title = '최근 거래내역',
  onRefresh,
  showCard = false
}) => {
  const { transactions, loading, error, refreshTransactions } = useTransactionHistory(limit);

  const handleRefresh = () => {
    refreshTransactions();
    onRefresh?.();
  };

  // 날짜 포맷팅 함수 (transaction.tsx에서 가져옴)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${month}월 ${day}일 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <View style={showCard ? styles.cardContainer : styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.transactionList}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>거래내역을 불러올 수 없습니다</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>거래내역이 없습니다</Text>
          </View>
        ) : (
          transactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    transaction.type === 'sent'
                      ? styles.sendIconContainer
                      : styles.receiveIconContainer,
                  ]}>
                  {transaction.type === 'sent' ? (
                    <ArrowUpRightIcon size={16} color="#dc2626" />
                  ) : (
                    <ArrowDownLeftIcon size={16} color="#16a34a" />
                  )}
                </View>
                <View>
                  <Text style={styles.transactionType}>
                    {transaction.type === 'sent' ? '보냄' : '받음'}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {formatDate(transaction.timestamp)}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'sent'
                      ? styles.sendAmount
                      : styles.receiveAmount,
                  ]}>
                  {transaction.type === 'sent' ? '-' : '+'}
                  {transaction.currency === 'KRW' ? '₩' : transaction.currency === 'USD' ? '$' : ''}
                  {transaction.price.toLocaleString()}
                </Text>
                <Text style={styles.transactionCurrency}>
                  {transaction.currency}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    transaction.status === 'completed'
                      ? styles.completedBadge
                      : transaction.status === 'pending'
                      ? styles.pendingBadge
                      : styles.failedBadge,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      transaction.status === 'completed'
                        ? styles.completedText
                        : transaction.status === 'pending'
                        ? styles.pendingText
                        : styles.failedText,
                    ]}>
                    {transaction.status === 'completed' ? '완료' :
                     transaction.status === 'failed' ? '실패' : '대기중'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  cardContainer: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  transactionList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sendIconContainer: {
    backgroundColor: '#fef2f2',
  },
  receiveIconContainer: {
    backgroundColor: '#f0fdf4',
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCurrency: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  sendAmount: {
    color: '#dc2626',
  },
  receiveAmount: {
    color: '#16a34a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  failedBadge: {
    backgroundColor: '#fecaca',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  completedText: {
    color: '#065f46',
  },
  pendingText: {
    color: '#92400e',
  },
  failedText: {
    color: '#991b1b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});