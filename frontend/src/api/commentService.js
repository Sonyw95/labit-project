import {api} from "@/api/client.js";

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