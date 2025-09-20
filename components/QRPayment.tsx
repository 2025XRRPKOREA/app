import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { QRScanner } from './QRScanner';
import { useNotification } from '@/context/NotificationContext';
import { useInAppNotification } from './InAppNotification';
import { QRCodeIcon, CheckIcon, CloseIcon } from './icons';

interface QRPaymentData {
  amount: string;
  currency: string;
  recipient: string;
  merchant?: string;
  memo?: string;
}

interface QRPaymentProps {
  onPaymentComplete?: (data: QRPaymentData) => void;
}

export function QRPayment({ onPaymentComplete }: QRPaymentProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState<QRPaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { sendQRPaymentNotification } = useNotification();
  const { showQRPaymentSuccess } = useInAppNotification();

  const parseQRData = (qrData: string): QRPaymentData | null => {
    try {
      // QR 데이터 형식: JSON 또는 URI scheme
      if (qrData.startsWith('{')) {
        return JSON.parse(qrData);
      } else if (qrData.startsWith('ripple:')) {
        // 예: ripple:rXXXXXX?amount=100&currency=XRP&memo=payment
        const url = new URL(qrData);
        const recipient = url.pathname;
        const amount = url.searchParams.get('amount') || '0';
        const currency = url.searchParams.get('currency') || 'XRP';
        const memo = url.searchParams.get('memo') || undefined;
        const merchant = url.searchParams.get('merchant') || undefined;

        return { amount, currency, recipient, memo, merchant };
      } else {
        // 단순 문자열인 경우 테스트용 데이터로 처리
        return {
          amount: '50.00',
          currency: 'XRP',
          recipient: qrData,
          merchant: '테스트 매장',
          memo: 'QR 결제'
        };
      }
    } catch (error) {
      console.error('QR 데이터 파싱 오류:', error);
      return null;
    }
  };

  const handleQRScan = (qrData: string) => {
    console.log('QR 스캔 완료:', qrData);

    const parsed = parseQRData(qrData);
    if (!parsed) {
      Alert.alert('오류', '유효하지 않은 QR 코드입니다.');
      return;
    }

    setPaymentData(parsed);
  };

  const processPayment = async () => {
    if (!paymentData) return;

    setIsProcessing(true);
    try {
      // 실제 결제 처리 API 호출 (모의 처리)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 결제 완료 후 알림 발송
      await sendQRPaymentNotification(
        paymentData.amount,
        paymentData.currency,
        paymentData.merchant
      );

      // 앱 내 알림 표시
      showQRPaymentSuccess(
        paymentData.amount,
        paymentData.currency,
        paymentData.merchant
      );

      // 콜백 호출
      onPaymentComplete?.(paymentData);

      // 모달 닫기
      setModalVisible(false);
      setPaymentData(null);

      Alert.alert('결제 완료', 'QR 결제가 성공적으로 완료되었습니다!');
    } catch (error) {
      console.error('결제 처리 오류:', error);
      Alert.alert('결제 실패', '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelPayment = () => {
    setPaymentData(null);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.qrButton}
        onPress={() => setModalVisible(true)}>
        <QRCodeIcon size={24} color="#ffffff" />
        <Text style={styles.qrButtonText}>QR 결제</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>QR 결제</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <CloseIcon size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {!paymentData ? (
              <QRScanner onScan={handleQRScan} />
            ) : (
              <View style={styles.paymentConfirm}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>결제 정보</Text>

                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>금액:</Text>
                    <Text style={styles.paymentValue}>
                      {paymentData.amount} {paymentData.currency}
                    </Text>
                  </View>

                  {paymentData.merchant && (
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>가맹점:</Text>
                      <Text style={styles.paymentValue}>{paymentData.merchant}</Text>
                    </View>
                  )}

                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>받는 주소:</Text>
                    <Text style={styles.paymentValue} numberOfLines={1}>
                      {paymentData.recipient}
                    </Text>
                  </View>

                  {paymentData.memo && (
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>메모:</Text>
                      <Text style={styles.paymentValue}>{paymentData.memo}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={cancelPayment}
                    disabled={isProcessing}>
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.confirmButton, isProcessing && styles.disabledButton]}
                    onPress={processPayment}
                    disabled={isProcessing}>
                    {isProcessing ? (
                      <Text style={styles.confirmButtonText}>처리 중...</Text>
                    ) : (
                      <>
                        <CheckIcon size={20} color="#ffffff" />
                        <Text style={styles.confirmButtonText}>결제하기</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  qrButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  qrButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  paymentConfirm: {
    gap: 20,
  },
  paymentInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});