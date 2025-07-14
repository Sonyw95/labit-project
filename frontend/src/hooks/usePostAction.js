import React, { useCallback} from 'react';
import {
    Text,
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { modals } from '@mantine/modals';
import {useAuth} from "@/contexts/AuthContext.jsx";
import {apiClient} from "@/api/apiClient.js";
import {showToast} from "@/components/common/Toast.jsx";

// 포스트 관리 훅
const usePostActions = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // 좋아요 토글 뮤테이션
    const likeMutation = useMutation({
        mutationFn: ({ postId, isLiked }) =>
            isLiked ? apiClient.posts.like(postId) : apiClient.posts.unlike(postId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['posts']);
            showToast.success(
                variables.isLiked ? '좋아요!' : '좋아요 취소',
                variables.isLiked ? '포스트에 좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.'
            );
        },
        onError: () => {
            showToast.error('오류', '요청을 처리할 수 없습니다.');
        },
    });

    // 북마크 토글 뮤테이션
    const bookmarkMutation = useMutation({
        mutationFn: ({ postId, isBookmarked }) =>
            isBookmarked ? apiClient.posts.bookmark(postId) : apiClient.posts.unbookmark(postId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['posts']);
            showToast.success(
                variables.isBookmarked ? '북마크 추가' : '북마크 제거',
                variables.isBookmarked ? '북마크에 추가했습니다.' : '북마크에서 제거했습니다.'
            );
        },
        onError: () => {
            showToast.error('오류', '요청을 처리할 수 없습니다.');
        },
    });

    // 포스트 삭제 뮤테이션
    const deleteMutation = useMutation({
        mutationFn: (postId) => apiClient.posts.delete(postId),
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']);
            showToast.success('삭제 완료', '포스트가 삭제되었습니다.');
        },
        onError: () => {
            showToast.error('오류', '포스트 삭제에 실패했습니다.');
        },
    });

    // 포스트 고정 토글 뮤테이션
    const pinMutation = useMutation({
        mutationFn: ({ postId, isPinned }) =>
            apiClient.posts.update(postId, { isPinned }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['posts']);
            showToast.success(
                variables.isPinned ? '고정됨' : '고정 해제',
                variables.isPinned ? '포스트가 상단에 고정되었습니다.' : '포스트 고정이 해제되었습니다.'
            );
        },
        onError: () => {
            showToast.error('오류', '요청을 처리할 수 없습니다.');
        },
    });

    // 포스트 공개/비공개 토글 뮤테이션
    const visibilityMutation = useMutation({
        mutationFn: ({ postId, isHidden }) =>
            apiClient.posts.update(postId, { isHidden }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['posts']);
            showToast.success(
                variables.isHidden ? '비공개로 변경' : '공개로 변경',
                variables.isHidden ? '포스트가 비공개로 설정되었습니다.' : '포스트가 공개로 설정되었습니다.'
            );
        },
        onError: () => {
            showToast.error('오류', '요청을 처리할 수 없습니다.');
        },
    });

    return {
        handleLike: useCallback((postId, isLiked) => {
            likeMutation.mutate({ postId, isLiked });
        }, [likeMutation]),

        handleBookmark: useCallback((postId, isBookmarked) => {
            bookmarkMutation.mutate({ postId, isBookmarked });
        }, [bookmarkMutation]),

        handleShare: useCallback(async (post) => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: post.title,
                        text: post.excerpt || post.title,
                        url: `${window.location.origin}/posts/${post.id}`,
                    });
                } catch (error) {
                    console.log('공유가 취소되었습니다.');
                }
            } else {
                try {
                    await navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
                    showToast.success('링크 복사', '포스트 링크가 클립보드에 복사되었습니다.');
                } catch (error) {
                    showToast.error('오류', '링크 복사에 실패했습니다.');
                }
            }
        }, []),

        handleDelete: useCallback((post) => {
            modals.openConfirmModal({
                title: '포스트 삭제',
                children: (
                    <Text size="sm">
                        "{post.title}" 포스트를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </Text>
                ),
                labels: { confirm: '삭제', cancel: '취소' },
                confirmProps: { color: 'red' },
                onConfirm: () => deleteMutation.mutate(post.id),
            });
        }, [deleteMutation]),

        handleTogglePin: useCallback((postId, isPinned) => {
            pinMutation.mutate({ postId, isPinned });
        }, [pinMutation]),

        handleToggleVisibility: useCallback((postId, isHidden) => {
            visibilityMutation.mutate({ postId, isHidden });
        }, [visibilityMutation]),

        isLoading: likeMutation.isLoading || bookmarkMutation.isLoading || deleteMutation.isLoading,
    };
};

export default usePostActions;