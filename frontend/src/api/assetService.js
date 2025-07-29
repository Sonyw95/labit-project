import {api} from "@/api/client.js";

export const assetService = {
    // 모든 에셋 조회 (관리자용)
    getAllAssets: () => api.get('/assets/all'),

    // 에셋 폴더 생성
    createAssetFolder: (folderData) => api.post('/assets/folder', folderData),

    // 에셋 폴더 수정
    updateAssetFolder: (id, folderData) => api.put(`/assets/folder/${id}`, folderData),

    // 에셋 폴더 삭제
    deleteAssetFolder: (id) => api.delete(`/assets/folder/${id}`),

    // 에셋 이동
    moveAsset: (assetId, targetFolderId) => api.patch(`/assets/${assetId}/move`, { targetFolderId }),

    // 에셋 순서 변경
    updateAssetOrder: (orderData) => api.put('/assets/order', orderData),

    // 에셋 파일 업로드
    uploadAssetFile: async (file, folderId) => {
        const formData = new FormData();
        formData.append('file', file);
        if (folderId) {
            formData.append('folderId', folderId);
        }

        return await api.post('/assets/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 에셋 파일 삭제
    deleteAssetFile: (id) => api.delete(`/assets/file/${id}`),
}


