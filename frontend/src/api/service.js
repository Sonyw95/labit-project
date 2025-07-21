import {api} from "@/api/client.js";

export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteAccount: () => api.delete('/users/account'),
    createUser: (userData) => api.post('/users', userData),
};

// Post API
export const postService = {
    getPosts: (params = {}) => api.get('/posts', { params }),
    getPost: (id) => api.get(`/posts/${id}`),
    createPost: (postData) => api.post('/posts', postData),
    updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
    deletePost: (id) => api.delete(`/posts/${id}`),
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


// Main Page API (복수 API 동시 요청)
export const mainPageService = {
    getMainPageData: async () => {
        const [userInfo, postList, mainImage, notifications] = await Promise.allSettled([
            userService.getProfile(),
            postService.getPosts({ page: 1, limit: 10 }),
            api.get('/main/featured-image'),
            api.get('/notifications/recent')
        ]);

        return {
            userInfo: userInfo.status === 'fulfilled' ? userInfo.value : null,
            postList: postList.status === 'fulfilled' ? postList.value : [],
            mainImage: mainImage.status === 'fulfilled' ? mainImage.value : null,
            notifications: notifications.status === 'fulfilled' ? notifications.value : [],
            errors: {
                userInfo: userInfo.status === 'rejected' ? userInfo.reason : null,
                postList: postList.status === 'rejected' ? postList.reason : null,
                mainImage: mainImage.status === 'rejected' ? mainImage.reason : null,
                notifications: notifications.status === 'rejected' ? notifications.reason : null,
            }
        };
    }
};
