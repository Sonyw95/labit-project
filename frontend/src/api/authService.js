import {api} from "@/api/client.js";
import useAuthStore from "@/stores/authStore.js";

export const authService = {
    // 카카오 로그인 인증 주소 (토큰 불필요)
    getKakaoAuthPath: () => api.publicRequest('get', '/auth/kakao/path'),

    // 카카오 로그인 (토큰 불필요)
    kakaoLogin: (code) => api.publicRequest('post', '/auth/kakao/login', null, {
        params: { code }
    }),

    updateUserInfo: (data) => api.put('/user/info', data),

    // 로그아웃
    logout: (kakaoAccessToken) => api.post('/auth/logout', null, {
        params: { kakaoAccessToken }
    }),

    // 내 정보 조회
    getUserInfo: () => api.get('/auth/me'),

    // 토큰 갱신 (Refresh Token 사용)
    refreshToken: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const refreshToken = useAuthStore().getState().getRefreshToken();
        if (!refreshToken) {
            throw new Error('Refresh token이 없습니다.');
        }

        return api.publicRequest('post', '/auth/token/refresh', {
            refreshToken
        });
    },

    // // 토큰 검증 (토큰 불필요 - 클라이언트에서 처리)
    // validateToken: (token) => {
    //     try {
    //         const { isTokenExpired } = getState();
    //         return !isTokenExpired(token);
    //     } catch (error) {
    //         return false;
    //     }
    // },
}