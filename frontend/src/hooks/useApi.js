import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiStore } from '../stores/apiStore';

export const useApi = () => {
    const queryClient = useQueryClient();
    const { apiRequest } = useApiStore();

    const createQuery = (key, apiCall, options = {}) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useQuery({
            queryKey: Array.isArray(key) ? key : [key],
            queryFn: () => apiCall().then(res => res.data),
            ...options
        });
    };

    const createMutation = (apiCall, options = {}) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMutation({
            mutationFn: apiCall,
            onSuccess: (data, variables, context) => {
                if (options.invalidateQueries) {
                    queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
                }
                options.onSuccess?.(data, variables, context);
            },
            ...options
        });
    };

    return {
        createQuery,
        createMutation,
        apiRequest,
        queryClient
    };
};