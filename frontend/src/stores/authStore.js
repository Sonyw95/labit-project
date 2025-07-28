// stores/authStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { authService } from '@/api/service';

const useAuthStore = create(
    subscribeWithSelector((set, get) => ({
        // 상태
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: Date.now(),
        tokenExpiryTime: null,

        // 액션
        login: (token, user = null) => {
            const state = get();

            // 중복 로그인 방지
            if (state.isAuthenticated && state.accessToken === token) {
                return;
            }

            // 토큰 만료 시간 계산 (30분)
            const expiryTime = Date.now() + (30 * 60 * 1000);

            set({
                accessToken: token,
                user,
                isAuthenticated: true,
                error: null,
                lastActivity: Date.now(),
                tokenExpiryTime: expiryTime
            });

            // 로컬 스토리지 저장 (선택적)
            localStorage.setItem('accessToken', token);
            localStorage.setItem('tokenExpiryTime', expiryTime.toString());
        },

        logout: () => {
            const state = get();

            // 이미 로그아웃 상태면 중복 실행 방지
            if (!state.isAuthenticated) {
                return;
            }

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                error: null,
                lastActivity: Date.now(),
                tokenExpiryTime: null
            });

            // 로컬 스토리지 정리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenExpiryTime');
        },

        setUser: (user) => {
            set({ user });
        },

        setError: (error) => {
            set({ error });
        },

        setLoading: (loading) => {
            set({ isLoading: loading });
        },

        updateLastActivity: () => {
            set({ lastActivity: Date.now() });
        },

        // 토큰 유효성 검사
        checkTokenValidity: () => {
            const { tokenExpiryTime, accessToken } = get();

            if (!accessToken || !tokenExpiryTime) {
                return false;
            }

            return Date.now() < tokenExpiryTime;
        },

        // 토큰 갱신
        refreshToken: async () => {
            const { accessToken, isAuthenticated } = get();

            if (!isAuthenticated || !accessToken) {
                return false;
            }

            try {
                set({ isLoading: true });

                const response = await authService.refreshToken();

                if (response?.accessToken) {
                    const expiryTime = Date.now() + (30 * 60 * 1000);

                    set({
                        accessToken: response.accessToken,
                        tokenExpiryTime: expiryTime,
                        lastActivity: Date.now(),
                        isLoading: false
                    });

                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('tokenExpiryTime', expiryTime.toString());

                    return true;
                }

                throw new Error('토큰 갱신 실패');

            } catch (error) {
                console.error('토큰 갱신 실패:', error);
                get().logout();
                set({ isLoading: false });
                return false;
            }
        },

        // 초기화 (앱 시작 시)
        initialize: async () => {
            const token = localStorage.getItem('accessToken');
            const expiryTime = localStorage.getItem('tokenExpiryTime');

            if (!token || !expiryTime) {
                return;
            }

            // 토큰 만료 확인
            if (Date.now() >= parseInt(expiryTime, 10)) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('tokenExpiryTime');
                return;
            }

            try {
                set({ isLoading: true });

                // 토큰 유효성 검증
                const isValid = await authService.validateToken();

                if (isValid) {
                    // 사용자 정보 조회
                    const userInfo = await authService.getUserInfo();

                    set({
                        accessToken: token,
                        user: userInfo,
                        isAuthenticated: true,
                        tokenExpiryTime: parseInt(expiryTime, 10),
                        lastActivity: Date.now(),
                        isLoading: false
                    });
                } else {
                    throw new Error('유효하지 않은 토큰');
                }

            } catch (error) {
                console.error('초기화 실패:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('tokenExpiryTime');
                set({ isLoading: false });
            }
        }
    }))
);

export default useAuthStore;