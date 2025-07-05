import axios from 'axios';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Zustand 스토어 - API 상태 관리
export const useApiStore = create(
    devtools(
        persist(
            (set, get) => ({
                // 인증 토큰
                token: null,
                refreshToken: null,

                // API 상태
                isLoading: false,
                error: null,

                // 사용자 정보
                user: null,

                // 액션들
                setToken: (token, refreshToken) => set({
                    token,
                    refreshToken
                }),

                clearAuth: () => set({
                    token: null,
                    refreshToken: null,
                    user: null
                }),

                setUser: (user) => set({ user }),

                setLoading: (isLoading) => set({ isLoading }),

                setError: (error) => set({ error }),

                clearError: () => set({ error: null }),
            }),
            {
                name: 'api-store',
                partialize: (state) => ({
                    token: state.token,
                    refreshToken: state.refreshToken,
                    user: state.user,
                }),
            }
        ),
        { name: 'api-store' }
    )
);

// Request 인터셉터 - 토큰 자동 첨부
apiClient.interceptors.request.use(
    (config) => {
        const { token } = useApiStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 로딩 상태 설정
        useApiStore.getState().setLoading(true);
        useApiStore.getState().clearError();

        return config;
    },
    (error) => {
        useApiStore.getState().setLoading(false);
        return Promise.reject(error);
    }
);

// Response 인터셉터 - 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
    (response) => {
        useApiStore.getState().setLoading(false);
        return response;
    },
    async (error) => {
        const { setLoading, setError, token, refreshToken, clearAuth } = useApiStore.getState();

        setLoading(false);

        if (error.response?.status === 401 && token && refreshToken) {
            try {
                // 토큰 갱신 시도
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;

                // 새 토큰 저장
                useApiStore.getState().setToken(newToken, newRefreshToken);

                // 원래 요청 재시도
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return apiClient.request(error.config);

            } catch (refreshError) {
                // 토큰 갱신 실패 시 로그아웃
                clearAuth();
                setError('세션이 만료되었습니다. 다시 로그인해주세요.');

                // 로그인 페이지로 리다이렉트
                window.location.href = '/login';
            }
        }

        // 에러 메시지 설정
        const errorMessage = error.response?.data?.message ||
            error.message ||
            '요청 처리 중 오류가 발생했습니다.';
        setError(errorMessage);

        return Promise.reject(error);
    }
);

// API 엔드포인트들
export const api = {
    // 인증 관련
    auth: {
        login: (credentials) =>
            apiClient.post('/auth/login', credentials),

        register: (userData) =>
            apiClient.post('/auth/register', userData),

        logout: () =>
            apiClient.post('/auth/logout'),

        refreshToken: (refreshToken) =>
            apiClient.post('/auth/refresh', { refreshToken }),

        resetPassword: (email) =>
            apiClient.post('/auth/reset-password', { email }),

        changePassword: (data) =>
            apiClient.post('/auth/change-password', data),
    },

    // 사용자 관련
    user: {
        getProfile: () =>
            apiClient.get('/user/profile'),

        updateProfile: (userData) =>
            apiClient.put('/user/profile', userData),

        uploadAvatar: (file) => {
            const formData = new FormData();
            formData.append('avatar', file);
            return apiClient.post('/user/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },

        getPreferences: () =>
            apiClient.get('/user/preferences'),

        updatePreferences: (preferences) =>
            apiClient.put('/user/preferences', preferences),
    },

    // 블로그 포스트 관련
    posts: {
        getAll: (params = {}) =>
            apiClient.get('/posts', { params }),

        getById: (id) =>
            apiClient.get(`/posts/${id}`),

        create: (postData) =>
            apiClient.post('/posts', postData),

        update: (id, postData) =>
            apiClient.put(`/posts/${id}`, postData),

        delete: (id) =>
            apiClient.delete(`/posts/${id}`),

        like: (id) =>
            apiClient.post(`/posts/${id}/like`),

        unlike: (id) =>
            apiClient.delete(`/posts/${id}/like`),

        incrementView: (id) =>
            apiClient.post(`/posts/${id}/view`),

        getPopular: (params = {}) =>
            apiClient.get('/posts/popular', { params }),

        getByTag: (tag, params = {}) =>
            apiClient.get(`/posts/tags/${tag}`, { params }),

        search: (query, params = {}) =>
            apiClient.get('/posts/search', { params: { q: query, ...params } }),
    },

    // 댓글 관련
    comments: {
        getByPost: (postId) =>
            apiClient.get(`/posts/${postId}/comments`),

        create: (postId, commentData) =>
            apiClient.post(`/posts/${postId}/comments`, commentData),

        update: (postId, commentId, commentData) =>
            apiClient.put(`/posts/${postId}/comments/${commentId}`, commentData),

        delete: (postId, commentId) =>
            apiClient.delete(`/posts/${postId}/comments/${commentId}`),

        like: (postId, commentId) =>
            apiClient.post(`/posts/${postId}/comments/${commentId}/like`),

        unlike: (postId, commentId) =>
            apiClient.delete(`/posts/${postId}/comments/${commentId}/like`),
    },

    // 태그 관련
    tags: {
        getAll: () =>
            apiClient.get('/tags'),

        getPopular: () =>
            apiClient.get('/tags/popular'),

        create: (tagData) =>
            apiClient.post('/tags', tagData),

        update: (id, tagData) =>
            apiClient.put(`/tags/${id}`, tagData),

        delete: (id) =>
            apiClient.delete(`/tags/${id}`),
    },

    // 북마크 관련
    bookmarks: {
        getAll: () =>
            apiClient.get('/bookmarks'),

        add: (postId) =>
            apiClient.post('/bookmarks', { postId }),

        remove: (postId) =>
            apiClient.delete(`/bookmarks/${postId}`),
    },

    // 파일 업로드
    upload: {
        image: (file, folder = 'general') => {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', folder);
            return apiClient.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },

        file: (file, folder = 'documents') => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
            return apiClient.post('/upload/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },

        delete: (fileUrl) =>
            apiClient.delete('/upload', { data: { fileUrl } }),
    },

    // 통계 관련
    analytics: {
        getPostStats: (postId) =>
            apiClient.get(`/analytics/posts/${postId}`),

        getBlogStats: () =>
            apiClient.get('/analytics/blog'),

        getUserStats: () =>
            apiClient.get('/analytics/user'),

        getTopPosts: (period = '7d') =>
            apiClient.get('/analytics/top-posts', { params: { period } }),
    },

    // 알림 관련
    notifications: {
        getAll: () =>
            apiClient.get('/notifications'),

        markAsRead: (id) =>
            apiClient.put(`/notifications/${id}/read`),

        markAllAsRead: () =>
            apiClient.put('/notifications/read-all'),

        delete: (id) =>
            apiClient.delete(`/notifications/${id}`),

        getUnreadCount: () =>
            apiClient.get('/notifications/unread-count'),
    },
};

// React Query용 쿼리 키 팩토리
export const queryKeys = {
    // 사용자
    user: {
        profile: ['user', 'profile'],
        preferences: ['user', 'preferences'],
    },

    // 포스트
    posts: {
        all: ['posts'],
        list: (params) => ['posts', 'list', params],
        detail: (id) => ['posts', 'detail', id],
        popular: (params) => ['posts', 'popular', params],
        search: (query, params) => ['posts', 'search', query, params],
        byTag: (tag, params) => ['posts', 'tag', tag, params],
    },

    // 댓글
    comments: {
        byPost: (postId) => ['comments', 'post', postId],
    },

    // 태그
    tags: {
        all: ['tags'],
        popular: ['tags', 'popular'],
    },

    // 북마크
    bookmarks: {
        all: ['bookmarks'],
    },

    // 통계
    analytics: {
        postStats: (postId) => ['analytics', 'post', postId],
        blogStats: ['analytics', 'blog'],
        userStats: ['analytics', 'user'],
        topPosts: (period) => ['analytics', 'top-posts', period],
    },

    // 알림
    notifications: {
        all: ['notifications'],
        unreadCount: ['notifications', 'unread-count'],
    },
};

// 에러 처리 유틸리티
export const handleApiError = (error) => {
    if (error.response) {
        // 서버에서 응답을 받았지만 에러 상태 코드인 경우
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return data.message || '잘못된 요청입니다.';
            case 401:
                return '인증이 필요합니다.';
            case 403:
                return '접근 권한이 없습니다.';
            case 404:
                return '요청한 리소스를 찾을 수 없습니다.';
            case 409:
                return data.message || '충돌이 발생했습니다.';
            case 422:
                return data.message || '입력 데이터를 확인해주세요.';
            case 500:
                return '서버 내부 오류가 발생했습니다.';
            default:
                return data.message || '알 수 없는 오류가 발생했습니다.';
        }
    } else if (error.request) {
        // 요청은 했지만 응답을 받지 못한 경우
        return '서버와 연결할 수 없습니다. 네트워크를 확인해주세요.';
    } else {
        // 요청을 만드는 중에 에러가 발생한 경우
        return error.message || '요청 처리 중 오류가 발생했습니다.';
    }
};

export default apiClient;