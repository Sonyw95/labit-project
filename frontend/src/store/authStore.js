// ============= Zustand 스토어 =============

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {AuthService} from "@/types/auth.js";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                error: null
            }),

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            login: async (credentials, type) => {
                try {
                    set({ isLoading: true, error: null });
                    let response;
                    switch( type ){
                        case 'normal':
                            response = await AuthService.login(credentials);
                            break
                        case 'kakao':
                            response = await AuthService.loginKakao(credentials);
                            break
                    }

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

            logout: async () => {
                try {
                    await AuthService.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: null
                    });
                }
            },
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
