// stores/apiStore.js - Zustand 스토어
import { create } from 'zustand';
import { persist} from 'zustand/middleware';

export const useApiStore = create(
    persist(
        (set, get) => ({
            // 로딩 상태 관리
            loading: {},
            errors: {},

            setLoading: (key, loading) =>
                set((state) => ({
                    loading: { ...state.loading, [key]: loading }
                }), false, 'setLoading'),

            setError: (key, error) =>
                set((state) => ({
                    errors: { ...state.errors, [key]: error }
                }), false, 'setError'),

            clearError: (key) =>
                set((state) => {
                    const {  ...rest } = state.errors;
                    return { errors: rest };
                }, false, 'clearError'),

            clearAllErrors: () =>
                set({ errors: {} }, false, 'clearAllErrors'),

            // API 요청 래퍼
            apiRequest: async (key, apiCall) => {
                const { setLoading, setError, clearError } = get();

                setLoading(key, true);
                clearError(key);

                try {
                    const result = await apiCall();
                    return { success: true, data: result.data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message;
                    setError(key, errorMessage);
                    return { success: false, error: errorMessage };
                } finally {
                    setLoading(key, false);
                }
            }
        }),
        { name: 'api-store' }
    )
);