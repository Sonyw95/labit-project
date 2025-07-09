// ========================================
// components/advanced/InfiniteScroll/InfiniteScroll.jsx - 무한 스크롤
// ========================================
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center, Loader, Text, Button } from '@mantine/core';
import { useIntersectionObserver, useMountedState } from '../../hooks';

const InfiniteScroll = ({
                            children,
                            hasMore = true,
                            isLoading = false,
                            onLoadMore,
                            threshold = 0.1,
                            rootMargin = '100px',
                            loader = <Loader size="md" />,
                            endMessage = '모든 컨텐츠를 불러왔습니다.',
                            errorMessage = '데이터를 불러오는데 실패했습니다.',
                            retryText = '다시 시도',
                            onRetry,
                            error = null,
                            initialLoad = true,
                            ...props
                        }) => {
    const isMounted = useMountedState();
    const [hasTriggered, setHasTriggered] = useState(!initialLoad);

    const [setElement, isIntersecting] = useIntersectionObserver({
        threshold,
        rootMargin,
        freezeOnceVisible: false,
    });

    // 무한 스크롤 트리거
    useEffect(() => {
        if (isIntersecting && hasMore && !isLoading && !error && isMounted()) {
            if (!hasTriggered) {
                setHasTriggered(true);
            }
            onLoadMore?.();
        }
    }, [isIntersecting, hasMore, isLoading, error, onLoadMore, hasTriggered, isMounted]);

    const handleRetry = useCallback(() => {
        onRetry?.();
    }, [onRetry]);

    return (
        <Box {...props}>
            {children}

            {/* 로딩 트리거 요소 */}
            {hasMore && !error && (
                <Box
                    ref={setElement}
                    style={{
                        height: '20px',
                        margin: '20px 0',
                    }}
                />
            )}

            {/* 로딩 상태 */}
            {isLoading && (
                <Center py="xl">
                    {loader}
                </Center>
            )}

            {/* 에러 상태 */}
            {error && (
                <Center py="xl">
                    <Box style={{ textAlign: 'center' }}>
                        <Text size="sm" c="dimmed" mb="md">
                            {errorMessage}
                        </Text>
                        {onRetry && (
                            <Button variant="light" size="sm" onClick={handleRetry}>
                                {retryText}
                            </Button>
                        )}
                    </Box>
                </Center>
            )}

            {/* 끝 메시지 */}
            {!hasMore && !isLoading && !error && (
                <Center py="xl">
                    <Text size="sm" c="dimmed">
                        {endMessage}
                    </Text>
                </Center>
            )}
        </Box>
    );
};

export default InfiniteScroll;