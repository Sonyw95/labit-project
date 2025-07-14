import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useApiStore = create(
    devtools(
        persist(
            (set, get) => ({
                // Loading states
                isLoading: false,
                navigationLoading: false,
                authLoading: false,

                // Error states
                error: null,
                navigationError: null,
                authError: null,

                // Navigation data
                navigationItems: [],

                // Auth data (persist 미들웨어가 자동으로 localStorage 관리)
                user: null,
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null,

                // Actions
                setLoading: (isLoading) => set({ isLoading }),
                setNavigationLoading: (navigationLoading) => set({ navigationLoading }),
                setAuthLoading: (authLoading) => set({ authLoading }),

                setError: (error) => set({ error }),
                setNavigationError: (navigationError) => set({ navigationError }),
                setAuthError: (authError) => set({ authError }),

                clearError: () => set({ error: null, navigationError: null, authError: null }),

                // Navigation actions
                setNavigationItems: (navigationItems) => set({ navigationItems }),

                // Auth actions (persist가 자동으로 localStorage 처리)
                setAuth: (authData) => set({
                    user: authData.userInfo,
                    isAuthenticated: true,
                    accessToken: authData.accessToken,
                    refreshToken: authData.refreshToken,
                }),

                clearAuth: () => set({
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                    refreshToken: null,
                }),

                updateUser: (userInfo) => set({ user: userInfo }),

                // Reset all states
                reset: () => set({
                    isLoading: false,
                    navigationLoading: false,
                    authLoading: false,
                    error: null,
                    navigationError: null,
                    authError: null,
                    navigationItems: [],
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                    refreshToken: null,
                }),
            }),
            {
                name: 'api-store',
                // 🔥 persist할 상태만 선택 (중요한 상태만 저장)
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                }),
                // 🔥 버전 관리 (스키마 변경 시 유용)
                version: 1,
                // 🔥 마이그레이션 함수 (필요시)
                migrate: (persistedState, version) => {
                    if (version === 0) {
                        // 이전 버전에서 마이그레이션 로직
                        return {
                            ...persistedState,
                            // 새로운 필드 추가 등
                        };
                    }
                    return persistedState;
                },
            }
        ),
        {
            name: 'api-store-devtools',
        }
    )
);

