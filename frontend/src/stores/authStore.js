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

            // 새로운 상태 - 초기화 관리
            isInitialized: false, // persist 로딩 완료 여부
            lastValidation: null,
            validationCache: new Map(),
            isValidating: false,

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

            // 로그아웃 (캐시 클리어 추가)
            logout: () => {
                // 캐시 클리어
                get().validationCache.clear();

                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                    isLoading: false,
                    lastValidation: null,
                    isValidating: false,
                });

                console.log('로그아웃 완료');
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

            // **새로고침 안전 토큰 검증** - 서버 검증 없이 클라이언트만
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

                // 클라이언트 측 토큰 만료 확인만 (서버 요청 없음)
                if (isTokenExpired(accessToken)) {
                    console.log('토큰 만료됨, 로그아웃 처리');
                    get().logout();
                    set({ isInitialized: true });
                    return false;
                }

                // 토큰에서 사용자 정보 추출
                const user = extractUserFromToken(accessToken);
                if (!user) {
                    console.log('사용자 정보 추출 실패, 로그아웃 처리');
                    get().logout();
                    set({ isInitialized: true });
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

            // **개선된 토큰 검증** - 서버 검증 포함
            validateStoredTokens: async () => {
                const state = get();
                const { accessToken, lastValidation, validationCache, isValidating, isInitialized } = state;

                // 초기화 완료 전에는 검증하지 않음
                if (!isInitialized) {
                    console.log('아직 초기화되지 않음, 검증 건너뛰기');
                    return false;
                }

                if (!accessToken) {
                    set({ isAuthenticated: false });
                    return false;
                }

                // 이미 검증 중이면 중복 실행 방지
                if (isValidating) {
                    return true;
                }

                // 성능 최적화: 최근 2분 이내에 검증했으면 건너뛰기
                const now = Date.now();
                if (lastValidation && (now - lastValidation) < 2 * 60 * 1000) {
                    return true;
                }

                // 캐시 확인 (5분 캐시)
                const cacheKey = accessToken.substring(0, 20);
                const cached = validationCache.get(cacheKey);
                if (cached && (now - cached.timestamp) < 5 * 60 * 1000) {
                    if (!cached.result) {
                        throw new Error('캐시된 검증 실패');
                    }
                    set({ lastValidation: now });
                    return true;
                }

                set({ isValidating: true });

                try {
                    // 1단계: 클라이언트 측 토큰 만료 확인
                    if (state.isTokenExpired(accessToken)) {
                        throw new Error('토큰이 만료되었습니다');
                    }

                    // 2단계: 서버 검증 (선택적)
                    // 중요한 작업이 아니면 서버 검증 생략
                    // try {
                    //     const response = await fetch('/api/auth/validate', {
                    //         headers: { Authorization: `Bearer ${accessToken}` },
                    //         signal: AbortSignal.timeout(3000) // 3초 타임아웃
                    //     });
                    //
                    //     if (!response.ok) {
                    //         throw new Error('서버 검증 실패');
                    //     }
                    // } catch (serverError) {
                    //     console.warn('서버 검증 실패, 클라이언트 검증으로 진행:', serverError.message);
                    // }

                    // 성공적인 검증 결과 캐시
                    validationCache.set(cacheKey, { result: true, timestamp: now });

                    set({
                        lastValidation: now,
                        isValidating: false,
                        isAuthenticated: true
                    });

                    return true;

                } catch (error) {
                    // 실패 결과 짧은 시간 캐시
                    validationCache.set(cacheKey, { result: false, timestamp: now });

                    set({ isValidating: false });
                    console.error('토큰 검증 실패:', error.message);
                    throw error;
                }
            },

            setAdminInfo: (adminInfo) => {
                set({
                    adminInfo,
                    adminInfoLoading: false,
                    adminInfoError: null,
                    adminInfoLastUpdated: Date.now(),
                });
                console.log('관리자 정보 저장 완료:', adminInfo.name);
            },

            // 관리자 정보 로딩 상태 설정
            setAdminInfoLoading: (loading) => {
                set({ adminInfoLoading: loading });
            },

            // 관리자 정보 에러 설정
            setAdminInfoError: (error) => {
                set({
                    adminInfoError: error,
                    adminInfoLoading: false,
                });
                console.error('관리자 정보 에러:', error);
            },

            // 관리자 정보 새로고침 필요 여부 확인 (10분마다)
            shouldRefreshAdminInfo: () => {
                const { adminInfoLastUpdated } = get();
                if (!adminInfoLastUpdated) {
                    return true;
                }

                const now = Date.now();
                const tenMinutes = 10 * 60 * 1000;
                return (now - adminInfoLastUpdated) > tenMinutes;
            },

            // 관리자 정보 초기화
            clearAdminInfo: () => {
                set({
                    adminInfo: null,
                    adminInfoLoading: false,
                    adminInfoError: null,
                    adminInfoLastUpdated: null,
                });
            },

            // 관리자 정보 부분 업데이트
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
                console.log('관리자 정보 업데이트:', updates);
            },


            // Getter 함수들
            getUser: () => get().user,
            getAccessToken: () => get().accessToken,
            getRefreshToken: () => get().refreshToken,
            getIsAuthenticated: () => get().isAuthenticated,
            getIsAdmin: () => get().isAdmin,
            getIsLoading: () => get().isLoading,

            // 관리자 정보 Getter들
            getAdminInfo: () => get().adminInfo,
            getAdminInfoLoading: () => get().adminInfoLoading,
            getAdminInfoError: () => get().adminInfoError,

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

                adminInfo: state.adminInfo,
                adminInfoLastUpdated: state.adminInfoLastUpdated,
            }),
            // persist 로딩 완료 시 콜백
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // persist 로딩 완료 후 토큰 검증
                    console.log('Persist 로딩 완료, 토큰 검증 시작');
                    state.validateTokensOnRefresh();
                }
            },
        }
    )
);



export default useAuthStore;
