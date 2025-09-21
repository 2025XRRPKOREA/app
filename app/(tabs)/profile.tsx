import { useAuthUser, useAuthActions } from '@/stores';
import { useNotification } from '@/context/NotificationContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BellIcon,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  EditIcon,
  EyeIcon,
  GearIcon,
  PersonIcon,
  ShieldIcon,
  WalletIcon
} from '../../components/icons';

interface UserProfile {
  name: string;
  email: string;
  walletAddress: string;
}

export default function ProfileScreen() {
  const user = useAuthUser();
  const { logout } = useAuthActions();
  const { notificationSettings, updateNotificationSettings } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '사용자',
    email: user?.email || 'user@example.com',
    walletAddress: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  });
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [showToast, setShowToast] = useState(false);
  const [toastAnimation] = useState(new Animated.Value(0));


  const showToastMessage = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  const handleEditPress = () => {
    showToastMessage();
  };

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
    Alert.alert('완료', '프로필이 업데이트되었습니다.');
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '로그아웃', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await logout();
            router.replace('/login');
          } catch (error) {
            console.error('로그아웃 오류:', error);
            Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
          }
        }
      },
    ]);
  };

  const copyToClipboard = () => {
    Alert.alert('복사 완료', '지갑 주소가 클립보드에 복사되었습니다.');
  };

  const SwitchComponent = ({
    value,
    onValueChange,
  }: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <TouchableOpacity
      className={`w-12 h-6 rounded-full p-0.5 ${
        value ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      onPress={() => onValueChange(!value)}>
      <View className={`w-5 h-5 rounded-full bg-white transition-transform ${
        value ? 'transform translate-x-6' : ''
      }`} />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>
      {/* 프로필 정보 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row justify-between items-center p-5 pb-0">
          <View className="flex-row items-center">
            <PersonIcon size={20} color="#1f2937" />
            <Text className="text-lg font-bold text-gray-800 ml-2">프로필</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity className="flex-row items-center py-2 px-3 rounded-lg bg-blue-50" onPress={handleEditPress}>
              <EditIcon size={16} color="#2563eb" />
              <Text className="text-blue-600 font-semibold ml-1">편집</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row gap-2">
              <TouchableOpacity className="p-2 rounded-lg bg-gray-100" onPress={handleCancel}>
                <CloseIcon size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 rounded-lg bg-blue-600" onPress={handleSave}>
                <CheckIcon size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="p-5">
          {/* 아바타 */}
          <View className="flex-row items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-blue-50 justify-center items-center mr-4">
              <Image
                source={require('../../assets/images/xrp-logo.png')}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">{profile.name}</Text>
              <Text className="text-sm text-gray-500">{profile.email}</Text>
            </View>
          </View>

          {/* 편집 가능한 필드들 */}
          <View className="gap-4">
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">이름</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg py-3 px-4 text-base text-gray-800 bg-white"
                  value={editProfile.name}
                  onChangeText={text => setEditProfile(prev => ({ ...prev, name: text }))}
                />
              ) : (
                <View className="py-3 px-4 bg-gray-50 rounded-lg">
                  <Text className="text-base text-gray-800">{profile.name}</Text>
                </View>
              )}
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">이메일</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg py-3 px-4 text-base text-gray-800 bg-white"
                  value={editProfile.email}
                  onChangeText={text => setEditProfile(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                />
              ) : (
                <View className="py-3 px-4 bg-gray-50 rounded-lg">
                  <Text className="text-base text-gray-800">{profile.email}</Text>
                </View>
              )}
            </View>

          </View>
        </View>
      </View>

      {/* 지갑 정보 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row items-center p-5 pb-0">
          <WalletIcon size={20} color="#1f2937" />            
          <Text className="text-lg font-bold text-gray-800 ml-2">지갑 정보</Text>
        </View>
        <View className="p-5">
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">지갑 주소</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 py-3 px-4 bg-gray-50 rounded-lg">
                <Text className="text-sm text-gray-800 font-mono">{profile.walletAddress}</Text>
              </View>
              <TouchableOpacity className="py-3 px-4 bg-blue-600 rounded-lg" onPress={copyToClipboard}>
                <Text className="text-white font-semibold">복사</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center py-3 px-4 bg-green-50 rounded-lg">
            <View className="flex-row items-center">
              <CheckIcon size={16} color="#16a34a" />
              <Text className="text-gray-700 font-medium ml-2">지갑 상태</Text>
            </View>
            <View className="py-1 px-3 bg-green-100 rounded-full">
              <Text className="text-green-700 text-sm font-semibold">안전</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 알림 설정 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row items-center p-5 pb-0">
          <BellIcon size={20} color="#1f2937" />
          <Text className="text-lg font-bold text-gray-800 ml-2">알림 설정</Text>
        </View>
        <View className="p-5 gap-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">거래 알림</Text>
              <Text className="text-sm text-gray-500 mt-1">송금/수신 시 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.transaction}
              onValueChange={checked =>
                updateNotificationSettings({ transaction: checked })
              }
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">환전 알림</Text>
              <Text className="text-sm text-gray-500 mt-1">환전 완료 시 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.exchange}
              onValueChange={checked =>
                updateNotificationSettings({ exchange: checked })
              }
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">보안 알림</Text>
              <Text className="text-sm text-gray-500 mt-1">로그인 및 보안 관련 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.security}
              onValueChange={checked =>
                updateNotificationSettings({ security: checked })
              }
            />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">마케팅 알림</Text>
              <Text className="text-sm text-gray-500 mt-1">이벤트 및 프로모션 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.marketing}
              onValueChange={checked =>
                updateNotificationSettings({ marketing: checked })
              }
            />
          </View>
        </View>
      </View>

      {/* 추가 설정 */}
      <View className="bg-white rounded-2xl mb-6 shadow-sm shadow-black/10 elevation-2">
        <View className="flex-row items-center p-5 pb-0">
          <GearIcon size={20} color="#1f2937" />
          <Text className="text-lg font-bold text-gray-800 ml-2">설정</Text>
        </View>
        <View className="p-5 gap-1">
          <TouchableOpacity className="flex-row items-center justify-between py-4 px-2">
            <PersonIcon size={20} color="#6b7280" />
            <Text className="flex-1 text-base text-gray-700 ml-3">생체 인증 설정</Text>
            <ChevronRightIcon size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 px-2">
            <EyeIcon size={20} color="#6b7280" />
            <Text className="flex-1 text-base text-gray-700 ml-3">개인정보 처리방침</Text>
            <ChevronRightIcon size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 px-2 mb-4">
            <ShieldIcon size={20} color="#6b7280" />
            <Text className="flex-1 text-base text-gray-700 ml-3">서비스 이용약관</Text>
            <ChevronRightIcon size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity className="py-3 px-4 bg-red-500 rounded-lg items-center" onPress={handleLogout}>
            <Text className="text-white font-semibold">로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View
          className="absolute top-16 left-5 right-5 py-3 px-5 bg-gray-800 rounded-xl z-50"
          style={{
            opacity: toastAnimation,
            transform: [
              {
                translateY: toastAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}>
          <Text className="text-white text-center font-medium">🚧 기능 준비중입니다</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

