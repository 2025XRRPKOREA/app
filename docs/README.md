# RipplePay 개발 문서

RipplePay 앱을 해커톤 프로토타입에서 실제 배포 가능한 프로덕션 앱으로 발전시키는 과정을 문서화합니다.

## 📁 문서 구조

### 📋 개발 계획 (`development-plan/`)
- [메인 로드맵](./development-plan/roadmap.md) - 전체 개발 계획 및 단계별 목표
- [Phase별 상세 계획](./development-plan/) - 각 개발 단계별 구체적인 실행 계획

### 🧠 CS 지식 (`cs-knowledge/`)
기술 선택의 배경과 CS 지식을 포트폴리오용으로 정리합니다.

- [상태관리 - Zustand](./cs-knowledge/CS_zustand.md) - 상태관리 라이브러리 비교 및 선택 이유
- [성능 최적화](./cs-knowledge/CS_performance.md) - React Native 성능 최적화 및 코드 스플리팅
- [스타일링 시스템](./cs-knowledge/CS_styling.md) - StyleSheet vs Tailwind vs Tamagui 비교
- [API 통신](./cs-knowledge/CS_api.md) - API 통신 패턴 및 axios 마이그레이션
- [배포 전략](./cs-knowledge/CS_deployment.md) - 모바일 앱 배포 및 CI/CD

## 🎯 프로젝트 목표

**해커톤 → 프로덕션 앱 전환**
- ✅ 현재: 기본 기능 구현된 해커톤 버전
- 🎯 목표: Google Play Store & App Store 배포 가능한 완전한 앱

## 🚀 핵심 개선 영역

1. **상태관리 현대화**: Context API → Zustand
2. **API 통신 통합**: OpenAPI Client + fetch → Axios 통합
3. **스타일링 혁신**: StyleSheet → NativeWind/Tamagui
4. **성능 최적화**: 번들 크기 최적화 및 렌더링 성능 개선
5. **배포 환경**: EAS Build를 통한 실제 앱스토어 배포

## 📱 기술 스택

### 현재 (해커톤 버전)
- **Framework**: React Native + Expo
- **상태관리**: React Context API
- **스타일링**: StyleSheet
- **API**: OpenAPI Generated Client + fetch

### 목표 (프로덕션 버전)
- **Framework**: React Native + Expo
- **상태관리**: Zustand
- **스타일링**: NativeWind (Tailwind for RN) 또는 Tamagui
- **API**: Axios with interceptors
- **애니메이션**: Reanimated 2
- **배포**: EAS Build

## 📈 성장 기록

이 문서들은 개발 과정에서의 기술적 의사결정과 학습 과정을 기록하여, 포트폴리오와 기술 면접에서 활용할 수 있도록 구성되었습니다.

---

**개발 시작일**: 2025-01-21  
**목표 완료일**: 2025-02-15  
**현재 브랜치**: `develop`