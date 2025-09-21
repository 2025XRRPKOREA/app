import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View className={showCard ? "m-4 bg-white rounded-2xl p-5 shadow-sm shadow-black/10 elevation-2 gap-3" : "gap-3"}>
      <Text className="text-lg font-bold mb-4 text-gray-800">{title}</Text>
      <View className="gap-3">
        {error ? (
          <View className="items-center p-5">
            <Text className="text-sm text-red-600 mb-3 text-center">거래내역을 불러올 수 없습니다</Text>
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-lg"
              onPress={handleRefresh}>
              <Text className="text-white text-sm font-semibold">다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 && !loading ? (
          <View className="items-center justify-center py-8">
            <Text className="text-sm text-gray-500">거래내역이 없습니다</Text>
          </View>
        ) : (
          transactions.map(transaction => (
            <View key={transaction.id} className="flex-row justify-between items-center p-3 bg-gray-50 rounded-xl">
              <View className="flex-row items-center flex-1">
                <View
                  className={`w-8 h-8 rounded-2xl justify-center items-center mr-3 ${
                    transaction.type === 'sent' ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                  {transaction.type === 'sent' ? (
                    <ArrowUpRightIcon size={16} color="#dc2626" />
                  ) : (
                    <ArrowDownLeftIcon size={16} color="#16a34a" />
                  )}
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                    {transaction.type === 'sent' ? '보냄' : '받음'}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text
                  className={`text-sm font-semibold mb-0.5 ${
                    transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                  }`}>
                  {transaction.type === 'sent' ? '-' : '+'}
                  {transaction.currency === 'KRW' ? '₩' : transaction.currency === 'USD' ? '$' : ''}
                  {transaction.price.toLocaleString()}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">
                  {transaction.currency}
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-xl ${
                    transaction.status === 'completed'
                      ? 'bg-green-100'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      transaction.status === 'completed'
                        ? 'text-green-800'
                        : transaction.status === 'pending'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
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
