import axios from "axios";
import useAuthStore from "../stores/authStore.js";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            const { logout } = useAuthStore.getState();
            logout();

            // 로그인 페이지로 리다이렉트하지 않고 현재 페이지에서 로그인 UI 표시
            console.log('토큰이 만료되었습니다. 다시 로그인해주세요.');
        }
        return Promise.reject(error);
    }
);


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

    async delete(url, config) {
        return await this.api.delete(url, config);
    }
}

export const api = new Api();