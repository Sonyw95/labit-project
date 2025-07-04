// src/lib/axios.js
import axios from 'axios';

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} data
 * @property {string} [message]
 * @property {string} [code]
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {string} [code]
 * @property {number} [status]
 */

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // 요청 인터셉터 - 토큰 자동 추가
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // 응답 인터셉터 - 토큰 만료 처리
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (refreshToken) {
                            const response = await this.client.post('/auth/refresh', {
                                refreshToken
                            });

                            const { accessToken } = response.data.data;
                            localStorage.setItem('accessToken', accessToken);

                            return this.client(originalRequest);
                        }
                        // eslint-disable-next-line no-unused-vars
                    } catch (refreshError) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // 복수개 작업 처리를 위한 배치 요청 메서드
    async batchRequests(requests) {
        try {
            const responses = await Promise.allSettled(
                requests.map(request => request())
            );

            return responses.map((response, index) => {
                if (response.status === 'fulfilled') {
                    return response.value.data.data;
                }
                console.error(`Batch request ${index} failed:`, response.reason);
                throw new Error(`Request ${index} failed: ${response.reason.message}`);

            });
        } catch (error) {
            throw new Error(`Batch request failed: ${error}`);
        }
    }

    async sequentialRequests(requests) {
        const results = [];

        for (const request of requests) {
            try {
                const response = await request();
                results.push(response.data.data);
            } catch (error) {
                console.error('Sequential request failed:', error);
                throw error;
            }
        }

        return results;
    }

    async get(url, config) {
        const response = await this.client.get(url, config);
        return response.data;
    }

    async post(url, data, config) {
        const response = await this.client.post(url, data, config);
        return response.data;
    }

    async put(url, data, config) {
        const response = await this.client.put(url, data, config);
        return response.data;
    }

    async delete(url, config) {
        const response = await this.client.delete(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();