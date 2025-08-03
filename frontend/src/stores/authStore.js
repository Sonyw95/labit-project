import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // 상태
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isAdmin: false,
            tokenRefreshPromise: null,

            // 초기화 관리
            isInitialized: false,
            lastValidation: null,
            validationCache: new Map(),
            isValidating: false,

            // 관리자 정보
            adminInfo: null,
            adminInfoLoading: false,
            adminInfoError: null,
            adminInfoLastUpdated: null,

            setInitialized: () => {
                set({ isInitialized: true, isLoading: false });
                console.log('AuthStore 초기화 완료');
            },

            // 토큰 만료 확인
            isTokenExpired: (token) => {
                if (!token) {
                    return true;
                }
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    return decoded.exp < currentTime;
                } catch (error) {
                    console.error('토큰 디코딩 오류:', error);
                    return true;
                }
            },

            // 토큰 만료 5분 전인지 확인
            shouldRefreshToken: (token) => {
                if (!token) {
                    return false;
                }
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    const timeUntilExpiry = decoded.exp - currentTime;
                    return timeUntilExpiry < 5 * 60;
                } catch (error) {
                    return false;
                }
            },

            // 토큰에서 사용자 정보 추출
            extractUserFromToken: (token) => {
                try {
                    const decoded = jwtDecode(token);
                    return {
                        id: decoded.userId,
                        kakaoId: decoded.sub,
                        nickname: decoded.nickname,
                        email: decoded.email,
                        role: decoded.role,
                        profileImage: decoded.profileImage,
                    };
                } catch (error) {
                    console.error('사용자 정보 추출 오류:', error);
                    return null;
                }
            },

            // 로그인
            login: (accessToken, refreshToken = null) => {
                const { extractUserFromToken, isTokenExpired } = get();

                if (isTokenExpired(accessToken)) {
                    console.error('만료된 토큰으로 로그인 시도');
                    return false;
                }

                const user = extractUserFromToken(accessToken);
                if (!user) {
                    console.error('토큰에서 사용자 정보 추출 실패');
                    return false;
                }

                const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

                set({
                    accessToken,
                    refreshToken,
                    user,
                    isAuthenticated: true,
                    isAdmin,
                    isLoading: false,
                    lastValidation: Date.now(),
                });

                console.log('로그인 성공:', user.nickname);
                return true;
            },

            // 정상 로그아웃
            logout: () => {
                console.log('정상 로그아웃 처리 시작');

                // 캐시 및 상태 완전 초기화
                const validationCache = get().validationCache;
                validationCache.clear();

                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                    isLoading: false,
                    lastValidation: null,
                    isValidating: false,
                    tokenRefreshPromise: null,

                    // 관리자 정보도 초기화
                    adminInfo: null,
                    adminInfoLoading: false,
                    adminInfoError: null,
                    adminInfoLastUpdated: null,
                });

                console.log('정상 로그아웃 완료');
            },

            // 강제 로그아웃 (긴급 상황용)
            forceLogout: () => {
                console.warn('강제 로그아웃 처리 시작');

                try {
                    // 모든 상태 강제 초기화
                    const validationCache = get().validationCache;
                    validationCache.clear();

                    // 상태 완전 리셋
                    set({
                        accessToken: null,
                        refreshToken: null,
                        user: null,
                        isAuthenticated: false,
                        isAdmin: false,
                        isLoading: false,
                        lastValidation: null,
                        isValidating: false,
                        tokenRefreshPromise: null,
                        isInitialized: true,

                        // 관리자 정보 초기화
                        adminInfo: null,
                        adminInfoLoading: false,
                        adminInfoError: null,
                        adminInfoLastUpdated: null,
                    });

                    console.warn('강제 로그아웃 완료');
                } catch (error) {
                    console.error('강제 로그아웃 중 오류:', error);
                }
            },

            // 토큰 갱신 (사용자 정보 수정 시 새 토큰 설정)
            setTokens: (accessToken, refreshToken = null) => {
                const { extractUserFromToken, isTokenExpired } = get();
                const currentState = get();

                if (isTokenExpired(accessToken)) {
                    console.error('만료된 토큰으로 갱신 시도');
                    get().forceLogout();
                    return false;
                }

                const user = extractUserFromToken(accessToken);
                if (!user) {
                    console.error('토큰에서 사용자 정보 추출 실패');
                    get().forceLogout();
                    return false;
                }

                const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

                set({
                    accessToken,
                    refreshToken: refreshToken || currentState.refreshToken,
                    user,
                    isAuthenticated: true,
                    isAdmin,
                    isLoading: false,
                    tokenRefreshPromise: null,
                    lastValidation: Date.now(),
                });

                console.log('토큰 갱신 완료:', { userId: user.id, nickname: user.nickname, role: user.role });
                return true;
            },

            // 사용자 정보 업데이트 (단순화된 버전 - 토큰 재발급 방식에서는 거의 불필요)
            updateUser: (userData) => {
                const currentState = get();
                if (!currentState.isAuthenticated) {
                    console.warn('인증되지 않은 상태에서 사용자 정보 업데이트 시도');
                    return;
                }

                const updatedUser = { ...currentState.user, ...userData };
                const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(updatedUser.role);

                set({
                    user: updatedUser,
                    isAdmin,
                });

                console.log('사용자 정보 업데이트 완료:', updatedUser.nickname);
            },

            // 로딩 상태 설정
            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            // 새로고침 안전 토큰 검증 (단순화된 버전)
            validateTokensOnRefresh: () => {
                const state = get();
                const { accessToken, extractUserFromToken, isTokenExpired } = state;

                console.log('새로고침 토큰 검증 시작');

                if (!accessToken) {
                    console.log('토큰 없음, 비인증 상태로 설정');
                    set({
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true
                    });
                    return false;
                }

                // 클라이언트 측 토큰 만료 확인
                if (isTokenExpired(accessToken)) {
                    console.log('토큰 만료됨, 강제 로그아웃 처리');
                    get().forceLogout();
                    return false;
                }

                // 토큰에서 사용자 정보 추출 (토큰이 항상 최신 정보 포함)
                const user = extractUserFromToken(accessToken);
                if (!user) {
                    console.log('사용자 정보 추출 실패, 강제 로그아웃 처리');
                    get().forceLogout();
                    return false;
                }

                const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

                set({
                    user,
                    isAuthenticated: true,
                    isAdmin,
                    isLoading: false,
                    isInitialized: true,
                    lastValidation: Date.now(),
                });

                console.log('새로고침 토큰 검증 성공:', user.nickname);

                return true;
            },

            // 간단한 토큰 검증 (로컬만)
            validateLocalToken: () => {
                const state = get();
                const { accessToken, isTokenExpired, extractUserFromToken } = state;

                if (!accessToken || isTokenExpired(accessToken)) {
                    return false;
                }

                const user = extractUserFromToken(accessToken);
                return !!user;
            },

            // 관리자 정보 관련 함수들 (기존 유지)
            setAdminInfo: (adminInfo) => {
                set({
                    adminInfo,
                    adminInfoLoading: false,
                    adminInfoError: null,
                    adminInfoLastUpdated: Date.now(),
                });
            },

            setAdminInfoLoading: (loading) => {
                set({ adminInfoLoading: loading });
            },

            setAdminInfoError: (error) => {
                set({
                    adminInfoError: error,
                    adminInfoLoading: false,
                });
            },

            shouldRefreshAdminInfo: () => {
                const { adminInfoLastUpdated } = get();
                if (!adminInfoLastUpdated) {
                    return true;
                }
                const now = Date.now();
                const tenMinutes = 10 * 60 * 1000;
                return (now - adminInfoLastUpdated) > tenMinutes;
            },

            clearAdminInfo: () => {
                set({
                    adminInfo: null,
                    adminInfoLoading: false,
                    adminInfoError: null,
                    adminInfoLastUpdated: null,
                });
            },

            updateAdminInfo: (updates) => {
                const currentState = get();
                if (!currentState.adminInfo) {
                    return;
                }
                const updatedAdminInfo = { ...currentState.adminInfo, ...updates };
                set({
                    adminInfo: updatedAdminInfo,
                    adminInfoLastUpdated: Date.now(),
                });
            },

            // Getter 함수들
            getUser: () => get().user,
            getAccessToken: () => get().accessToken,
            getRefreshToken: () => get().refreshToken,
            getIsAuthenticated: () => get().isAuthenticated,
            getIsAdmin: () => get().isAdmin,
            getIsLoading: () => get().isLoading,
            getAdminInfo: () => get().adminInfo,
            getAdminInfoLoading: () => get().adminInfoLoading,
            getAdminInfoError: () => get().adminInfoError,

            // 토큰 갱신 Promise 관리
            setTokenRefreshPromise: (promise) => {
                set({ tokenRefreshPromise: promise });
            },
            getTokenRefreshPromise: () => get().tokenRefreshPromise,
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                // user 정보는 토큰에서 추출하므로 저장하지 않음
                adminInfo: state.adminInfo,
                adminInfoLastUpdated: state.adminInfoLastUpdated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    console.log('Persist 로딩 완료, 토큰 검증 시작');
                    state.validateTokensOnRefresh();
                }
            },
        }
    )
);

export default useAuthStore;