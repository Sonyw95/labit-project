// API 응답 타입 정의 (JSDoc으로 타입 힌트 제공)
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} data
 * @property {string} [message]
 * @property {string} [code]
 */

import axios from "axios";

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
        this.setInterceptors();
    }
    // 요청, 응답 인터셉터
    setInterceptors() {
        // 요청 -> 토큰 저장 혹은 토큰 헤더 세팅
        this.client.interceptors.request.use(
            ( config ) => {
                const token = localStorage.getItem('accessToken');
                if( token ){
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            ( error ) => Promise.reject(error)
        );
        //응답 -> 토큰 만료 처리
        this.client.interceptors.response.use(
            ( response ) => response,
            async ( error ) => {
                const originRequest = error.config;
                if( error.response?.status === 401 && !originRequest._retry ){
                    originRequest._retry  = true;
                    try{
                        // 스토리지에 저장된 새로고침 토큰을 획득
                        const refreshToken = localStorage.getItem('refreshToken');
                        if( refreshToken ){
                            // 새로고침 토큰이 존재할 경우 만료 처리
                            const response = await this.client.post('/auth/refresh', {
                                refreshToken
                            });
                            // 접근 토큰을 스토리지에 저장
                            const { accessToken } = response.data.data;
                            localStorage.setItem('accessToken', accessToken);

                            return this.client(originRequest);
                        }
                    }catch ( refreshError ){
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/home';
                    }
                }
                return Promise.reject( error );
            }
        )
    }

    // 복수 작업을 위한 배치 Request Method
    async batchRequests( request ){
        try{
            const response = await Promise.allSettled(
                request.map(request => request() )
            );
            return response.map( ( resp, index ) => {
                if( resp.status === 'fulfilled' ){
                    return resp.value.data.data
                }
                console.error(`Batch Request ${index} failed: ${resp.reason}`);
                throw new Error(`[ERROR] Request ${index} failed: ${resp.reason.message}`);
            } )
        }catch ( error ){
            throw new Error( `[ERROR] Batch Request Failed : ${error}` );
        }
    }

    // 직렬 처리 ( 순차 )
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
    // 기본 HTTP 메서드들
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