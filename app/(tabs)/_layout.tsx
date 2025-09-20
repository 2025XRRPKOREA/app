import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import AuthGuard from '@/components/AuthGuard';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ArrowLeftRightIcon, HomeIcon, RefreshIcon, UserIcon } from '../../components/icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitle: 'RipplePay',
          headerRight: () => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 16
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#10b981',
                marginRight: 8
              }} />
              <Text style={{ fontSize: 14, color: '#6b7280' }}>연결됨</Text>
            </View>
          ),
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '홈',
            tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: '거래',
            tabBarIcon: ({ color }) => <ArrowLeftRightIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="exchange"
          options={{
            title: '환전',
            tabBarIcon: ({ color }) => <RefreshIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '마이페이지',
            tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
