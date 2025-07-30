import {api} from "@/api/client.js";

export const fileService = {
    // 프로필 이미지 업로드
    uploadProfileImage: async (formData) => {
        try {
            const response = await api.post('/admin/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.success) {
                return response?.imageUrl;
            } 
                throw new Error(response.message || '이미지 업로드에 실패했습니다.');
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(errorMessage);
        }
    },

    // 파일 목록 조회 (관리자 전용)
    getFileList: async (subDir = 'profiles') => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await api.get(`/files/list/${subDir}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 파일 삭제 (관리자 전용)
    deleteFile: async (subDir, yearMonth, fileName) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await api.delete(`/files/${subDir}/${yearMonth}/${fileName}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // 업로드 통계 조회 (관리자 전용)
    getUploadStats: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await api.get('/files/stats');
        } catch (error) {
            throw error;
        }
    },

    // 파일 존재 여부 확인
    checkFileExists: async (subDir, yearMonth, fileName) => {
        try {
            const response = await api.publicRequest('get', `/files/exists/${subDir}/${yearMonth}/${fileName}`);
            return response.exists;
        } catch (error) {
            return false;
        }
    },

    // 파일 URL 파싱
    parseFileUrl: (fileUrl) => {
        try {
            const urlParts = fileUrl.split('/api/files/');
            if (urlParts.length !== 2) {
                return null;
            }

            const pathParts = urlParts[1].split('/');
            if (pathParts.length < 3) {
                return null;
            }

            return {
                subDir: pathParts[0],
                yearMonth: pathParts[1],
                fileName: pathParts.slice(2).join('/'),
                fullPath: urlParts[1]
            };
        } catch (error) {
            return null;
        }
    },

    // 이미지 URL 검증
    validateImageUrl: async (imageUrl) => {
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    },
};