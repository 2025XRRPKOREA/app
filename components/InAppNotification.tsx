import React, { useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
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

const { width } = Dimensions.get('window');

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
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.notification,
          getNotificationStyle(notification.type),
        ]}
        onPress={() => {
          if (notification.onPress) {
            notification.onPress();
          }
          hideNotification();
        }}
        activeOpacity={0.9}>
        <View style={styles.iconContainer}>
          {getIcon(notification.type)}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // 상태바 아래
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  notification: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 18,
  },
  closeButton: {
    marginLeft: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

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