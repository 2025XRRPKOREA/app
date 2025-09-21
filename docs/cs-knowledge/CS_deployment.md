# 모바일 앱 배포 전략 및 CI/CD

> **기술 면접 포인트**: 모바일 앱 배포 파이프라인과 크로스 플랫폼 빌드 전략

## 🎯 모바일 앱 배포의 복잡성

### 기존 웹 배포와의 차이점
- **앱 스토어 심사**: Google Play Store, Apple App Store의 정책과 심사 과정
- **플랫폼별 빌드**: iOS (.ipa), Android (.apk/.aab) 별도 빌드 필요
- **코드 사이닝**: 인증서와 프로비저닝 프로파일 관리
- **버전 관리**: 앱 스토어별 버전 번호 체계
- **배포 승인**: 즉시 배포 불가능, 심사 기간 필요

### RipplePay의 배포 제약사항
```bash
# 현재 환경
- Windows 개발 환경 (macOS 없음)
- iOS 기기 보유 (iPhone)
- Android Studio 미설치
- 현재: Expo Go로만 테스트

# 목표
- Google Play Store 배포
- Apple App Store 배포 (macOS 없이!)
- 자동화된 CI/CD 파이프라인
```

## 📊 배포 방식 비교 분석

### 1. Expo Classic Build (현재 가능)

#### 장점과 사용법
```bash
# Expo Classic Build (deprecated되었지만 여전히 작동)
expo build:android  # APK 생성
expo build:ios      # IPA 생성 (macOS 없이도 가능!)

# 장점:
# ✅ macOS 없이 iOS 빌드 가능
# ✅ 클라우드에서 빌드 처리
# ✅ 간단한 설정과 명령어
# ✅ 인증서 자동 관리 옵션
```

#### 제약사항
```bash
# 문제점:
# ❌ Expo SDK에만 의존 (네이티브 모듈 제한)
# ❌ deprecated (지원 중단 예정)
# ❌ 제한된 커스터마이징
# ❌ 큰 앱 크기 (모든 Expo 기능 포함)
```

### 2. EAS Build (Expo Application Services) - 권장

#### EAS Build의 혁신성
```yaml
# eas.json 설정
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-key.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "AB12CD34EF"
      }
    }
  }
}
```

#### 핵심 장점
```typescript
// ✅ 모든 React Native 프로젝트 지원 (Expo 제약 없음)
// ✅ 클라우드 기반 빌드 (macOS 없이 iOS 빌드)
// ✅ 강력한 캐싱 시스템
// ✅ 자동 스토어 제출
// ✅ 프리뷰 빌드와 내부 배포
// ✅ 환경별 빌드 설정
// ✅ 네이티브 모듈 완전 지원

// 빌드 명령어
eas build --platform android --profile production
eas build --platform ios --profile production
eas build --platform all --profile preview  // 양쪽 동시 빌드
```

### 3. 기존 방식 (React Native CLI)

#### 로컬 빌드의 한계
```bash
# Android (Windows에서 가능)
cd android && ./gradlew assembleRelease
# 문제: 복잡한 환경 설정, 의존성 관리

# iOS (macOS 필수)
xcodebuild -workspace ios/App.xcworkspace -scheme App archive
# 문제: macOS 없으면 불가능!
```

## 🚀 macOS 없이 iOS 배포하기

### EAS Build를 활용한 iOS 배포 전략

#### 1단계: Apple Developer 계정 설정
```bash
# Apple Developer Program 가입 ($99/년)
# - 개인 또는 조직 계정
# - iOS 기기에서 Apple ID로 가입 가능
# - Windows에서도 Apple Developer 웹사이트 접근 가능
```

#### 2단계: 인증서 및 프로비저닝 관리
```bash
# EAS CLI로 인증서 자동 생성
eas credentials

# 또는 수동 관리
# 1. Apple Developer 사이트에서 인증서 생성
# 2. 프로비저닝 프로파일 생성
# 3. EAS에 업로드

# Windows에서도 가능한 방법:
# - 브라우저에서 Apple Developer 사이트 접근
# - 인증서 요청 파일(CSR) 생성
# - 다운로드한 인증서를 EAS에 업로드
```

#### 3단계: EAS 빌드 설정
```javascript
// app.config.js
export default {
  expo: {
    name: "RipplePay",
    slug: "ripplepay",
    ios: {
      bundleIdentifier: "com.ripplepay.app",
      buildNumber: "1.0.0",
    },
    android: {
      package: "com.ripplepay.app",
      versionCode: 1,
    },
    extra: {
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
```

#### 4단계: 실제 빌드 및 배포
```bash
# iOS 빌드 (클라우드에서 실행)
eas build --platform ios --profile production

# 빌드 완료 후 자동으로 App Store Connect에 업로드
eas submit --platform ios --profile production

# 또는 수동 업로드
# 1. 빌드된 .ipa 파일 다운로드
# 2. Transporter 앱 (Windows용 있음) 또는 웹 인터페이스로 업로드
```

## 📱 Android 배포 전략

### Google Play Console 배포

#### 1단계: Play Console 설정
```bash
# Google Play Console 계정 생성 ($25 일회성)
# - 개발자 계정 등록
# - 앱 등록 및 설정
# - 릴리스 키 생성
```

#### 2단계: 앱 서명 키 관리
```bash
# Android 앱 번들(.aab) 사용 권장
# EAS Build에서 자동 처리

# eas.json 설정
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"  // .aab 생성
      }
    }
  }
}
```

#### 3단계: 자동 배포
```bash
# Google Play 서비스 계정 키 설정
# 1. Google Cloud Console에서 서비스 계정 생성
# 2. JSON 키 다운로드
# 3. EAS에 설정

# 자동 배포
eas submit --platform android --profile production
```

## 🔄 CI/CD 파이프라인 구성

### GitHub Actions + EAS Build

#### 워크플로우 설정
```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 🏗 Setup repo
        uses: actions/checkout@v3

      - name: 🏗 Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: npm

      - name: 🏗 Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🚀 Build on EAS
        run: |
          eas build --platform all --profile production --non-interactive

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: 🚀 Submit to stores
        run: |
          eas submit --platform all --profile production --non-interactive
```

### 환경별 배포 전략
```yaml
# 다중 환경 설정
{
  "build": {
    "development": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "staging": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

## 🛡️ 앱 스토어 심사 대응

### Apple App Store 심사 가이드라인

#### 주요 체크 포인트
```typescript
// 1. 앱 메타데이터
const appMetadata = {
  name: "RipplePay",
  description: "XRP와 KRW를 쉽게 거래할 수 있는 모바일 지갑",
  keywords: "xrp, 암호화폐, 지갑, 송금",
  category: "금융",
  
  // 스크린샷 (각 기기별 필수)
  screenshots: {
    iPhone: ["6.7인치", "6.5인치", "5.5인치"],
    iPad: ["12.9인치", "11인치"],
  }
};

// 2. 개인정보 보호
const privacyPolicy = {
  url: "https://ripplepay.com/privacy",
  dataCollection: {
    location: false,
    contacts: false,
    biometrics: true, // 생체 인증 사용시
  }
};

// 3. 금융 앱 특별 요구사항
const financialCompliance = {
  encryption: true, // 암호화 사용 신고
  thirdPartyPayments: false, // 제3자 결제 사용 여부
  contentRating: "4+", // 연령 등급
};
```

#### 심사 거부 방지 체크리스트
```typescript
// ❌ 심사 거부 요인들
const rejectionReasons = [
  "크래시나 버그",
  "불완전한 기능",
  "개인정보 정책 부재",
  "저작권 침해",
  "부적절한 콘텐츠",
  "Apple 가이드라인 위반"
];

// ✅ 심사 통과 준비사항
const approvalChecklist = [
  "모든 기능 완전 동작",
  "개인정보 처리방침 링크",
  "앱 설명과 실제 기능 일치",
  "고품질 스크린샷",
  "적절한 콘텐츠 등급",
  "테스트 계정 제공 (필요시)"
];
```

### Google Play 정책 준수

#### 주요 정책 영역
```typescript
const playPolicyCompliance = {
  // 금융 서비스 정책
  financialServices: {
    transparentFees: true, // 수수료 명시
    secureTransactions: true, // 보안 거래
    regulatoryCompliance: true, // 규제 준수
  },
  
  // 개인정보 보호
  privacy: {
    dataHandling: "명확한 데이터 사용 설명",
    userConsent: "사용자 동의 획득",
    dataRetention: "데이터 보관 정책",
  },
  
  // 보안
  security: {
    encryption: "AES-256 암호화",
    authentication: "생체 인증 지원",
    secureStorage: "Keychain/Keystore 사용",
  }
};
```

## 📊 배포 모니터링 및 분석

### 앱 성능 추적
```typescript
// Expo Application Services Analytics
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';

const trackDeployment = async () => {
  const update = await Updates.checkForUpdateAsync();
  
  console.log('현재 빌드:', Application.nativeBuildVersion);
  console.log('업데이트 사용 가능:', update.isAvailable);
  
  // 사용자 메트릭 수집
  const metrics = {
    platform: Platform.OS,
    version: Application.nativeApplicationVersion,
    buildNumber: Application.nativeBuildVersion,
    installTime: Application.getInstallationTimeAsync(),
  };
  
  // 애널리틱스 서비스로 전송
  analytics.track('app_launched', metrics);
};
```

### A/B 테스팅과 점진적 출시
```bash
# Google Play Console - 단계적 출시
# 1% → 5% → 10% → 50% → 100%

# App Store Connect - 단계적 출시
# TestFlight → 내부 테스팅 → 외부 테스팅 → 출시
```

## 🎯 RipplePay 배포 실행 계획

### Phase 1: 환경 구성 (1일)
```bash
# 1. EAS CLI 설치 및 설정
npm install -g @expo/cli eas-cli
eas login
eas init

# 2. Apple Developer & Google Play 계정 설정
# 3. 인증서 및 키 설정
eas credentials

# 4. eas.json 설정 파일 작성
```

### Phase 2: 빌드 테스트 (1일)
```bash
# 1. 개발용 빌드 테스트
eas build --platform all --profile development

# 2. 내부 배포 테스트
eas build --platform all --profile preview

# 3. 실제 기기에서 테스트
# 4. 버그 수정 및 최적화
```

### Phase 3: 프로덕션 배포 (1일)
```bash
# 1. 프로덕션 빌드
eas build --platform all --profile production

# 2. 스토어 메타데이터 준비
# - 앱 설명, 스크린샷, 키워드
# - 개인정보 처리방침
# - 지원 연락처

# 3. 스토어 제출
eas submit --platform all --profile production

# 4. 심사 대기 및 대응
```

### Phase 4: CI/CD 자동화 (선택사항)
```bash
# 1. GitHub Actions 워크플로우 설정
# 2. 자동 빌드 및 테스트
# 3. 자동 배포 파이프라인
# 4. 슬랙/이메일 알림 설정
```

## 💡 면접 질문 예상 답변

### Q: "macOS 없이 iOS 앱을 어떻게 배포했나요?"
**A**: "EAS Build를 활용했습니다. 클라우드에서 iOS 빌드를 처리하므로 macOS가 없어도 가능해요. Apple Developer 계정만 있으면 브라우저에서 인증서를 관리하고, EAS CLI로 빌드부터 App Store 제출까지 자동화할 수 있었습니다."

### Q: "앱 스토어 심사에서 어려웠던 점은?"
**A**: "금융 앱이다 보니 개인정보 보호와 보안 관련 요구사항이 까다로웠습니다. 특히 생체 인증 사용 시 명확한 사용 목적 설명과 개인정보 처리방침 링크가 필수였어요. 또한 모든 기능이 완전히 동작해야 하므로 철저한 테스트가 중요했습니다."

### Q: "배포 자동화는 어떻게 구성했나요?"
**A**: "GitHub Actions와 EAS Build를 연동했습니다. main 브랜치에 푸시되면 자동으로 빌드되고, 성공하면 스토어에 제출되도록 했어요. 환경별로 다른 설정을 사용하고, 빌드 실패 시 Slack으로 알림을 받도록 구성했습니다."

## 🔗 참고 자료

- [EAS Build 공식 문서](https://docs.expo.dev/build/introduction/)
- [Apple App Store 심사 가이드라인](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play 정책 센터](https://play.google.com/about/developer-content-policy/)
- [React Native 배포 가이드](https://reactnative.dev/docs/signed-apk-android)

---

**완료**: 모든 CS 지식 문서화 완료! 이제 실제 개발 시작 준비 완료 🚀