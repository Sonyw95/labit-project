// Hook for managing infinite scroll state
import {useCallback, useState} from "react";

export const useInfiniteScroll = (loadMore, options = {}) => {
    const {
        initialData = [],
        pageSize = 10,
        enabled = true,
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const load = useCallback(async (pageNum = page) => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const result = await loadMore(pageNum, pageSize);

            if (Array.isArray(result)) {
                setData(prev => pageNum === 0 ? result : [...prev, ...result]);
                setHasMore(result.length === pageSize);
                setPage(pageNum + 1);
            } else if (result && typeof result === 'object') {
                // Handle paginated response
                const { items, total, hasNext } = result;
                setData(prev => pageNum === 0 ? items : [...prev, ...items]);
                setHasMore(hasNext !== undefined ? hasNext : items.length === pageSize);
                setPage(pageNum + 1);
            }
        } catch (err) {
            setError(err);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loadMore, page, pageSize, enabled]);

    const refresh = useCallback(() => {
        setPage(0);
        setData([]);
        setHasMore(true);
        setError(null);
        load(0);
    }, [load]);

    const retry = useCallback(() => {
        setError(null);
        load();
    }, [load]);

    return {
        data,
        loading,
        error,
        hasMore,
        load,
        refresh,
        retry,
    };
};