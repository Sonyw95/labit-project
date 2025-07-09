import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {AuthService} from "../api/auth.js";
import {useAuthStore} from "../store/authStore.js";

export const useAuthQuery = () => {
    const { user, isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ['auth', 'user'],
        queryFn: AuthService.getCurrentUser,
        enabled: isAuthenticated && !!localStorage.getItem('accessToken'),
        staleTime: 5 * 60 * 1000, // 5분
        retry: false,
    });
};

export const useLoginMutation = () => {
    const { login } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
    });
};

export const useLogoutMutation = () => {
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
        },
    });
};
