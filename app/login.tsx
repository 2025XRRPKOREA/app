import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuthActions, useIsAuthenticated, useAuthLoading } from '@/stores';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login } = useAuthActions();
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useAuthLoading();

  // 이미 로그인된 상태면 메인 화면으로 이동
  useEffect(() => {
    // 초기 로딩이 완료된 후에만 리다이렉션 수행
    if (isAuthenticated && !authLoading) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100); // 약간의 지연을 두어 렌더링 사이클 회피
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      // 로그인 성공 시 useEffect에서 자동으로 리다이렉션됨
    } catch (error: any) {
      // API 클라이언트에서 처리된 에러 메시지 사용
      const errorMessage = error.message || '로그인 중 오류가 발생했습니다.';
      Alert.alert('로그인 실패', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white justify-center px-5"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View className="bg-white p-6 rounded-2xl shadow-sm shadow-black/10">
        <Text className="text-3xl font-bold text-gray-800 text-center mb-2">RipplePay</Text>
        <Text className="text-base text-gray-500 text-center mb-10">안전한 XRP 결제를 시작하세요</Text>
        
        <View className="mb-4">
          <Text className="text-sm text-gray-800 mb-2 font-medium">이메일</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력하세요"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <View className="mb-4">
          <Text className="text-sm text-gray-800 mb-2 font-medium">비밀번호</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity
          className={`rounded-xl py-4 mt-6 mb-4 ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600'
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {isLoading ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text className="text-center text-blue-600 text-sm mt-4">비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}