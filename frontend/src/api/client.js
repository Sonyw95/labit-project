import axios from "axios";
import useAuthStore from "../stores/authStore.js";
import { showToast } from "../components/advanced/Toast.jsx";

// 요청 중복 방지를 위한 맵
const pendingRequests = new Map();
const requestTimeouts = new Map();

// 로그아웃 처리 중복 방지 플래그
let isLoggingOut = false;

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

// 강제 로그아웃 처리 함수
const handleForceLogout = (reason = '인증 오류') => {
    if (isLoggingOut) {
        return; // 이미 로그아웃 처리 중이면 중복 실행 방지
    }

    isLoggingOut = true;
    console.warn(`강제 로그아웃 실행: ${reason}`);

    try {
        // 1. 모든 진행 중인 요청 취소
        pendingRequests.forEach((cancelSource) => {
            cancelSource.cancel('강제 로그아웃으로 인한 요청 취소');
        });
        pendingRequests.clear();

        requestTimeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
        requestTimeouts.clear();

        // 2. AuthStore 강제 로그아웃
        const authStore = useAuthStore.getState();
        authStore.forceLogout();

        // 3. 브라우저 저장소 완전 정리
        clearAllBrowserStorage();

        // 4. 사용자에게 알림
        showToast.error('세션 만료', '다시 로그인해주세요.');

        // 5. 보호된 페이지에서는 홈으로 리다이렉트
        const protectedPaths = ['/admin', '/user/settings', '/post/edit'];
        const currentPath = window.location.pathname;

        if (protectedPaths.some(path => currentPath.startsWith(path))) {
            setTimeout(() => {
                window.location.href = '/home';
            }, 1000);
        }

    } catch (error) {
        console.error('강제 로그아웃 처리 중 오류:', error);
    } finally {
        // 5초 후 플래그 리셋 (안전장치)
        setTimeout(() => {
            isLoggingOut = false;
        }, 5000);
    }
};

// 브라우저 저장소 완전 정리
const clearAllBrowserStorage = () => {
    try {
        // LocalStorage 정리
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');

        // SessionStorage 정리
        sessionStorage.clear();

        // 쿠키 정리 (있다면)
        const hostname = window.location.hostname;
        document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
        document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;

        console.log('브라우저 저장소 완전 정리 완료');
    } catch (error) {
        console.error('저장소 정리 중 오류:', error);
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - 토큰 첨부 및 검증 강화
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

        // 토큰 검증 강화 (보호된 경로에서만)
        if (config.headers.Authorization && state.isAuthenticated) {
            try {
                // 서버 측 토큰 검증 (블랙리스트 확인 포함)
                const isValid = await validateTokenWithServer(accessToken);
                if (!isValid) {
                    throw new Error('서버 토큰 검증 실패');
                }
            } catch (error) {
                console.warn('토큰 검증 실패:', error.message);
                handleForceLogout('토큰 검증 실패');
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

// 서버 측 토큰 검증 함수
const validateTokenWithServer = async (token) => {
    try {
        const response = await axios.get('http://localhost:8080/api/auth/token/validate', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 3000
        });

        return response.status === 200 && response.data === true;
    } catch (error) {
        if (error.response?.status === 401) {
            // 401이면 블랙리스트된 토큰이거나 무효한 토큰
            return false;
        }
        // 네트워크 오류 등은 일단 유효한 것으로 처리
        console.warn('토큰 검증 서버 요청 실패:', error.message);
        return true;
    }
};

// Response interceptor - 강화된 401 에러 처리
instance.interceptors.response.use(
    (response) => {
        // 성공 시 대기 요청에서 제거
        const requestKey = generateRequestKey(response.config);
        pendingRequests.delete(requestKey);

        // 로그아웃 플래그 리셋 (성공적인 요청이면)
        if (isLoggingOut && response.config.url !== '/auth/logout') {
            isLoggingOut = false;
        }

        return response.data;
    },
    (error) => {
        // 취소된 요청이면 조용히 처리
        if (axios.isCancel(error)) {
            return Promise.reject({ cancelled: true, message: error.message });
        }

        // 에러 시 대기 요청에서 제거
        if (error.config) {
            const requestKey = generateRequestKey(error.config);
            pendingRequests.delete(requestKey);
        }

        // 401 에러 처리 강화
        if (error.response?.status === 401) {
            console.warn('401 에러 감지:', error.config?.url);

            // 토큰 검증 API가 아닌 경우에만 강제 로그아웃
            if (!error.config?.url?.includes('/auth/token/validate')) {
                handleForceLogout('401 인증 오류');
            }
        }

        // 403 에러 처리 (권한 없음)
        if (error.response?.status === 403) {
            showToast.error('접근 권한 없음', '해당 기능에 접근할 권한이 없습니다.');
        }

        // 500 에러 처리
        if (error.response?.status >= 500) {
            showToast.error('서버 오류', '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }

        return Promise.reject(error);
    }
);

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

        console.log('모든 진행 중인 요청이 취소되었습니다.');
    }

    // 강제 로그아웃 (외부에서 호출 가능)
    forceLogout(reason = '수동 호출') {
        handleForceLogout(reason);
    }

    // 브라우저 저장소 정리 (외부에서 호출 가능)
    clearStorage() {
        clearAllBrowserStorage();
    }

    // 토큰 검증 (외부에서 호출 가능)
    async validateToken() {
        const authStore = useAuthStore.getState();
        const token = authStore.getAccessToken();

        if (!token) {
            return false;
        }

        // 클라이언트 측 만료 확인
        if (authStore.isTokenExpired(token)) {
            return false;
        }

        // 서버 측 검증 (블랙리스트 확인 포함)
        return await validateTokenWithServer(token);
    }

    // 로그아웃 상태 확인
    isLoggingOut() {
        return isLoggingOut;
    }

    // 로그아웃 플래그 리셋 (긴급시 사용)
    resetLogoutFlag() {
        isLoggingOut = false;
        console.log('로그아웃 플래그가 리셋되었습니다.');
    }
}

export const api = new Api();

// 전역에서 사용할 수 있는 유틸리티 함수들
export const apiUtils = {
    forceLogout: (reason) => api.forceLogout(reason),
    clearStorage: () => api.clearStorage(),
    validateToken: () => api.validateToken(),
    cancelAllRequests: () => api.cancelAllRequests(),
    isLoggingOut: () => api.isLoggingOut(),
    resetLogoutFlag: () => api.resetLogoutFlag(),
};