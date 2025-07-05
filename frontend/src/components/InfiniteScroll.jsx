import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Stack,
    Center,
    Loader,
    Text,
    Button,
    Alert,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconRefresh,
} from '@tabler/icons-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const InfiniteScroll = ({
                            data = [],
                            renderItem,
                            loadMore,
                            hasMore = true,
                            loading = false,
                            error = null,
                            threshold = 0.1,
                            rootMargin = '100px',
                            initialLoad = true,
                            loadingComponent,
                            errorComponent,
                            endComponent,
                            emptyComponent,
                            onRetry,
                            gap = 'md',
                            ...props
                        }) => {
    const [items, setItems] = useState(data);
    const [isLoading, setIsLoading] = useState(loading);
    const [loadError, setLoadError] = useState(error);
    const [page, setPage] = useState(1);

    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    // Intersection observer for loading trigger
    const { elementRef: triggerRef, isIntersecting } = useIntersectionObserver({
        threshold,
        rootMargin,
    });

    // Update items when data prop changes
    useEffect(() => {
        setItems(data);
    }, [data]);

    // Handle loading more items
    const handleLoadMore = useCallback(async () => {
        if (isLoading || !hasMore || loadError) return;

        setIsLoading(true);
        setLoadError(null);

        try {
            const newItems = await loadMore(page);

            if (Array.isArray(newItems)) {
                setItems(prev => [...prev, ...newItems]);
                setPage(prev => prev + 1);
            }
        } catch (err) {
            setLoadError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [loadMore, page, isLoading, hasMore, loadError]);

    // Trigger load more when intersection observer fires
    useEffect(() => {
        if (isIntersecting && hasMore && !isLoading) {
            handleLoadMore();
        }
    }, [isIntersecting, hasMore, isLoading, handleLoadMore]);

    // Initial load
    useEffect(() => {
        if (initialLoad && items.length === 0 && !isLoading && !loadError) {
            handleLoadMore();
        }
    }, [initialLoad, items.length, isLoading, loadError, handleLoadMore]);

    // Retry function
    const handleRetry = () => {
        setLoadError(null);
        if (onRetry) {
            onRetry();
        } else {
            handleLoadMore();
        }
    };

    // Custom loading component
    const LoadingComponent = loadingComponent || (() => (
        <Center py="xl">
            <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">
                    데이터를 불러오는 중...
                </Text>
            </Stack>
        </Center>
    ));

    // Custom error component
    const ErrorComponent = errorComponent || (({ error, onRetry }) => (
        <Center py="xl">
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="오류 발생"
                color="red"
                style={{ maxWidth: 400 }}
            >
                <Stack gap="sm">
                    <Text size="sm">
                        {error}
                    </Text>
                    <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconRefresh size={14} />}
                        onClick={onRetry}
                    >
                        다시 시도
                    </Button>
                </Stack>
            </Alert>
        </Center>
    ));

    // Custom end component
    const EndComponent = endComponent || (() => (
        <Center py="xl">
            <Stack align="center" gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                    모든 항목을 불러왔습니다
                </Text>
                <Box
                    style={{
                        width: 40,
                        height: 2,
                        background: dark ? '#30363d' : '#e5e7eb',
                        borderRadius: 1,
                    }}
                />
            </Stack>
        </Center>
    ));

    // Custom empty component
    const EmptyComponent = emptyComponent || (() => (
        <Center py="xl">
            <Stack align="center" gap="sm">
                <Box
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: dark ? '#21262d' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                    }}
                >
                    📭
                </Box>
                <Text size="sm" c="dimmed">
                    표시할 항목이 없습니다
                </Text>
            </Stack>
        </Center>
    ));

    // Show empty state
    if (items.length === 0 && !isLoading && !loadError) {
        return <EmptyComponent />;
    }

    return (
        <Stack gap={gap} {...props}>
            {/* Render items */}
            {items.map((item, index) => (
                <Box key={item.id || index}>
                    {renderItem(item, index)}
                </Box>
            ))}

            {/* Loading state */}
            {isLoading && <LoadingComponent />}

            {/* Error state */}
            {loadError && !isLoading && (
                <ErrorComponent error={loadError} onRetry={handleRetry} />
            )}

            {/* End state */}
            {!hasMore && !isLoading && !loadError && items.length > 0 && (
                <EndComponent />
            )}

            {/* Intersection trigger */}
            {hasMore && !isLoading && !loadError && (
                <Box ref={triggerRef} style={{ height: 1 }} />
            )}
        </Stack>
    );
};

// Higher-order component for easier usage
export const withInfiniteScroll = (Component) => {
    return (props) => {
        const {
            data,
            loadMore,
            hasMore,
            loading,
            error,
            renderItem,
            ...rest
        } = props;

        const defaultRenderItem = (item, index) => (
            <Component key={item.id || index} item={item} index={index} {...rest} />
        );

        return (
            <InfiniteScroll
                data={data}
                loadMore={loadMore}
                hasMore={hasMore}
                loading={loading}
                error={error}
                renderItem={renderItem || defaultRenderItem}
            />
        );
    };
};



export default InfiniteScroll;