import {api} from "@/api/client.js";

export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteAccount: () => api.delete('/users/account'),
    createUser: (userData) => api.post('/users', userData),
};


// Navigation API
export const navigationService = {
    // 네비게이션 트맂 조회
    getNavigationTree: () => api.get('/navigation/tree'),

    // 특정 경로의 네비게이션 경로 조회 ( breadcrumb 용 )
    getNavigationPath: (href) => api.get('/navigation/path', {
        params: { href }
    }),

    // 네비게이션 캐시 무효화
    evictNavigationCache: () => api.post('/navigation/cache/evict'),

}

export const authService = {

    // 카카오 로그인 인증 주소
    getKakaoAuthPath: () => api.get('/auth/kakao/path'),

    // 카카오 로그인
    kakaoLogin: (code) => api.post('/auth/kakao/login', null, {
        params: { code }
    }),

    // 로그아웃
    logout: (kakaoAccessToken) => api.post('/auth/logout', null, {
        params: { kakaoAccessToken }
    }),

    // 내 정보 조회
    getUserInfo: () => api.get('/auth/me'),

    // 토큰 갱신
    refreshToken: () => api.post('/auth/token/refresh'),

    // 토큰 검증
    validateToken: () => api.get('/auth/token/validate'),
}


// Main Page API (복수 API 동시 요청)
// export const mainPageService = {
//     getMainPageData: async () => {
//         const [userInfo, postList, mainImage, notifications] = await Promise.allSettled([
//             userService.getProfile(),
//             postService.getPosts({ page: 1, limit: 10 }),
//             api.get('/main/featured-image'),
//             api.get('/notifications/recent')
//         ]);
//
//         return {
//             userInfo: userInfo.status === 'fulfilled' ? userInfo.value : null,
//             postList: postList.status === 'fulfilled' ? postList.value : [],
//             mainImage: mainImage.status === 'fulfilled' ? mainImage.value : null,
//             notifications: notifications.status === 'fulfilled' ? notifications.value : [],
//             errors: {
//                 userInfo: userInfo.status === 'rejected' ? userInfo.reason : null,
//                 postList: postList.status === 'rejected' ? postList.reason : null,
//                 mainImage: mainImage.status === 'rejected' ? mainImage.reason : null,
//                 notifications: notifications.status === 'rejected' ? notifications.reason : null,
//             }
//         };
//     }
// };


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

export const commentService = {
    // 포스트의 댓글 목록 조회
    getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),

    // 댓글 생성
    createComment: (commentData) => api.post('/comments', commentData),

    // 댓글 수정
    updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),

    // 댓글 삭제
    deleteComment: (id) => api.delete(`/comments/${id}`),

    // 댓글 좋아요 토글
    toggleCommentLike: (id) => api.post(`/comments/${id}/like`),

    // 사용자별 댓글 조회
    getCommentsByAuthor: (authorId, params = {}) => {
        const { page = 0, size = 10 } = params;
        return api.get(`/comments/author/${authorId}`, {
            params: { page, size }
        });
    },

    // 최근 댓글 조회
    getRecentComments: (limit = 10) => api.get('/comments/recent', {
        params: { limit }
    }),
};

export const uploadService = {
    // 이미지 업로드
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'image');

        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    },

    // 파일 업로드
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    },

    // 썸네일 업로드
    uploadThumbnail: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'thumbnail');

        const response = await api.post('/upload/thumbnail', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    },

    // URL로 이미지 검증
    validateImageUrl: (url) => api.get('/upload/validate-url', {
        params: { url }
    }),
};