import { apiClient } from './client';

// Auth API
export const authAPI = {
    login: (credentials) =>
        apiClient.post('/auth/login', credentials),

    register: (userData) =>
        apiClient.post('/auth/register', userData),

    logout: () =>
        apiClient.post('/auth/logout'),

    refreshToken: () =>
        apiClient.post('/auth/refresh'),

    forgotPassword: (email) =>
        apiClient.post('/auth/forgot-password', { email }),

    resetPassword: (token, password) =>
        apiClient.post('/auth/reset-password', { token, password }),
};

// User API
export const userAPI = {
    getProfile: () =>
        apiClient.get('/user/profile'),

    updateProfile: (profileData) =>
        apiClient.put('/user/profile', profileData),

    changePassword: (passwordData) =>
        apiClient.put('/user/password', passwordData),

    uploadAvatar: (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return apiClient.post('/user/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteAccount: () =>
        apiClient.delete('/user/account'),
};

// Blog API
export const blogAPI = {
    getPosts: (params) =>
        apiClient.get('/posts', { params }),

    getPost: (id) =>
        apiClient.get(`/posts/${id}`),

    createPost: (postData) =>
        apiClient.post('/posts', postData),

    updatePost: (id, postData) =>
        apiClient.put(`/posts/${id}`, postData),

    deletePost: (id) =>
        apiClient.delete(`/posts/${id}`),

    getCategories: () =>
        apiClient.get('/categories'),

    getTags: () =>
        apiClient.get('/tags'),

    searchPosts: (query, filters) =>
        apiClient.get('/posts/search', {
            params: { q: query, ...filters }
        }),
};

// Comments API
export const commentAPI = {
    getComments: (postId) =>
        apiClient.get(`/posts/${postId}/comments`),

    createComment: (postId, commentData) =>
        apiClient.post(`/posts/${postId}/comments`, commentData),

    updateComment: (commentId, commentData) =>
        apiClient.put(`/comments/${commentId}`, commentData),

    deleteComment: (commentId) =>
        apiClient.delete(`/comments/${commentId}`),

    likeComment: (commentId) =>
        apiClient.post(`/comments/${commentId}/like`),
};

// Statistics API
export const statsAPI = {
    getDashboard: () =>
        apiClient.get('/stats/dashboard'),

    getPostStats: (postId) =>
        apiClient.get(`/stats/posts/${postId}`),

    getUserStats: () =>
        apiClient.get('/stats/user'),
};