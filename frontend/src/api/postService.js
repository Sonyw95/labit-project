import {api} from "@/api/client.js";

export const postService = {
    // 포스트 목록 조회
    getPosts: (params = {}) => {
        const { page = 0, size = 10, ...otherParams } = params;
        return api.get('/posts', {
            params: { page, size, ...otherParams }
        });
    },

    // 포스트 상세 조회
    getPost: (id) => api.get(`/posts/${id}`),

    // 포스트 생성
    createPost: (postData) => api.post('/posts', postData),

    // 포스트 수정
    updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

    // 포스트 삭제
    deletePost: (id) => api.delete(`/posts/${id}`),

    // 카테고리별 포스트 조회
    getPostsByCategory: (categoryId, params = {}) => {
        const { page = 0, size = 10 } = params;
        return api.get(`/posts/category/${categoryId}`, {
            params: { page, size }
        });
    },

    // 포스트 검색
    searchPosts: (keyword, params = {}) => {
        const { page = 0, size = 10 } = params;
        return api.get('/posts/search', {
            params: { keyword, page, size }
        });
    },

    // 태그별 포스트 조회
    getPostsByTag: (tag, params = {}) => {
        const { page = 0, size = 10 } = params;
        return api.get(`/posts/tag/${tag}`, {
            params: { page, size }
        });
    },

    // 추천 포스트 조회
    getFeaturedPosts: () => api.get('/posts/featured'),

    // 인기 포스트 조회
    getPopularPosts: (limit = 10) => api.get('/posts/popular', {
        params: { limit }
    }),

    // 최근 포스트 조회
    getRecentPosts: (limit = 10) => api.get('/posts/recent', {
        params: { limit }
    }),

    // 포스트 좋아요 토글
    togglePostLike: (id) => api.post(`/posts/${id}/like`),

    // 작성자별 포스트 조회
    getPostsByAuthor: (authorId, params = {}) => {
        const { page = 0, size = 10 } = params;
        return api.get(`/posts/author/${authorId}`, {
            params: { page, size }
        });
    },
};
