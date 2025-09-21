import React from 'react';
import { useWalletBalance, useWalletLoading } from '@/stores';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WalletIcon } from '../../components/icons';
import { TransactionList } from '../../components/TransactionList';


export default function HomeScreen() {
  const balance = useWalletBalance();
  const { isInitialLoading } = useWalletLoading();

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* 잔고 카드 */}
      <LinearGradient
        colors={['#2563eb', '#9333ea']}
        className="m-4 p-5 rounded-2xl mb-6"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View className="flex-row items-center mb-4">
          <WalletIcon size={20} color="#ffffff" />
          <Text className="text-white text-lg font-bold ml-2">내 지갑</Text>
        </View>

        {/* XRP 잔고 */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white/80 text-sm mb-1">XRP</Text>
            <Text className="text-white text-2xl font-bold">
              {isInitialLoading ? '로딩 중...' : balance?.XRP?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>

        {/* KRW & USD 잔고 */}
        <View className="flex-row pt-4 border-t border-white/20">
          <View className="flex-1">
            <Text className="text-white/80 text-sm mb-1">KRW</Text>
            <Text className="text-white text-base font-semibold">
              {isInitialLoading ? '로딩 중...' : `₩${balance?.KRW?.toLocaleString() || '0'}`}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white/80 text-sm mb-1">USD</Text>
            <Text className="text-white text-base font-semibold">
              {isInitialLoading ? '로딩 중...' : `$${balance?.USD?.toLocaleString() || '0'}`}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* 최근 거래내역 */}
      <View className="m-4 bg-white rounded-2xl p-5 shadow-sm shadow-black/10 elevation-2">
        <TransactionList limit={3} showCard={false} />
      </View>
    </ScrollView>
  );
}

