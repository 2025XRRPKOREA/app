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
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 0,
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
          },
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
            title: '',
            tabBarIcon: ({ color }) => <HomeIcon size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <ArrowLeftRightIcon size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="exchange"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <RefreshIcon size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({ color }) => <UserIcon size={28} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
