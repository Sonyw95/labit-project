import {api} from "./client.js";

export const adminService = {
    // 관리자 정보 조회 (공개 API - 토큰 불필요)
    getAdminInfo: () => api.publicRequest('get', '/admin/info'),

    // 관리자 조회수 증가 (공개 API - 토큰 불필요)
    // incrementViews: () => api.publicRequest('post', '/admin/views/increment'),

    // 관리자 정보 수정 (인증 필요)
    updateAdminInfo: (adminData) => api.put('/admin/info', adminData),

    // 관리자 프로필 이미지 업로드 (인증 필요)
    uploadProfileImage: (formData) => api.post('/admin/profile-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};