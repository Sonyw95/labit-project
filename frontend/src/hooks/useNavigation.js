import {navigationApi} from "@/api/navigationApi.js";
import {useApi} from "@/hooks/useApi.js";
import useApiStore from "@/stores/apiStore.js";

export const useNavigation = () => {
    const {createQuery} = useApi();

    const {
        navigationItems,
        setNavigationItems,
        setNavigationLoading,
        setNavigationError,
        user
    } = useApiStore();

    const { data, isLoading, error, refetch, isRefetching } = createQuery(
        ['navigation', user?.role],
        async () => {
            setNavigationLoading(true);
            try {
                const response = user?.role === 'ADMIN'
                    ? await navigationApi.getAdminNavigationItems()
                    : await navigationApi.getNavigationItems();

                const items = response.data;
                setNavigationItems(items);
                setNavigationError(null);
                return items;
            } catch (err) {
                setNavigationError(err.message);
                throw err;
            } finally {
                setNavigationLoading(false);
            }
        },
        {
            enabled: !!user,
            staleTime: 5 * 60 * 1000, // 5분
            cacheTime: 10 * 60 * 1000, // 10분
            retry: 2,
            refetchOnWindowFocus: false,
        }
    )
    return {
        navigationItems: data || navigationItems,
        isLoading: isLoading || isRefetching,
        error,
        refetch,
    };
};