import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  PersonIcon,
  EditIcon,
  CloseIcon,
  CheckIcon,
  ShieldIcon,
  BellIcon,
  GearIcon,
  ChevronRightIcon,
  EyeIcon
} from '../../components/icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

interface UserProfile {
  name: string;
  email: string;
  walletAddress: string;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '사용자',
    email: user?.email || 'user@example.com',
    walletAddress: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  });
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);

  const [notifications, setNotifications] = useState({
    transaction: true,
    exchange: true,
    security: true,
    marketing: false,
  });

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
    <ScrollView style={styles.container}>
      {/* 프로필 정보 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <PersonIcon size={20} color="#1f2937" />
            <Text style={styles.cardTitle}>프로필</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
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
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
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
            <ShieldIcon size={20} color="#1f2937" />
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
              value={notifications.transaction}
              onValueChange={checked =>
                setNotifications(prev => ({ ...prev, transaction: checked }))
              }
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>환전 알림</Text>
              <Text style={styles.notificationSubtitle}>환전 완료 시 알림</Text>
            </View>
            <SwitchComponent
              value={notifications.exchange}
              onValueChange={checked =>
                setNotifications(prev => ({ ...prev, exchange: checked }))
              }
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>보안 알림</Text>
              <Text style={styles.notificationSubtitle}>로그인 및 보안 관련 알림</Text>
            </View>
            <SwitchComponent
              value={notifications.security}
              onValueChange={checked =>
                setNotifications(prev => ({ ...prev, security: checked }))
              }
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <Text style={styles.notificationTitle}>마케팅 알림</Text>
              <Text style={styles.notificationSubtitle}>이벤트 및 프로모션 알림</Text>
            </View>
            <SwitchComponent
              value={notifications.marketing}
              onValueChange={checked =>
                setNotifications(prev => ({ ...prev, marketing: checked }))
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
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b7280',
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
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
  },
  walletAddressText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1f2937',
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  copyButtonText: {
    fontSize: 14,
    color: '#6b7280',
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  notificationLeft: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: '#2563eb',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});