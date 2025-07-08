# 🚀 Modern Tech Blog Platform

2025년 웹 디자인 트렌드를 반영한 고성능 기술 블로그 플랫폼입니다. Mantine v8 기반으로 구축되었으며, 모바일 우선 설계와 메모리 누수 방지, 리렌더링 최적화가 적용되었습니다.

![Tech Stack](https://img.shields.io/badge/React-18.2.0-blue)
![Mantine](https://img.shields.io/badge/Mantine-v8.1.2-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.0-red)

## ✨ 주요 기능

### 🎨 2025 웹 디자인 트렌드 적용
- **Low Light 모드**: 어두운 테마에 최적화된 색상 팔레트
- **Bento Box 레이아웃**: 깔끔하게 정리된 카드 기반 디자인
- **Glassmorphism**: 반투명 효과와 블러 처리
- **Micro-animations**: 부드러운 인터랙션 애니메이션
- **Bold Typography**: 대담하고 현대적인 타이포그래피

### 🚀 고성능 최적화
- **메모리 누수 방지**: 모든 컴포넌트에 cleanup 로직 적용
- **리렌더링 최적화**: React.memo, useMemo, useCallback 활용
- **가상화**: 대용량 리스트 성능 최적화
- **지연 로딩**: 이미지 및 컴포넌트 lazy loading
- **코드 분할**: 동적 import를 통한 번들 크기 최적화

### 📱 모바일 우선 설계
- **반응형 디자인**: 모든 화면 크기에 최적화
- **터치 친화적**: 모바일 제스처 지원
- **PWA 지원**: 오프라인 기능 및 앱 설치
- **성능 최적화**: 모바일 환경에서의 빠른 로딩

## 🏗️ 아키텍처

### 📁 프로젝트 구조
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
│   │   ├── AppLayout.jsx
│   │   └── UserDropdown.jsx
│   ├── sections/            # 페이지 섹션 컴포넌트
│   │   ├── HeroSection.jsx
│   │   └── RecentPosts.jsx
│   ├── cards/               # 카드 형태 컴포넌트
│   │   └── PostCard.jsx
│   ├── advanced/            # 고급 컴포넌트
│   │   ├── Toast/
│   │   ├── SearchBar/
│   │   ├── InfiniteScroll/
│   │   ├── VirtualList/
│   │   └── LazyImage/
│   └── settings/            # 설정 관련 컴포넌트
│       ├── NavBarSettings.jsx
│       └── UserSettings.jsx
├── contexts/                # React Context 관리
│   ├── AuthContext.jsx
│   ├── BlogContext.jsx
│   ├── ToastContext.jsx
│   └── ThemeContext.jsx
├── hooks/                   # 커스텀 훅
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   ├── useIntersectionObserver.js
│   ├── useMediaQuery.js
│   └── useApiQueries.js
├── api/                     # API 클라이언트
│   ├── apiClient.js
│   └── queryClient.js
├── utils/                   # 유틸리티 함수
│   ├── colorHelpers.js
│   ├── formatters.js
│   ├── validation.js
│   ├── domHelpers.js
│   ├── performanceHelpers.js
│   └── constants.js
└── pages/                   # 페이지 컴포넌트
    └── TechBlogPage.jsx
```

## 🛠️ 기술 스택

### Core
- **React 18.2.0**: 최신 Concurrent Features 활용
- **Mantine v8.1.2**: 2025년 최신 UI 컴포넌트 라이브러리
- **TypeScript**: 타입 안전성 보장
- **Vite**: 빠른 개발 서버 및 빌드 도구

### 상태 관리
- **TanStack Query v5**: 서버 상태 관리 및 캐싱
- **Zustand**: 클라이언트 상태 관리
- **React Context**: 전역 상태 관리

### API & 네트워킹
- **Axios**: HTTP 클라이언트
- **멀티 요청 배치 처리**: 동시 요청 최적화
- **자동 토큰 갱신**: JWT 토큰 자동 관리
- **재시도 로직**: 네트워크 오류 복구

### UI/UX
- **@hello-pangea/dnd**: 드래그 앤 드롭 기능
- **React Intersection Observer**: 무한 스크롤 구현
- **Framer Motion**: 고급 애니메이션 (선택사항)

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install

# 주요 의존성
npm install @mantine/core@^8.1.2 @mantine/hooks @tabler/icons-react
npm install @tanstack/react-query axios zustand
npm install @hello-pangea/dnd
```

### 2. 환경 변수 설정
```bash
# .env.local
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_KAKAO_CLIENT_ID=your_kakao_client_id
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 빌드
```bash
npm run build
```

## 🎯 주요 컴포넌트 사용법

### 1. 커스텀 훅 활용

#### useLocalStorage
```javascript
import { useLocalStorage } from './hooks/useLocalStorage';

const MyComponent = () => {
    const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

    return (
        <button onClick={() => setTheme('dark')}>
            다크 테마로 변경
        </button>
    );
};
```

#### useDebounce
```javascript
import { useDebounce, useDebouncedCallback } from './hooks/useDebounce';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    const { debouncedCallback } = useDebouncedCallback((searchTerm) => {
        // API 호출
        searchAPI(searchTerm);
    }, 500);

    useEffect(() => {
        if (debouncedQuery) {
            searchAPI(debouncedQuery);
        }
    }, [debouncedQuery]);
};
```

### 2. 고급 컴포넌트 활용

#### Toast 시스템
```javascript
import { useToast } from './contexts/ToastContext';

const MyComponent = () => {
    const toast = useToast();

    const handleSuccess = () => {
        toast.success('작업이 완료되었습니다!', {
            duration: 3000,
            action: <Button size="xs">실행 취소</Button>
        });
    };

    const handleError = () => {
        toast.error('오류가 발생했습니다.', {
            title: '오류',
            position: 'top-center'
        });
    };
};
```

#### SearchBar
```javascript
import SearchBar from './components/advanced/SearchBar/SearchBar';

const MyPage = () => {
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = (query) => {
        // 검색 로직
        fetchSuggestions(query).then(setSuggestions);
    };

    return (
        <SearchBar
            placeholder="검색어를 입력하세요..."
            onSearch={handleSearch}
            suggestions={suggestions}
            recentSearches={['React', 'JavaScript']}
            popularSearches={['TypeScript', 'Node.js']}
            showFilters
        />
    );
};
```

#### InfiniteScroll
```javascript
import InfiniteScroll from './components/advanced/InfiniteScroll/InfiniteScroll';

const PostList = () => {
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfinitePosts();

    return (
        <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isLoading}
            onLoadMore={fetchNextPage}
            endMessage="모든 게시글을 불러왔습니다."
        >
            {data?.pages.map((page) =>
                page.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </InfiniteScroll>
    );
};
```

### 3. Context 활용

#### AuthContext
```javascript
import { useAuth } from './contexts/AuthContext';

const LoginComponent = () => {
    const { login, loginWithKakao, user, isAuthenticated, isLoading } = useAuth();

    const handleLogin = async (credentials) => {
        const result = await login(credentials);
        if (result.success) {
            console.log('로그인 성공:', result.data);
        } else {
            console.error('로그인 실패:', result.error);
        }
    };

    const handleKakaoLogin = async () => {
        const result = await loginWithKakao();
        if (result.success) {
            console.log('카카오 로그인 성공');
        }
    };

    if (isLoading) return <div>로딩 중...</div>;

    return isAuthenticated ? (
        <div>환영합니다, {user.name}님!</div>
    ) : (
        <div>
            <button onClick={() => handleLogin({ email: 'test@example.com', password: 'password' })}>
                로그인
            </button>
            <button onClick={handleKakaoLogin}>
                카카오 로그인
            </button>
        </div>
    );
};
```

### 4. API 클라이언트 활용

#### 기본 사용법
```javascript
import { apiClient } from './api/apiClient';

// 단일 요청
const createPost = async (postData) => {
    try {
        const response = await apiClient.blog.createPost(postData);
        console.log('포스트 생성 성공:', response);
    } catch (error) {
        console.error('포스트 생성 실패:', error.message);
    }
};

// 배치 요청
const batchCreatePosts = async (postsData) => {
    const requests = postsData.map(post => ({
        method: 'POST',
        url: '/posts',
        data: post
    }));

    const result = await apiClient.batchRequests(requests, {
        concurrent: 3,
        onProgress: (progress) => {
            console.log(`진행률: ${progress.progress}%`);
        }
    });

    console.log(`성공: ${result.successCount}, 실패: ${result.errorCount}`);
};

// 파일 업로드
const uploadImage = async (file) => {
    try {
        const response = await apiClient.uploadFile(file, '/images', {
            onProgress: (progress) => {
                console.log(`업로드 진행률: ${progress}%`);
            }
        });
        console.log('업로드 성공:', response.data.url);
    } catch (error) {
        console.error('업로드 실패:', error.message);
    }
};
```

#### TanStack Query와 함께 사용
```javascript
import { usePosts, useCreatePost, useInfinitePosts } from './hooks/useApiQueries';

const BlogPage = () => {
    // 단순 목록 조회
    const { data: posts, isLoading, error } = usePosts({ category: 'tech' });

    // 무한 스크롤
    const {
        data: infinitePosts,
        fetchNextPage,
        hasNextPage,
        isLoading: isLoadingMore
    } = useInfinitePosts({ limit: 10 });

    // 뮤테이션
    const createPostMutation = useCreatePost();

    const handleCreatePost = async (postData) => {
        try {
            await createPostMutation.mutateAsync(postData);
            // 성공 처리는 훅 내부에서 자동으로 처리됨 (토스트 알림 등)
        } catch (error) {
            // 에러 처리도 훅 내부에서 자동으로 처리됨
        }
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>오류: {error.message}</div>;

    return (
        <div>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};
```

### 5. NavBar 설정 시스템

#### 네비게이션 구조 정의
```javascript
const navStructure = {
    id: 'root',
    type: 'folder',
    title: 'Navigation',
    children: [
        {
            id: 'home',
            type: 'item',
            title: '홈',
            icon: 'IconHome',
            href: '/',
            visible: true,
            order: 0
        },
        {
            id: 'blog',
            type: 'folder',
            title: '블로그',
            icon: 'IconArticle',
            visible: true,
            order: 1,
            children: [
                {
                    id: 'posts',
                    type: 'item',
                    title: '게시글',
                    href: '/posts',
                    visible: true,
                    order: 0
                }
            ]
        }
    ]
};
```

#### NavBar 설정 컴포넌트 사용
```javascript
import NavBarSettings from './components/settings/NavBarSettings';

const App = () => {
    const [navSettingsOpened, setNavSettingsOpened] = useState(false);
    const [currentNavData, setCurrentNavData] = useLocalStorage('nav-structure', defaultNavStructure);
    
    const handleSaveNavigation = (newNavStructure) => {
        setCurrentNavData(newNavStructure);
        // 네비게이션 재구성 로직
        updateNavigation(newNavStructure);
    };
    
    return (
        <>
            <NavBarSettings
                opened={navSettingsOpened}
                onClose={() => setNavSettingsOpened(false)}
                currentNavData={currentNavData}
                onSave={handleSaveNavigation}
            />
            {/* 드래그 앤 드롭으로 메뉴 순서 변경 가능 */}
        </>
    );
};
```

### 6. 사용자 설정 시스템

#### UserSettings 컴포넌트
```javascript
import UserSettings from './components/settings/UserSettings';

const UserProfile = () => {
    const [settingsOpened, setSettingsOpened] = useState(false);
    
    return (
        <>
            <button onClick={() => setSettingsOpened(true)}>
                사용자 설정
            </button>
            
            <UserSettings
                opened={settingsOpened}
                onClose={() => setSettingsOpened(false)}
            />
            {/* 프로필 수정, 비밀번호 변경, 이미지 업로드 등 */}
        </>
    );
};
```

## 🎨 테마 시스템

### 커스텀 테마 적용
```javascript
import { CustomThemeProvider } from './contexts/ThemeContext';

const App = () => {
    return (
        <CustomThemeProvider>
            <YourApp />
        </CustomThemeProvider>
    );
};

// 테마 훅 사용
const MyComponent = () => {
    const {
        colorScheme,
        setColorScheme,
        setPrimaryColor,
        setRadius,
        theme
    } = useCustomTheme();
    
    return (
        <div>
            <button onClick={() => setColorScheme('dark')}>
                다크 모드
            </button>
            <button onClick={() => setPrimaryColor('red')}>
                빨간색 테마
            </button>
        </div>
    );
};
```

### 2025 트렌드 색상 사용
```javascript
import { trendColors, trendGradients } from './utils/colorHelpers';

const TrendyComponent = () => {
    return (
        <div
            style={{
                background: trendGradients.sunset,
                color: trendColors.lowLight.text,
                padding: '20px',
                borderRadius: '16px'
            }}
        >
            2025 트렌드 디자인
        </div>
    );
};
```

## 📊 성능 최적화 기법

### 1. 메모리 누수 방지
```javascript
import { useMountedState } from './hooks/useMountedState';

const AsyncComponent = () => {
    const isMounted = useMountedState();
    
    const fetchData = async () => {
        const data = await api.getData();
        
        // 컴포넌트가 언마운트되었다면 상태 업데이트 하지 않음
        if (isMounted()) {
            setData(data);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
};
```

### 2. 리렌더링 최적화
```javascript
// React.memo로 불필요한 리렌더링 방지
const PostCard = React.memo(({ post, onLike }) => {
    // 메모화된 핸들러
    const handleLike = useCallback(() => {
        onLike(post.id);
    }, [post.id, onLike]);
    
    // 계산 값 메모화
    const formattedDate = useMemo(() => {
        return formatDate(post.createdAt);
    }, [post.createdAt]);
    
    return (
        <Card>
            <Text>{post.title}</Text>
            <Text>{formattedDate}</Text>
            <button onClick={handleLike}>좋아요</button>
        </Card>
    );
});
```

### 3. 가상화 리스트
```javascript
import VirtualList from './components/advanced/VirtualList/VirtualList';

const LargePostList = ({ posts }) => {
    return (
        <VirtualList
            items={posts}
            itemHeight={120}
            containerHeight={600}
            renderItem={({ item: post, index }) => (
                <PostCard key={post.id} post={post} />
            )}
        />
    );
};
```

## 🔧 유틸리티 함수 활용

### 색상 헬퍼
```javascript
import {
    hexToRgb,
    isDarkColor,
    getContrastColor,
    adjustBrightness
} from './utils/colorHelpers';

const dynamicColor = '#3b82f6';
const textColor = getContrastColor(dynamicColor); // 대비되는 텍스트 색상
const lighterColor = adjustBrightness(dynamicColor, 20); // 20% 밝게
```

### 포맷터
```javascript
import {
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    formatFileSize
} from './utils/formatters';

const price = 1500000;
const formattedPrice = formatCurrency(price); // ₩1,500,000

const date = new Date('2024-01-01');
const relativeTime = formatRelativeTime(date); // 6개월 전

const fileSize = 2048576;
const readableSize = formatFileSize(fileSize); // 2.0 MB
```

### 검증 함수
```javascript
import {
    isValidEmail,
    validatePassword,
    isValidKoreanPhone
} from './utils/validation';

const email = 'user@example.com';
const isValid = isValidEmail(email); // true

const password = 'MyPassword123!';
const passwordStrength = validatePassword(password);
// { length: true, uppercase: true, lowercase: true, number: true, special: true, score: 5, strength: 'strong', isValid: true }
```

## 🧪 테스트

### 단위 테스트 예시
```bash
npm test
```

```javascript
// __tests__/PostCard.test.js
import { render, screen } from '@testing-library/react';
import PostCard from '../components/cards/PostCard';

describe('PostCard', () => {
    const mockPost = {
        id: 1,
        title: 'Test Post',
        excerpt: 'Test excerpt',
        date: '2024-01-01',
        readTime: '5분',
        views: 100,
        likes: 10
    };

    test('renders post title correctly', () => {
        render(<PostCard post={mockPost} />);
        expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
});
```

## 🚀 배포

### Vercel 배포
```bash
npm install -g vercel
vercel --prod
```

### Netlify 배포
```bash
npm run build
# dist 폴더를 Netlify에 드래그 앤 드롭
```

### Docker 배포
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 환경 설정

### VSCode 권장 확장
```json
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss"
    ]
}
```

### ESLint 설정
```json
{
    "extends": [
        "react-app",
        "react-app/jest"
    ],
    "rules": {
        "react-hooks/exhaustive-deps": "error",
        "no-unused-vars": "error"
    }
}
```

## 📈 모니터링 및 분석

### 성능 모니터링
```javascript
// 성능 메트릭 수집
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(entry.name, entry.duration);
    });
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

### 에러 추적
```javascript
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // 에러 로깅 서비스로 전송
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 코딩 컨벤션
- **컴포넌트**: PascalCase (예: `PostCard.jsx`)
- **훅**: camelCase with `use` prefix (예: `useLocalStorage.js`)
- **유틸리티**: camelCase (예: `formatters.js`)
- **상수**: UPPER_SNAKE_CASE (예: `API_ENDPOINTS`)

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 formatting, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 과정 또는 보조 기능 수정
```

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🆘 문제 해결

### 자주 발생하는 문제

#### 1. Mantine 스타일이 적용되지 않는 경우
```javascript
// App.jsx에 CSS 파일 import 확인
import '@mantine/core/styles.css';
```

#### 2. 토큰이 자동으로 갱신되지 않는 경우
```javascript
// API 클라이언트 설정 확인
const apiStore = useApiStore.getState();
console.log('Current tokens:', apiStore.tokens);
```

#### 3. 드래그 앤 드롭이 작동하지 않는 경우
```bash
npm install @hello-pangea/dnd
```

#### 4. 무한 스크롤이 트리거되지 않는 경우
```javascript
// Intersection Observer 옵션 조정
const [setElement, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // 마진 증가
});
```

## 📞 지원

- **GitHub Issues**: 버그 리포트 및 기능 요청
- **Discussions**: 일반적인 질문 및 토론
- **Email**: support@techblog.com

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Mantine](https://mantine.dev/) - 훌륭한 UI 컴포넌트 라이브러리
- [TanStack Query](https://tanstack.com/query) - 강력한 데이터 페칭 라이브러리
- [Zustand](https://github.com/pmndrs/zustand) - 가벼운 상태 관리 라이브러리
- [React DnD](https://github.com/hello-pangea/dnd) - 드래그 앤 드롭 라이브러리

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

Made with ❤️ by LABit Team