import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useInAppNotification } from '../../components/InAppNotification';
import { QRGenerator } from '../../components/QRGenerator';
import { QRScanner } from '../../components/QRScanner';
import { CameraIcon, QRCodeIcon, QRGenerateIcon, ScanQRIcon } from '../../components/icons';
import { useNotification } from '../../context/NotificationContext';
import { TransactionList } from '../../components/TransactionList';
import * as Haptics from 'expo-haptics';
import { apiClient } from '../../services/apiClient';

type TransactionMode = 'main' | 'receive' | 'qr-display' | 'qr-scan';

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
  const { sendTransactionNotification } = useNotification();
  const { showTransactionSuccess } = useInAppNotification();


  const handleReceive = async () => {
    if (!transactionData.amount || loading) return;

    setLoading(true);
    try {
      // 실제 offer/create API 호출
      const API_BASE_URL = 'http://122.40.46.59';
      const offerResponse = await fetch(`${API_BASE_URL}/api/transaction/offer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiClient.getCurrentToken()}`,
        },
        body: JSON.stringify({
          iou: transactionData.currency, // USD 또는 KRW
          price: parseInt(transactionData.amount)
        })
      });

      if (!offerResponse.ok) {
        throw new Error(`API Error: ${offerResponse.status}`);
      }

      const offerData = await offerResponse.json();
      
      // 백엔드에서 받은 qrCode UUID 사용
      const qrCodeUUID = offerData.qrCode;
      
      // QR 코드에는 UUID만 포함 (백엔드가 하라는 대로)
      const qrData = qrCodeUUID;

      setTransactionData(prev => ({ 
        ...prev, 
        qrData, 
        offerId: qrCodeUUID // UUID를 offerId로 사용
      }));
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

  const handleQRScanned = async (data: string) => {
    console.log('transaction.tsx에서 QR 스캔 받음:', data);
    try {
      // QR 코드는 UUID 문자열이므로 그대로 사용
      const qrUUID = data.trim();
      console.log('처리할 UUID:', qrUUID);
      
      setLoading(true);
      
      // QR 스캔 즉시 서버로 offer/finish 요청
      const API_BASE_URL = 'http://122.40.46.59';
      const finishResponse = await fetch(`${API_BASE_URL}/api/transaction/offer/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiClient.getCurrentToken()}`,
        },
        body: JSON.stringify({
          uuid: qrUUID // QR에서 스캔한 UUID 바로 전송
        })
      });

      if (!finishResponse.ok) {
        throw new Error(`API Error: ${finishResponse.status}`);
      }

      await finishResponse.json();

      // 거래 완료 후 알림 발송
      await sendTransactionNotification('sent', '송금완료', 'QR');
      showTransactionSuccess('송금완료', 'QR', 'sent');

      Alert.alert('완료', 'QR 송금이 성공적으로 완료되었습니다!');
      setMode('main');
      setTransactionData({ type: 'receive', currency: 'KRW', amount: '' });
      
    } catch (error) {
      Alert.alert('오류', 'QR 송금 처리 중 문제가 발생했습니다.');
      console.error('QR Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };


  if (mode === 'qr-display') {
    return (
      <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
          <View className="flex-row items-center p-5 pb-0">
            <QRCodeIcon size={20} color="#1f2937" />
            <Text className="text-lg font-bold text-gray-800 ml-2">결제 요청 QR 코드</Text>
          </View>
          <View className="p-5">
            <View className="items-center mb-6">
              <QRGenerator data={transactionData.qrData || ''} />
            </View>
            <View className="items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {transactionData.amount} {transactionData.currency}
              </Text>
              <Text className="text-sm text-gray-500 text-center">
                상대방이 이 QR 코드를 스캔하여 결제할 수 있습니다
              </Text>
              {transactionData.offerId && (
                <Text className="text-xs text-gray-400 mt-2">
                  오퍼 ID: {transactionData.offerId}
                </Text>
              )}
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg border border-gray-300 items-center ${
                  loading ? 'opacity-50' : ''
                }`}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMode('main');
                  setTransactionData({ type: 'receive', currency: 'KRW', amount: '' });
                }}
                disabled={loading}>
                <Text className="text-gray-700 font-semibold">
                  {loading ? '취소 중...' : '닫기'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 px-4 rounded-lg bg-blue-600 items-center"
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  await sendTransactionNotification('received', transactionData.amount, transactionData.currency);
                  showTransactionSuccess(transactionData.amount, transactionData.currency, 'received');
                  Alert.alert('테스트', '결제 받기 완료 알림이 전송되었습니다!');
                  setMode('main');
                  setTransactionData({ type: 'receive', currency: 'KRW', amount: '' });
                }}>
                <Text className="text-white font-semibold">테스트 결제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'qr-scan') {
    return (
      <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
          <View className="flex-row items-center p-5 pb-0">
            <CameraIcon size={20} color="#1f2937" />
            <Text className="text-lg font-bold text-gray-800 ml-2">QR 코드 스캔</Text>
          </View>
          <View className="p-5">
            <QRScanner onScan={handleQRScanned} />
            <TouchableOpacity
              className="py-3 px-4 rounded-lg border border-gray-300 items-center mt-4"
              onPress={() => setMode('main')}>
              <Text className="text-gray-700 font-semibold">취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }



  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      showsVerticalScrollIndicator={false}>
      {/* 메인 거래 옵션 */}
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity
          className="flex-1 bg-white rounded-2xl p-6 items-center shadow-sm shadow-black/10 elevation-2"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setMode('receive');
          }}>
          <QRGenerateIcon size={36} color="#10b981" />
          <Text className="text-base font-bold text-gray-800 mt-3">QR 생성하기</Text>
          <Text className="text-sm text-gray-500 mt-1">결제 요청</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-white rounded-2xl p-6 items-center shadow-sm shadow-black/10 elevation-2"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSend();
          }}>
          <ScanQRIcon size={36} color="#3b82f6" />
          <Text className="text-base font-bold text-gray-800 mt-3">QR 송금하기</Text>
          <Text className="text-sm text-gray-500 mt-1">즉시 결제</Text>
        </TouchableOpacity>
      </View>

      {/* 받기 폼 */}
      {mode === 'receive' && (
        <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
          <View className="flex-row items-center p-5 pb-0">
            <QRGenerateIcon size={20} color="#16a34a" />
            <Text className="text-lg font-bold text-gray-800 ml-2">QR 생성하기</Text>
          </View>
          <View className="p-5">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">통화 선택</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    transactionData.currency === 'KRW'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTransactionData(prev => ({ ...prev, currency: 'KRW' }));
                  }}>
                  <Text
                    className={`text-center font-semibold ${
                      transactionData.currency === 'KRW'
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}>
                    KRW (원)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    transactionData.currency === 'USD'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTransactionData(prev => ({ ...prev, currency: 'USD' }));
                  }}>
                  <Text
                    className={`text-center font-semibold ${
                      transactionData.currency === 'USD'
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}>
                    USD (달러)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">금액</Text>
              <TextInput
                className="border border-gray-300 rounded-lg py-3 px-4 text-base text-gray-800 bg-white"
                placeholder="받을 금액을 입력하세요"
                value={transactionData.amount}
                onChangeText={text =>
                  setTransactionData(prev => ({ ...prev, amount: text }))}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 items-center"
                onPress={() => setMode('main')}>
                <Text className="text-gray-700 font-semibold">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg items-center ${
                  (!transactionData.amount || loading)
                    ? 'bg-gray-300'
                    : 'bg-blue-600'
                }`}
                onPress={() => {
                  if (!transactionData.amount || loading) return;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  handleReceive();
                }}
                disabled={!transactionData.amount || loading}>
                <Text className="text-white font-semibold">
                  {loading ? '생성 중...' : '⚡ QR 생성'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}


      {/* 최근 거래 내역 */}
      <TransactionList limit={10} showCard={true} />
    </ScrollView>
  );
}
