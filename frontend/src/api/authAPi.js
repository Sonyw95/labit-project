import {apiClient} from "./apiClient.js";

export const authService = {
    // 카카오 로그인
    kakaoLogin: (code) => apiClient.post('/auth/kakao/login', { code }),

    // 로그아웃
    logout: () => apiClient.post('/auth/logout'),

    // 현재 사용자 정보 조회
    getCurrentUser: () => apiClient.get('/auth/me'),

    // 토큰 검증
    validateToken: (token) => apiClient.post('/auth/validate', { token }),
};

export const kakaoAuthUtils = {
    // 카카오 로그인 URL 생성
    getKakaoAuthUrl: () => {
        const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID || 'your-kakao-client-id';
        const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173/auth/callback';

        return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    },

    // URL에서 authorization code 추출
    getCodeFromUrl: (url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('code');
    },

    // 카카오 로그인 페이지로 리다이렉트
    redirectToKakaoLogin: () => {
        window.location.href = kakaoAuthUtils.getKakaoAuthUrl();
    },
};

// 토큰 관련 유틸리티
export const tokenUtils = {
    // 토큰 저장
    saveToken: (token) => {
        localStorage.setItem('accessToken', token);
    },

    // 토큰 가져오기
    getToken: () => {
        return localStorage.getItem('accessToken');
    },

    // 토큰 제거
    removeToken: () => {
        localStorage.removeItem('accessToken');
    },

    // 토큰 존재 여부 확인
    hasToken: () => {
        return !!localStorage.getItem('accessToken');
    },

    // JWT 토큰 디코딩 (페이로드 부분만)
    decodeToken: (token) => {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    },

    // 토큰 만료 시간 확인
    isTokenExpired: (token) => {
        try {
            const decoded = tokenUtils.decodeToken(token);
            if (!decoded || !decoded.exp) return true;

            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    },

    // 토큰 유효성 검증
    isValidToken: (token) => {
        if (!token) return false;
        return !tokenUtils.isTokenExpired(token);
    },
};

// 사용자 정보 관련 유틸리티
export const userUtils = {
    // 사용자 정보 저장
    saveUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // 사용자 정보 가져오기
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // 사용자 정보 제거
    removeUser: () => {
        localStorage.removeItem('user');
    },

    // 로그인 상태 확인
    isLoggedIn: () => {
        return tokenUtils.hasToken() && userUtils.getUser();
    },

    // 관리자 권한 확인
    isAdmin: () => {
        const user = userUtils.getUser();
        return user && user.userRole === 'ADMIN';
    },
};