import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {mainPageService, navigationService, postService, userService} from "@/api/service.js";
import useAuthStore from "../../stores/authStore.js";
import {authService} from "../../api/service.js";

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

// Post Hooks
export const usePosts = (params = {}) => {
    return useQuery({
        queryKey: queryKeys.posts.list(params),
        queryFn: () => postService.getPosts(params),
        keepPreviousData: true,
    });
};

export const usePost = (id) => {
    return useQuery({
        queryKey: queryKeys.posts.detail(id),
        queryFn: () => postService.getPost(id),
        enabled: !!id,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.mainPage.data });
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => postService.updatePost(id, data),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(queryKeys.posts.detail(variables.id), data);
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.mainPage.data });
        },
    });
};

// Main Page Hook (복수 API)
export const useMainPageData = () => {
    return useQuery({
        queryKey: queryKeys.mainPage.data,
        queryFn: mainPageService.getMainPageData,
        staleTime: 2 * 60 * 1000, // 2분
        retry: 1,
    });
};

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
    const { login, setError } = useAuthStore();
    return useMutation({
        mutationFn: authService.kakaoLogin,
        onSuccess: ( response) => {
            const { accessToken } = response;
            login(accessToken);

            // 사용자 정보 캐시 무효화 -> 새로조회
            queryClient.invalidateQueries({ queryKey: queryKeys.userInfo });
        },
        onError: (error) => {
            console.error( '카카오 로그인 실패: ', error);
            setError(error?.message);
        }
    })
}

// 로그아웃
 export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout, kakaoAccessToken } = useAuthStore();
    return useMutation({
        mutationFn: () => authService.logout(kakaoAccessToken),
        onSuccess: () => {
            logout();
            queryClient.removeQueries({ queryKey: ['auth'] })
            queryClient.clear();
        },
        onSettled: () => {
            // 성공/ 실패 상관없이 클라이언트 상태 초기화
            logout();
            queryClient.clear();
        }
    })
 }

 // 토큰 갱신
export const useTokenRefresh = () => {
    const { setToken } = useAuthStore();
    return useMutation({
        mutationFn: authService.refreshToken,
        onSuccess: ( response ) => {
            const { accessToken } = response;
            setToken(accessToken);
        },
        onError: () => {
            useAuthStore.getState().logout();
        }
    })
}