# 🚀 RipplePay 개발 로드맵

> 해커톤 프로토타입 → 실제 배포 가능한 프로덕션 앱

## ⚠️ 문서 최신화 중요 알림

**이 문서는 살아있는 문서입니다!** 각 Phase를 진행하면서 반드시 다음을 업데이트해야 합니다:

- ✅ **진행 상황 추적 테이블**: 시작일, 완료일, 상태 변경
- ✅ **체크리스트**: 완료된 작업 체크 표시
- ✅ **관련 파일**: 실제 수정된 파일과 폴더 경로 추가
- ✅ **학습 내용**: 예상치 못한 문제나 새로운 발견사항 기록

💡 **Claude에게**: 각 Phase 작업 시 이 문서를 자동으로 업데이트해주세요!

## 📋 전체 개발 계획

### Phase 1: 상태관리 현대화 (1-2일)
**목표**: Context API를 Zustand로 마이그레이션하여 더 효율적인 상태관리 구현

#### 📁 관련 파일 및 폴더
- 🔄 `context/AuthContext.tsx` → `stores/authStore.ts`
- 🔄 `hooks/useWalletBalance.ts` → `stores/walletStore.ts`
- 🔄 `services/apiClient.ts` (상태 관리 로직 분리)
- 📦 `package.json` (zustand 의존성 추가)
- 🔄 모든 컴포넌트에서 `useAuth()` → `useAuthStore()` 변경

#### 🎯 구체적 작업
- [x] Zustand 설치 및 기본 설정
- [x] AuthContext → Zustand Auth Store 마이그레이션
- [x] 지갑 잔고 상태 통합 관리
- [x] 거래 내역 상태 통합 관리
- [x] 기존 Context API 코드 제거

#### 💡 기대 효과
- 불필요한 리렌더링 최소화
- 상태 로직 중앙집중화
- 타입스크립트 지원 개선
- 디버깅 도구 지원

#### ✅ 실제 구현 내용 (2025-09-21 완료)
**생성된 파일:**
- ➕ `stores/authStore.ts` - 인증 상태 관리 (login, register, logout, initializeAuth)
- ➕ `stores/walletStore.ts` - 지갑 잔고 관리 (fetchBalance, auto-refresh 기능)
- ➕ `stores/transactionStore.ts` - 거래 내역 관리 (fetchTransactions, addTransaction)
- ➕ `stores/index.ts` - 모든 store 통합 export
- ➕ `components/StoreInitializer.tsx` - Zustand 초기화 컴포넌트

**수정된 파일:**
- 🔄 `app/_layout.tsx` - AuthProvider → StoreInitializer 교체
- 🔄 `app/login.tsx` - useAuth() → useAuthActions(), useIsAuthenticated()
- 🔄 `app/(tabs)/profile.tsx` - useAuth() → useAuthUser(), useAuthActions()
- 🔄 `app/(tabs)/index.tsx` - useWalletBalance() → store hooks
- 🔄 `components/AuthGuard.tsx` - useAuth() → useIsAuthenticated(), useAuthLoading()

**삭제된 파일:**
- 🗑️ `context/AuthContext.tsx` - 기존 Context API 제거
- 🗑️ `hooks/useWalletBalance.ts` - Zustand store로 대체

**주요 개선 사항:**
- **Selective Subscriptions**: 필요한 상태만 구독하여 리렌더링 최적화
- **TypeScript 개선**: 더 나은 타입 추론과 자동완성
- **DevTools 지원**: Zustand DevTools로 상태 변화 디버깅
- **Auto-refresh**: 지갑 잔고 자동 새로고침 (30초 간격)
- **초기화 자동화**: StoreInitializer로 앱 시작 시 자동 상태 복원

### Phase 2: API 통신 통일 (1일)
**목표**: 혼재된 API 통신 방식을 Axios로 통합

#### 📁 관련 파일 및 폴더
- 🔄 `services/apiClient.ts` (fetch → axios 전환)
- ➕ `services/httpClient.ts` (새로운 axios 인스턴스)
- ➕ `services/authService.ts` (API 서비스 레이어)
- ➕ `services/walletService.ts` (지갑 API 분리)
- ➕ `services/transactionService.ts` (거래 API 분리)
- 📦 `package.json` (axios 의존성 확인)

#### 🎯 구체적 작업
- [ ] 기존 fetch 호출을 axios로 변환
- [ ] 요청/응답 인터셉터 설정
- [ ] 에러 처리 통합
- [ ] 토큰 자동 갱신 로직
- [ ] API 베이스 URL 환경별 관리

#### 💡 기대 효과
- 일관된 HTTP 클라이언트 사용
- 자동 토큰 관리
- 통합된 에러 처리
- 요청/응답 로깅

### Phase 3: 스타일링 혁명 (2-3일)
**목표**: StyleSheet를 현대적인 스타일링 시스템으로 교체

#### 📁 관련 파일 및 폴더 (옵션 A: NativeWind)
- 🔄 `app/(tabs)/index.tsx` (140줄 StyleSheet → Tailwind 클래스)
- 🔄 `app/(tabs)/exchange.tsx`, `transaction.tsx`, `profile.tsx`
- 📦 `package.json` (nativewind, tailwindcss 추가)
- ➕ `tailwind.config.js` (설정 파일)
- 🔄 `metro.config.js` (NativeWind 설정)
- 🔄 `babel.config.js` (플러그인 추가)
- 🗑️ 모든 파일의 `StyleSheet.create({})` 제거

#### 📁 관련 파일 및 폴더 (옵션 B: Tamagui)
- 📦 `package.json` (@tamagui/* 패키지들)
- ➕ `tamagui.config.ts` (디자인 시스템 설정)
- 🔄 `app/_layout.tsx` (Tamagui Provider 추가)
- 🔄 모든 컴포넌트 파일 (Tamagui 컴포넌트 사용)

#### 옵션 A: NativeWind (Tailwind CSS)
- [ ] NativeWind 설치 및 설정
- [ ] 기존 StyleSheet → Tailwind 클래스 변환
- [ ] 반응형 디자인 적용
- [ ] 다크모드 지원

#### 옵션 B: Tamagui
- [ ] Tamagui 설치 및 설정
- [ ] 디자인 시스템 구축
- [ ] 컴포넌트 라이브러리 생성
- [ ] 테마 시스템 구축

#### 💡 기대 효과
- 개발 속도 향상
- 일관된 디자인 시스템
- 유지보수성 개선
- 모던한 UI/UX

### Phase 4: 애니메이션 & UI 향상 (2-3일)
**목표**: 사용자 경험을 향상시키는 애니메이션 및 인터랙션 구현

#### 📁 관련 파일 및 폴더
- 📦 `package.json` (react-native-reanimated 이미 설치됨!)
- 🔄 `app/(tabs)/_layout.tsx` (탭 전환 애니메이션)
- 🔄 `components/TransactionList.tsx` (목록 애니메이션)
- ➕ `components/animations/` (애니메이션 컴포넌트 폴더)
- 🔄 `app/(tabs)/index.tsx` (잔고 카드 애니메이션)
- 🔄 모든 버튼과 인터랙티브 요소 (터치 피드백)

#### 🎯 구체적 작업
- [ ] React Native Reanimated 활용
- [ ] 화면 전환 애니메이션
- [ ] 제스처 기반 인터랙션
- [ ] 로딩 애니메이션
- [ ] 마이크로 인터랙션

#### 💡 기대 효과
- 프리미엄 앱 느낌
- 사용자 만족도 향상
- 자연스러운 인터랙션
- 브랜드 차별화

### Phase 5: 성능 최적화 (1-2일)
**목표**: 앱 성능 최적화 및 메모리 효율성 개선

#### 📁 관련 파일 및 폴더
- 🔄 `components/TransactionList.tsx` (FlatList 최적화)
- 🔄 `hooks/useWalletBalance.ts` (메모이제이션 적용)
- 🔄 모든 컴포넌트 (React.memo, useMemo, useCallback)
- 📦 `package.json` (expo-image 이미 설치됨!)
- 🔄 `metro.config.js` (번들링 최적화)
- ➕ `scripts/bundle-analyzer.js` (번들 크기 분석)
- 🔄 이미지 파일들 (최적화 및 압축)

#### 🎯 구체적 작업
- [ ] 번들 크기 분석 및 최적화
- [ ] 이미지 최적화 (Expo Image 활용)
- [ ] 메모이제이션 적용 (useMemo, useCallback)
- [ ] FlatList 가상화
- [ ] 코드 스플리팅 적용

#### 💡 기대 효과
- 빠른 앱 시작 시간
- 메모리 사용량 최적화
- 부드러운 스크롤링
- 배터리 효율성 개선

### Phase 6: 실제 배포 (1-2일)
**목표**: Google Play Store와 App Store에 실제 배포

#### 📁 관련 파일 및 폴더
- ➕ `eas.json` (EAS Build 설정)
- 🔄 `app.config.js` (앱 메타데이터, 아이콘, 스플래시)
- 🔄 `package.json` (@expo/cli, eas-cli 추가)
- ➕ `assets/` (앱 아이콘, 스플래시 이미지)
- ➕ `.github/workflows/build-deploy.yml` (CI/CD 파이프라인)
- ➕ `docs/store-assets/` (스토어 스크린샷, 설명)
- 🔄 `constants/config.ts` (프로덕션 API URL)

#### 🎯 구체적 작업
- [ ] EAS Build 설정
- [ ] iOS 빌드 설정 (macOS 없이)
- [ ] Android 빌드 최적화
- [ ] 앱 아이콘 및 스플래시 화면
- [ ] 스토어 메타데이터 준비
- [ ] 실제 기기 테스트
- [ ] 스토어 업로드

#### 💡 기대 효과
- 실제 사용자에게 서비스 제공
- 포트폴리오 완성
- 앱 스토어 배포 경험
- 실제 피드백 수집

## 📊 진행 상황 추적

| Phase | 상태 | 시작일 | 완료일 | 핵심 파일 | 비고 |
|-------|------|--------|--------|-----------|------|
| Phase 1 | 🟢 완료 | 2025-09-21 | 2025-09-21 | `stores/authStore.ts`, `stores/walletStore.ts`, `stores/transactionStore.ts` | Zustand 마이그레이션 완료 |
| Phase 2 | ⚪ 미시작 | - | - | `services/apiClient.ts` → axios | API 통신 통합 |
| Phase 3 | ⚪ 미시작 | - | - | `app/(tabs)/index.tsx` 140줄 → className | 스타일링 시스템 |
| Phase 4 | ⚪ 미시작 | - | - | `components/` + animations | 애니메이션 & UI |
| Phase 5 | ⚪ 미시작 | - | - | 모든 컴포넌트 최적화 | 성능 최적화 |
| Phase 6 | ⚪ 미시작 | - | - | `eas.json` + 스토어 배포 | 실제 배포 |

### 📝 진행 상황 업데이트 규칙
각 Phase 시작/완료 시 반드시 업데이트:
- ✅ **상태 변경**: 🟡 진행 중 → 🟢 완료
- ✅ **날짜 기록**: 실제 시작일과 완료일 입력
- ✅ **파일 변경 내역**: 실제 수정된 파일 목록
- ✅ **예상치 못한 이슈**: 발생한 문제와 해결 방법

## 🛠 기술 스택 변화

### Before (해커톤 버전)
```
React Native + Expo
├── 상태관리: React Context API
├── 스타일링: StyleSheet (140줄+)
├── API: OpenAPI Client + fetch 혼용
├── 애니메이션: 기본 애니메이션만
└── 배포: Expo Go 테스트만
```

### After (프로덕션 버전)
```
React Native + Expo
├── 상태관리: Zustand (타입 안전성)
├── 스타일링: NativeWind/Tamagui (모던 UI)
├── API: Axios (인터셉터, 에러 처리)
├── 애니메이션: Reanimated 2 (60fps)
└── 배포: EAS Build (실제 앱스토어)
```

## 📈 성공 지표

### 기술적 목표
- [ ] 앱 시작 시간 < 3초
- [ ] JavaScript 번들 크기 < 2MB
- [ ] 메모리 사용량 < 100MB
- [ ] 60fps 부드러운 애니메이션

### 비즈니스 목표
- [ ] Google Play Store 배포 완료
- [ ] App Store 배포 완료
- [ ] 실제 사용자 테스트 10명
- [ ] 포트폴리오 프로젝트 완성

## 🚨 리스크 관리

### 잠재적 문제
1. **iOS 배포 제약** (macOS 없음)
   - 해결: EAS Build 클라우드 빌드 활용

2. **Tamagui 설정 복잡성**
   - 해결: NativeWind 대안 준비

3. **성능 이슈**
   - 해결: 단계별 측정 및 최적화

4. **배포 심사 거부**
   - 해결: 스토어 가이드라인 사전 숙지

## 💪 학습 목표

이 프로젝트를 통해 습득할 기술:
- ✅ React Native 심화 개발
- ✅ 상태관리 라이브러리 선택 및 적용
- ✅ 모바일 앱 성능 최적화
- ✅ 모던 스타일링 시스템
- ✅ 실제 앱스토어 배포 경험
- ✅ CI/CD 파이프라인 구축

---

## 🎯 실행 가이드

### 문서 최신화 체크리스트
각 Phase 진행 시 Claude가 자동으로 확인할 항목:

- [ ] **시작 시**: 진행 상황 테이블에서 상태를 🟡 진행 중으로 변경
- [ ] **진행 중**: 완료된 작업에 ✅ 체크 표시
- [ ] **완료 시**: 상태를 🟢 완료로 변경하고 완료일 기록
- [ ] **파일 변경**: 실제 수정/추가/삭제된 파일 목록 업데이트
- [ ] **이슈 기록**: 예상치 못한 문제나 학습 내용 추가

### Phase 우선순위 추천
1. **Phase 1** (Zustand): 기본 아키텍처 개선
2. **Phase 3** (NativeWind): 시각적 개선으로 빠른 만족도 향상  
3. **Phase 6** (배포): 실제 앱스토어 경험
4. **Phase 2, 4, 5**: 점진적 개선

**다음 단계**: [CS 지식 문서](../cs-knowledge/) 검토 후 Phase 1 시작

---

💡 **Claude 알림**: 이 문서는 살아있는 문서입니다. 각 작업 시 자동으로 업데이트하겠습니다!