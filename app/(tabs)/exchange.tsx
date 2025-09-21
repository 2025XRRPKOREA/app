import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ArrowLeftRightIcon, ChartIcon, RefreshIcon } from '../../components/icons';
import { exchangeRateService, ExchangeRate } from '../../services/exchangeRateService';

interface ExchangeHistory {
  id: string;
  from: string;
  to: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}


const mockHistory: ExchangeHistory[] = [
  {
    id: '1',
    from: 'XRP',
    to: 'KRW',
    fromAmount: '100',
    toAmount: '150,450',
    rate: 1504.5,
    timestamp: '2025-09-20 14:30',
    status: 'completed',
  },
  {
    id: '2',
    from: 'KRW',
    to: 'XRP',
    fromAmount: '50,000',
    toAmount: '33.25',
    rate: 1504.5,
    timestamp: '2025-09-19 16:20',
    status: 'completed',
  },
];

// 환율 포맷팅 함수 - 소수점 자릿수를 적절히 표시
const formatExchangeRate = (rate: number): string => {
  if (rate === 0 || isNaN(rate) || !isFinite(rate)) return '0';
  
  // XRP 관련 환율 (매우 작은 값)은 더 많은 소수점 자릿수 표시
  if (rate < 0.001) {
    return rate.toFixed(8); // 8자리 소수점
  }
  // KRW 관련 환율 (큰 값)은 소수점 2자리
  else if (rate > 100) {
    return rate.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
  // 중간 값은 4자리 소수점
  else {
    return rate.toFixed(4);
  }
};

export default function ExchangeScreen() {
  const [fromCurrency, setFromCurrency] = useState<'XRP' | 'KRW'>('XRP');
  const [amount, setAmount] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastAnimation] = useState(new Animated.Value(0));

  // 자동으로 받을 통화 결정: KRW -> XRP, XRP -> KRW
  const toCurrency = fromCurrency === 'KRW' ? 'XRP' : 'KRW';

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000), // 3초 동안 표시
      Animated.timing(toastAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  // 환율 서비스 초기화 및 구독
  useEffect(() => {
    // 초기 환율 로드
    setExchangeRates(exchangeRateService.getAllRates());
    
    // 환율 업데이트 구독
    const unsubscribe = exchangeRateService.subscribe((rates) => {
      setExchangeRates(rates);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    });

    // 자동 업데이트 시작
    exchangeRateService.startAutoUpdate();

    return () => {
      unsubscribe();
      exchangeRateService.stopAutoUpdate();
    };
  }, []);

  const getCurrentRate = () => {
    const rate = exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency);
    return rate ? rate.rate : 0;
  };

  const getEstimatedAmount = () => {
    if (!amount) return '0';
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0';
    
    const rate = getCurrentRate();
    if (!rate || isNaN(rate)) return '0';
    
    const result = numAmount * rate;
    if (isNaN(result) || !isFinite(result)) return '0';
    
    return result.toLocaleString();
  };

  const handleSwapCurrencies = () => {
    // 토글 방식: KRW ↔ XRP
    setFromCurrency(fromCurrency === 'KRW' ? 'XRP' : 'KRW');
  };

  const handleExchange = async () => {
    if (!amount) return;

    setIsLoading(true);
    try {
      const amountNum = parseFloat(amount);
      let result;
      
      if (fromCurrency === 'KRW') {
        result = await exchangeRateService.convertKrwToXrp(amountNum);
      } else {
        result = await exchangeRateService.convertXrpToKrw(amountNum);
      }

      const convertedAmountStr = result.convertedAmount < 0.001 
        ? formatExchangeRate(result.convertedAmount)
        : (isNaN(result.convertedAmount) ? '0' : result.convertedAmount.toLocaleString());
      
      showToastMessage(
        `✅ ${amount} ${fromCurrency} → ${convertedAmountStr} ${toCurrency} 환전 완료!`,
        'success'
      );
      setAmount('');
    } catch (error) {
      showToastMessage('❌ 환전 실패, 다시 시도해주세요', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshRates = async () => {
    setIsLoading(true);
    await exchangeRateService.refresh();
  };

  const CurrencySelector = ({
    value,
    onSelect,
    id,
  }: {
    value: string;
    onSelect: (currency: 'XRP' | 'KRW') => void;
    id: string;
  }) => {
    const currencies = ['XRP', 'KRW'];
    const isOpen = activeDropdown === id;

    const handleToggle = () => {
      setActiveDropdown(isOpen ? null : id);
    };

    const handleSelect = (currency: 'XRP' | 'KRW') => {
      onSelect(currency);
      setActiveDropdown(null);
    };

    return (
      <View className="relative z-[5000]">
        <TouchableOpacity 
          className="bg-gray-50 border border-gray-300 rounded-lg py-3 px-3 flex-row items-center justify-between"
          onPress={handleToggle}
        >
          <Text className="text-sm font-semibold text-gray-700">{value}</Text>
          <View className={`ml-1 ${isOpen ? 'rotate-180' : ''}`}>
            <Text className="text-xs text-gray-500">▼</Text>
          </View>
        </TouchableOpacity>
        
        {isOpen && (
          <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-[50000]">
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                className={`py-3 px-4 flex-row justify-between items-center ${
                  currency === value ? 'bg-gray-100' : ''
                }`}
                onPress={() => handleSelect(currency as 'XRP' | 'KRW')}
              >
                <Text className={`text-sm ${
                  currency === value 
                    ? 'font-semibold text-blue-600' 
                    : 'text-gray-700'
                }`}>
                  {currency}
                </Text>
                {currency === value && (
                  <Text className="text-sm text-blue-600 font-bold">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>
      {/* 환전 폼 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row items-center p-5 pb-0">
          <RefreshIcon size={20} color="#1f2937" />
          <Text className="text-lg font-bold text-gray-800 ml-2">환전</Text>
          {lastUpdated && (
            <Text className="text-xs text-gray-500 ml-auto">마지막 업데이트: {lastUpdated}</Text>
          )}
        </View>
        <View className="p-5">
          <View className="z-[1000]">
            {/* From 섹션 */}
            <View className="mb-4 z-[10000]">
              <Text className="text-sm font-semibold text-gray-700 mb-2">보낼 통화</Text>
              <View className="flex-row gap-2 items-center">
                <View className="w-20 z-[5000]">
                  <CurrencySelector
                    value={fromCurrency}
                    onSelect={setFromCurrency}
                    id="from"
                  />
                </View>
                <TextInput
                  className="flex-1 border border-gray-300 rounded-lg py-3 px-4 text-base text-gray-800 bg-white"
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* 스왑 버튼 */}
            <View className="items-center my-4">
              <TouchableOpacity 
                className="w-10 h-10 rounded-full border border-gray-300 bg-white justify-center items-center shadow-sm" 
                onPress={handleSwapCurrencies}
              >
                <ArrowLeftRightIcon size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* To 섹션 */}
            <View className="mb-4 z-[1000]">
              <Text className="text-sm font-semibold text-gray-700 mb-2">받을 통화</Text>
              <View className="flex-row gap-2 items-center">
                <View className="w-20 bg-gray-50 border border-gray-300 rounded-lg py-3 px-3 justify-center items-center">
                  <Text className="text-sm font-semibold text-gray-500">{toCurrency}</Text>
                </View>
                <View className="flex-1 bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 justify-center">
                  <Text className="text-base text-gray-500 font-medium">{getEstimatedAmount()}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 환율 정보 */}
          {getCurrentRate() > 0 && (
            <View className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">현재 환율</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  1 {fromCurrency} = {formatExchangeRate(getCurrentRate())} {toCurrency}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            className={`py-3 px-6 rounded-lg items-center ${
              (!amount || getCurrentRate() === 0 || isLoading) 
                ? 'bg-gray-300' 
                : 'bg-blue-600'
            }`}
            onPress={handleExchange}
            disabled={!amount || getCurrentRate() === 0 || isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-semibold">환전하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 실시간 환율 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row items-center p-5 pb-0">
          <ChartIcon size={20} color="#1f2937" />
          <Text className="text-lg font-bold text-gray-800 ml-2">실시간 환율</Text>
          <TouchableOpacity
            className="ml-auto p-2 rounded-md bg-gray-50 border border-gray-300"
            onPress={handleRefreshRates}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <RefreshIcon size={16} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
        <View className="p-5">
          {exchangeRates.map((rate, index) => (
            <View key={index} className="flex-row justify-between items-center p-3 bg-gray-50 rounded-xl mb-3">
              <View>
                <Text className="text-sm font-semibold text-gray-800 mb-1">
                  {rate.from} → {rate.to}
                </Text>
                <Text className="text-base font-bold text-gray-800">{formatExchangeRate(rate.rate)}</Text>
              </View>
              <View
                className={`px-2 py-1 rounded-xl ${
                  rate.change >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                <Text
                  className={`text-xs font-semibold ${
                    rate.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {rate.change >= 0 ? '+' : ''}
                  {rate.change}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 환전 내역 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row items-center p-5 pb-0">
          <Text className="text-lg font-bold text-gray-800">최근 환전 내역</Text>
        </View>
        <View className="p-5">
          {mockHistory.map(history => (
            <View key={history.id} className="flex-row justify-between items-center p-3 bg-gray-50 rounded-xl mb-3">
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mr-3">
                  <RefreshIcon size={16} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                    {history.from} → {history.to}
                  </Text>
                  <Text className="text-xs text-gray-500">{history.timestamp}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                  {history.fromAmount} {history.from}
                </Text>
                <Text className="text-xs text-gray-500 mb-1">
                  → {history.toAmount} {history.to}
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-xl ${
                    history.status === 'completed' 
                      ? 'bg-gray-200' 
                      : history.status === 'pending' 
                      ? 'bg-yellow-100' 
                      : 'bg-red-100'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      history.status === 'completed' 
                        ? 'text-gray-700' 
                        : history.status === 'pending' 
                        ? 'text-yellow-700' 
                        : 'text-red-600'
                    }`}>
                    {history.status === 'completed'
                      ? '완료'
                      : history.status === 'pending'
                      ? '처리중'
                      : '실패'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View
          className={`absolute top-15 left-5 right-5 px-5 py-3 rounded-xl z-[1000] shadow-lg ${
            toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          style={{
            opacity: toastAnimation,
            transform: [
              {
                translateY: toastAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}>
          <Text className="text-white text-base font-semibold text-center">{toastMessage}</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

