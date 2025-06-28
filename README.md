# 🥕 Kakao Login System

> React + Mantine v8 + Spring Boot를 사용한 카카오 소셜 로그인 시스템

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [설치 및 실행](#설치-및-실행)
- [환경 설정](#환경-설정)
- [API 문서](#api-문서)
- [폴더 구조](#폴더-구조)
- [배포](#배포)
- [트러블슈팅](#트러블슈팅)

## 🎯 프로젝트 개요

카카오 OAuth2를 활용한 소셜 로그인 시스템입니다. 현대적인 React UI와 안전한 Spring Boot 백엔드를 결합하여 완전한 인증 시스템을 제공합니다.

### 특징

- 🔐 **보안**: JWT 기반 인증 + Refresh Token
- 🎨 **UI/UX**: Mantine v8 최신 디자인 시스템
- 📱 **반응형**: 모바일/데스크톱 완벽 지원
- 🚀 **성능**: React Query로 최적화된 서버 상태 관리
- 🔄 **실시간**: 배치 작업 및 API 테스트 도구 내장

## 🛠 기술 스택

### Frontend
- **React 18** - 최신 React 기반 SPA
- **Mantine v8.1.1** - 현대적 UI 컴포넌트 라이브러리
- **Vite** - 빠른 빌드 도구
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트

### Backend
- **Spring Boot 3.2** - 최신 스프링 프레임워크
- **Spring Security** - 보안 및 인증
- **Spring Data JPA** - 데이터 액세스 레이어
- **JWT (jsonwebtoken)** - 토큰 기반 인증
- **H2 Database** - 개발용 인메모리 DB

### DevOps
- **Docker & Docker Compose** - 컨테이너화
- **Nginx** - 리버스 프록시 (프로덕션)

## ✨ 주요 기능

### 🔑 인증 시스템
- [x] 카카오 OAuth2 소셜 로그인
- [x] JWT Access Token / Refresh Token
- [x] 자동 토큰 갱신
- [x] 로그인 상태 지속성

### 🖥 사용자 인터페이스
- [x] 반응형 대시보드
- [x] 사용자 프로필 관리
- [x] 실시간 로딩 상태
- [x] 에러 핸들링 및 알림

### 🔧 개발자 도구
- [x] 배치 API 작업 테스트
- [x] API 호출 테스트 도구
- [x] React Query Devtools
- [x] 상세한 에러 로깅

## 🚀 설치 및 실행

### 사전 요구사항

- Node.js 18+
- Java 17+
- Docker & Docker Compose (선택사항)
- 카카오 개발자 계정

### 1. 카카오 개발자 콘솔 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
2. 애플리케이션 생성
3. **플랫폼 설정**:
    - Web 플랫폼 추가
    - 도메인: `http://localhost:3000`
4. **카카오 로그인 설정**:
    - 활성화 설정: ON
    - Redirect URI: `http://localhost:8080/oauth2/callback/kakao`
5. **동의항목 설정**:
    - 닉네임: 필수 동의
    - 프로필 사진: 선택 동의
    - 카카오계정(이메일): 선택 동의
6. **앱 키 확인**:
    - REST API 키 복사
    - Client Secret 생성 후 복사

### 2. 로컬 개발 환경 설정

#### Backend 설정

```bash
# 1. 백엔드 디렉토리로 이동
cd backend

# 2. 환경변수 설정 (application.yml 또는 환경변수)
export KAKAO_CLIENT_ID=your_rest_api_key
export KAKAO_CLIENT_SECRET=your_client_secret
export KAKAO_REDIRECT_URI=http://localhost:8080/oauth2/callback/kakao

# 3. 애플리케이션 빌드 및 실행
./gradlew bootRun
```

#### Frontend 설정

```bash
# 1. 프론트엔드 디렉토리로 이동
cd frontend

# 2. 의존성 설치
npm install

# 3. 환경변수 설정 (.env 파일 생성)
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

# 4. 개발 서버 실행
npm run dev
```

### 3. Docker를 사용한 실행

```bash
# 1. 환경변수 파일 생성
cp .env.example .env
# .env 파일에 카카오 클라이언트 정보 입력

# 2. Docker Compose로 전체 시스템 실행
docker-compose up -d

# 3. 로그 확인
docker-compose logs -f
```

## ⚙️ 환경 설정

### Backend 환경변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `KAKAO_CLIENT_ID` | 카카오 REST API 키 | `your_rest_api_key` |
| `KAKAO_CLIENT_SECRET` | 카카오 Client Secret | `your_client_secret` |
| `KAKAO_REDIRECT_URI` | 카카오 리다이렉트 URI | `http://localhost:8080/oauth2/callback/kakao` |
| `FRONTEND_URL` | 프론트엔드 URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT 서명 키 | `mySecretKey123...` |
| `JWT_EXPIRATION` | JWT 만료 시간 (ms) | `86400000` |

### Frontend 환경변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_BASE_URL` | 백엔드 API URL | `http://localhost:8080/api` |
| `VITE_KAKAO_CLIENT_ID` | 카카오 클라이언트 ID | `your_kakao_client_id` |

## 📚 API 문서

### 인증 API

#### GET /api/auth/kakao/url
카카오 로그인 URL을 반환합니다.

**응답:**
```json
{
  "success": true,
  "data": "https://kauth.kakao.com/oauth/authorize?client_id=...",
  "message": null
}
```

#### POST /api/auth/kakao/login
카카오 인증 코드로 로그인을 처리합니다.

**파라미터:**
- `code`: 카카오 인증 코드

**응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "nickname": "사용자",
      "profileImage": "https://...",
      "roles": ["USER"]
    }
  }
}
```

#### POST /api/auth/logout
로그아웃을 처리합니다.

**응답:**
```json
{
  "success": true,
  "data": "로그아웃되었습니다.",
  "message": "로그아웃이 완료되었습니다."
}
```

## 📁 폴더 구조

```
kakao-login-system/
├── backend/                     # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/example/kakao/
│   │       ├── config/          # 설정 클래스
│   │       ├── controller/      # REST 컨트롤러
│   │       ├── dto/            # 데이터 전송 객체
│   │       ├── entity/         # JPA 엔티티
│   │       ├── repository/     # 데이터 레포지토리
│   │       ├── service/        # 비즈니스 로직
│   │       └── util/           # 유틸리티 클래스
│   └── src/main/resources/
│       └── application.yml     # 스프링 설정
├── frontend/                   # React 프론트엔드
│   ├── public/
│   │   └── kakao-callback.html # 카카오 로그인 콜백
│   ├── src/
│   │   ├── components/         # React 컴포넌트
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── lib/               # 라이브러리 설정
│   │   ├── services/          # API 서비스
│   │   ├── store/             # 상태 관리
│   │   └── App.jsx            # 메인 앱 컴포넌트
│   ├── package.json
│   ├── vite.config.js
│   └── postcss.config.cjs
├── docker-compose.yml          # Docker 컴포즈 설정
└── README.md
```

## 🚢 배포

### Docker를 사용한 프로덕션 배포

1. **환경변수 설정**
```bash
# .env.production 파일 생성
KAKAO_CLIENT_ID=your_production_client_id
KAKAO_CLIENT_SECRET=your_production_client_secret
KAKAO_REDIRECT_URI=https://yourdomain.com/oauth2/callback/kakao
FRONTEND_URL=https://yourdomain.com
```

2. **프로덕션 빌드**
```bash
# 프로덕션 프로파일로 실행
docker-compose --env-file .env.production up -d --profile production
```

3. **Nginx SSL 설정**
```bash
# SSL 인증서 설정 (Let's Encrypt 권장)
certbot --nginx -d yourdomain.com
```

### AWS/GCP 클라우드 배포

1. **ECS/Cloud Run 설정**
2. **환경변수를 시크릿 매니저로 관리**
3. **로드 밸런서 및 도메인 설정**
4. **SSL 인증서 적용**

## 🔧 트러블슈팅

### 자주 발생하는 문제들

#### 1. 카카오 로그인 실패
```
오류: "카카오 로그인에 실패했습니다"
해결: 
- 카카오 개발자 콘솔에서 Redirect URI 확인
- Client ID와 Secret 확인
- 브라우저 팝업 차단 해제
```

#### 2. CORS 오류
```
오류: "Access to fetch at 'http://localhost:8080' from origin 'http://localhost:3000' has been blocked by CORS policy"
해결:
- 백엔드 SecurityConfig의 CORS 설정 확인
- application.yml의 frontend-url 설정 확인
```

#### 3. JWT 토큰 만료
```
오류: "401 Unauthorized"
해결:
- 자동 토큰 갱신 로직 확인
- Refresh Token 유효성 확인
- 로컬스토리지의 토큰 확인
```

#### 4. Docker 빌드 실패
```
오류: "docker build failed"
해결:
- Java 17 이상 사용 확인
- Node.js 18 이상 사용 확인
- Docker 버전 업데이트
```

### 디버깅 도구

#### 로그 확인
```bash
# 백엔드 로그
docker-compose logs backend

# 프론트엔드 로그
docker-compose logs frontend

# 실시간 로그 모니터링
docker-compose logs -f
```

#### 개발자 도구 활용
- **React Query Devtools**: 서버 상태 모니터링
- **브라우저 개발자 도구**: 네트워크 요청 분석
- **Spring Boot Actuator**: 백엔드 헬스 체크

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

- **이슈 제보**: [GitHub Issues](https://github.com/your-repo/issues)
- **문의사항**: your-email@example.com

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!