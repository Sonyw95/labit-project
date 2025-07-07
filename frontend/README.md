# 🚀 분리된 TechBlog 프로젝트 구조 및 사용 가이드

## 📁 최종 폴더 구조

```
src/
├── components/
│   ├── common/              # 재사용 가능한 공통 컴포넌트
│   │   ├── Logo.jsx
│   │   ├── CustomLoader.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── LoadingWrapper.jsx
│   ├── layout/              # 레이아웃 관련 컴포넌트
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   └── AppLayout.jsx
│   ├── sections/            # 페이지 섹션 컴포넌트
│   │   ├── HeroSection.jsx
│   │   └── RecentPosts.jsx
│   └── cards/               # 카드 형태 컴포넌트
│       └── PostCard.jsx
├── hooks/                   # 커스텀 훅
│   ├── useLoadingProgress.js
│   ├── useTechStackRotation.js
│   ├── useTheme.js
│   └── useResponsive.js
├── utils/                   # 유틸리티 함수 및 상수
│   ├── constants.js
│   ├── animations.js
│   ├── theme.js
│   └── helpers.js
├── pages/                   # 페이지 컴포넌트
│   └── TechBlogPage.jsx
├── App.jsx                  # 루트 앱 컴포넌트
└── index.js                 # 엔트리 포인트
```

## 🔧 주요 분리 내용

### 1. **데이터 분리** (`utils/constants.js`)
- 하드코딩된 데이터들을 별도 파일로 분리
- 네비게이션 메뉴, 인기 태그, 최근 게시글, 기술 스택 등
- 데이터 수정 시 한 곳에서만 관리 가능

### 2. **커스텀 훅** (`hooks/`)
- `useLoadingProgress`: 로딩 진행률 관리
- `useTechStackRotation`: 기술 스택 텍스트 순환
- `useTheme`: 테마 관련 로직 및 색상 유틸리티
- `useResponsive`: 반응형 디자인 지원

### 3. **컴포넌트 분리**
- **공통**: Logo, CustomLoader, ThemeToggle
- **레이아웃**: Header, Navigation, AppLayout
- **섹션**: HeroSection, RecentPosts
- **카드**: PostCard

### 4. **스타일 분리** (`utils/animations.js`)
- CSS 애니메이션을 별도 파일로 관리
- 재사용 가능한 애니메이션 정의

## 🎯 주요 개선 사항

### ✅ **재사용성**
```jsx
// Logo 컴포넌트 - 다양한 크기와 스타일로 재사용 가능
<Logo size="lg" radius="xl" isLogo={false} />
<Logo size="sm" radius="md" />
```

### ✅ **유지보수성**
```jsx
// 데이터 수정 시 constants.js만 변경
export const TECH_STACK = ['Java', 'Spring', 'React', 'TypeScript'];
```

### ✅ **테스트 용이성**
```jsx
// 개별 컴포넌트 단위 테스트 가능
import { render } from '@testing-library/react';
import PostCard from '../components/cards/PostCard';

test('renders post card correctly', () => {
    const mockPost = { title: 'Test Post', ... };
    render(<PostCard post={mockPost} />);
});
```

### ✅ **타입 안정성** (TypeScript 적용 시)
```typescript
interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  image: string;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  // 타입 안전한 컴포넌트
};
```

## 🚀 설치 및 실행 방법

### 1. **패키지 설치**
```bash
npm install @mantine/core @mantine/hooks @tabler/icons-react
```

### 2. **필요한 CSS 파일 추가**
```jsx
// App.jsx 또는 index.js에 추가
import '@mantine/core/styles.css';
```

### 3. **컴포넌트 사용 예시**
```jsx
// 기본 사용
function App() {
  return (
    <MantineProvider>
      <TechBlogPage />
    </MantineProvider>
  );
}

// 개별 컴포넌트 사용
import Logo from './components/common/Logo';
import PostCard from './components/cards/PostCard';

function MyPage() {
  return (
    <div>
      <Logo size="lg" />
      <PostCard post={myPost} />
    </div>
  );
}
```

## 🔄 마이그레이션 가이드

### 기존 코드에서 새 구조로 변경하는 순서:

#### 1단계: 상수 분리
```jsx
// 기존 코드의 하드코딩된 데이터를
// utils/constants.js로 이동
const navigationItems = [...]; // ❌
import { NAVIGATION_ITEMS } from '../utils/constants'; // ✅
```

#### 2단계: 훅 분리
```jsx
// 기존의 useState/useEffect 로직을
// 커스텀 훅으로 분리
const { loading, progress } = useLoadingProgress(); // ✅
```

#### 3단계: 컴포넌트 분리
```jsx
// 큰 컴포넌트를 작은 단위로 분리
<Header opened={opened} onToggle={setOpened} />
<Navigation />
<HeroSection currentTech={currentTech} />
```

## 📈 성능 최적화 팁

### 1. **React.memo 활용**
```jsx
import React from 'react';

const PostCard = React.memo(({ post }) => {
  // 컴포넌트 내용
});

export default PostCard;
```

### 2. **useMemo 활용**
```jsx
const expensiveValue = useMemo(() => {
  return someExpensiveCalculation(data);
}, [data]);
```

### 3. **lazy Loading**
```jsx
const HeroSection = React.lazy(() => import('./components/sections/HeroSection'));

function App() {
  return (
    <Suspense fallback={<CustomLoader progress={0} />}>
      <HeroSection />
    </Suspense>
  );
}
```

## 🧪 테스트 전략

### 1. **컴포넌트 테스트**
```jsx
// __tests__/PostCard.test.js
import { render, screen } from '@testing-library/react';
import PostCard from '../components/cards/PostCard';

describe('PostCard', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    excerpt: 'Test excerpt',
    // ... 기타 필드
  };

  test('renders post title correctly', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });
});
```

### 2. **훅 테스트**
```jsx
// __tests__/useLoadingProgress.test.js
import { renderHook, act } from '@testing-library/react';
import { useLoadingProgress } from '../hooks/useLoadingProgress';

test('should increment progress over time', async () => {
  const { result } = renderHook(() => useLoadingProgress());
  
  expect(result.current.loading).toBe(true);
  expect(result.current.progress).toBe(0);
  
  // 시간 경과 테스트...
});
```

## 🎨 커스터마이징 가이드

### 1. **테마 색상 변경**
```jsx
// utils/theme.js에서 색상 수정
export const themeColors = {
  primary: '#your-primary-color',
  // ... 기타 색상
};
```

### 2. **애니메이션 추가**
```jsx
// utils/animations.js에 새 애니메이션 추가
export const newAnimation = `
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;
```

### 3. **새 섹션 추가**
```jsx
// components/sections/NewSection.jsx
const NewSection = () => {
  return (
    <Container>
      {/* 새 섹션 내용 */}
    </Container>
  );
};

// TechBlogPage.jsx에 추가
<HeroSection />
<NewSection />  {/* 새 섹션 */}
<RecentPosts />
```

## 🔧 확장 가능성

### 1. **다국어 지원**
```jsx
// utils/i18n.js
export const translations = {
  ko: { welcome: '환영합니다' },
  en: { welcome: 'Welcome' }
};
```

### 2. **라우팅 추가**
```jsx
// React Router 적용
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TechBlogPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. **상태 관리**
```jsx
// Context API 또는 Redux 적용
const BlogContext = createContext();

function BlogProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return (
    <BlogContext.Provider value={{ posts, setPosts, loading, setLoading }}>
      {children}
    </BlogContext.Provider>
  );
}
```

## 📋 체크리스트

분리 작업 완료 후 확인할 사항들:

- [ ] 모든 컴포넌트가 독립적으로 작동하는가?
- [ ] 데이터가 props로 올바르게 전달되는가?
- [ ] 스타일이 올바르게 적용되는가?
- [ ] 반응형 디자인이 정상 작동하는가?
- [ ] 테마 전환이 모든 컴포넌트에서 작동하는가?
- [ ] 애니메이션이 부드럽게 실행되는가?
- [ ] 코드 중복이 제거되었는가?
- [ ] 파일 구조가 논리적으로 구성되었는가?

## 🎉 결론

이제 원래의 거대한 단일 파일이 **재사용 가능하고 유지보수하기 쉬운 모듈형 구조**로 변경되었습니다!

- **개발 효율성** ⬆️
- **코드 가독성** ⬆️
- **재사용성** ⬆️
- **테스트 용이성** ⬆️
- **협업 효율성** ⬆️

각 컴포넌트는 단일 책임 원칙을 따르며, 필요에 따라 독립적으로 수정하거나 다른 프로젝트에서 재사용할 수 있습니다.