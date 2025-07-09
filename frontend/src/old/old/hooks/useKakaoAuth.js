import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export const useKakaoLoginMutation = () => {
    const { loginWithKakao } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginWithKakao,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
        onError: (error) => {
            console.error('Kakao login mutation error:', error);
        }
    });
};

export const useKakaoLogoutMutation = () => {
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
        },
        onError: (error) => {
            console.error('Kakao logout mutation error:', error);
        }
    });
};