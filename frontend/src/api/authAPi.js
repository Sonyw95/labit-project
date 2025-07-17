import {apiClient} from "./apiClient.js";

export const authService = {
    // 카카오 로그인
    async getKakaoLoginUrl() {
        const response = await apiClient.get('/auth/kakao/url');
        return response.data;
    },
    openKakaoLoginPopup(){
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const kakaoLoginUrl = await this.getKakaoLoginUrl();

                const popup = window.open(
                    kakaoLoginUrl,
                    'kakaoLogin',
                    `width=500,height=700,scrollbars=yes,resizable=yes,left=${
                        window.screen.width / 2 - 250  },top=${
                        window.screen.height / 2 - 350}`
                );

                if (!popup) {
                    reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
                    return;
                }

                // 팝업 모니터링
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        reject(new Error('로그인이 취소되었습니다.'));
                    }
                }, 1000);

                // 메시지 리스너
                const messageListener = (event) => {
                    // 보안을 위해 origin 체크
                    if (event.origin !== window.location.origin) {return;}

                    if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        resolve(event.data.code);
                    } else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error(event.data.error || '카카오 로그인 중 오류가 발생했습니다.'));
                    }
                };

                window.addEventListener('message', messageListener);

                // 타임아웃 설정 (5분)
                setTimeout(() => {
                    if (!popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error('로그인 시간이 초과되었습니다.'));
                    }
                }, 300000); // 5분

            } catch (error) {
                reject(error);
            }
        });
    },
    async loginWithKakaoCode(code) {
        const response = await apiClient.post(`/auth/kakao/login?code=${code}`);
        return response.data;
    },
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
        if (!token) {
            return false;
        }
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