import React, { useState, useEffect } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckIcon, BellIcon } from './icons';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  onPress?: () => void;
}

interface InAppNotificationProps {
  notification: NotificationData | null;
  onDismiss: () => void;
}

export function InAppNotification({ notification, onDismiss }: InAppNotificationProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (notification) {
      // 알림 표시 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 자동 숨김 (기본 4초)
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#10b981', borderColor: '#059669' };
      case 'warning':
        return { backgroundColor: '#f59e0b', borderColor: '#d97706' };
      case 'error':
        return { backgroundColor: '#ef4444', borderColor: '#dc2626' };
      default:
        return { backgroundColor: '#3b82f6', borderColor: '#2563eb' };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckIcon size={20} color="#ffffff" />;
      default:
        return <BellIcon size={20} color="#ffffff" />;
    }
  };

  if (!notification) return null;

  return (
    <Animated.View
      className="absolute top-15 left-4 right-4 z-[9999]"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}>
      <TouchableOpacity
        className="rounded-xl border flex-row items-center py-4 px-4 shadow-lg shadow-black/30"
        style={getNotificationStyle(notification.type)}
        onPress={() => {
          if (notification.onPress) {
            notification.onPress();
          }
          hideNotification();
        }}
        activeOpacity={0.9}>
        <View className="mr-3">
          {getIcon(notification.type)}
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-white mb-0.5">{notification.title}</Text>
          <Text className="text-sm text-white opacity-90 leading-tight">{notification.message}</Text>
        </View>
        <TouchableOpacity className="ml-3 w-6 h-6 justify-center items-center" onPress={hideNotification}>
          <Text className="text-xl text-white font-bold">×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

// 알림 관리용 훅
export function useInAppNotification() {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = (data: Omit<NotificationData, 'id'>) => {
    const notificationWithId: NotificationData = {
      ...data,
      id: Date.now().toString(),
    };
    setNotification(notificationWithId);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const showSuccess = (title: string, message: string, onPress?: () => void) => {
    showNotification({ title, message, type: 'success', onPress });
  };

  const showError = (title: string, message: string, onPress?: () => void) => {
    showNotification({ title, message, type: 'error', onPress });
  };

  const showInfo = (title: string, message: string, onPress?: () => void) => {
    showNotification({ title, message, type: 'info', onPress });
  };

  const showTransactionSuccess = (amount: string, currency: string, type: 'sent' | 'received') => {
    const title = type === 'sent' ? '송금 완료' : '입금 완료';
    const message = `${amount} ${currency} ${type === 'sent' ? '송금이' : '입금이'} 완료되었습니다.`;
    showSuccess(title, message);
  };

  const showQRPaymentSuccess = (amount: string, currency: string, merchant?: string) => {
    const title = 'QR 결제 완료';
    const merchantText = merchant ? ` (${merchant})` : '';
    const message = `${amount} ${currency} QR 결제가 완료되었습니다${merchantText}.`;
    showSuccess(title, message);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showTransactionSuccess,
    showQRPaymentSuccess,
  };
}