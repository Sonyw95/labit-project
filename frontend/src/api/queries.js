import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api, queryKeys, handleApiError } from './client';

// 포스트 관련 쿼리들
export const usePostsQuery = (params = {}) => {
    return useQuery({
        queryKey: queryKeys.posts.list(params),
        queryFn: () => api.posts.getAll(params),
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000, // 5분
    });
};

export const usePostQuery = (id, options = {}) => {
    return useQuery({
        queryKey: queryKeys.posts.detail(id),
        queryFn: () => api.posts.getById(id),
        select: (data) => data.data,
        enabled: !!id,
        ...options,
    });
};

export const useInfinitePostsQuery = (params = {}) => {
    return useInfiniteQuery({
        queryKey: queryKeys.posts.list(params),
        queryFn: ({ pageParam = 1 }) =>
            api.posts.getAll({ ...params, page: pageParam }),
        select: (data) => ({
            pages: data.pages.map(page => page.data),
            pageParams: data.pageParams,
        }),
        getNextPageParam: (lastPage, allPages) => {
            const { hasMore, page } = lastPage.data;
            return hasMore ? page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const usePopularPostsQuery = (params = {}) => {
    return useQuery({
        queryKey: queryKeys.posts.popular(params),
        queryFn: () => api.posts.getPopular(params),
        select: (data) => data.data,
        staleTime: 10 * 60 * 1000, // 10분
    });
};

export const useSearchPostsQuery = (query, params = {}, options = {}) => {
    return useQuery({
        queryKey: queryKeys.posts.search(query, params),
        queryFn: () => api.posts.search(query, params),
        select: (data) => data.data,
        enabled: !!query && query.length > 2,
        staleTime: 2 * 60 * 1000, // 2분
        ...options,
    });
};

// 포스트 뮤테이션들
export const useCreatePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postData) => api.posts.create(postData),
        onSuccess: (data) => {
            // 포스트 목록 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });

            // 새 포스트를 캐시에 추가
            queryClient.setQueryData(
                queryKeys.posts.detail(data.data.id),
                { data: data.data }
            );
        },
        onError: (error) => {
            console.error('Post creation failed:', handleApiError(error));
        },
    });
};

export const useUpdatePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => api.posts.update(id, data),
        onSuccess: (data, variables) => {
            // 특정 포스트 쿼리 업데이트
            queryClient.setQueryData(
                queryKeys.posts.detail(variables.id),
                { data: data.data }
            );

            // 포스트 목록 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
        onError: (error) => {
            console.error('Post update failed:', handleApiError(error));
        },
    });
};

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.posts.delete(id),
        onSuccess: (data, postId) => {
            // 포스트 상세 쿼리 제거
            queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });

            // 포스트 목록 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
        onError: (error) => {
            console.error('Post deletion failed:', handleApiError(error));
        },
    });
};

export const useLikePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, isLiked }) =>
            isLiked ? api.posts.unlike(postId) : api.posts.like(postId),
        onMutate: async ({ postId, isLiked }) => {
            // 낙관적 업데이트
            await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });

            const previousPost = queryClient.getQueryData(queryKeys.posts.detail(postId));

            if (previousPost) {
                queryClient.setQueryData(queryKeys.posts.detail(postId), {
                    ...previousPost,
                    data: {
                        ...previousPost.data,
                        isLiked: !isLiked,
                        likesCount: isLiked
                            ? previousPost.data.likesCount - 1
                            : previousPost.data.likesCount + 1,
                    },
                });
            }

            return { previousPost };
        },
        onError: (error, variables, context) => {
            // 에러 시 이전 상태로 복원
            if (context?.previousPost) {
                queryClient.setQueryData(
                    queryKeys.posts.detail(variables.postId),
                    context.previousPost
                );
            }
        },
        onSettled: (data, error, variables) => {
            // 완료 후 쿼리 다시 가져오기
            queryClient.invalidateQueries({
                queryKey: queryKeys.posts.detail(variables.postId)
            });
        },
    });
};

// 댓글 관련 쿼리들
export const useCommentsQuery = (postId, options = {}) => {
    return useQuery({
        queryKey: queryKeys.comments.byPost(postId),
        queryFn: () => api.comments.getByPost(postId),
        select: (data) => data.data,
        enabled: !!postId,
        staleTime: 2 * 60 * 1000,
        ...options,
    });
};

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentData }) =>
            api.comments.create(postId, commentData),
        onSuccess: (data, variables) => {
            // 댓글 목록에 새 댓글 추가
            queryClient.setQueryData(
                queryKeys.comments.byPost(variables.postId),
                (old) => ({
                    ...old,
                    data: [...(old?.data || []), data.data],
                })
            );

            // 포스트의 댓글 수 업데이트
            queryClient.setQueryData(
                queryKeys.posts.detail(variables.postId),
                (old) => ({
                    ...old,
                    data: {
                        ...old?.data,
                        commentsCount: (old?.data?.commentsCount || 0) + 1,
                    },
                })
            );
        },
        onError: (error) => {
            console.error('Comment creation failed:', handleApiError(error));
        },
    });
};

export const useUpdateCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, commentData }) =>
            api.comments.update(postId, commentId, commentData),
        onSuccess: (data, variables) => {
            // 댓글 목록에서 해당 댓글 업데이트
            queryClient.setQueryData(
                queryKeys.comments.byPost(variables.postId),
                (old) => ({
                    ...old,
                    data: old?.data?.map(comment =>
                        comment.id === variables.commentId
                            ? { ...comment, ...data.data }
                            : comment
                    ) || [],
                })
            );
        },
        onError: (error) => {
            console.error('Comment update failed:', handleApiError(error));
        },
    });
};

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }) =>
            api.comments.delete(postId, commentId),
        onSuccess: (data, variables) => {
            // 댓글 목록에서 해당 댓글 제거
            queryClient.setQueryData(
                queryKeys.comments.byPost(variables.postId),
                (old) => ({
                    ...old,
                    data: old?.data?.filter(comment =>
                        comment.id !== variables.commentId
                    ) || [],
                })
            );

            // 포스트의 댓글 수 업데이트
            queryClient.setQueryData(
                queryKeys.posts.detail(variables.postId),
                (old) => ({
                    ...old,
                    data: {
                        ...old?.data,
                        commentsCount: Math.max((old?.data?.commentsCount || 0) - 1, 0),
                    },
                })
            );
        },
        onError: (error) => {
            console.error('Comment deletion failed:', handleApiError(error));
        },
    });
};

// 사용자 관련 쿼리들
export const useUserProfileQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.user.profile,
        queryFn: () => api.user.getProfile(),
        select: (data) => data.data,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
};

export const useUserPreferencesQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.user.preferences,
        queryFn: () => api.user.getPreferences(),
        select: (data) => data.data,
        staleTime: 15 * 60 * 1000,
        ...options,
    });
};

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData) => api.user.updateProfile(userData),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.user.profile, { data: data.data });
        },
        onError: (error) => {
            console.error('Profile update failed:', handleApiError(error));
        },
    });
};

// 태그 관련 쿼리들
export const useTagsQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.tags.all,
        queryFn: () => api.tags.getAll(),
        select: (data) => data.data,
        staleTime: 30 * 60 * 1000, // 30분
        ...options,
    });
};

export const usePopularTagsQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.tags.popular,
        queryFn: () => api.tags.getPopular(),
        select: (data) => data.data,
        staleTime: 15 * 60 * 1000,
        ...options,
    });
};

// 북마크 관련 쿼리들
export const useBookmarksQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.bookmarks.all,
        queryFn: () => api.bookmarks.getAll(),
        select: (data) => data.data,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useToggleBookmarkMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, isBookmarked }) =>
            isBookmarked
                ? api.bookmarks.remove(postId)
                : api.bookmarks.add(postId),
        onMutate: async ({ postId, isBookmarked }) => {
            // 낙관적 업데이트
            await queryClient.cancelQueries({ queryKey: queryKeys.bookmarks.all });

            const previousBookmarks = queryClient.getQueryData(queryKeys.bookmarks.all);

            if (previousBookmarks) {
                const newBookmarks = isBookmarked
                    ? previousBookmarks.data.filter(bookmark => bookmark.postId !== postId)
                    : [...previousBookmarks.data, { postId }];

                queryClient.setQueryData(queryKeys.bookmarks.all, {
                    ...previousBookmarks,
                    data: newBookmarks,
                });
            }

            return { previousBookmarks };
        },
        onError: (error, variables, context) => {
            if (context?.previousBookmarks) {
                queryClient.setQueryData(
                    queryKeys.bookmarks.all,
                    context.previousBookmarks
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all });
        },
    });
};

// 통계 관련 쿼리들
export const useBlogStatsQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.analytics.blogStats,
        queryFn: () => api.analytics.getBlogStats(),
        select: (data) => data.data,
        staleTime: 30 * 60 * 1000,
        ...options,
    });
};

export const useTopPostsQuery = (period = '7d', options = {}) => {
    return useQuery({
        queryKey: queryKeys.analytics.topPosts(period),
        queryFn: () => api.analytics.getTopPosts(period),
        select: (data) => data.data,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
};

// 알림 관련 쿼리들
export const useNotificationsQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.notifications.all,
        queryFn: () => api.notifications.getAll(),
        select: (data) => data.data,
        staleTime: 60 * 1000, // 1분
        ...options,
    });
};

export const useUnreadCountQuery = (options = {}) => {
    return useQuery({
        queryKey: queryKeys.notifications.unreadCount,
        queryFn: () => api.notifications.getUnreadCount(),
        select: (data) => data.data.count,
        staleTime: 30 * 1000, // 30초
        refetchInterval: 60 * 1000, // 1분마다 자동 갱신
        ...options,
    });
};

export const useMarkNotificationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId) =>
            api.notifications.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount });
        },
        onError: (error) => {
            console.error('Mark notification failed:', handleApiError(error));
        },
    });
};

// 파일 업로드 뮤테이션
export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: ({ file, folder = 'general' }) =>
            api.upload.image(file, folder),
        onError: (error) => {
            console.error('Image upload failed:', handleApiError(error));
        },
    });
};

// 커스텀 훅 - 포스트 상세 페이지용
export const usePostDetail = (id) => {
    const postQuery = usePostQuery(id);
    const commentsQuery = useCommentsQuery(id);

    const incrementViewMutation = useMutation({
        mutationFn: () => api.posts.incrementView(id),
        onError: (error) => {
            console.warn('View increment failed:', handleApiError(error));
        },
    });

    React.useEffect(() => {
        if (id && postQuery.data) {
            incrementViewMutation.mutate();
        }
    }, [id, postQuery.data]);

    return {
        post: postQuery.data,
        comments: commentsQuery.data,
        isLoading: postQuery.isLoading || commentsQuery.isLoading,
        error: postQuery.error || commentsQuery.error,
        refetch: () => {
            postQuery.refetch();
            commentsQuery.refetch();
        },
    };
};

// 커스텀 훅 - 검색 기능용
export const usePostSearch = () => {
    const [query, setQuery] = React.useState('');
    const [debouncedQuery, setDebouncedQuery] = React.useState('');

    // 디바운스 처리
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const searchResults = useSearchPostsQuery(debouncedQuery);

    return {
        query,
        setQuery,
        results: searchResults.data,
        isLoading: searchResults.isLoading,
        error: searchResults.error,
    };
};