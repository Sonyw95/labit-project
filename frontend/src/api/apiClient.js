// ========================================
// api/apiClient.js - 메인 API 클라이언트 (캡슐화)
// ========================================
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API 클라이언트 상태 관리 (Zustand)
export const useApiStore = create(
    persist(
        (set, get) => ({
            // 상태
            baseURL: 'http://localhost:8080/api',
            timeout: 10000,
            retryAttempts: 3,
            tokens: {
                access: null,
                refresh: null,
            },

            // 액션
            setTokens: (tokens) => set({ tokens }),
            clearTokens: () => set({ tokens: { access: null, refresh: null } }),
            updateBaseURL: (baseURL) => set({ baseURL }),
            updateTimeout: (timeout) => set({ timeout }),
        }),
        {
            name: 'api-store',
            partialize: (state) => ({
                tokens: state.tokens,
                baseURL: state.baseURL,
                timeout: state.timeout,
            }),
        }
    )
);

// API 클라이언트 클래스
class ApiClient {
    constructor() {
        this.store = useApiStore.getState();
        this.instance = null;
        this.refreshPromise = null;
        this.initializeAxios();

        // Zustand store 변경 감지
        useApiStore.subscribe(
            (state) => {
                this.store = state;
                this.updateAxiosConfig();
            }
        );
    }

    // Axios 인스턴스 초기화
    initializeAxios() {
        this.instance = axios.create({
            baseURL: this.store.baseURL,
            timeout: this.store.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    // Axios 설정 업데이트
    updateAxiosConfig() {
        if (this.instance) {
            this.instance.defaults.baseURL = this.store.baseURL;
            this.instance.defaults.timeout = this.store.timeout;
        }
    }

    // 인터셉터 설정
    setupInterceptors() {
        // 요청 인터셉터
        this.instance.interceptors.request.use(
            (config) => {
                const { tokens } = this.store;

                // 액세스 토큰 자동 추가
                if (tokens.access && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${tokens.access}`;
                }

                // 요청 로깅 (개발 모드)
                if (import.meta.env.MODE === 'development') {
                    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                        data: config.data,
                        params: config.params,
                    });
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 응답 인터셉터
        this.instance.interceptors.response.use(
            (response) => {
                // 응답 로깅 (개발 모드)
                if (import.meta.env.MODE === 'development') {
                    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                        status: response.status,
                        data: response.data,
                    });
                }

                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // 토큰 만료 시 자동 갱신
                if (error.response?.status === 401 && !originalRequest._retry && this.store.tokens.refresh) {
                    originalRequest._retry = true;

                    try {
                        // 동시 요청들이 모두 토큰 갱신을 시도하지 않도록 Promise 재사용
                        if (!this.refreshPromise) {
                            this.refreshPromise = this.refreshTokens();
                        }

                        await this.refreshPromise;
                        this.refreshPromise = null;

                        // 원래 요청 재시도
                        return this.instance(originalRequest);
                    } catch (refreshError) {
                        // 토큰 갱신 실패 시 로그아웃 처리
                        this.store.clearTokens();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                // 에러 로깅
                if (import.meta.env.MODE === 'development') {
                    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                        status: error.response?.status,
                        message: error.response?.data?.message || error.message,
                    });
                }

                return Promise.reject(this.formatError(error));
            }
        );
    }

    // 에러 포맷팅
    formatError(error) {
        if (error.response) {
            // 서버 응답 에러
            return {
                type: 'response',
                status: error.response.status,
                message: error.response.data?.message || `HTTP ${error.response.status}`,
                data: error.response.data,
                code: error.response.data?.code,
            };
        } else if (error.request) {
            // 네트워크 에러
            return {
                type: 'network',
                message: '네트워크 연결을 확인해주세요.',
                originalError: error,
            };
        }
            // 기타 에러
            return {
                type: 'unknown',
                message: error.message || '알 수 없는 오류가 발생했습니다.',
                originalError: error,
            };

    }

    // 토큰 갱신
    async refreshTokens() {
        const { tokens } = this.store;

        if (!tokens.refresh) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await axios.post(`${this.store.baseURL}/auth/refresh`, {
                refreshToken: tokens.refresh,
            });

            const newTokens = {
                access: response.data.accessToken,
                refresh: response.data.refreshToken || tokens.refresh,
            };

            useApiStore.getState().setTokens(newTokens);
            return newTokens;
        } catch (error) {
            useApiStore.getState().clearTokens();
            throw error;
        }
    }

    // 재시도 로직이 포함된 요청
    async requestWithRetry(config, retries = this.store.retryAttempts) {
        try {
            return await this.instance(config);
        } catch (error) {
            if (retries > 0 && this.shouldRetry(error)) {
                await this.delay(1000 * (this.store.retryAttempts - retries + 1)); // 지수 백오프
                return this.requestWithRetry(config, retries - 1);
            }
            throw error;
        }
    }

    // 재시도 여부 판단
    shouldRetry(error) {
        // 네트워크 에러 또는 5xx 서버 에러만 재시도
        return !error.response || error.response.status >= 500;
    }

    // 지연 함수
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 복수 요청 배치 처리
    async batchRequests(requests, options = {}) {
        const {
            concurrent = 5, // 동시 요청 수
            retryFailed = true,
            onProgress,
        } = options;

        const results = [];
        const errors = [];
        let completed = 0;

        // 청크 단위로 요청 처리
        for (let i = 0; i < requests.length; i += concurrent) {
            const chunk = requests.slice(i, i + concurrent);

            const chunkPromises = chunk.map(async (request, index) => {
                try {
                    const result = await this.requestWithRetry(request);
                    completed++;

                    onProgress?.({
                        completed,
                        total: requests.length,
                        progress: (completed / requests.length) * 100,
                    });

                    return { success: true, data: result.data, index: i + index };
                } catch (error) {
                    completed++;
                    const errorResult = { success: false, error, index: i + index };

                    if (retryFailed) {
                        errors.push(errorResult);
                    }

                    onProgress?.({
                        completed,
                        total: requests.length,
                        progress: (completed / requests.length) * 100,
                        errors: errors.length,
                    });

                    return errorResult;
                }
            });

            const chunkResults = await Promise.all(chunkPromises);
            results.push(...chunkResults);
        }

        return {
            results: results.filter(r => r.success),
            errors: results.filter(r => !r.success),
            total: requests.length,
            successCount: results.filter(r => r.success).length,
            errorCount: results.filter(r => !r.success).length,
        };
    }

    // 파일 업로드 (진행률 포함)
    async uploadFile(file, endpoint, options = {}) {
        const formData = new FormData();
        formData.append('file', file);

        if (options.fields) {
            Object.entries(options.fields).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }

        return this.instance.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (options.onProgress) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    options.onProgress(progress);
                }
            },
            ...options.axiosConfig,
        });
    }

    // 스트리밍 다운로드
    async downloadFile(url, options = {}) {
        return this.instance.get(url, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                if (options.onProgress && progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    options.onProgress(progress);
                }
            },
            ...options,
        });
    }

    // 인증 API
    auth = {
        // 일반 로그인
        login: async (credentials) => {
            const response = await this.instance.post('/auth/login', credentials);
            const { accessToken, refreshToken, user } = response.data;

            useApiStore.getState().setTokens({
                access: accessToken,
                refresh: refreshToken,
            });

            return { token: accessToken, refreshToken, user };
        },

        // 카카오 로그인
        loginWithKakao: async () => {
            // 카카오 OAuth URL 생성
            const kakaoAuthUrl = `${this.store.baseURL}/auth/kakao`;

            // 팝업으로 카카오 로그인 처리
            return new Promise((resolve, reject) => {
                const popup = window.open(
                    kakaoAuthUrl,
                    'kakaoLogin',
                    'width=500,height=600,scrollbars=yes,resizable=yes'
                );

                const handleMessage = (event) => {
                    if (event.origin !== window.location.origin) {
                        return;
                    }

                    if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
                        const { accessToken, refreshToken, user } = event.data;

                        useApiStore.getState().setTokens({
                            access: accessToken,
                            refresh: refreshToken,
                        });

                        resolve({ token: accessToken, refreshToken, user });
                        popup.close();
                    } else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
                        reject(new Error(event.data.error));
                        popup.close();
                    }
                };

                window.addEventListener('message', handleMessage);

                // 팝업이 닫혔는지 체크
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', handleMessage);
                        reject(new Error('Login cancelled'));
                    }
                }, 1000);
            });
        },

        // 로그아웃
        logout: async () => {
            try {
                await this.instance.post('/auth/logout');
            } finally {
                useApiStore.getState().clearTokens();
            }
        },

        // 토큰 갱신
        refreshToken: async (refreshToken) => {
            const response = await this.instance.post('/auth/refresh', {
                refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            useApiStore.getState().setTokens({
                access: accessToken,
                refresh: newRefreshToken || refreshToken,
            });

            return { token: accessToken, refreshToken: newRefreshToken || refreshToken };
        },

        // 토큰 만료 확인
        isTokenExpired: async (token) => {
            try {
                await this.instance.get('/auth/verify', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return false;
            } catch (error) {
                return error.response?.status === 401;
            }
        },

        // 사용자 정보 조회
        getProfile: async () => {
            const response = await this.instance.get('/auth/profile');
            return response.data;
        },

        // 비밀번호 변경
        changePassword: async (currentPassword, newPassword) => {
            const response = await this.instance.put('/auth/password', {
                currentPassword,
                newPassword,
            });
            return response.data;
        },
    };

    // 블로그 API
    blog = {
        // 포스트 목록 조회
        getPosts: async (params = {}) => {
            const response = await this.instance.get('/posts', { params });
            return response.data;
        },

        // 포스트 상세 조회
        getPost: async (id) => {
            const response = await this.instance.get(`/posts/${id}`);
            return response.data;
        },

        // 포스트 생성
        createPost: async (postData) => {
            const response = await this.instance.post('/posts', postData);
            return response.data;
        },

        // 포스트 수정
        updatePost: async (id, postData) => {
            const response = await this.instance.put(`/posts/${id}`, postData);
            return response.data;
        },

        // 포스트 삭제
        deletePost: async (id) => {
            await this.instance.delete(`/posts/${id}`);
        },

        // 카테고리 목록
        getCategories: async () => {
            const response = await this.instance.get('/categories');
            return response.data;
        },

        // 태그 목록
        getTags: async () => {
            const response = await this.instance.get('/tags');
            return response.data;
        },

        // 댓글 목록
        getComments: async (postId) => {
            const response = await this.instance.get(`/posts/${postId}/comments`);
            return response.data;
        },

        // 댓글 작성
        createComment: async (postId, commentData) => {
            const response = await this.instance.post(`/posts/${postId}/comments`, commentData);
            return response.data;
        },
    };

    // 사용자 API
    users = {
        // 프로필 수정
        updateProfile: async (userData) => {
            const response = await this.instance.put('/users/profile', userData);
            return response.data;
        },

        // 프로필 이미지 업로드
        uploadAvatar: async (file, onProgress) => {
            return this.uploadFile(file, '/users/avatar', { onProgress });
        },

        // 사용자 설정 조회
        getSettings: async () => {
            const response = await this.instance.get('/users/settings');
            return response.data;
        },

        // 사용자 설정 업데이트
        updateSettings: async (settings) => {
            const response = await this.instance.put('/users/settings', settings);
            return response.data;
        },
    };

    // 파일 API
    files = {
        // 이미지 업로드
        uploadImage: async (file, onProgress) => {
            return this.uploadFile(file, '/files/images', { onProgress });
        },

        // 파일 다운로드
        download: async (fileId, onProgress) => {
            return this.downloadFile(`/files/${fileId}/download`, { onProgress });
        },

        // 파일 삭제
        deleteFile: async (fileId) => {
            await this.instance.delete(`/files/${fileId}`);
        },
    };
}

// API 클라이언트 인스턴스 생성 (싱글톤)
export const apiClient = new ApiClient();
