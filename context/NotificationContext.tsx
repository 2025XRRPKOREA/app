import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 푸시 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationSettings {
  transaction: boolean;
  exchange: boolean;
  security: boolean;
  marketing: boolean;
}

interface NotificationContextType {
  expoPushToken: string | null;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  sendTransactionNotification: (type: 'sent' | 'received', amount: string, currency: string) => Promise<void>;
  sendExchangeNotification: (fromAmount: string, fromCurrency: string, toAmount: string, toCurrency: string) => Promise<void>;
  sendQRPaymentNotification: (amount: string, currency: string, merchant?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('푸시 알림 권한이 필요합니다!');
      return null;
    }

    // 프로젝트 ID 설정 (실제 프로젝트에서는 app.config.js에서 설정)
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? '이곳에-실제-프로젝트-ID-입력';

    try {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('푸시 토큰 생성 실패:', error);
    }
  } else {
    alert('실제 기기에서만 푸시 알림이 작동합니다!');
  }

  return token;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps): JSX.Element {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    transaction: true,
    exchange: true,
    security: true,
    marketing: false,
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // 포그라운드에서 알림 수신 리스너
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('포그라운드 알림 수신:', notification);
    });

    // 알림 클릭 리스너
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('알림 클릭:', response);
      // 여기서 알림 클릭 시 특정 화면으로 이동하는 로직 추가 가능
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // 즉시 발송
    });
  };

  const sendTransactionNotification = async (
    type: 'sent' | 'received',
    amount: string,
    currency: string
  ) => {
    if (!notificationSettings.transaction) return;

    const title = type === 'sent' ? '송금 완료' : '입금 완료';
    const body = `${amount} ${currency} ${type === 'sent' ? '송금이' : '입금이'} 완료되었습니다.`;

    await sendLocalNotification(title, body, {
      type: 'transaction',
      transactionType: type,
      amount,
      currency
    });
  };

  const sendExchangeNotification = async (
    fromAmount: string,
    fromCurrency: string,
    toAmount: string,
    toCurrency: string
  ) => {
    if (!notificationSettings.exchange) return;

    const title = '환전 완료';
    const body = `${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency} 환전이 완료되었습니다.`;

    await sendLocalNotification(title, body, {
      type: 'exchange',
      fromAmount,
      fromCurrency,
      toAmount,
      toCurrency
    });
  };

  const sendQRPaymentNotification = async (
    amount: string,
    currency: string,
    merchant?: string
  ) => {
    if (!notificationSettings.transaction) return;

    const title = 'QR 결제 완료';
    const merchantText = merchant ? ` (${merchant})` : '';
    const body = `${amount} ${currency} QR 결제가 완료되었습니다${merchantText}.`;

    await sendLocalNotification(title, body, {
      type: 'qr_payment',
      amount,
      currency,
      merchant
    });
  };

  const value: NotificationContextType = {
    expoPushToken,
    notificationSettings,
    updateNotificationSettings,
    sendLocalNotification,
    sendTransactionNotification,
    sendExchangeNotification,
    sendQRPaymentNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}