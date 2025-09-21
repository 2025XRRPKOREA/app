import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuthActions, useIsAuthenticated } from '@/stores';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login } = useAuthActions();
  const isAuthenticated = useIsAuthenticated();

  // 이미 로그인된 상태면 메인 화면으로 이동
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      // 로그인 성공 시 메인 화면으로 이동
      router.replace('/(tabs)');
    } catch (error: any) {
      // API 클라이언트에서 처리된 에러 메시지 사용
      const errorMessage = error.message || '로그인 중 오류가 발생했습니다.';
      Alert.alert('로그인 실패', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.icon,
      textAlign: 'center',
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    inputFocused: {
      borderColor: colors.tint,
      borderWidth: 2,
    },
    loginButton: {
      backgroundColor: colors.tint,
      borderRadius: 12,
      paddingVertical: 16,
      marginTop: 24,
      marginBottom: 16,
    },
    loginButtonDisabled: {
      backgroundColor: colors.icon,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    forgotPassword: {
      textAlign: 'center',
      color: colors.tint,
      fontSize: 14,
      marginTop: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View>
        <Text style={styles.title}>RipplePay</Text>
        <Text style={styles.subtitle}>안전한 XRP 결제를 시작하세요</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력하세요"
            placeholderTextColor={colors.icon}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor={colors.icon}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.loginButton,
            isLoading && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>비밀번호를 잊으셨나요?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}