# React Native 성능 최적화 및 코드 스플리팅

> **기술 면접 포인트**: 모바일 앱 성능 최적화 전략과 코드 스플리팅 원리

## 🎯 성능 최적화가 중요한 이유

### 모바일 환경의 제약사항
- **제한된 메모리**: 일반적으로 1-4GB RAM
- **배터리 효율성**: CPU 사용량이 배터리 수명에 직접 영향
- **네트워크 지연**: 모바일 네트워크의 불안정성
- **다양한 디바이스**: 저사양부터 고사양까지 다양한 스펙

### 사용자 경험에 미치는 영향
- **앱 시작 시간**: 3초 이상 걸리면 사용자 이탈률 증가
- **UI 응답성**: 60fps 유지 실패시 앱이 느려 보임
- **메모리 누수**: 앱 크래시 및 시스템 불안정

## 📊 성능 측정 도구

### 1. React Native 내장 도구
```bash
# 성능 모니터링 활성화
npx react-native run-android --variant=release

# JavaScript 스레드 모니터링
import { Systrace } from 'react-native';
Systrace.beginEvent('expensive-operation');
// 무거운 작업
Systrace.endEvent();
```

### 2. Flipper (Facebook의 디버깅 도구)
```typescript
// 성능 프로파일링
// 1. CPU 사용량 모니터링
// 2. 메모리 사용량 추적
// 3. 네트워크 요청 분석
// 4. UI 렌더링 성능 측정
```

### 3. React DevTools Profiler
```typescript
// 컴포넌트 렌더링 성능 측정
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Render time:', actualDuration);
}

<Profiler id="WalletBalance" onRender={onRenderCallback}>
  <WalletBalance />
</Profiler>
```

## 🚀 React Native 성능 최적화 기법

### 1. 렌더링 최적화

#### React.memo() 활용
```typescript
// Before: 불필요한 리렌더링
const TransactionItem = ({ transaction }) => {
  return (
    <View>
      <Text>{transaction.amount}</Text>
      <Text>{transaction.date}</Text>
    </View>
  );
};

// After: 메모이제이션 적용
const TransactionItem = React.memo(({ transaction }) => {
  return (
    <View>
      <Text>{transaction.amount}</Text>
      <Text>{transaction.date}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수
  return prevProps.transaction.id === nextProps.transaction.id;
});
```

#### useMemo와 useCallback 최적화
```typescript
// Before: 매번 새로운 객체/함수 생성
const WalletBalance = () => {
  const formatBalance = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const balanceStyle = {
    color: balance > 0 ? 'green' : 'red',
    fontSize: 24,
  };

  return <Text style={balanceStyle}>{formatBalance(balance)}</Text>;
};

// After: 메모이제이션 적용
const WalletBalance = () => {
  const formatBalance = useCallback((amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  }, []);

  const balanceStyle = useMemo(() => ({
    color: balance > 0 ? 'green' : 'red',
    fontSize: 24,
  }), [balance]);

  const formattedBalance = useMemo(() => 
    formatBalance(balance), [balance, formatBalance]
  );

  return <Text style={balanceStyle}>{formattedBalance}</Text>;
};
```

### 2. FlatList 최적화

#### 가상화 및 최적화 프로퍼티
```typescript
// Before: 기본 FlatList
<FlatList
  data={transactions}
  renderItem={({ item }) => <TransactionItem transaction={item} />}
/>

// After: 최적화된 FlatList
<FlatList
  data={transactions}
  renderItem={({ item }) => <TransactionItem transaction={item} />}
  // 성능 최적화 옵션들
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={5}
  updateCellsBatchingPeriod={50}
  // 메모리 절약
  onEndReachedThreshold={0.5}
/>
```

### 3. 이미지 최적화

#### Expo Image 활용
```typescript
// Before: 기본 Image 컴포넌트
import { Image } from 'react-native';

<Image 
  source={{ uri: userAvatar }} 
  style={{ width: 50, height: 50 }}
/>

// After: Expo Image (캐싱, 최적화)
import { Image } from 'expo-image';

<Image
  source={{ uri: userAvatar }}
  style={{ width: 50, height: 50 }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### 4. 번들 크기 최적화

#### Tree Shaking과 Dead Code Elimination
```typescript
// Before: 전체 라이브러리 import
import * as _ from 'lodash';
import moment from 'moment';

// After: 필요한 함수만 import
import { debounce, throttle } from 'lodash';
import { format } from 'date-fns';
```

#### 조건부 Import
```typescript
// Before: 모든 플랫폼에서 불필요한 import
import { Camera } from 'expo-camera';

// After: 플랫폼별 조건부 import
const Camera = Platform.OS === 'web' 
  ? null 
  : require('expo-camera').Camera;
```

## 🧩 코드 스플리팅 (Code Splitting)

### 코드 스플리팅이란?
하나의 큰 번들 파일을 여러 개의 작은 청크로 나누어 필요한 시점에만 로드하는 기법

### React Native에서의 코드 스플리팅

#### 1. Route-based Splitting (경로 기반)
```typescript
// Before: 모든 화면이 메인 번들에 포함
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';

// After: Lazy Loading 적용
const LoginScreen = React.lazy(() => import('./screens/LoginScreen'));
const DashboardScreen = React.lazy(() => import('./screens/DashboardScreen'));
const ProfileScreen = React.lazy(() => import('./screens/ProfileScreen'));

// Suspense로 감싸기
<Suspense fallback={<LoadingSpinner />}>
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
</Suspense>
```

#### 2. Component-based Splitting (컴포넌트 기반)
```typescript
// 무거운 차트 컴포넌트를 동적 로딩
const ChartComponent = React.lazy(() => 
  import('./components/ExpensiveChart')
);

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <View>
      <Button 
        title="차트 보기" 
        onPress={() => setShowChart(true)} 
      />
      {showChart && (
        <Suspense fallback={<Text>차트 로딩 중...</Text>}>
          <ChartComponent />
        </Suspense>
      )}
    </View>
  );
};
```

#### 3. Metro Bundler 설정
```javascript
// metro.config.js
module.exports = {
  resolver: {
    // 코드 스플리팅을 위한 설정
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
  },
  transformer: {
    // JavaScript 변환 설정
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      // 트리 셰이킹 활성화
      mangle: true,
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
      },
    },
  },
};
```

### React Native의 번들링 특성
```typescript
// React Native는 단일 번들이지만 최적화 가능
// 1. Metro bundler가 자동으로 unused code 제거
// 2. 플랫폼별 번들 생성 (android/ios)
// 3. 개발/프로덕션 모드별 최적화

// 예: 플랫폼별 파일
// Button.ios.tsx
// Button.android.tsx
// Button.tsx (공통)
```

## ⚡ JavaScript 스레드 최적화

### 1. 무거운 연산을 UI 스레드에서 분리
```typescript
// Before: 메인 스레드에서 무거운 연산
const processTransactions = (transactions) => {
  return transactions.map(transaction => ({
    ...transaction,
    formattedAmount: new Intl.NumberFormat('ko-KR').format(transaction.amount),
    category: categorizeTransaction(transaction),
  }));
};

// After: InteractionManager 활용
import { InteractionManager } from 'react-native';

const processTransactions = (transactions) => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      const processed = transactions.map(transaction => ({
        ...transaction,
        formattedAmount: new Intl.NumberFormat('ko-KR').format(transaction.amount),
        category: categorizeTransaction(transaction),
      }));
      resolve(processed);
    });
  });
};
```

### 2. 배치 처리로 UI 블로킹 방지
```typescript
// Before: 모든 데이터를 한번에 처리
const processBulkData = (data) => {
  return data.map(item => expensiveOperation(item));
};

// After: 청크 단위로 나누어 처리
const processBulkDataInBatches = async (data, batchSize = 100) => {
  const results = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResults = batch.map(item => expensiveOperation(item));
    results.push(...batchResults);
    
    // UI 스레드에 제어권 반환
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
};
```

## 📱 메모리 관리

### 1. 메모리 누수 방지
```typescript
// Before: 메모리 누수 위험
useEffect(() => {
  const subscription = EventEmitter.addListener('dataUpdate', handleUpdate);
  // cleanup 없음
}, []);

// After: 적절한 cleanup
useEffect(() => {
  const subscription = EventEmitter.addListener('dataUpdate', handleUpdate);
  
  return () => {
    subscription.remove(); // 구독 해제
  };
}, []);

// 타이머 정리
useEffect(() => {
  const timer = setInterval(updateBalance, 5000);
  
  return () => {
    clearInterval(timer);
  };
}, []);
```

### 2. 큰 객체 참조 해제
```typescript
// Before: 큰 데이터 계속 보유
const [transactionHistory, setTransactionHistory] = useState([]);

// After: 필요 없는 데이터 정리
const [recentTransactions, setRecentTransactions] = useState([]);

// 오래된 데이터 정리
useEffect(() => {
  const cleanup = () => {
    setRecentTransactions(prev => 
      prev.filter(tx => Date.now() - tx.timestamp < 7 * 24 * 60 * 60 * 1000)
    );
  };
  
  const timer = setInterval(cleanup, 60000); // 1분마다 정리
  return () => clearInterval(timer);
}, []);
```

## 📊 성능 측정 및 모니터링

### 번들 크기 분석
```bash
# Metro Bundle Analyzer
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js --sourcemap-output android-sourcemap.map

# 번들 크기 분석
npx react-native-bundle-visualizer
```

### 성능 지표 수집
```typescript
// 커스텀 성능 측정
const performanceMonitor = {
  startTime: Date.now(),
  
  measureRenderTime: (componentName: string) => {
    return (WrappedComponent: React.ComponentType) => {
      return (props: any) => {
        const startTime = performance.now();
        
        useEffect(() => {
          const endTime = performance.now();
          console.log(`${componentName} 렌더링 시간: ${endTime - startTime}ms`);
        });
        
        return <WrappedComponent {...props} />;
      };
    };
  },
  
  measureMemoryUsage: () => {
    if (performance.memory) {
      console.log('사용 중인 메모리:', performance.memory.usedJSHeapSize);
      console.log('메모리 한계:', performance.memory.jsHeapSizeLimit);
    }
  },
};
```

## 🎯 RipplePay 프로젝트 적용 계획

### 현재 성능 이슈 분석
```typescript
// 1. 홈 화면 (app/(tabs)/index.tsx)
// - 140줄의 StyleSheet (인라인 스타일 최적화 필요)
// - useWalletBalance 훅 최적화
// - TransactionList 가상화 적용

// 2. API 호출 최적화
// - 불필요한 API 중복 호출 방지
// - 캐싱 전략 수립
// - 배치 요청 구현

// 3. 번들 크기 최적화
// - 현재 의존성 분석
// - 불필요한 라이브러리 제거
// - 조건부 import 적용
```

### 개선 목표
- **앱 시작 시간**: < 3초
- **JavaScript 번들**: < 2MB
- **메모리 사용량**: < 100MB
- **60fps 유지**: 스크롤 및 애니메이션

## 💡 면접 질문 예상 답변

### Q: "React Native에서 성능 병목의 주요 원인은?"
**A**: "주로 JavaScript 스레드와 UI 스레드 간의 통신 비용, 불필요한 리렌더링, 메모리 누수가 원인입니다. JavaScript는 싱글 스레드이므로 무거운 연산이 UI를 블로킹할 수 있어요. 이를 해결하기 위해 InteractionManager, React.memo, useMemo 등을 활용합니다."

### Q: "코드 스플리팅을 어떻게 적용했나요?"
**A**: "React.lazy와 Suspense를 활용해 화면별로 분할했습니다. 특히 무거운 차트나 카메라 컴포넌트는 사용자가 실제로 접근할 때만 로드되도록 했어요. Metro bundler 설정도 최적화해서 불필요한 코드는 제거했습니다."

### Q: "메모리 누수를 어떻게 방지했나요?"
**A**: "useEffect의 cleanup 함수를 철저히 활용했습니다. 이벤트 리스너, 타이머, 구독 등은 모두 컴포넌트 언마운트 시 정리하도록 했고, WeakMap이나 WeakSet을 활용해서 참조 관리도 개선했습니다."

## 🔗 참고 자료

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Metro Bundler](https://metrobundler.dev/)
- [React DevTools Profiler](https://react.dev/blog/2018/09/10/introducing-the-react-profiler)

---

**다음 학습**: [스타일링 시스템 비교](./CS_styling.md)