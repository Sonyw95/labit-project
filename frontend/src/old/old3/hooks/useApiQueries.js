
// ========================================
// hooks/useApiQueries.js - API 쿼리 훅들
// ========================================
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { useToast } from '../contexts/ToastContext';

// 포스트 목록 조회
export const usePosts = (params = {}) => {
    return useQuery({
        queryKey: ['posts', params],
        queryFn: () => apiClient.blog.getPosts(params),
        staleTime: 2 * 60 * 1000, // 2분
    });
};

// 무한 스크롤 포스트 목록
export const useInfinitePosts = (params = {}) => {
    return useInfiniteQuery({
        queryKey: ['posts', 'infinite', params],
        queryFn: ({ pageParam = 1 }) =>
            apiClient.blog.getPosts({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

// 포스트 상세 조회
export const usePost = (id) => {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: () => apiClient.blog.getPost(id),
        enabled: !!id,
    });
};

// 포스트 생성 뮤테이션
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: apiClient.blog.createPost,
        onSuccess: (data) => {
            // 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('포스트가 성공적으로 생성되었습니다.');
        },
        onError: (error) => {
            toast.error(error.message || '포스트 생성에 실패했습니다.');
        },
    });
};

// 포스트 업데이트 뮤테이션
export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ id, ...postData }) => apiClient.blog.updatePost(id, postData),
        onSuccess: (data) => {
            // 특정 포스트 캐시 업데이트
            queryClient.setQueryData(['posts', data.id], data);
            // 포스트 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('포스트가 성공적으로 업데이트되었습니다.');
        },
        onError: (error) => {
            toast.error(error.message || '포스트 업데이트에 실패했습니다.');
        },
    });
};

// 포스트 삭제 뮤테이션
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: apiClient.blog.deletePost,
        onSuccess: (_, id) => {
            // 포스트 캐시에서 제거
            queryClient.removeQueries({ queryKey: ['posts', id] });
            // 포스트 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('포스트가 성공적으로 삭제되었습니다.');
        },
        onError: (error) => {
            toast.error(error.message || '포스트 삭제에 실패했습니다.');
        },
    });
};

// 사용자 프로필 조회
export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: apiClient.auth.getProfile,
        staleTime: 10 * 60 * 1000, // 10분
    });
};

// 프로필 업데이트 뮤테이션
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: apiClient.users.updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(['profile'], data);
            toast.success('프로필이 성공적으로 업데이트되었습니다.');
        },
        onError: (error) => {
            toast.error(error.message || '프로필 업데이트에 실패했습니다.');
        },
    });
};

// 파일 업로드 뮤테이션
export const useUploadFile = () => {
    const toast = useToast();

    return useMutation({
        mutationFn: ({ file, onProgress }) =>
            apiClient.files.uploadImage(file, onProgress),
        onSuccess: () => {
            toast.success('파일이 성공적으로 업로드되었습니다.');
        },
        onError: (error) => {
            toast.error(error.message || '파일 업로드에 실패했습니다.');
        },
    });
};