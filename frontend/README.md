# 🚀 Modern Tech Blog Platform

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-v8.1.1-339af0.svg)](https://mantine.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

> 현대적이고 반응형인 기술 블로그 플랫폼입니다. React, Mantine v8, TanStack Query, Zustand를 사용하여 구축되었습니다.

## ✨ 주요 기능

### 🎨 **모던 UI/UX**
- **다크/라이트 모드** 지원
- **모바일 우선** 반응형 디자인
- **2025 웹 디자인 트렌드** 반영
- **플랫 디자인** 스타일
- **부드러운 애니메이션** 및 전환 효과

### 📝 **블로그 기능**
- **리치 텍스트 에디터** (Mantine TipTap 기반)
- **실시간 코드 하이라이팅**
- **배너 이미지** 업로드 및 관리
- **태그 시스템** (다중 선택, 색상 구분)
- **카테고리 관리**
- **임시저장** 기능
- **자동저장** (디바운스 적용)
- **SEO 최적화**

### 👤 **사용자 관리**
- **일반 로그인/회원가입**
- **카카오 소셜 로그인**
- **프로필 관리** (이미지, 정보 수정)
- **비밀번호 변경** (강도 검사 포함)
- **알림 설정**

### 🛠 **고급 기능**
- **드래그 앤 드롭** 네비게이션 설정
- **무한 스크롤**
- **가상화된 리스트**
- **지연 로딩 이미지**
- **읽기 진행률** 표시
- **댓글 시스템** (중첩 댓글 지원)
- **검색 기능** (자동완성, 검색 기록)
- **토스트 알림**

### 🔧 **개발자 도구**
- **TypeScript** 지원
- **커스텀 훅** 라이브러리
- **API 클라이언트** (Axios + TanStack Query)
- **상태 관리** (Zustand + Context API)
- **테스트 지원** (Jest 설정)
- **메모리 누수 방지**
- **성능 최적화**

## 🏗 프로젝트 구조

```
src/
├── components/              # 재사용 가능한 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   │   ├── Logo.jsx
│   │   ├── CustomLoader.jsx
│   │   ├── SearchBar.jsx
│   │   ├── InfiniteScroll.jsx
│   │   └── Modal.jsx
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── HeroSection.jsx
│   │   ├── NavbarSettings.jsx
│   │   └── UserInfo.jsx
│   └── blog/               # 블로그 관련 컴포넌트
│       ├── PostEdit.jsx
│       ├── PostView.jsx
│       ├── PostCard.jsx
│       └── CommentsSection.jsx
├── contexts/               # React Context
│   ├── AuthContext.jsx
│   ├── BlogContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── hooks/                  # 커스텀 훅
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   ├── useClickOutside.js
│   ├── useIntersectionObserver.js
│   ├── useScrollPosition.js
│   └── useApi.js
├── services/               # API 클라이언트
│   ├── apiClient.js
│   └── endpoints/
├── stores/                 # Zustand 스토어
│   └── apiStore.js
├── utils/                  # 유틸리티 함수
│   ├── colorHelpers.js
│   ├── formatters.js
│   ├── validators.js
│   └── storage.js
├── constants/              # 상수 및 설정
│   └── data.js
└── tests/                  # 테스트 파일
    ├── apiClient.test.js
    └── components/
```

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/tech-blog-platform.git
cd tech-blog-platform

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 값들을 설정하세요

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 http://localhost:3000 접속
```

### 환경 변수 설정

```env
# .env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_KAKAO_CLIENT_ID=your_kakao_client_id
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback
```

## 📦 주요 의존성

### 핵심 라이브러리
```json
{
  "@mantine/core": "^7.12.0",
  "@mantine/hooks": "^7.12.0",
  "@mantine/notifications": "^7.12.0",
  "@mantine/tiptap": "^7.12.0",
  "@mantine/nprogress": "^7.12.0",
  "@mantine/prism": "^7.12.0",
  "@tabler/icons-react": "^2.47.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### 상태 관리 및 API
```json
{
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "axios": "^1.6.0"
}
```

### 에디터 및 UI
```json
{
  "@tiptap/react": "^2.1.0",
  "@tiptap/starter-kit": "^2.1.0",
  "@hello-pangea/dnd": "^16.5.0",
  "lowlight": "^3.1.0"
}
```

## 🎯 컴포넌트 사용법

### 1. SearchBar 컴포넌트

```jsx
import { SearchBar } from './components/common/SearchBar';

function App() {
  const handleSearch = (query) => {
    console.log('검색어:', query);
  };

  return (
    <SearchBar
      placeholder="검색어를 입력하세요..."
      onSearch={handleSearch}
      showSuggestions={true}
      showHistory={true}
      showTrending={true}
      maxHistoryItems={5}
      debounceMs={300}
    />
  );
}
```

### 2. InfiniteScroll 컴포넌트

```jsx
import { InfiniteScroll } from './components/common/InfiniteScroll';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const newPosts = await fetchPosts(posts.length);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InfiniteScroll
      hasMore={hasMore}
      loading={loading}
      onLoadMore={loadMore}
      threshold={100}
    >
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
}
```

### 3. UserInfo 컴포넌트

```jsx
import { UserInfo } from './components/UserInfo';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <header>
        <UserInfo />
      </header>
    </AuthProvider>
  );
}
```

### 4. PostEdit 컴포넌트

```jsx
import PostEdit from './components/blog/PostEdit';

function CreatePost() {
  const handleSave = (postData) => {
    console.log('저장된 포스트:', postData);
  };

  const handlePreview = (postData) => {
    console.log('미리보기:', postData);
  };

  return (
    <PostEdit
      initialPost={null} // 새 포스트 작성
      onSave={handleSave}
      onPreview={handlePreview}
      navbarData={[
        { id: 'tech', label: '기술' },
        { id: 'tutorial', label: '튜토리얼' }
      ]}
    />
  );
}
```

### 5. NavbarSettings 컴포넌트

```jsx
import NavbarSettings from './components/NavbarSettings';

function SettingsPage() {
  return (
    <div>
      <h1>네비게이션 설정</h1>
      <NavbarSettings />
    </div>
  );
}
```

## 🔌 API 사용법

### 기본 API 호출

```javascript
import { apiClient } from './services/apiClient';

// 포스트 목록 조회
const posts = await apiClient.posts.getAll();

// 포스트 생성
const newPost = await apiClient.posts.create({
  title: '새 포스트',
  content: '<p>내용</p>',
  tags: ['react', 'javascript']
});

// 사용자 로그인
const loginResult = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### React Query와 함께 사용

```javascript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from './services/apiClient';

// 포스트 목록 조회
function usePostsQuery() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => apiClient.posts.getAll().then(res => res.data)
  });
}

// 포스트 생성 뮤테이션
function useCreatePostMutation() {
  return useMutation({
    mutationFn: (postData) => apiClient.posts.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    }
  });
}

// 컴포넌트에서 사용
function PostsList() {
  const { data: posts, isLoading } = usePostsQuery();
  const createPost = useCreatePostMutation();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 배치 요청

```javascript
// 여러 API를 한 번에 호출
const batchRequests = [
  { method: 'GET', url: '/posts', id: 'posts' },
  { method: 'GET', url: '/tags', id: 'tags' },
  { method: 'GET', url: '/categories', id: 'categories' }
];

const results = await apiClient.batch.execute(batchRequests);
console.log(results.data.posts); // 포스트 데이터
console.log(results.data.tags); // 태그 데이터
console.log(results.data.categories); // 카테고리 데이터
```

## 🧪 테스트

### 단위 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 특정 파일 테스트
npm test -- apiClient.test.js

# 커버리지 포함 테스트
npm test -- --coverage

# 워치 모드로 테스트
npm test -- --watch
```

### API 테스트 예시

```javascript
// tests/apiClient.test.js
import { apiClient } from '../services/apiClient';

describe('API Client', () => {
  test('포스트 목록 조회', async () => {
    const posts = await apiClient.posts.getAll();
    expect(posts.data).toBeInstanceOf(Array);
  });

  test('로그인 기능', async () => {
    const result = await apiClient.auth.login({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result.data).toHaveProperty('token');
    expect(result.data).toHaveProperty('user');
  });
});
```

### 컴포넌트 테스트

```javascript
// tests/components/SearchBar.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
  test('검색 입력 및 실행', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/검색어/);
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('React');
    });
  });
});
```

## 🎨 커스터마이징

### 테마 설정

```javascript
// contexts/ThemeContext.jsx에서 테마 수정
const customTheme = {
  colorScheme: 'dark',
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  colors: {
    // 커스텀 색상 정의
  }
};
```

### 새 컴포넌트 추가

```javascript
// components/custom/MyComponent.jsx
import React, { memo } from 'react';
import { Box, Text } from '@mantine/core';

const MyComponent = memo(({ title, children }) => {
  return (
    <Box p="md">
      <Text size="lg" fw={600} mb="sm">
        {title}
      </Text>
      {children}
    </Box>
  );
});

MyComponent.displayName = 'MyComponent';
export default MyComponent;
```

### 새 API 엔드포인트 추가

```javascript
// services/apiClient.js에 추가
export class ApiClient {
  // ... 기존 코드

  // 새 API 그룹 추가
  myNewApi = {
    getData: async () => {
      return this.api.get('/my-new-endpoint');
    },

    postData: async (data) => {
      return this.api.post('/my-new-endpoint', data);
    }
  };
}
```

## 🔧 성능 최적화

### 메모이제이션

- 모든 컴포넌트는 `React.memo()` 사용
- 콜백 함수는 `useCallback()` 사용
- 계산된 값은 `useMemo()` 사용

```javascript
const OptimizedComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, processed: true }));
  }, [data]);

  const handleClick = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### 코드 분할

```javascript
// 지연 로딩으로 번들 크기 최적화
const PostEdit = lazy(() => import('./components/blog/PostEdit'));
const PostView = lazy(() => import('./components/blog/PostView'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/edit" element={<PostEdit />} />
        <Route path="/view/:id" element={<PostView />} />
      </Routes>
    </Suspense>
  );
}
```

### 이미지 최적화

```javascript
// LazyImage 컴포넌트 사용
<LazyImage
  src="large-image.jpg"
  placeholder={<SkeletonLoader type="image" />}
  fallback={<div>이미지를 불러올 수 없습니다</div>}
/>
```

## 📱 모바일 지원

### 반응형 디자인

```javascript
// 모바일 우선 스타일링
const ResponsiveComponent = () => {
  return (
    <Box
      p={{ base: 'xs', sm: 'md', lg: 'xl' }}
      w={{ base: '100%', sm: '80%', lg: '60%' }}
    >
      <Group
        direction={{ base: 'column', sm: 'row' }}
        spacing={{ base: 'xs', sm: 'md' }}
      >
        <Button size={{ base: 'sm', sm: 'md' }}>
          모바일용 버튼
        </Button>
      </Group>
    </Box>
  );
};
```

### 터치 제스처

```javascript
// 터치 이벤트 처리
const TouchComponent = () => {
  const handleTouchStart = useCallback((e) => {
    // 터치 시작 처리
  }, []);

  const handleTouchEnd = useCallback((e) => {
    // 터치 종료 처리
  }, []);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      터치 가능한 요소
    </div>
  );
};
```

## 🚀 배포

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 확인
npm run preview
```

### 환경별 설정

```bash
# 개발 환경
REACT_APP_ENV=development npm run build

# 스테이징 환경
REACT_APP_ENV=staging npm run build

# 프로덕션 환경
REACT_APP_ENV=production npm run build
```

### Docker 배포

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Docker 빌드 및 실행
docker build -t tech-blog .
docker run -p 3000:3000 tech-blog
```

## 🤝 기여하기

### 개발 환경 설정

1. Fork 저장소
2. 브랜치 생성: `git checkout -b feature/amazing-feature`
3. 변경사항 커밋: `git commit -m 'Add amazing feature'`
4. 브랜치에 푸시: `git push origin feature/amazing-feature`
5. Pull Request 생성

### 코딩 스타일

- ESLint와 Prettier 설정 준수
- 컴포넌트명은 PascalCase 사용
- 파일명은 kebab-case 사용
- 커밋 메시지는 [Conventional Commits](https://conventionalcommits.org/) 규칙 준수

### 코드 리뷰 가이드라인

- 모든 PR은 최소 1명의 리뷰어 승인 필요
- 테스트 커버리지 80% 이상 유지
- 타입스크립트 에러 0개
- 성능 영향도 검토

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Mantine](https://mantine.dev/) - 훌륭한 React 컴포넌트 라이브러리
- [TanStack Query](https://tanstack.com/query) - 강력한 데이터 페칭 라이브러리
- [Tabler Icons](https://tabler-icons.io/) - 아름다운 아이콘 세트
- [Hello Pangea DnD](https://github.com/hello-pangea/dnd) - 드래그 앤 드롭 라이브러리

## 📞 문의

프로젝트 관련 문의사항이 있으시면 언제든 연락주세요:

- 이메일: your-email@example.com
- 이슈: [GitHub Issues](https://github.com/your-username/tech-blog-platform/issues)
- 토론: [GitHub Discussions](https://github.com/your-username/tech-blog-platform/discussions)

---

⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요!