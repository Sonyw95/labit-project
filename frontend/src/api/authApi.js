import {apiClient} from "@/api/apiClient.js";


export const authApi = {
    kakaoLogin: (accessToken) => apiClient.post('/auth/kakao/login', {accessToken}),
    logout: () => apiClient.post('/auth/kakao/logout'),
    getUserInfo: () => apiClient.get('/auth/kakao/user-info'),
    refreshToken: (refreshToken) => apiClient.post('/auth/kakao/refresh',{}, {
        headers:{ Authorization: `Bearer ${refreshToken}` }
    }),
};