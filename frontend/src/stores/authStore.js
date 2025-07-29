import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';


/**
 * @typedef {Object} AuthStore
 * @property {Function} getState - Zustand store의 getState 메서드
 * @property {Function} getAccessToken - 액세스 토큰 반환
 * @property {Function} logout - 로그아웃 처리
 */
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
            tokenRefreshPromise: null, // 중복 갱신 방지

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
                    return timeUntilExpiry < 5 * 60; // 5분 미만 남은 경우
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
                });

                console.log('로그인 성공:', { userId: user.id, role: user.role, isAdmin });
                return true;
            },

            // 토큰 갱신
            setTokens: (accessToken, refreshToken = null) => {
                const { extractUserFromToken, isTokenExpired } = get();
                const currentState = get();

                if (isTokenExpired(accessToken)) {
                    console.error('만료된 토큰으로 갱신 시도');
                    get().logout();
                    return false;
                }

                const user = extractUserFromToken(accessToken);
                if (!user) {
                    console.error('토큰에서 사용자 정보 추출 실패');
                    get().logout();
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
                });

                console.log('토큰 갱신 완료:', { userId: user.id, role: user.role });
                return true;
            },

            // 사용자 정보 업데이트
            updateUser: (userData) => {
                const currentState = get();
                if (!currentState.isAuthenticated) {
                    return;
                }

                const updatedUser = { ...currentState.user, ...userData };
                const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(updatedUser.role);

                set({
                    user: updatedUser,
                    isAdmin,
                });

                console.log('사용자 정보 업데이트:', updatedUser);
            },

            // 로딩 상태 설정
            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            // 로그아웃
            logout: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                    isLoading: false,
                    tokenRefreshPromise: null,
                });
                console.log('로그아웃 완료');
            },

            // 토큰 상태 확인 (앱 시작시)
            validateStoredTokens: () => {
                const { accessToken, refreshToken, isTokenExpired, logout } = get();

                if (!accessToken) {
                    return false;
                }

                // Access token이 만료된 경우
                if (isTokenExpired(accessToken)) {
                    console.log('저장된 access token이 만료됨');

                    // Refresh token도 확인
                    if (!refreshToken || isTokenExpired(refreshToken)) {
                        console.log('Refresh token도 만료됨, 로그아웃 처리');
                        logout();
                        return false;
                    }

                    // Refresh token이 유효하면 자동 갱신 시도
                    console.log('Refresh token으로 갱신 시도');
                    return 'refresh_needed';
                }

                // Access token이 유효한 경우 사용자 정보 복원
                const user = get().extractUserFromToken(accessToken);
                if (user) {
                    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
                    set({
                        user,
                        isAuthenticated: true,
                        isAdmin,
                        isLoading: false,
                    });
                    return true;
                }

                logout();
                return false;
            },

            // Getter 함수들
            getUser: () => get().user,
            getAccessToken: () => get().accessToken,
            getRefreshToken: () => get().refreshToken,
            getIsAuthenticated: () => get().isAuthenticated,
            getIsAdmin: () => get().isAdmin,
            getIsLoading: () => get().isLoading,

            // 중복 토큰 갱신 방지를 위한 Promise 관리
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
            }),
        }
    )
);



export default useAuthStore;
