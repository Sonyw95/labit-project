// 토큰 만료 확인 및 자동 로그아웃 훅
import {useCallback, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useApiStore from "../../stores/apiStore.js";
import {tokenUtils} from "../../api/authAPi.js";
import {showToast} from "../../components/common/Toast.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";

export const useTokenExpiration = () => {
    const logout = useApiStore(state => state.logout);
    const navigate = useNavigate();

    const checkTokenExpiration = useCallback(async () => {
        const token = tokenUtils.getToken();

        if (!token) {
            return;
        }

        if (tokenUtils.isTokenExpired(token)) {
            showToast.error('경고', '세션이 만료되었습니다. 다시 로그인해주세요.');
            await logout();
            navigate('/login');
        }
    }, [logout, navigate]);

    useEffect(() => {
        // 컴포넌트 마운트 시 토큰 확인
        checkTokenExpiration().then(r => {console.log(r)});

        // 주기적으로 토큰 만료 확인 (1분마다)
        const interval = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(interval);
    }, [checkTokenExpiration]);

    return { checkTokenExpiration };
};

// 인증 상태 훅
export const useAuthState = () => {
    const authStore = useApiStore();

    return {
        user: authStore.user,
        isAuthenticated: authStore.isAuthenticated,
        isLoading: authStore.isLoading,
        error: authStore.error,
        isAdmin: authStore.isAdmin(),
        hasRole: authStore.hasRole,
    };
};

// 카카오 로그인 훅
export const useKakaoLogin = () => {
    const login = useApiStore(state => state.login);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (code) => {
            const result = await login(code);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: (data) => {
            showToast.success('로그인 성공', `${data.user.nickname}님, 환영합니다!`);
            // 로그인 후 대시보드로 이동
            navigate('/dashboard');
        },
        onError: (error) => {
            showToast.error('로그인 실패', error.message || '로그인에 실패했습니다.');
        },
    });
};

// 로그아웃 훅
export const useLogout = () => {
    const logout = useApiStore(state => state.logout);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            showToast.success('로그아웃', '로그아웃되었습니다.');
            navigate('/login');
        },
        onError: (error) => {
            showToast.error('로그아웃 실패', error.message || '로그아웃에 실패했습니다.');
        },
    });
};

// 현재 사용자 정보 조회 훅
export const useCurrentUser = () => {
    const { user, isAuthenticated } = useApiStore();
    const fetchCurrentUser = useApiStore(state => state.fetchCurrentUser);

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        enabled: isAuthenticated && !!tokenUtils.getToken(),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        refetchOnWindowFocus: false,
        retry: false,
        onError: (error) => {
            console.error('사용자 정보 조회 실패:', error);
        },
    });
};

// 토큰 검증 훅
export const useTokenValidation = () => {
    const validateToken = useApiStore(state => state.validateToken);
    const logout = useApiStore(state => state.logout);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: validateToken,
        onSuccess: (isValid) => {
            if (!isValid) {
                showToast.warning('세션 만료', '세션이 만료되었습니다. 다시 로그인해주세요.');
                logout();
                navigate('/login');
            }
        },
        onError: (error) => {
            console.error('토큰 검증 실패:', error);
            logout();
            navigate('/login');
        },
    });
};

// 인증 초기화 훅
export const useAuthInitialize = () => {
    const initialize = useApiStore(state => state.initialize);

    return useQuery({
        queryKey: ['authInitialize'],
        queryFn: initialize,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
    });
};

// 통합 인증 훅
export const useAuth = () => {
    const authState = useAuthState();
    const kakaoLogin = useKakaoLogin();
    const logout = useLogout();
    const tokenValidation = useTokenValidation();

    // 토큰 만료 확인 활성화
    useTokenExpiration();

    return {
        ...authState,
        login: kakaoLogin.mutate,
        logout: logout.mutate,
        validateToken: tokenValidation.mutate,
        isLoginLoading: kakaoLogin.isPending,
        isLogoutLoading: logout.isPending,
    };
};