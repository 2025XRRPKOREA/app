import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
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
  const { user, logout } = useAuth();
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
      style={[styles.switch, value && styles.switchActive]}
      onPress={() => onValueChange(!value)}>
      <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 프로필 정보 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <PersonIcon size={20} color="#1f2937" />
            <Text style={styles.cardTitle}>프로필</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <EditIcon size={16} color="#2563eb" />
              <Text style={styles.editButtonText}>편집</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <CloseIcon size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <CheckIcon size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          {/* 아바타 */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Image
                source={require('../../assets/images/xrp-logo.png')}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.avatarName}>{profile.name}</Text>
              <Text style={styles.avatarEmail}>{profile.email}</Text>
            </View>
          </View>

          {/* 편집 가능한 필드들 */}
          <View style={styles.fieldsContainer}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>이름</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={editProfile.name}
                  onChangeText={text => setEditProfile(prev => ({ ...prev, name: text }))}
                />
              ) : (
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldValueText}>{profile.name}</Text>
                </View>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>이메일</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={editProfile.email}
                  onChangeText={text => setEditProfile(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                />
              ) : (
                <View style={styles.fieldValue}>
                  <Text style={styles.fieldValueText}>{profile.email}</Text>
                </View>
              )}
            </View>

          </View>
        </View>
      </View>

      {/* 지갑 정보 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <WalletIcon size={20} color="#1f2937" />            
            <Text style={styles.cardTitle}>지갑 정보</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>지갑 주소</Text>
            <View style={styles.walletAddressRow}>
              <View style={styles.walletAddress}>
                <Text style={styles.walletAddressText}>{profile.walletAddress}</Text>
              </View>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>복사</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.walletStatus}>
            <View style={styles.walletStatusLeft}>
              <CheckIcon size={16} color="#16a34a" />
              <Text style={styles.walletStatusText}>지갑 상태</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>안전</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 알림 설정 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <BellIcon size={20} color="#1f2937" />
            <Text style={styles.cardTitle}>알림 설정</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>거래 알림</Text>
              <Text style={styles.notificationSubtitle}>송금/수신 시 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.transaction}
              onValueChange={checked =>
                updateNotificationSettings({ transaction: checked })
              }
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>환전 알림</Text>
              <Text style={styles.notificationSubtitle}>환전 완료 시 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.exchange}
              onValueChange={checked =>
                updateNotificationSettings({ exchange: checked })
              }
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>보안 알림</Text>
              <Text style={styles.notificationSubtitle}>로그인 및 보안 관련 알림</Text>
            </View>
            <SwitchComponent
              value={notificationSettings.security}
              onValueChange={checked =>
                updateNotificationSettings({ security: checked })
              }
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>마케팅 알림</Text>
              <Text style={styles.notificationSubtitle}>이벤트 및 프로모션 알림</Text>
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
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <GearIcon size={20} color="#1f2937" />
            <Text style={styles.cardTitle}>설정</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.settingItem}>
            <PersonIcon size={20} color="#6b7280" />
            <Text style={styles.settingText}>생체 인증 설정</Text>
            <ChevronRightIcon size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <EyeIcon size={20} color="#6b7280" />
            <Text style={styles.settingText}>개인정보 처리방침</Text>
            <ChevronRightIcon size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <ShieldIcon size={20} color="#6b7280" />
            <Text style={styles.settingText}>서비스 이용약관</Text>
            <ChevronRightIcon size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastAnimation,
              transform: [
                {
                  translateY: toastAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}>
          <Text style={styles.toastText}>🚧 기능 준비중입니다</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  editButtonText: {
    fontSize: 14,
    color: '#2563eb',
    marginLeft: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  avatarInfo: {},
  avatarName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  avatarEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  fieldsContainer: {
    gap: 16,
  },
  field: {},
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  fieldValue: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  fieldValueText: {
    fontSize: 16,
    color: '#1f2937',
  },
  walletAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletAddress: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  walletAddressText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1e293b',
    lineHeight: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  copyButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  walletStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  walletStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginLeft: 8,
  },
  statusBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationLeft: {
    flex: 1,
    paddingHorizontal: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    paddingHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  switchActive: {
    backgroundColor: '#3b82f6',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fafbfc',
    borderRadius: 8,
    marginBottom: 8,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});