# LABit - Modern Tech Blog Platform

> 2025 웹 디자인 트렌드를 반영한 모던한 기술 블로그 플랫폼

## 🚀 기능 소개

### ✨ 주요 특징
- **모바일 우선 반응형 디자인** - 모든 디바이스에서 완벽한 사용자 경험
- **다크/라이트 모드 지원** - 사용자 선호도에 맞는 테마 제공
- **2025 웹 디자인 트렌드 적용** - 모던하고 직관적인 UI/UX
- **고성능 최적화** - 리렌더링 방지 및 메모리 누수 방지
- **타입스크립트 미사용** - 순수 JavaScript로 구현

## 📦 구성 요소

### 1. 커스텀 훅 (Custom Hooks)

#### `useLocalStorage`
로컬 스토리지 데이터를 상태처럼 관리할 수 있는 훅입니다.

```javascript
import { useLocalStorage } from './custom-hooks';

function MyComponent() {
    const [user, setUser] = useLocalStorage('user', null);
    
    return (
        <div>
            {user ? `안녕하세요, ${user.name}님!` : '로그인이 필요합니다.'}
        </div>
    );
}
```

**주요 기능:**
- 초기값 설정 가능
- JSON 자동 직렬화/역직렬화
- 에러 처리 내장
- 리렌더링 최적화

#### `useDebounce`
검색 입력 등에서 불필요한 API 호출을 방지합니다.

```javascript
import { useDebounce } from './custom-hooks';

function SearchComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    useEffect(() => {
        if (debouncedSearchTerm) {
            // API 호출
            searchAPI(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);
}
```

#### `useIntersectionObserver`
무한 스크롤 구현을 위한 교차점 관찰자 훅입니다.

```javascript
import { useIntersectionObserver } from './custom-hooks';

function InfiniteList() {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '100px'
    });
    
    useEffect(() => {
        if (entry?.isIntersecting) {
            loadMoreItems();
        }
    }, [entry?.isIntersecting]);
}
```

#### 기타 훅들
- `useThrottle` - 스로틀링 처리
- `useClickOutside` - 외부 클릭 감지
- `useMediaQuery` - 반응형 처리
- `useToggle` - 토글 상태 관리
- `useWindowSize` - 윈도우 크기 추적
- `useAsync` - 비동기 작업 관리

### 2. 유틸리티 함수 (Utility Functions)

#### Color Helper
색상 관련 유틸리티 함수들입니다.

```javascript
import { colorHelpers } from './utility-functions';

// HEX를 RGB로 변환
const rgb = colorHelpers.hexToRgb('#4c6ef5');
// { r: 76, g: 110, b: 245 }

// 색상 밝기 계산
const brightness = colorHelpers.getBrightness('#4c6ef5');

// 대비 색상 결정
const textColor = colorHelpers.getContrastColor('#4c6ef5');

// 색상 팔레트 생성
const palette = colorHelpers.generatePalette('#4c6ef5');
```

#### Format Helper
다양한 데이터 포맷팅 함수들입니다.

```javascript
import { formatHelpers } from './utility-functions';

// 숫자 포맷팅
formatHelpers.formatNumber(1500); // "1.5K"
formatHelpers.formatNumber(1500000); // "1.5M"

// 날짜 포맷팅
formatHelpers.formatDate(new Date(), 'YYYY년 MM월 DD일');
formatHelpers.formatRelativeTime('2024-01-01'); // "3개월 전"

// 파일 크기 포맷팅
formatHelpers.formatFileSize(1024); // "1 KB"

// 통화 포맷팅
formatHelpers.formatCurrency(50000); // "₩50,000"
```

#### String Helper
문자열 처리 유틸리티 함수들입니다.

```javascript
import { stringHelpers } from './utility-functions';

// 문자열 자르기
stringHelpers.truncate('긴 텍스트입니다', 10); // "긴 텍스트입..."

// 케이스 변환
stringHelpers.toCamelCase('hello-world'); // "helloWorld"
stringHelpers.toKebabCase('HelloWorld'); // "hello-world"

// 유효성 검사
stringHelpers.isValidEmail('test@example.com'); // true
stringHelpers.isValidUrl('https://example.com'); // true

// 랜덤 문자열 생성
stringHelpers.generateRandomString(8); // "aBc123De"
```

#### Array Helper
배열 처리 유틸리티 함수들입니다.

```javascript
import { arrayHelpers } from './utility-functions';

// 중복 제거
const unique = arrayHelpers.unique([1, 2, 2, 3, 3]);
// [1, 2, 3]

// 객체 배열 중복 제거
const uniqueUsers = arrayHelpers.uniqueBy(users, 'id');

// 배열 청크
const chunks = arrayHelpers.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

// 객체 배열 정렬
const sortedUsers = arrayHelpers.sortBy(users, 'name', 'asc');

// 그룹화
const groupedUsers = arrayHelpers.groupBy(users, 'department');
```

### 3. 고급 컴포넌트 (Advanced Components)

#### Toast 시스템
사용자에게 알림을 표시하는 토스트 시스템입니다.

```javascript
import { useToast } from './context-providers';
import { ToastContainer } from './advanced-components';

function App() {
    return (