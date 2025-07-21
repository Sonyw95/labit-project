import { create } from 'zustand';
import {devtools, persist} from 'zustand/middleware';

const useAppStore = create(
    devtools(
        persist(
            (set, get) => ({
                // UI 상태
                isLoading: false,
                notifications: [],

                // 액션들
                setLoading: (loading) => set({ isLoading: loading }),

                addNotification: (notification) =>
                    set((state) => ({
                        notifications: [...state.notifications, {
                            id: Date.now(),
                            ...notification
                        }]
                    })),

                removeNotification: (id) =>
                    set((state) => ({
                        notifications: state.notifications.filter(n => n.id !== id)
                    })),

                clearNotifications: () => set({ notifications: [] }),
            }),
            { name: 'app-store' }
        )
    )
);

export default useAppStore;