import {api} from "./client.js";

export const uploadService = {
    // 이미지 업로드

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'profile');

        return await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 파일 업로드
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return await api.post('/upload/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 썸네일 업로드
    uploadThumbnail: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'thumbnail');

        return await api.post('/upload/thumbnail', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // URL로 이미지 검증
    validateImageUrl: (url) => api.get('/upload/validate-url', {
        params: { url }
    }),
};