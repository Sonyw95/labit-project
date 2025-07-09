// InfiniteScroll 컴포넌트
import {memo, useEffect, useState} from "react";
import {useTheme} from "../../hooks/useTheme.js";
import {useIntersectionObserver} from "../../hooks/useIntersectionObserver.js";
import {ActionIcon, Box, Loader} from "@mantine/core";

const InfiniteScroll = memo(({
                                 children,
                                 hasMore = true,
                                 loading = false,
                                 onLoadMore,
                                 threshold = 100,
                                 loader = <Loader size="md" />,
                                 endMessage = "더 이상 불러올 데이터가 없습니다.",
                                 error = null,
                                 onRetry,
                                 ...props
                             }) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const { dark } = useTheme();

    const { ref } = useIntersectionObserver({
        threshold: 0,
        rootMargin: `${threshold}px`,
    });

    useEffect(() => {
        if (isIntersecting && hasMore && !loading && !error) {
            onLoadMore?.();
        }
    }, [isIntersecting, hasMore, loading, error, onLoadMore]);

    return (
        <Box {...props}>
            {children}

            {/* 로딩 트리거 */}
            <Box ref={ref} style={{ height: 1 }} />

            {/* 로딩 상태 */}
            {loading && (
                <Box p="xl" style={{ textAlign: 'center' }}>
                    {loader}
                </Box>
            )}

            {/* 에러 상태 */}
            {error && (
                <Box p="xl" style={{ textAlign: 'center' }}>
                    <Text size="sm" c="red" mb="md">
                        {error}
                    </Text>
                    {onRetry && (
                        <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={onRetry}
                            size="lg"
                        >
                            재시도
                        </ActionIcon>
                    )}
                </Box>
            )}

            {/* 끝 메시지 */}
            {!hasMore && !loading && !error && (
                <Box p="xl" style={{ textAlign: 'center' }}>
                    <Text size="sm" c="dimmed">
                        {endMessage}
                    </Text>
                </Box>
            )}
        </Box>
    );
});

InfiniteScroll.displayName = 'InfiniteScroll';

export default InfiniteScroll;