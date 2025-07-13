// services/apiClient.js
import axios from 'axios';
import { storage } from '../utils/storage';

// Axios 인스턴스 생성
const createApiInstance = (baseURL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080/api') => {
    const instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 요청 인터셉터
    instance.interceptors.request.use(
        (config) => {
            const token = storage.local.get('authToken');
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
        (error) => {
            if (error.response?.status === 401) {
                storage.local.remove('authToken');
                storage.local.remove('userInfo');
                window.location.href = '/login';
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

    // navigation ={
    //     getNavItems: async () => {
    //         return this.api.get('/navigation/items');
    //     }
    // }
    //
    // // 인증 관련 API
    // auth = {
    //     login: async (credentials) => {
    //         return this.api.post('/auth/login', credentials);
    //     },
    //
    //     register: async (userData) => {
    //         return this.api.post('/auth/register', userData);
    //     },
    //
    //     logout: async () => {
    //         return this.api.post('/auth/logout');
    //     },
    //
    //     kakaoLogin: async () => {
    //         return this.api.get('/auth/kakao');
    //     },
    //
    //     kakaoCallback: async (code) => {
    //         return this.api.post('/auth/kakao/callback', { code });
    //     },
    //
    //     refreshToken: async () => {
    //         return this.api.post('/auth/refresh');
    //     },
    //
    //     forgotPassword: async (email) => {
    //         return this.api.post('/auth/forgot-password', { email });
    //     },
    //
    //     resetPassword: async (token, password) => {
    //         return this.api.post('/auth/reset-password', { token, password });
    //     },
    //
    //     verifyEmail: async (token) => {
    //         return this.api.post('/auth/verify-email', { token });
    //     }
    // };
    //
    // // 사용자 관련 API
    // users = {
    //     getProfile: async () => {
    //         return this.api.get('/users/profile');
    //     },
    //
    //     updateProfile: async (userData) => {
    //         return this.api.put('/users/profile', userData);
    //     },
    //
    //     uploadAvatar: async (file) => {
    //         const formData = new FormData();
    //         formData.append('avatar', file);
    //         return this.api.post('/users/avatar', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' }
    //         });
    //     },
    //
    //     changePassword: async (currentPassword, newPassword) => {
    //         return this.api.put('/users/password', {
    //             currentPassword,
    //             newPassword
    //         });
    //     },
    //
    //     deleteAccount: async () => {
    //         return this.api.delete('/users/account');
    //     }
    // };
    //
    // // 블로그 포스트 관련 API
    // posts = {
    //     getAll: async (params = {}) => {
    //         return this.api.get('/posts', { params });
    //     },
    //
    //     getById: async (id) => {
    //         return this.api.get(`/posts/${id}`);
    //     },
    //
    //     getBySlug: async (slug) => {
    //         return this.api.get(`/posts/slug/${slug}`);
    //     },
    //
    //     create: async (postData) => {
    //         return this.api.post('/posts', postData);
    //     },
    //
    //     update: async (id, postData) => {
    //         return this.api.put(`/posts/${id}`, postData);
    //     },
    //
    //     delete: async (id) => {
    //         return this.api.delete(`/posts/${id}`);
    //     },
    //
    //     publish: async (id) => {
    //         return this.api.patch(`/posts/${id}/publish`);
    //     },
    //
    //     unpublish: async (id) => {
    //         return this.api.patch(`/posts/${id}/unpublish`);
    //     },
    //
    //     saveDraft: async (postData) => {
    //         return this.api.post('/posts/draft', postData);
    //     },
    //
    //     uploadImage: async (file, postId) => {
    //         const formData = new FormData();
    //         formData.append('image', file);
    //         if (postId) {formData.append('postId', postId);}
    //         return this.api.post('/posts/upload-image', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' }
    //         });
    //     },
    //
    //     search: async (query, filters = {}) => {
    //         return this.api.get('/posts/search', {
    //             params: { q: query, ...filters }
    //         });
    //     },
    //
    //     getPopular: async (period = 'week') => {
    //         return this.api.get('/posts/popular', { params: { period } });
    //     },
    //
    //     getRelated: async (postId) => {
    //         return this.api.get(`/posts/${postId}/related`);
    //     }
    // };
    //
    // // 댓글 관련 API
    // comments = {
    //     getByPost: async (postId) => {
    //         return this.api.get(`/posts/${postId}/comments`);
    //     },
    //
    //     create: async (postId, commentData) => {
    //         return this.api.post(`/posts/${postId}/comments`, commentData);
    //     },
    //
    //     update: async (commentId, commentData) => {
    //         return this.api.put(`/comments/${commentId}`, commentData);
    //     },
    //
    //     delete: async (commentId) => {
    //         return this.api.delete(`/comments/${commentId}`);
    //     },
    //
    //     like: async (commentId) => {
    //         return this.api.post(`/comments/${commentId}/like`);
    //     },
    //
    //     unlike: async (commentId) => {
    //         return this.api.delete(`/comments/${commentId}/like`);
    //     }
    // };
    //
    // // 태그 관련 API
    // tags = {
    //     getAll: async () => {
    //         return this.api.get('/tags');
    //     },
    //
    //     getPopular: async (limit = 20) => {
    //         return this.api.get('/tags/popular', { params: { limit } });
    //     },
    //
    //     create: async (tagData) => {
    //         return this.api.post('/tags', tagData);
    //     },
    //
    //     update: async (id, tagData) => {
    //         return this.api.put(`/tags/${id}`, tagData);
    //     },
    //
    //     delete: async (id) => {
    //         return this.api.delete(`/tags/${id}`);
    //     },
    //
    //     getPostsByTag: async (tagId, params = {}) => {
    //         return this.api.get(`/tags/${tagId}/posts`, { params });
    //     }
    // };
    //
    // // 카테고리 관련 API
    // categories = {
    //     getAll: async () => {
    //         return this.api.get('/categories');
    //     },
    //
    //     getTree: async () => {
    //         return this.api.get('/categories/tree');
    //     },
    //
    //     create: async (categoryData) => {
    //         return this.api.post('/categories', categoryData);
    //     },
    //
    //     update: async (id, categoryData) => {
    //         return this.api.put(`/categories/${id}`, categoryData);
    //     },
    //
    //     delete: async (id) => {
    //         return this.api.delete(`/categories/${id}`);
    //     },
    //
    //     reorder: async (categoriesOrder) => {
    //         return this.api.put('/categories/reorder', { order: categoriesOrder });
    //     },
    //
    //     getPostsByCategory: async (categoryId, params = {}) => {
    //         return this.api.get(`/categories/${categoryId}/posts`, { params });
    //     }
    // };
    //
    // // 파일 업로드 관련 API
    // files = {
    //     upload: async (file, folder = 'general') => {
    //         const formData = new FormData();
    //         formData.append('file', file);
    //         formData.append('folder', folder);
    //         return this.api.post('/files/upload', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' }
    //         });
    //     },
    //
    //     uploadMultiple: async (files, folder = 'general') => {
    //         const formData = new FormData();
    //         files.forEach(file => {
    //             formData.append('files', file);
    //         });
    //         formData.append('folder', folder);
    //         return this.api.post('/files/upload-multiple', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' }
    //         });
    //     },
    //
    //     delete: async (fileId) => {
    //         return this.api.delete(`/files/${fileId}`);
    //     },
    //
    //     getSignedUrl: async (fileName, fileType) => {
    //         return this.api.post('/files/signed-url', {
    //             fileName,
    //             fileType
    //         });
    //     }
    // };
    //
    // // 통계 관련 API
    // analytics = {
    //     getPostViews: async (postId, period = '7d') => {
    //         return this.api.get(`/analytics/posts/${postId}/views`, {
    //             params: { period }
    //         });
    //     },
    //
    //     getBlogStats: async () => {
    //         return this.api.get('/analytics/blog/stats');
    //     },
    //
    //     getPopularPosts: async (limit = 10, period = '30d') => {
    //         return this.api.get('/analytics/posts/popular', {
    //             params: { limit, period }
    //         });
    //     },
    //
    //     getTrafficSources: async (period = '30d') => {
    //         return this.api.get('/analytics/traffic/sources', {
    //             params: { period }
    //         });
    //     }
    // };
    //
    // // 검색 관련 API
    // search = {
    //     global: async (query, filters = {}) => {
    //         return this.api.get('/search', {
    //             params: { q: query, ...filters }
    //         });
    //     },
    //
    //     posts: async (query, filters = {}) => {
    //         return this.api.get('/search/posts', {
    //             params: { q: query, ...filters }
    //         });
    //     },
    //
    //     suggestions: async (query) => {
    //         return this.api.get('/search/suggestions', {
    //             params: { q: query }
    //         });
    //     }
    // };
    //
    // // 배치 요청 처리
    // batch = {
    //     execute: async (requests) => {
    //         return this.api.post('/batch', { requests });
    //     }
    // };
    //
    // // 헬스체크
    // health = {
    //     check: async () => {
    //         return this.api.get('/health');
    //     }
    // };
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();



