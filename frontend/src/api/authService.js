import { api, apiUtils } from "@/api/client.js";
import useAuthStore from "@/stores/authStore.js";
import { showToast } from "@/components/advanced/Toast.jsx";

export const authService = {
    // 카카오 로그인 인증 주소 (토큰 불필요)
    getKakaoAuthPath: () => api.publicRequest('get', '/auth/kakao/path'),

    // 카카오 로그인 (토큰 불필요)
    kakaoLogin: (code) => api.publicRequest('post', '/auth/kakao/login', null, {
        params: { code }
    }),

    // 내 정보 조회 (서버에서 최신 정보)
    getUserInfo: async () => {
        try {
            const response = await api.get('/auth/me');
            // console.log('서버에서 사용자 정보 조회 성공');
            return response;
        } catch (error) {
            // console.error('사용자 정보 조회 실패:', error);

            // 401 에러면 자동 로그아웃 처리됨 (client.js 인터셉터에서)
            if (error.response?.status === 401) {
                throw new Error('인증이 만료되었습니다.');
            }

            throw error;
        }
    },

    // 사용자 정보 수정 (새로운 토큰 재발급 방식)
    updateUserInfo: async (data) => {
        try {
            // console.log('사용자 정보 수정 시작:', data);

            // 서버에 사용자 정보 수정 요청 (새 토큰과 함께 응답)
            const response = await api.put('/auth/me', data);

            // console.log('서버 사용자 정보 수정 성공:', response);

            // 응답에서 새 토큰과 사용자 정보 추출
            const { user, accessToken, tokenType, expiresIn, message } = response;

            if (!accessToken || !user) {
                throw new Error('서버 응답이 올바르지 않습니다.');
            }

            // 새 토큰으로 AuthStore 업데이트
            const authStore = useAuthStore.getState();
            const success = authStore.setTokens(accessToken, authStore.getRefreshToken());

            if (!success) {
                throw new Error('새 토큰 설정에 실패했습니다.');
            }

            // console.log('새 토큰으로 업데이트 완료:', {
            //     nickname: user.nickname,
            //     tokenType,
            //     expiresIn
            // });

            // 성공 메시지 표시
            showToast.success('프로필 수정', message || '프로필 정보가 성공적으로 수정되었습니다.');

            return response;

        } catch (error) {
            console.error('사용자 정보 수정 실패:', error);

            // 에러 타입별 처리
            if (error.response?.status === 409) {
                showToast.error('수정 실패', '이미 사용 중인 이메일 또는 닉네임입니다.');
            } else if (error.response?.status === 400) {
                showToast.error('입력 오류', '입력 정보를 확인해주세요.');
            } else if (error.response?.status === 401) {
                showToast.error('인증 만료', '로그인이 만료되었습니다. 다시 로그인해주세요.');
            } else {
                showToast.error('수정 실패', '프로필 수정 중 오류가 발생했습니다.');
            }

            throw error;
        }
    },

    // 완전한 로그아웃 처리 (기존 코드 유지)
    logout: async (kakaoAccessToken) => {
        if (apiUtils.isLoggingOut()) {
            // console.log('이미 로그아웃 처리 중입니다.');
            return;
        }
        try {
            apiUtils.cancelAllRequests();
            try {
                await api.post('/auth/logout', null, {
                    params: { kakaoAccessToken }
                });
            } catch (error) {
                return error;
            }
        } catch (error) {
            // console.error('로그아웃 중 오류:', error);
        } finally {
            // apiUtils.forceLogout('사용자 로그아웃 요청');
            // 5. 보호된 페이지에서는 홈으로 리다이렉트
            const protectedPaths = ['/admin', '/user/settings', '/post/edit'];
            const currentPath = window.location.pathname;

            if (protectedPaths.some(path => currentPath.startsWith(path))) {
                setTimeout(() => {
                    window.location.href = '/home';
                }, 1000);
            }
        }
    },

    // 강제 로그아웃 (401 에러 등에서 자동 호출)
    forceLogout: (reason = '자동 로그아웃') => {
        // console.warn(`강제 로그아웃 실행: ${reason}`);
        apiUtils.forceLogout(reason);

        const protectedPaths = ['/admin', '/user/settings', '/post/edit'];
        const currentPath = window.location.pathname;

        if (!protectedPaths.some(path => currentPath.startsWith(path))) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
    },

    // 토큰 유효성 검사 (서버 검증 포함)
    validateToken: async () => {
        try {
            return await apiUtils.validateToken();
        } catch (error) {
            console.warn('토큰 검증 실패:', error);
            return false;
        }
    },

    // 앱 시작시 토큰 검증 (단순화된 버전)
    validateTokenOnStartup: async () => {
        const authStore = useAuthStore.getState();

        if (!authStore.isInitialized) {
            // console.log('아직 초기화되지 않음, 검증 건너뛰기');
            return false;
        }

        const token = authStore.getAccessToken();
        if (!token) {
            return false;
        }

        try {
            // 1. 클라이언트 측 만료 확인
            if (authStore.isTokenExpired(token)) {
                // console.log('토큰 만료됨');
                authService.forceLogout('토큰 만료');
                return false;
            }

            // 2. 서버 측 검증 (블랙리스트 확인)
            const isValid = await apiUtils.validateToken();
            if (!isValid) {
                // console.log('서버 토큰 검증 실패');
                authService.forceLogout('서버 토큰 검증 실패');
                return false;
            }

            console.log('토큰 검증 성공');
            return true;

        } catch (error) {
            // console.error('토큰 검증 중 오류:', error);
            authService.forceLogout('토큰 검증 오류');
            return false;
        }
    },

    // 토큰 갱신 (Refresh Token 사용)
    refreshToken: () => {
        const refreshToken = useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
            throw new Error('Refresh token이 없습니다.');
        }

        return api.publicRequest('post', '/auth/token/refresh', {
            refreshToken
        });
    },

    // 회원탈퇴
    withdrawal: async (kakaoAccessToken) => {
        try {
            const response = await api.get('/auth/withdrawal', {
                params: { kakaoAccessToken }
            });

            showToast.success('회원탈퇴', '회원탈퇴가 완료되었습니다.');
            authService.forceLogout('회원탈퇴 완료');

            return response;
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            showToast.error('회원탈퇴 실패', '회원탈퇴 중 오류가 발생했습니다.');
            throw error;
        }
    },

    // 브라우저 저장소 완전 정리
    clearAllStorage: () => {
        apiUtils.clearStorage();
    },

    // 로그아웃 상태 확인
    isLoggingOut: () => {
        return apiUtils.isLoggingOut();
    },

    // 모든 요청 취소
    cancelAllRequests: () => {
        apiUtils.cancelAllRequests();
    },

    // 긴급 복구 함수
    emergencyReset: () => {
        console.warn('긴급 복구 실행');
        apiUtils.resetLogoutFlag();
        apiUtils.clearStorage();

        const authStore = useAuthStore.getState();
        authStore.forceLogout();

        showToast.info('시스템 복구', '인증 상태가 초기화되었습니다.');

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    },

    // 개발자 도구용 디버깅 함수들 (단순화)
    debug: {
        // 현재 사용자 정보 상태 확인
        getCurrentUserState: () => {
            const authStore = useAuthStore.getState();
            return {
                user: authStore.user,
                isAuthenticated: authStore.isAuthenticated,
                token: authStore.getAccessToken()?.substring(0, 20) + '...'
            };
        },

        // 토큰 정보 확인
        getTokenInfo: () => {
            const authStore = useAuthStore.getState();
            const token = authStore.getAccessToken();

            if (!token) {
                return null;
            }

            try {
                const { jwtDecode } = require('jwt-decode');
                const decoded = jwtDecode(token);

                return {
                    userId: decoded.userId,
                    email: decoded.email,
                    nickname: decoded.nickname,
                    role: decoded.role,
                    exp: new Date(decoded.exp * 1000),
                    isExpired: authStore.isTokenExpired(token)
                };
            } catch (error) {
                return { error: '토큰 디코딩 실패' };
            }
        }
    }
};