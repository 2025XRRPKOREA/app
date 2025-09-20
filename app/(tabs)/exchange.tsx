import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RefreshIcon, ArrowLeftRightIcon, ChartIcon } from '../../components/icons';
import exchangeRateService, { ExchangeRate } from '../../services/exchangeRateService';

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

export default function ExchangeScreen() {
  const [fromCurrency, setFromCurrency] = useState<'XRP' | 'KRW'>('XRP');
  const [amount, setAmount] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 자동으로 받을 통화 결정: KRW -> XRP, XRP -> KRW
  const toCurrency = fromCurrency === 'KRW' ? 'XRP' : 'KRW';

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
    const rate = getCurrentRate();
    const result = parseFloat(amount) * rate;
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

      Alert.alert(
        '환전 완료',
        `${amount} ${fromCurrency}를 ${result.convertedAmount.toLocaleString()} ${toCurrency}로 환전 요청이 완료되었습니다.\n\n환율: ${result.rate.toLocaleString()}`
      );
      setAmount('');
    } catch (error) {
      Alert.alert('환전 실패', '환전 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
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
      <View style={styles.currencyDropdownContainer}>
        <TouchableOpacity 
          style={styles.currencyPickerButton}
          onPress={handleToggle}
        >
          <Text style={styles.currencyPickerText}>{value}</Text>
          <View style={[styles.dropdownArrow, isOpen && styles.dropdownArrowOpen]}>
            <Text style={styles.dropdownArrowText}>▼</Text>
          </View>
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.currencyDropdown}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                style={[
                  styles.currencyDropdownItem,
                  currency === value && styles.currencyDropdownItemSelected
                ]}
                onPress={() => handleSelect(currency as 'XRP' | 'KRW')}
              >
                <Text style={[
                  styles.currencyDropdownText,
                  currency === value && styles.currencyDropdownTextSelected
                ]}>
                  {currency}
                </Text>
                {currency === value && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 환전 폼 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <RefreshIcon size={20} color="#1f2937" />
          <Text style={styles.cardTitle}>환전</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdated}>마지막 업데이트: {lastUpdated}</Text>
          )}
        </View>
        <View style={styles.cardContent}>
          <View style={styles.exchangeFormContainer}>
            {/* From 섹션 */}
            <View style={[styles.inputSection, styles.fromSection]}>
              <Text style={styles.sectionLabel}>보낼 통화</Text>
              <View style={styles.inputRowContainer}>
                <View style={styles.currencySelectContainer}>
                  <CurrencySelector
                    value={fromCurrency}
                    onSelect={setFromCurrency}
                    id="from"
                  />
                </View>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* 스왑 버튼 */}
            <View style={styles.swapButtonContainer}>
              <TouchableOpacity style={styles.swapButton} onPress={handleSwapCurrencies}>
                <ArrowLeftRightIcon size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* To 섹션 */}
            <View style={[styles.inputSection, styles.toSection]}>
              <Text style={styles.sectionLabel}>받을 통화</Text>
              <View style={styles.inputRowContainer}>
                <View style={styles.fixedCurrencyContainer}>
                  <Text style={styles.fixedCurrencyText}>{toCurrency}</Text>
                </View>
                <View style={styles.resultContainer}>
                  <Text style={styles.resultAmount}>{getEstimatedAmount()}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 환율 정보 */}
          {getCurrentRate() > 0 && (
            <View style={styles.exchangeRateContainer}>
              <View style={styles.exchangeRateRow}>
                <Text style={styles.exchangeRateLabel}>현재 환율</Text>
                <Text style={styles.exchangeRateValue}>
                  1 {fromCurrency} = {getCurrentRate().toLocaleString()} {toCurrency}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!amount || getCurrentRate() === 0 || isLoading) && styles.disabledButton,
            ]}
            onPress={handleExchange}
            disabled={!amount || getCurrentRate() === 0 || isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>환전하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 실시간 환율 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ChartIcon size={20} color="#1f2937" />
          <Text style={styles.cardTitle}>실시간 환율</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshRates}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <RefreshIcon size={16} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          {exchangeRates.map((rate, index) => (
            <View key={index} style={styles.rateItem}>
              <View style={styles.rateItemLeft}>
                <Text style={styles.ratePair}>
                  {rate.from} → {rate.to}
                </Text>
                <Text style={styles.rateAmount}>{rate.rate.toLocaleString()}</Text>
              </View>
              <View
                style={[
                  styles.changeBadge,
                  rate.change >= 0 ? styles.changeBadgePositive : styles.changeBadgeNegative,
                ]}>
                <Text
                  style={[
                    styles.changeText,
                    rate.change >= 0 ? styles.changeTextPositive : styles.changeTextNegative,
                  ]}>
                  {rate.change >= 0 ? '+' : ''}
                  {rate.change}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 환전 내역 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>최근 환전 내역</Text>
        </View>
        <View style={styles.cardContent}>
          {mockHistory.map(history => (
            <View key={history.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.exchangeIconContainer}>
                  <RefreshIcon size={16} color="#2563eb" />
                </View>
                <View>
                  <Text style={styles.historyPair}>
                    {history.from} → {history.to}
                  </Text>
                  <Text style={styles.historyTime}>{history.timestamp}</Text>
                </View>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyAmount}>
                  {history.fromAmount} {history.from}
                </Text>
                <Text style={styles.historyResult}>
                  → {history.toAmount} {history.to}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    history.status === 'completed' && styles.completedBadge,
                    history.status === 'pending' && styles.pendingBadge,
                    history.status === 'failed' && styles.failedBadge,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      history.status === 'completed' && styles.completedText,
                      history.status === 'pending' && styles.pendingText,
                      history.status === 'failed' && styles.failedText,
                    ]}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 'auto',
  },
  refreshButton: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  cardContent: {
    padding: 20,
  },
  exchangeFormContainer: {
    zIndex: 1000,
    elevation: 1000,
  },
  inputSection: {
    marginBottom: 16,
  },
  fromSection: {
    zIndex: 10000,
    elevation: 10000,
  },
  toSection: {
    zIndex: 1000,
    elevation: 1000,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputRowContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  currencySelectContainer: {
    width: 80,
    zIndex: 5000,
    elevation: 5000,
  },
  fixedCurrencyContainer: {
    width: 80,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedCurrencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  currencyDropdownContainer: {
    position: 'relative',
    zIndex: 5000,
    elevation: 5000,
  },
  currencyPickerButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyPickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dropdownArrow: {
    marginLeft: 4,
  },
  dropdownArrowOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownArrowText: {
    fontSize: 10,
    color: '#6b7280',
  },
  currencyDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 50000,
  },
  currencyDropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyDropdownItemSelected: {
    backgroundColor: '#f3f4f6',
  },
  currencyDropdownText: {
    fontSize: 14,
    color: '#374151',
  },
  currencyDropdownTextSelected: {
    fontWeight: '600',
    color: '#2563eb',
  },
  checkMark: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  resultAmount: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  exchangeRateContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  exchangeRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exchangeRateLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  exchangeRateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  rateItemLeft: {},
  ratePair: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  rateAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeBadgePositive: {
    backgroundColor: '#dcfce7',
  },
  changeBadgeNegative: {
    backgroundColor: '#fef2f2',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: '#16a34a',
  },
  changeTextNegative: {
    color: '#dc2626',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exchangeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyPair: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  historyResult: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
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
    backgroundColor: '#fef3c7',
  },
  failedBadge: {
    backgroundColor: '#fef2f2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  completedText: {
    color: '#374151',
  },
  pendingText: {
    color: '#d97706',
  },
  failedText: {
    color: '#dc2626',
  },
});