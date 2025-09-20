import React from 'react';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WalletIcon, ArrowUpRightIcon, ArrowDownLeftIcon } from '../../components/icons';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  currency: 'XRP' | 'KRW' | 'USD';
  timestamp: string;
  status: 'completed' | 'pending';
  recipient?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: '1,500.00',
    currency: 'KRW',
    timestamp: '2025-09-20 14:30',
    status: 'completed',
    recipient: 'user123',
  },
  {
    id: '2',
    type: 'send',
    amount: '25.5',
    currency: 'XRP',
    timestamp: '2025-09-20 12:15',
    status: 'completed',
    recipient: 'user456',
  },
  {
    id: '3',
    type: 'receive',
    amount: '10.00',
    currency: 'USD',
    timestamp: '2025-09-19 16:45',
    status: 'pending',
    recipient: 'user789',
  },
];

export default function HomeScreen() {
  const { balance, loading } = useWalletBalance();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 잔고 카드 */}
      <LinearGradient
        colors={['#2563eb', '#9333ea']}
        style={styles.walletCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View style={styles.walletHeader}>
          <WalletIcon size={20} color="#ffffff" />
          <Text style={styles.walletTitle}>내 지갑</Text>
        </View>

        {/* XRP 잔고 */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceLeft}>
            <Text style={styles.currencyLabel}>XRP</Text>
            <Text style={styles.balanceAmount}>
              {loading ? '로딩 중...' : balance?.XRP?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>

        {/* KRW 잔고 */}
        <View style={styles.stablecoinContainer}>
          <View style={styles.stablecoinItem}>
            <Text style={styles.stablecoinLabel}>KRW</Text>
            <Text style={styles.stablecoinAmount}>
              {loading ? '로딩 중...' : `₩${balance?.KRW?.toLocaleString() || '0'}`}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* 최근 거래내역 */}
      <View style={styles.transactionCard}>
        <Text style={styles.transactionTitle}>최근 거래내역</Text>
        <View style={styles.transactionList}>
          {mockTransactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    transaction.type === 'send'
                      ? styles.sendIconContainer
                      : styles.receiveIconContainer,
                  ]}>
                  {transaction.type === 'send' ? (
                    <ArrowUpRightIcon size={16} color="#dc2626" />
                  ) : (
                    <ArrowDownLeftIcon size={16} color="#16a34a" />
                  )}
                </View>
                <View>
                  <Text style={styles.transactionType}>
                    {transaction.type === 'send' ? '보냄' : '받음'}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {transaction.timestamp}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'send'
                      ? styles.sendAmount
                      : styles.receiveAmount,
                  ]}>
                  {transaction.type === 'send' ? '-' : '+'}
                  {transaction.amount} {transaction.currency}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    transaction.status === 'completed'
                      ? styles.completedBadge
                      : styles.pendingBadge,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      transaction.status === 'completed'
                        ? styles.completedText
                        : styles.pendingText,
                    ]}>
                    {transaction.status === 'completed' ? '완료' : '대기중'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  walletCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLeft: {},
  currencyLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  fiatAmount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  changePercent: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  stablecoinContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  stablecoinItem: {
    flex: 1,
  },
  stablecoinLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  stablecoinAmount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionTitle: {
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
    backgroundColor: '#e5e7eb',
  },
  pendingBadge: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  completedText: {
    color: '#374151',
  },
  pendingText: {
    color: '#6b7280',
  },
});
