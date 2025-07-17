// src/api/apiClient.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        // 필요시 인증 토큰 추가
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // 토큰 만료 시 로그아웃 처리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');

            // 토큰 만료 알림
            if (window.showToast) {
                window.showToast('세션이 만료되었습니다. 다시 로그인해주세요.', 'warning');
            }

            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// API 클라이언트 클래스
export class ApiClient {
    constructor() {
        this.api = instance;
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



