// examples/apiUsage.js - API 사용 예시
import { apiClient } from '@/api/apiClient';
import { useApi } from '../hooks/useApi';
import { useQuery } from '@tanstack/react-query';

// React Query와 함께 사용하는 예시
export const usePostsQuery = (params = {}) => {
    return useQuery({
        queryKey: ['posts', params],
        queryFn: () => apiClient.posts.getAll(params).then(res => res.data),
        staleTime: 5 * 60 * 1000, // 5분
        cacheTime: 10 * 60 * 1000, // 10분
    });
};

export const usePostQuery = (postId) => {
    return useQuery({
        queryKey: ['post', postId],
        queryFn: () => apiClient.posts.getById(postId).then(res => res.data),
        enabled: !!postId,
    });
};

export const useCreatePostMutation = () => {
    const { createMutation } = useApi();

    return createMutation(
        (postData) => apiClient.posts.create(postData).then(res => res.data),
        {
            invalidateQueries: ['posts'],
            onSuccess: (data) => {
                console.log('Post created:', data);
            },
            onError: (error) => {
                console.error('Failed to create post:', error);
            }
        }
    );
};

export const useUpdatePostMutation = () => {
    const { createMutation } = useApi();

    return createMutation(
        ({ id, data }) => apiClient.posts.update(id, data).then(res => res.data),
        {
            invalidateQueries: [['posts'], ['post']],
            onSuccess: (data) => {
                console.log('Post updated:', data);
            }
        }
    );
};

// 복합 작업 예시
export const useBlogDataQuery = () => {
    return useQuery({
        queryKey: ['blog-data'],
        queryFn: async () => {
            const batchRequests = [
                { method: 'GET', url: '/posts', id: 'posts' },
                { method: 'GET', url: '/tags/popular', id: 'popularTags' },
                { method: 'GET', url: '/categories', id: 'categories' },
                { method: 'GET', url: '/analytics/blog/stats', id: 'stats' }
            ];

            const response = await apiClient.batch.execute(batchRequests);
            return response.data;
        },
        staleTime: 1 * 60 * 1000, // 1분
    });
};

// 인증 관련 훅 예시
export const useAuthMutations = () => {
    const { createMutation } = useApi();

    const loginMutation = createMutation(
        (credentials) => apiClient.auth.login(credentials).then(res => res.data),
        {
            onSuccess: (data) => {
                // 로그인 성공 후 처리
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_info', JSON.stringify(data.user));
            }
        }
    );

    const logoutMutation = createMutation(
        () => apiClient.auth.logout(),
        {
            onSuccess: () => {
                // 로그아웃 후 처리
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_info');
            }
        }
    );

    const kakaoLoginMutation = createMutation(
        () => apiClient.auth.kakaoLogin().then(res => res.data),
        {
            onSuccess: (data) => {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_info', JSON.stringify(data.user));
            }
        }
    );

    return {
        login: loginMutation,
        logout: logoutMutation,
        kakaoLogin: kakaoLoginMutation
    };
};

// 파일 업로드 예시
export const useFileUploadMutation = () => {
    const { createMutation } = useApi();

    return createMutation(
        ({ file, folder = 'general' }) =>
            apiClient.files.upload(file, folder).then(res => res.data),
        {
            onSuccess: (data) => {
                console.log('File uploaded:', data.url);
            },
            onError: (error) => {
                console.error('File upload failed:', error);
            }
        }
    );
};

// 검색 관련 훅 예시
export const useSearchQuery = (query, filters = {}) => {
    return useQuery({
        queryKey: ['search', query, filters],
        queryFn: () => apiClient.search.posts(query, filters).then(res => res.data),
        enabled: !!query && query.length > 2,
        staleTime: 30 * 1000, // 30초
    });
};

// 실시간 데이터 업데이트 예시
export const useRealtimePostUpdates = (postId) => {
    const { createQuery } = useApi();

    return createQuery(
        ['post-updates', postId],
        () => apiClient.posts.getById(postId).then(res => res.data),
        {
            refetchInterval: 30 * 1000, // 30초마다 업데이트
            refetchIntervalInBackground: true,
        }
    );
};

// 에러 처리 예시
export const useRobustApiCall = () => {
    const { createMutation } = useApi();

    return createMutation(
        async (data) => {
            try {
                const result = await apiClient.posts.create(data);
                return result.data;
            } catch (error) {
                // 상세한 에러 처리
                if (error.response?.status === 401) {
                    // 인증 오류 처리
                    throw new Error('인증이 필요합니다.');
                } else if (error.response?.status === 403) {
                    // 권한 오류 처리
                    throw new Error('권한이 없습니다.');
                } else if (error.response?.status >= 500) {
                    // 서버 오류 처리
                    throw new Error('서버 오류가 발생했습니다.');
                } else {
                    // 기타 오류 처리
                    throw new Error(error.response?.data?.message || '요청을 처리할 수 없습니다.');
                }
            }
        },
        {
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        }
    );
};

// 캐시 관리 예시
export const useCacheManager = () => {
    const { queryClient } = useApi();

    const invalidateAllPosts = () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    };

    const prefetchPost = (postId) => {
        queryClient.prefetchQuery({
            queryKey: ['post', postId],
            queryFn: () => apiClient.posts.getById(postId).then(res => res.data),
        });
    };

    const clearCache = () => {
        queryClient.clear();
    };

    return {
        invalidateAllPosts,
        prefetchPost,
        clearCache
    };
};