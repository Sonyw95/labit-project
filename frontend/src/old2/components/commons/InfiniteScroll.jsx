import React, { useEffect, useCallback, useMemo } from 'react';
import { Stack, Loader, Center, Text, Button } from '@mantine/core';
import {useIntersectionObserver} from "@/hooks/useIntersectionObserver.js";

const InfiniteScroll = ({
                            children,
                            hasNextPage = false,
                            isFetchingNextPage = false,
                            fetchNextPage,
                            error = null,
                            loadingComponent,
                            errorComponent,
                            endMessage = '모든 콘텐츠를 불러왔습니다.',
                            threshold = 0.1,
                            rootMargin = '100px',
                        }) => {
    const { elementRef, isIntersecting } = useIntersectionObserver({
        threshold,
        rootMargin,
    });

    // 다음 페이지 로드
    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage && !error) {
            fetchNextPage?.();
        }
    }, [hasNextPage, isFetchingNextPage, error, fetchNextPage]);

    // 교차점 감지 시 로드
    useEffect(() => {
        if (isIntersecting) {
            handleLoadMore();
        }
    }, [isIntersecting, handleLoadMore]);

    // 로딩 컴포넌트
    const LoadingComponent = useMemo(() => {
        if (loadingComponent) return loadingComponent;

        return (
            <Center py="xl">
                <Stack align="center" gap="sm">
                    <Loader size="md" />
                    <Text size="sm" c="dimmed">콘텐츠를 불러오는 중...</Text>
                </Stack>
            </Center>
        );
    }, [loadingComponent]);

    // 에러 컴포넌트
    const ErrorComponent = useMemo(() => {
        if (errorComponent) return errorComponent;

        return (
            <Center py="xl">
                <Stack align="center" gap="sm">
                    <Text size="sm" c="red">콘텐츠를 불러오는 중 오류가 발생했습니다.</Text>
                    <Button size="xs" variant="light" onClick={handleLoadMore}>
                        다시 시도
                    </Button>
                </Stack>
            </Center>
        );
    }, [errorComponent, handleLoadMore]);

    return (
        <div>
            {children}

            {/* 트리거 엘리먼트 */}
            <div ref={elementRef} style={{ height: '1px' }} />

            {/* 상태별 컴포넌트 렌더링 */}
            {isFetchingNextPage && LoadingComponent}
            {error && ErrorComponent}
            {!hasNextPage && !isFetchingNextPage && !error && (
                <Center py="xl">
                    <Text size="sm" c="dimmed">{endMessage}</Text>
                </Center>
            )}
        </div>
    );
};

export default InfiniteScroll;