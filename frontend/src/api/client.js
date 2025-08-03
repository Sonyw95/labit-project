import axios from "axios";
import useAuthStore from "../stores/authStore.js";
import { showToast } from "../components/advanced/Toast.jsx";

// 요청 중복 방지를 위한 맵
const pendingRequests = new Map();
const requestTimeouts = new Map();

// 요청 키 생성 함수
const generateRequestKey = (config) => {
    const { method, url, params, data } = config;
    return `${method?.toUpperCase()}_${url}_${JSON.stringify(params || {})}_${JSON.stringify(data || {})}`;
};

// 디바운스된 요청 처리
const debounceRequest = (key, request, delay = 100) => {
    if (requestTimeouts.has(key)) {
        clearTimeout(requestTimeouts.get(key));
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            requestTimeouts.delete(key);
            try {
                const result = await request();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, delay);

        requestTimeouts.set(key, timeout);
    });
};

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - 토큰 첨부만
instance.interceptors.request.use(async (config) => {
    try {
        const state = useAuthStore.getState();
        const accessToken = state.getAccessToken();

        // 토큰이 있고 만료되지 않았으면 첨부
        if (accessToken && !state.isTokenExpired(accessToken)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 중복 요청 방지
        const requestKey = generateRequestKey(config);

        // 동일한 요청이 진행 중이면 취소
        if (pendingRequests.has(requestKey)) {
            const existingRequest = pendingRequests.get(requestKey);
            existingRequest.cancel('중복 요청으로 인한 취소');
            pendingRequests.delete(requestKey);
        }

        // 새로운 CancelToken 생성
        const cancelSource = axios.CancelToken.source();
        config.cancelToken = cancelSource.token;

        // 요청을 맵에 저장
        pendingRequests.set(requestKey, cancelSource);

        // 토큰 검증 (보호된 경로에서만)
        if (config.headers.Authorization && state.isAuthenticated) {
            try {
                await state.validateStoredTokens();
            } catch (error) {
                // 검증 실패 시 즉시 로그아웃
                state.logout();
                throw new axios.Cancel('토큰 검증 실패로 인한 요청 취소');
            }
        }

    } catch (error) {
        console.error('요청 인터셉터 오류:', error);
        if (axios.isCancel(error)) {
            throw error;
        }
    }

    return config;
}, (error) => Promise.reject(error));


// Response interceptor - 401시 바로 로그아웃
instance.interceptors.response.use(
    (response) => {
        // 성공 시 대기 요청에서 제거
        const requestKey = generateRequestKey(response.config);
        pendingRequests.delete(requestKey);
        return response.data;
    },
    (error) => {
        // 취소된 요청이면 조용히 처리
        if (axios.isCancel(error)) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ cancelled: true, message: error.message });
        }

        // 에러 시 대기 요청에서 제거
        if (error.config) {
            const requestKey = generateRequestKey(error.config);
            pendingRequests.delete(requestKey);
        }

        // 401 에러 처리
        if (error.response?.status === 401) {
            const state = useAuthStore.getState();
            state.logout();
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

    // 디바운스된 요청 메서드들
    async get(url, config) {
        const requestKey = `GET_${url}_${JSON.stringify(config?.params || {})}`;
        return debounceRequest(requestKey, () => this.api.get(url, config));
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

    #getPublicRequest(){
        const publicApi = axios.create({
            baseURL: 'http://localhost:8080/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        publicApi.interceptors.response.use(
            (response) => response.data,
            (error) => {
                return Promise.reject(error);
            }
        );


        return publicApi;
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
                return await this.#getPublicRequest().get(`${url}`, requestConfig);
            case 'post':
                return await this.#getPublicRequest().post(`${url}`, data, requestConfig);
            case 'put':
                return await this.#getPublicRequest().put(`${url}`, data, requestConfig);
            case 'delete':
                return await this.#getPublicRequest().delete(`${url}`, requestConfig);
            default:
                throw new Error(`지원하지 않는 HTTP 메서드: ${method}`);
        }
    }
    // 모든 대기 중인 요청 취소 (로그아웃 시 사용)
    cancelAllRequests() {
        pendingRequests.forEach((cancelSource, requestKey) => {
            cancelSource.cancel('사용자 로그아웃으로 인한 요청 취소');
        });
        pendingRequests.clear();

        requestTimeouts.forEach((timeout, key) => {
            clearTimeout(timeout);
        });
        requestTimeouts.clear();
    }
}

export const api = new Api();