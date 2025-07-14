// services/apiClient.js
import axios from 'axios';
import {useApiStore} from "@/stores/apiStore.js";

// Axios 인스턴스 생성
const createApiInstance = (baseURL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080/api') => {
    const instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 요청 인터셉터 - 토큰 자동 첨부
    instance.interceptors.request.use(
        (config) => {
            // 🔥 Zustand store에서 토큰 가져오기 (persist가 관리)
            const { accessToken } = useApiStore.getState();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 응답 인터셉터 - 토큰 갱신 및 에러 처리
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const { refreshToken, setAuth, clearAuth } = useApiStore.getState();

                    if (refreshToken) {
                        const response = await axios.post(`${baseURL}/auth/kakao/refresh`, {}, {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`
                            }
                        });

                        const authData = response.data;
                        setAuth(authData); // 🔥 persist가 자동으로 저장

                        // 원래 요청 재시도
                        originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    // 토큰 갱신 실패시 로그아웃
                    const { clearAuth } = useApiStore.getState();
                    clearAuth(); // 🔥 persist가 자동으로 localStorage에서 제거
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        }
    );
    return instance;
};

const api = createApiInstance();

// API 클라이언트 클래스
export class ApiClient {
    constructor() {
        this.api = api;
    }
    async get(url, config) {
        const response = await this.api.get(url, config);
        return response.data;
    }

    async post(url, data, config) {
        const response = await this.api.post(url, data, config);
        return response.data;
    }

    async put(url, data, config) {
        const response = await this.api.put(url, data, config);
        return response.data;
    }

    async delete(url, config) {
        const response = await this.api.delete(url, config);
        return response.data;
    }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();



