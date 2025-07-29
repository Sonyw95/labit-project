import axios from "axios";
import useAuthStore from "../stores/authStore.js";
import { showToast } from "../components/advanced/Toast.jsx";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - 토큰 첨부만
instance.interceptors.request.use((config) => {
    try {
        const accessToken = useAuthStore.getState().getAccessToken();
        if (accessToken && !useAuthStore.getState().isTokenExpired(accessToken)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    } catch (error) {
        console.error('토큰 접근 오류:', error);
    }
    return config;
}, (error) => Promise.reject(error));


// Response interceptor - 401시 바로 로그아웃
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore().logout();
            showToast.error('세션 만료', '다시 로그인해주세요.');

            // 보호된 페이지에서는 홈으로 리다이렉트
            const protectedPaths = ['/admin', '/user/settings'];
            if (protectedPaths.some(path => window.location.pathname.startsWith(path))) {
                window.location.href = '/home';
            }
        }
        return Promise.reject(error);
    }
);
// 토큰 갱신 함수
// const refreshTokenRequest = async (refreshToken) => {
//     try {
//         console.log('토큰 갱신 요청 시작');
//
//         const response = await axios.post(
//             'http://localhost:8080/api/auth/token/refresh',
//             { refreshToken },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 timeout: 5000,
//             }
//         );
//
//         const { accessToken, refreshToken: newRefreshToken } = response.data;
//
//         if (accessToken) {
//             // Zustand store에 새 토큰 저장
//             const success = useAuthStore.getState().setTokens(accessToken, newRefreshToken);
//
//             if (success) {
//                 console.log('토큰 갱신 성공');
//                 showToast.info('세션 연장', '로그인 세션이 자동으로 연장되었습니다.');
//                 return { accessToken, refreshToken: newRefreshToken };
//             } else {
//                 throw new Error('토큰 저장 실패');
//             }
//         } else {
//             throw new Error('응답에 액세스 토큰이 없음');
//         }
//     } catch (error) {
//         console.error('토큰 갱신 요청 실패:', error);
//         throw error;
//     }
// };
//
// // 토큰 갱신 실패 시 처리
// const handleTokenRefreshFailure = () => {
//     const { logout } = useAuthStore.getState();
//     logout();
//
//     showToast.error(
//         '세션 만료',
//         '로그인 세션이 만료되었습니다. 다시 로그인해주세요.'
//     );
//
//     // 현재 페이지가 보호된 경로인 경우에만 홈으로 리다이렉트
//     const currentPath = window.location.pathname;
//     const protectedPaths = ['/admin', '/user/settings'];
//
//     if (protectedPaths.some(path => currentPath.startsWith(path))) {
//         setTimeout(() => {
//             window.location.href = '/home';
//         }, 2000);
//     }
// };

class Api {
    constructor() {
        this.api = instance;
    }

    async get(url, config) {
        return await this.api.get(url, config);
    }

    async post(url, data, config) {
        return await this.api.post(url, data, config);
    }

    async put(url, data, config) {
        return await this.api.put(url, data, config);
    }

    async patch(url, data, config) {
        return await this.api.patch(url, data, config);
    }

    async delete(url, config) {
        return await this.api.delete(url, config);
    }

    // 토큰 없이 요청하는 경우 (로그인, 회원가입 등)
    async publicRequest(method, url, data = null, config = {}) {
        const requestConfig = {
            ...config,
            headers: {
                ...config.headers,
                // Authorization 헤더 제거
            }
        };

        // Authorization 헤더가 있다면 제거
        delete requestConfig.headers?.Authorization;

        switch (method.toLowerCase()) {
            case 'get':
                return await axios.get(`/api${url}`, requestConfig);
            case 'post':
                return await axios.post(`/api${url}`, data, requestConfig);
            case 'put':
                return await axios.put(`/api${url}`, data, requestConfig);
            case 'delete':
                return await axios.delete(`/api${url}`, requestConfig);
            default:
                throw new Error(`지원하지 않는 HTTP 메서드: ${method}`);
        }
    }
}

export const api = new Api();