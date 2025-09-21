# 상태관리 라이브러리 비교 및 Zustand 선택

> **기술 면접 포인트**: 상태관리 라이브러리 선택 기준과 마이그레이션 전략

## 🎯 문제 정의

### 현재 상황 (Context API 사용)
```typescript
// context/AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  // ... 복잡한 로직들
}
```

### 발생한 문제들
1. **불필요한 리렌더링**: Context 값이 변경될 때마다 모든 자식 컴포넌트 리렌더링
2. **Props Drilling**: 깊은 컴포넌트 트리에서 상태 전달의 복잡성
3. **상태 로직 분산**: 비즈니스 로직이 컴포넌트와 혼재
4. **테스트 어려움**: Context Provider 설정의 복잡성

## 📊 상태관리 라이브러리 비교 분석

### 1. Redux Toolkit
```typescript
// 장점
- 강력한 개발자 도구 (Redux DevTools)
- 예측 가능한 상태 변화 (Time Travel)
- 대규모 앱에서 검증된 안정성
- 미들웨어 생태계 (redux-saga, redux-thunk)

// 단점
- 보일러플레이트 코드 과다
- 러닝 커브 높음
- 작은 앱에는 과도한 복잡성
- 번들 사이즈 증가
```

### 2. React Context API (현재)
```typescript
// 장점
- React 내장 API (추가 의존성 없음)
- 간단한 글로벌 상태 공유
- 학습 비용 낮음

// 단점
- 성능 이슈 (불필요한 리렌더링)
- 복잡한 상태 로직 관리 어려움
- 상태 업데이트 최적화 어려움
- 개발자 도구 부족
```

### 3. Zustand (선택!)
```typescript
// 장점
- 최소한의 보일러플레이트
- 우수한 TypeScript 지원
- 작은 번들 사이즈 (2.7kb)
- 선택적 리렌더링 (selector 패턴)
- 미들웨어 지원 (persist, devtools)

// 단점
- 상대적으로 작은 생태계
- Redux만큼 강력하지 않은 디버깅 도구
```

### 4. Jotai
```typescript
// 장점
- Atomic 접근법
- Bottom-up 상태 관리
- 우수한 TypeScript 지원

// 단점
- 새로운 패러다임 (러닝 커브)
- 복잡한 상태 관계에서 관리 어려움
```

## 🏆 Zustand 선택 이유

### 1. 성능 최적화
```typescript
// Context API (문제)
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ user, token, isLoading });
  // state 중 하나만 변해도 모든 컴포넌트 리렌더링
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

// Zustand (해결)
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  // 선택적 구독으로 필요한 부분만 리렌더링
}));

// 컴포넌트에서 필요한 상태만 구독
const user = useAuthStore((state) => state.user); // user만 변경시에만 리렌더링
const isLoading = useAuthStore((state) => state.isLoading); // isLoading만 변경시에만 리렌더링
```

### 2. 타입 안전성
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 완전한 타입 추론 지원
const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login(email, password);
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => set({ user: null, token: null }),
}));
```

### 3. 미들웨어 활용
```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

// 자동 영속화
const useAuthStore = create(
  persist(
    (set) => ({
      // store 정의
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// 개발자 도구 연동
const useAuthStore = create(
  devtools(
    persist(/* store 정의 */),
    { name: 'auth-store' }
  )
);
```

## 🔄 마이그레이션 전략

### 1단계: Zustand 설치 및 기본 설정
```bash
npm install zustand
npm install @types/zustand # TypeScript 지원
```

### 2단계: 점진적 마이그레이션
```typescript
// 1. AuthStore 생성
// stores/authStore.ts
export const useAuthStore = create<AuthState>()((set, get) => ({
  // 기존 AuthContext 로직 이전
}));

// 2. 기존 Context와 병행 사용
// 기존 코드 영향 최소화하며 점진적 전환

// 3. 컴포넌트별 순차적 마이그레이션
// AuthContext → useAuthStore 사용으로 변경

// 4. 기존 Context 코드 제거
```

### 3단계: 성능 측정 및 최적화
```typescript
// React DevTools Profiler로 리렌더링 측정
// Before/After 성능 비교

// 선택적 구독 최적화
const Login = () => {
  // 필요한 상태만 구독
  const { login, isLoading } = useAuthStore(
    (state) => ({ login: state.login, isLoading: state.isLoading })
  );
  // user 상태 변경시에는 리렌더링 안됨
};
```

## 📈 성능 개선 지표

### 메모리 사용량
- **Before**: Context API + 불필요한 리렌더링으로 메모리 누수 가능성
- **After**: 선택적 구독으로 메모리 효율성 개선

### 번들 크기
- **Context API**: 0kb (React 내장)
- **Zustand**: +2.7kb (매우 경량)
- **Redux Toolkit**: +47kb (상당한 증가)

### 개발 경험
- **타입 안전성**: TypeScript 완전 지원
- **디버깅**: Zustand DevTools 지원
- **테스트**: 간단한 store 테스트 작성

## 🧪 코드 예시

### Before (Context API)
```typescript
// 140줄의 복잡한 Context 코드
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // 복잡한 useEffect들...
  useEffect(() => {
    checkStoredSession();
  }, []);

  // 복잡한 로직들...
  const login = async (email: string, password: string) => {
    // 긴 로그인 로직...
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### After (Zustand)
```typescript
// 간결하고 명확한 50줄 정도의 store
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,

        login: async (email, password) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.login(email, password);
            set({ 
              user: response.user, 
              token: response.token, 
              isLoading: false,
              isAuthenticated: true 
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        }),

        register: async (email, password) => {
          // 회원가입 로직
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: 'auth-store' }
  )
);
```

## 💡 면접 질문 예상 답변

### Q: "왜 Context API 대신 Zustand를 선택했나요?"
**A**: "Context API는 간단한 상태 공유에는 좋지만, 복잡한 앱에서는 성능 이슈가 있습니다. Context 값이 변경될 때마다 모든 자식 컴포넌트가 리렌더링되는 문제가 있었어요. Zustand는 선택적 구독을 통해 필요한 컴포넌트만 리렌더링하므로 성능이 좋고, TypeScript 지원도 우수해서 선택했습니다."

### Q: "Redux와 비교해서 Zustand의 장단점은?"
**A**: "Redux는 대규모 앱에서 강력하지만 보일러플레이트가 많고 러닝 커브가 높습니다. Zustand는 Redux의 80%의 기능을 20%의 복잡성으로 제공합니다. 저희 앱 규모에서는 Zustand가 더 적합했고, 번들 크기도 47kb → 2.7kb로 크게 줄일 수 있었습니다."

### Q: "마이그레이션 과정에서 어려웠던 점은?"
**A**: "기존 Context API와 Zustand를 병행 사용하면서 점진적으로 마이그레이션했습니다. 가장 중요했던 것은 상태 업데이트 로직을 컴포넌트에서 store로 옮기는 과정에서 사이드 이펙트를 관리하는 것이었습니다. React DevTools Profiler로 성능을 측정하면서 개선했습니다."

## 🔗 참고 자료

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [React 성능 최적화 가이드](https://react.dev/learn/render-and-commit)
- [상태관리 라이브러리 비교](https://github.com/pmndrs/zustand#comparison)

---

**다음 학습**: [성능 최적화 전략](./CS_performance.md)