import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { QRGenerator } from '../../components/QRGenerator';
import { QRScanner } from '../../components/QRScanner';
import { ArrowUpRightIcon, ArrowDownLeftIcon, QRCodeIcon, CameraIcon } from '../../components/icons';
import { useNotification } from '../../context/NotificationContext';
import { useInAppNotification } from '../../components/InAppNotification';

type TransactionMode = 'main' | 'receive' | 'qr-display' | 'qr-scan' | 'confirm';

interface TransactionData {
  type: 'send' | 'receive';
  currency: 'KRW' | 'USD';
  amount: string;
  qrData?: string;
  offerId?: string;
}

export default function TransactionScreen() {
  const [mode, setMode] = useState<TransactionMode>('main');
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData>({
    type: 'receive',
    currency: 'KRW',
    amount: '',
  });

  // 알림 훅 추가
  const { sendTransactionNotification, sendQRPaymentNotification } = useNotification();
  const { showTransactionSuccess, showQRPaymentSuccess } = useInAppNotification();

  const handleReceive = async () => {
    if (!transactionData.amount || loading) return;

    setLoading(true);
    try {
      // API로 오퍼 생성 (실제 API 호출 시)
      // const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      // const offerResponse = await fetch(`${API_BASE_URL}/api/transaction/offer/create`, {
      
      // 현재는 데모용 - 실제 API 연결 시 위 코드 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      
      // 데모용 오퍼 ID 생성
      const demoOfferId = `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // QR 코드에 오퍼 ID 포함
      const qrData = JSON.stringify({
        type: 'payment_request',
        offerId: demoOfferId,
        currency: transactionData.currency,
        amount: transactionData.amount,
        timestamp: Date.now(),
      });

      setTransactionData(prev => ({ ...prev, qrData, offerId: demoOfferId }));
      setMode('qr-display');
    } catch (error) {
      Alert.alert('오류', '결제 요청 생성에 실패했습니다.');
      console.error('Offer creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOffer = async () => {
    if (!transactionData.offerId) {
      setMode('main');
      setTransactionData({ type: 'receive', currency: 'KRW', amount: '' });
      return;
    }

    // 취소 확인 다이얼로그
    Alert.alert(
      '결제 요청 취소',
      '생성된 QR 코드와 결제 요청을 취소하시겠습니까?',
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네, 취소합니다',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // API로 오퍼 취소 (실제 API 호출 시)
              // const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
              // const cancelResponse = await fetch(`${API_BASE_URL}/api/transaction/offer/cancel`, {
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/json',
              //   },
              //   body: JSON.stringify({
              //     offerSequence: 0  // API 스펙에 따른 필드
              //   })
              // });

              // 현재는 데모용 - 실제 API 연결 시 위 코드 사용
              await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
              
              console.log(`오퍼 취소됨: ${transactionData.offerId}`);
              
              setMode('main');
              setTransactionData({ type: 'receive', currency: 'KRW', amount: '' });
            } catch (error) {
              Alert.alert('오류', '오퍼 취소에 실패했습니다.');
              console.error('Offer cancellation error:', error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSend = () => {
    setMode('qr-scan');
  };

  const handleQRScanned = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setTransactionData(prev => ({
        ...prev,
        type: 'send',
        currency: parsed.currency,
        amount: parsed.amount,
        qrData: data,
      }));
      setMode('confirm');
    } catch (error) {
      Alert.alert('오류', '유효하지 않은 QR 코드입니다.');
    }
  };

  const handleConfirmTransaction = async () => {
    setLoading(true);
    try {
      // 실제 거래 처리 (API 호출 등)
      await new Promise(resolve => setTimeout(resolve, 2000)); // 모의 처리

      // 거래 완료 후 알림 발송
      if (transactionData.type === 'send') {
        // 송금 완료 알림
        await sendTransactionNotification('sent', transactionData.amount, transactionData.currency);
        showTransactionSuccess(transactionData.amount, transactionData.currency, 'sent');
      }

      Alert.alert('완료', `${transactionData.amount} ${transactionData.currency} 송금이 완료되었습니다!`);
      setMode('main');
      setTransactionData({ type: 'receive', currency: 'KRW', amount: '' });
    } catch (error) {
      Alert.alert('오류', '거래 처리 중 문제가 발생했습니다.');
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'qr-display') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <QRCodeIcon size={20} color="#1f2937" />
            <Text style={styles.cardTitle}>결제 요청 QR 코드</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.qrContainer}>
              <QRGenerator data={transactionData.qrData || ''} />
            </View>
            <View style={styles.qrInfo}>
              <Text style={styles.amountText}>
                {transactionData.amount} {transactionData.currency}
              </Text>
              <Text style={styles.qrDescription}>
                상대방이 이 QR 코드를 스캔하여 결제할 수 있습니다
              </Text>
              {transactionData.offerId && (
                <Text style={styles.offerIdText}>
                  오퍼 ID: {transactionData.offerId}
                </Text>
              )}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }, loading && styles.disabledButton]}
                onPress={handleCancelOffer}
                disabled={loading}>
                <Text style={styles.outlineButtonText}>
                  {loading ? '취소 중...' : '닫기'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={async () => {
                  // 테스트용: 결제 완료 시뮬레이션
                  await sendTransactionNotification('received', transactionData.amount, transactionData.currency);
                  showTransactionSuccess(transactionData.amount, transactionData.currency, 'received');
                  Alert.alert('테스트', '결제 받기 완료 알림이 전송되었습니다!');
                }}>
                <Text style={styles.primaryButtonText}>테스트 결제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'qr-scan') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CameraIcon size={20} color="#1f2937" />
            <Text style={styles.cardTitle}>QR 코드 스캔</Text>
          </View>
          <View style={styles.cardContent}>
            <QRScanner onScan={handleQRScanned} />
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setMode('main')}>
              <Text style={styles.outlineButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'confirm') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>거래 확인</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.confirmContainer}>
              <Text style={styles.confirmAmount}>
                -{transactionData.amount} {transactionData.currency}
              </Text>
              <Text style={styles.confirmLabel}>보낼 금액</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>거래 유형:</Text>
                <Text style={styles.detailValue}>송금</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>통화:</Text>
                <Text style={styles.detailValue}>{transactionData.currency}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>수수료:</Text>
                <Text style={styles.detailValue}>0.1 XRP</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }]}
                onPress={() => setMode('main')}>
                <Text style={styles.outlineButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1 }, loading && styles.disabledButton]}
                onPress={handleConfirmTransaction}
                disabled={loading}>
                <Text style={styles.primaryButtonText}>
                  {loading ? '처리 중...' : '확인'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 메인 거래 옵션 */}
      <View style={styles.optionsGrid}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setMode('receive')}>
          <ArrowDownLeftIcon size={32} color="#16a34a" />
          <Text style={styles.optionTitle}>받기</Text>
          <Text style={styles.optionSubtitle}>QR 생성</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleSend}>
          <ArrowUpRightIcon size={32} color="#dc2626" />
          <Text style={styles.optionTitle}>보내기</Text>
          <Text style={styles.optionSubtitle}>QR 스캔</Text>
        </TouchableOpacity>
      </View>

      {/* 받기 폼 */}
      {mode === 'receive' && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>받기</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>통화 선택</Text>
              <View style={styles.currencySelector}>
                <TouchableOpacity
                  style={[
                    styles.currencyOption,
                    transactionData.currency === 'KRW' && styles.currencyOptionActive,
                  ]}
                  onPress={() =>
                    setTransactionData(prev => ({ ...prev, currency: 'KRW' }))}
                  >
                  <Text
                    style={[
                      styles.currencyOptionText,
                      transactionData.currency === 'KRW' && styles.currencyOptionTextActive,
                    ]}>
                    KRW (원)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.currencyOption,
                    transactionData.currency === 'USD' && styles.currencyOptionActive,
                  ]}
                  onPress={() =>
                    setTransactionData(prev => ({ ...prev, currency: 'USD' }))}
                  >
                  <Text
                    style={[
                      styles.currencyOptionText,
                      transactionData.currency === 'USD' && styles.currencyOptionTextActive,
                    ]}>
                    USD (달러)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>금액</Text>
              <TextInput
                style={styles.textInput}
                placeholder="받을 금액을 입력하세요"
                value={transactionData.amount}
                onChangeText={text =>
                  setTransactionData(prev => ({ ...prev, amount: text }))}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }]}
                onPress={() => setMode('main')}>
                <Text style={styles.outlineButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { flex: 1 },
                  (!transactionData.amount || loading) && styles.disabledButton,
                ]}
                onPress={handleReceive}
                disabled={!transactionData.amount || loading}>
                <Text style={styles.primaryButtonText}>
                  {loading ? '생성 중...' : 'QR 생성'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}


      {/* 최근 거래 내역 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>최근 거래</Text>
        </View>
        <View style={styles.cardContent}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.recentTransaction}>
              <View style={styles.transactionLeft}>
                <View style={styles.receiveIconContainer}>
                  <ArrowDownLeftIcon size={16} color="#16a34a" />
                </View>
                <View>
                  <Text style={styles.transactionType}>받음</Text>
                  <Text style={styles.transactionTime}>9월 20일 14:30</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.receiveAmount}>+1,500 KRW</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>완료</Text>
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
  optionsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#1f2937',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  cardContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  currencyOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  currencyOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  currencyOptionTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
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
  outlineButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  qrDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  offerIdText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  confirmContainer: {
    backgroundColor: '#f3f4f6',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  scanInstructions: {
    alignItems: 'center',
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  instructionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  recentTransaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  receiveIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  receiveAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
});