import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

const useAuthStore = create(
    devtools(
        persist(
            (set, get) => ({
                // 상태
                isAuthenticated: false,
                accessToken: null,
                kakaoAccessToken: null,
                user: null,
                error: null,

                // 액션들
                login: (token, kakaoToken = null) =>
                    set({
                        isAuthenticated: true,
                        accessToken: token,
                        kakaoAccessToken: kakaoToken,
                    }),

                logout: () =>
                    set({
                        isAuthenticated: false,
                        accessToken: null,
                        kakaoAccessToken: null,
                        user: null,
                    }),

                setToken: (token) =>
                    set({
                        accessToken: token,
                        isAuthenticated: !!token,
                    }),

                setUser: (user) => set({ user }),

                setError: (error) => set({ error }),

                // 토큰 존재 여부 확인
                hasValidToken: () => {
                    const { accessToken } = get();
                    return !!accessToken;
                },

                // 사용자 역할 확인
                hasRole: (role) => {
                    const { user } = get();
                    if (!user || !user.role) {
                        return false;
                    }

                    const roles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
                    const userRoleIndex = roles.indexOf(user.role);
                    const requiredRoleIndex = roles.indexOf(role);

                    return userRoleIndex >= requiredRoleIndex;
                },

                // 관리자 여부 확인
                isAdmin: () => {
                    const { user } = get();
                    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
                },
            }),
            {
                name: 'auth-store',
                partialize: (state) => ({
                    isAuthenticated: state.isAuthenticated,
                    accessToken: state.accessToken,
                    kakaoAccessToken: state.kakaoAccessToken,
                }),
            }
        ),
        { name: 'auth-store' }
    )
);

export default useAuthStore;