// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {KakaoAuth} from "../api/KakaoAuth.js";
import {AuthService} from "../api/auth.js";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // 사용자 설정
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                error: null
            }),

            // 로딩 상태 설정
            setLoading: (isLoading) => set({ isLoading }),

            // 에러 설정
            setError: (error) => set({ error }),

            // 에러 초기화
            clearError: () => set({ error: null }),

            // 카카오 로그인
            loginWithKakao: async () => {
                try {
                    set({ isLoading: true, error: null });

                    // 카카오 로그인 팝업 열기
                    const code = await KakaoAuth.openKakaoLoginPopup();

                    // 인증 코드로 로그인 처리
                    const response = await KakaoAuth.loginWithKakaoCode(code);

                    // 토큰 저장
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);

                    // 사용자 정보 저장
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                } catch (error) {
                    set({
                        error: error.message || '카카오 로그인에 실패했습니다.',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 로그인
            login: async (credentials) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await AuthService.login(credentials);
                    // 토큰 저장
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);

                    // 사용자 정보 저장
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false
                    });

                } catch (error) {
                    set({
                        error: error.response?.data?.message || '로그인에 실패했습니다.',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 로그아웃
            logout: async () => {
                try {
                    set({ isLoading: true });

                    // 서버에 로그아웃 요청
                    await KakaoAuth.logout();

                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // 로컬 스토리지 정리
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    // 상태 초기화
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            // 토큰 유효성 확인
            checkAuthToken: () => {
                const token = localStorage.getItem('accessToken');
                const user = get().user;

                if (token && user) {
                    set({ isAuthenticated: true });
                } else {
                    set({
                        user: null,
                        isAuthenticated: false
                    });
                }
            },

            // 사용자 정보 새로고침
            refreshUserInfo: async () => {
                try {
                    const userInfo = await KakaoAuth.getCurrentUser();
                    set({ user: userInfo });
                } catch (error) {
                    console.error('Failed to refresh user info:', error);
                    // 토큰이 유효하지 않으면 로그아웃
                    get().logout();
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);