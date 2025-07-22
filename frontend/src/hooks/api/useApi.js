import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {navigationService, postService, userService} from "@/api/service.js";
import useAuthStore from "../../stores/authStore.js";
import {authService, commentService, uploadService} from "../../api/service.js";
import {showToast} from "../../components/advanced/Toast.jsx";

export const queryKeys = {
    users: {
        all: ['users'],
        profile: () => [...queryKeys.users.all, 'profile'],
    },
    posts: {
        all: ['posts'],
        list: (params) => [...queryKeys.posts.all, 'list', params],
        detail: (id) => [...queryKeys.posts.all, 'detail', id],
    },
    mainPage: {
        data: ['mainPage', 'data'],
    },
    navigation: {
        tree: ['navigation', 'tree'],
        path: (href) => ['navigation', 'path', href],
    },
    post: {
        posts: ['posts'],
        post: (id) => ['posts', id],
        postsByCategory: (categoryId) => ['posts', 'category', categoryId],
        postsByTag: (tag) => ['posts', 'tag', tag],
        postsByAuthor: (authorId) => ['posts', 'author', authorId],
        searchPosts: (keyword) => ['posts', 'search', keyword],
        featuredPosts: ['posts', 'featured'],
        popularPosts: ['posts', 'popular'],
        recentPosts: ['posts', 'recent'],
    },
    comments: ['comments'],
    commentsByPost: (postId) => ['comments', 'post', postId],
    commentsByAuthor: (authorId) => ['comments', 'author', authorId],
    recentComments: ['comments', 'recent'],
    
    userInfo: ['auth', 'userInfo'],
    tokenValidation: ['auth', 'tokenValidation'],
};

// User Hooks
export const useUserProfile = () => {
    return useQuery({
        queryKey: queryKeys.users.profile(),
        queryFn: userService.getProfile,
        staleTime: 5 * 60 * 1000, // 5분
        retry: 1,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.users.profile(), data);
            queryClient.invalidateQueries({ queryKey: queryKeys.mainPage.data });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.deleteAccount,
        onSuccess: () => {
            queryClient.clear();
            localStorage.removeItem('authToken');
        },
    });
};

// Main Page Hook (복수 API)
// export const useMainPageData = () => {
//     return useQuery({
//         queryKey: queryKeys.mainPage.data,
//         queryFn: mainPageService.getMainPageData,
//         staleTime: 2 * 60 * 1000, // 2분
//         retry: 1,
//     });
// };

// 네비게이션 트리 조회
export const useNavigationTree = () => {
    return useQuery({
        queryKey: queryKeys.navigation.tree,
        queryFn: navigationService.getNavigationTree,
        staleTime: 10 * 60 * 1000, // 10분
        cacheTime: 30 * 60 * 1000, // 30분
        retry: 1,
        refetchOnWindowFocus: false,
    })
}

// 네비게이션 경로 조회
export const useNavigationPath = ( href ) => {
    return useQuery({
        queryKey: queryKeys.navigation.path(href),
        queryFn: () => navigationService.getNavigationPath(href),
        enabled: !!href,
        staleTime: 10 * 60 * 1000, // 10분
        retry: 1
    })
}

// 네비게이션 캐시 무효화
export const useEvictNavigationCache = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: navigationService.evictNavigationCache,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['navigation'] });
        }
    })
}

// 사용자 정보 조회
export const useUserInfo = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: queryKeys.userInfo,
        queryFn: authService.getUserInfo,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        onError: (error) => {
            if( error.response?.status === 401 ){
                useAuthStore.getState().logout();
            }
        }
    })
}

// 카카오 인증 주소
export const useKakaoAuthPath = () => {
    return useQuery({
        queryKey: queryKeys.userInfo,
        queryFn: authService.getKakaoAuthPath,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    })
}

// 카카오 로그인
export const useKakaoLogin = () => {
    const queryClient = useQueryClient();
    const { login } = useAuthStore();

    return useMutation({
        mutationFn: authService.kakaoLogin,
        onSuccess: (response) => {
            console.log('카카오 로그인 API 성공:', response);

            const { accessToken } = response;
            if (!accessToken) {
                throw new Error('액세스 토큰을 받지 못했습니다.');
            }

            login(accessToken);

            // 사용자 정보 캐시 무효화하여 새로 조회
            queryClient.invalidateQueries({ queryKey: queryKeys.userInfo });

            // 성공 알림
            showToast.success('로그인 성공', '카카오 로그인이 완료되었습니다.');
        },
        onError: (error) => {
            console.error('카카오 로그인 실패:', error);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                '로그인에 실패했습니다.';
            showToast.error('로그인 실패', errorMessage);
            // 에러를 다시 throw하여 콜백 페이지에서 처리할 수 있도록
            throw error;
        },
    });
};

// 로그아웃
export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout, kakaoAccessToken } = useAuthStore();

    return useMutation({
        mutationFn: () => authService.logout(kakaoAccessToken),
        onSuccess: () => {
            logout();
            queryClient.removeQueries({ queryKey: ['auth'] });
            queryClient.clear();
            showToast.success('로그아웃 완료', '성공적으로 로그아웃되었습니다.');
        },
        onSettled: () => {
            // 로그아웃은 성공/실패와 관계없이 클라이언트 상태는 초기화
            logout();
            queryClient.clear();
        },
    });
};

 // 토큰 갱신
export const useTokenRefresh = () => {
    const { setToken } = useAuthStore();

    return useMutation({
        mutationFn: authService.refreshToken,
        onSuccess: (response) => {
            const { accessToken } = response;
            setToken(accessToken);
            showToast.success('토큰 갱신', '인증 토큰이 갱신되었습니다.');
        },
        onError: () => {
            // 토큰 갱신 실패시 로그아웃
            useAuthStore.getState().logout();
            showToast.success('세션 만료', '토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
        },
    });
};

// 포스트 목록 조회 (페이지네이션)
export const usePosts = (params = {}) => {
    return useQuery({
        queryKey: [queryKeys.post.posts, params],
        queryFn: () => postService.getPosts(params),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

// 무한 스크롤 포스트 목록
export const useInfinitePosts = (params = {}) => {
    return useInfiniteQuery({
        queryKey: [queryKeys.post.posts, 'infinite', params],
        queryFn: ({ pageParam = 0 }) =>
            postService.getPosts({ ...params, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.last) {
                return undefined;
            }
            return lastPage.number + 1;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// 포스트 상세 조회
export const usePost = (id, options = {}) => {
    return useQuery({
        queryKey: queryKeys.post.post(id),
        queryFn: () => postService.getPost(id),
        enabled: !!id && (options.enabled !== false),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

// 카테고리별 포스트 조회
export const usePostsByCategory = (categoryId, params = {}) => {
    return useQuery({
        queryKey: [queryKeys.post.postsByCategory(categoryId), params],
        queryFn: () => postService.getPostsByCategory(categoryId, params),
        enabled: !!categoryId,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

// 태그별 포스트 조회
export const usePostsByTag = (tag, params = {}) => {
    return useQuery({
        queryKey: [queryKeys.post.postsByTag(tag), params],
        queryFn: () => postService.getPostsByTag(tag, params),
        enabled: !!tag,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

// 포스트 검색
export const useSearchPosts = (keyword, params = {}) => {
    return useQuery({
        queryKey: [queryKeys.post.searchPosts(keyword), params],
        queryFn: () => postService.searchPosts(keyword, params),
        enabled: !!keyword && keyword.length >= 2,
        keepPreviousData: true,
        staleTime: 2 * 60 * 1000,
    });
};

// 추천 포스트 조회
export const useFeaturedPosts = () => {
    return useQuery({
        queryKey: queryKeys.post.featuredPosts,
        queryFn: postService.getFeaturedPosts,
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });
};

// 인기 포스트 조회
export const usePopularPosts = (limit = 10) => {
    return useQuery({
        queryKey: [queryKeys.post.popularPosts, limit],
        queryFn: () => postService.getPopularPosts(limit),
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });
};

// 최근 포스트 조회
export const useRecentPosts = (limit = 10) => {
    return useQuery({
        queryKey: [queryKeys.post.recentPosts, limit],
        queryFn: () => postService.getRecentPosts(limit),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

// 포스트 생성
export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.createPost,
        onSuccess: (data) => {
            // 관련 캐시 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.post.posts });
            queryClient.invalidateQueries({ queryKey: queryKeys.post.recentPosts });

            if (data.isFeatured) {
                queryClient.invalidateQueries({ queryKey: queryKeys.post.featuredPosts });
            }

            if (data.category?.id) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.post.postsByCategory(data.category.id)
                });
            }
            showToast.success("포스트 작성 완료", "포스트가 성공적으로 작성되었습니다.")
        },
        onError: (error) => {
            showToast.error("포스트 생성 실패", "포스트 생성 중 오류가 발생하였습니다.")
        },
    });
};

// 포스트 수정
export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => postService.updatePost(id, data),
        onSuccess: (data, variables) => {
            // 특정 포스트 캐시 업데이트
            queryClient.setQueryData(queryKeys.post.post(variables.id), data);

            // 관련 캐시 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.post.posts });
            queryClient.invalidateQueries({ queryKey: queryKeys.post.recentPosts });

            if (data.isFeatured) {
                queryClient.invalidateQueries({ queryKey: queryKeys.post.featuredPosts });
            }
            showToast.success("포스트 수정 완료", "포스트가 성공적으로 수정되었습니다.")
        },
        onError: (error) => {
            showToast.error("포스트 수정 실패",  error.message || '포스트 수정 중 오류가 발생했습니다.')
        },
    });
};

// 포스트 삭제
export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.deletePost,
        onSuccess: (_, postId) => {
            // 특정 포스트 캐시 제거
            queryClient.removeQueries({ queryKey: queryKeys.post.post(postId) });

            // 관련 캐시 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.post.posts });
            queryClient.invalidateQueries({ queryKey: queryKeys.post.featuredPosts });
            queryClient.invalidateQueries({ queryKey: queryKeys.post.recentPosts });
            queryClient.invalidateQueries({ queryKey: queryKeys.post.popularPosts });

            showToast.success("포스트 삭제 완료", "포스트가 삭제되었습니다.")

        },
        onError: (error) => {
            showToast.error("포스트 삭제 실패", error.message || '포스트 삭제 중 오류가 발생했습니다.')
        },
    });
};

// 포스트 좋아요 토글
export const useTogglePostLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.togglePostLike,
        onSuccess: (data, postId) => {
            // 특정 포스트 캐시 업데이트
            queryClient.setQueryData(queryKeys.post.post(postId), data);

            // 포스트 목록 캐시에서 해당 포스트 업데이트
            queryClient.setQueriesData(
                { queryKey: queryKeys.post.posts },
                (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        content: oldData.content?.map(post =>
                            post.id === postId ? { ...post, likeCount: data.likeCount } : post
                        )
                    };
                }
            );
        },
        onError: (error) => {
            showToast.error('좋아요 처리 실패', error.message || '좋아요 처리 중 오류가 발생했습니다.')

        },
    });
};


// 포스트별 댓글 조회
export const useCommentsByPost = (postId) => {
    return useQuery({
        queryKey: queryKeys.commentsByPost(postId),
        queryFn: () => commentService.getCommentsByPost(postId),
        enabled: !!postId,
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });
};

// 사용자별 댓글 조회
export const useCommentsByAuthor = (authorId, params = {}) => {
    return useQuery({
        queryKey: [queryKeys.commentsByAuthor(authorId), params],
        queryFn: () => commentService.getCommentsByAuthor(authorId, params),
        enabled: !!authorId,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

// 최근 댓글 조회
export const useRecentComments = (limit = 10) => {
    return useQuery({
        queryKey: [queryKeys.recentComments, limit],
        queryFn: () => commentService.getRecentComments(limit),
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });
};

// 댓글 생성
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.createComment,
        onSuccess: (data) => {
            // 해당 포스트의 댓글 목록 무효화
            queryClient.invalidateQueries({
                queryKey: queryKeys.commentsByPost(data.postId)
            });

            // 최근 댓글 무효화
            queryClient.invalidateQueries({
                queryKey: queryKeys.recentComments
            });

            // 포스트의 댓글 수 업데이트
            queryClient.invalidateQueries({
                queryKey: ['posts', data.postId]
            });
            showToast.success("댓글 작성 완료", "댓글이 성공적으로 작성되었습니다.")
        },
        onError: (error) => {
            showToast.error("댓글 작성 실패", error.message || "댓글 작성 중 오류가 발생하였스브니다.")
        },
    });
};

// 댓글 수정
export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => commentService.updateComment(id, data),
        onSuccess: (data) => {
            // 해당 포스트의 댓글 목록 무효화
            queryClient.invalidateQueries({
                queryKey: queryKeys.commentsByPost(data.postId)
            });

            showToast.success("댓글 수정 완료", "댓글이 성공적으로 수정되었습니다.")
        },
        onError: (error) => {
            showToast.error("댓굴 수정 실패", error.message || "댓글 수정 중 오류가 발생했습니다.");
        },
    });
};

// 댓글 삭제
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.deleteComment,
        onSuccess: (_, commentId) => {
            // 모든 댓글 관련 캐시 무효화
            queryClient.invalidateQueries({ queryKey: queryKeys.comments });
            showToast.success("댓글 삭제 완료", "댓글이 삭제되었습니다.");
        },
        onError: (error) => {
            showToast.error("댓글 삭제 실패", error.message || "댓글 삭제 중 오류가 발생했습니다.")
        },
    });
};

// 댓글 좋아요 토글
export const useToggleCommentLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.toggleCommentLike,
        onSuccess: (data) => {
            // 해당 포스트의 댓글 목록 무효화
            queryClient.invalidateQueries({
                queryKey: queryKeys.commentsByPost(data.postId)
            });
        },
        onError: (error) => {
            showToast.error("좋아요 처리 실패", error.message || "좋아요 처리 중 오류가 발생했습니다.")
        },
    });
};


// 이미지 업로드
export const useUploadImage = () => {
    return useMutation({
        mutationFn: uploadService.uploadImage,
        onSuccess: (data) => {
            showToast.success("이미지 업로드 완료",  '이미지가 성공적으로 업로드되었습니다.')
        },
        onError: (error) => {
            showToast.error("이미지 업로드 실패", error.message || "이미지 업로드 중 오류가 발생했습니다.")
        },
    });
};

// 썸네일 업로드
export const useUploadThumbnail = () => {
    return useMutation({
        mutationFn: uploadService.uploadThumbnail,
        onSuccess: (data) => {
            showToast.success("썸네일 업로드 완료",  '썸네일이 성공적으로 업로드되었습니다.')
        },
        onError: (error) => {
            showToast.error("썸네일 업로드 실패", error.message || "썸네일 업로드 중 오류가 발생했습니다.")
        },
    });
};

// 파일 업로드
export const useUploadFile = () => {
    return useMutation({
        mutationFn: uploadService.uploadFile,
        onSuccess: (data) => {
            showToast.success("파일 업로드 완료", "파일이 성공적으로 업로드되었습니다")
        },
        onError: (error) => {
            showToast.error("파일 업로드 실패", "파일 업로드 중 오류가 발생했습니다.")
        },
    });
};