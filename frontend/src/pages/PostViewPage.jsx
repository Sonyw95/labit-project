import { memo, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Stack,
    Divider,
    Loader,
    Center,
    Box,
    Text,
} from '@mantine/core';
import useAuthStore from "../stores/authStore.js";
import { useCommentsByPost, useDeletePost, usePost, useTogglePostLike } from "../hooks/api/useApi.js";
import { showToast } from "../components/advanced/Toast.jsx";
import CommentSection from "../components/section/CommentSection.jsx";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import PostHeader from "@/components/section/post/PostHeader.jsx";
import PostContent from "@/components/section/post/PostContent.jsx";
import PostActions from "@/components/section/post/PostActions.jsx";
import DeleteModal from "@/components/section/post/DeleteModal.jsx";

const PostViewPage = memo(() => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { velogColors } = useTheme();

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // API 훅
    const { data: post, isLoading, error } = usePost(postId);
    const { data: comments } = useCommentsByPost(postId);
    const deletePostMutation = useDeletePost();
    const toggleLikeMutation = useTogglePostLike();

    // 컨테이너 스타일을 메모이제이션
    const containerStyle = useMemo(() => ({
        backgroundColor: velogColors.background,
        minHeight: '100vh'
    }), [velogColors.background]);

    // 계산된 값들을 메모이제이션
    const computedValues = useMemo(() => ({
        isAuthor: user && post && user.id === post.author.id,
        isAdmin: user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),
        isLiked: post?.isLiked
    }), [user, post]);

    // 날짜 포맷팅 함수를 useCallback으로 메모이제이션
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, []);

    // 이벤트 핸들러들을 useCallback으로 메모이제이션
    const handleDeletePost = useCallback(async () => {
        try {
            await deletePostMutation.mutateAsync(postId);
            showToast.success('포스트 삭제', '포스트 삭제가 되었습니다..');
            navigate('/posts');
        } catch (error) {
            showToast.error('삭제 실패', '포스트 삭제 중 오류가 발생했습니다.');
        }
        setDeleteModalOpened(false);
    }, [deletePostMutation, postId, navigate]);

    const handleToggleLike = useCallback(async () => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '좋아요를 누르려면 로그인이 필요합니다.');
            return;
        }
        try {
            await toggleLikeMutation.mutateAsync(postId);
        } catch (error) {
            showToast.error("오류 발생", "좋아요 처리 중 오류가 발생했습니다.");
        }
    }, [isAuthenticated, toggleLikeMutation, postId]);

    const handleToggleBookmark = useCallback(() => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '북마크를 사용하려면 로그인이 필요합니다.');
            return;
        }
        setIsBookmarked(prev => {
            const newState = !prev;
            showToast.success('북마크', newState ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.');
            return newState;
        });
    }, [isAuthenticated]);

    const handleShare = useCallback(async () => {
        try {
            await navigator.share({
                title: post.title,
                text: post.summary,
                url: window.location.href,
            });
        } catch (error) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast.success("링크 복사", "포스트 링크가 클립보드에 복사되었습니다");
            } catch (clipboardError) {
                showToast.error("공유 실패", "링크 공유에 실패했습니다");
            }
        }
    }, [post]);

    const handleOpenDeleteModal = useCallback(() => {
        setDeleteModalOpened(true);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModalOpened(false);
    }, []);

    // 로딩 컴포넌트를 메모이제이션
    const LoadingComponent = useMemo(() => (
        <Center h="50vh">
            <Loader size="lg" color={velogColors.primary} />
        </Center>
    ), [velogColors.primary]);

    // 에러 컴포넌트를 메모이제이션
    const ErrorComponent = useMemo(() => (
        <Container size="md">
            <Center py="xl">
                <Text c="red" ta="center" size="lg">
                    포스트를 불러올 수 없습니다.
                </Text>
            </Center>
        </Container>
    ), []);

    if (isLoading) {
        return LoadingComponent;
    }

    if (error || !post) {
        return ErrorComponent;
    }

    return (
        <Box style={containerStyle}>
            <Container size="md" py="xl">
                <Stack gap="xl">
                    {/* 포스트 헤더 */}
                    <PostHeader
                        post={post}
                        isAuthor={computedValues.isAuthor}
                        isAdmin={computedValues.isAdmin}
                        onDeletePost={handleOpenDeleteModal}
                        formatDate={formatDate}
                    />

                    {/* 포스트 내용 */}
                    <PostContent post={post} />

                    {/* 액션 버튼들 */}
                    <PostActions
                        post={post}
                        isLiked={computedValues.isLiked}
                        isBookmarked={isBookmarked}
                        onToggleLike={handleToggleLike}
                        onShare={handleShare}
                        onToggleBookmark={handleToggleBookmark}
                        isLikeLoading={toggleLikeMutation.isLoading}
                    />

                    {/* 구분선 */}
                    <Divider
                        my="xl"
                        color={velogColors.border}
                        style={{ marginTop: '4rem' }}
                    />

                    {/* 댓글 섹션 */}
                    <CommentSection postId={postId} comments={comments} />

                    {/* 삭제 확인 모달 */}
                    <DeleteModal
                        opened={deleteModalOpened}
                        onClose={handleCloseDeleteModal}
                        onConfirm={handleDeletePost}
                        isLoading={deletePostMutation.isLoading}
                    />
                </Stack>
            </Container>
        </Box>
    );
});

PostViewPage.displayName = 'PostViewPage';

export default PostViewPage;