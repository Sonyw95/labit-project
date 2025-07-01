import {useEffect, useRef, useState} from "react";
import {Box, rem} from "@mantine/core";

export const InfiniteScroll = ({
                                   children,
                                   hasMore,
                                   loading,
                                   onLoadMore,
                                   threshold = 100,
                                   loader,
                                   endMessage,
                               }) => {
    const [isFetching, setIsFetching] = useState(false);
    const sentinelRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !loading && !isFetching) {
                    setIsFetching(true);
                    onLoadMore();
                }
            },
            { rootMargin: `${threshold}px` }
        );

        const sentinel = sentinelRef.current;
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [hasMore, loading, isFetching, onLoadMore, threshold]);

    useEffect(() => {
        if (!loading) {
            setIsFetching(false);
        }
    }, [loading]);

    return (
        <Box>
            {children}

            {hasMore && (
                <div ref={sentinelRef}>
                    {loading && (
                        loader || (
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: rem(20),
                                }}
                            >
                                <Box
                                    style={{
                                        width: rem(24),
                                        height: rem(24),
                                        border: '3px solid #e5e7eb',
                                        borderTop: '3px solid #3b82f6',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                    }}
                                />
                            </Box>
                        )
                    )}
                </div>
            )}

            {!hasMore && (
                endMessage || (
                    <Box
                        style={{
                            textAlign: 'center',
                            padding: rem(20),
                            color: '#9ca3af',
                        }}
                    >
                        <Text size="sm">모든 콘텐츠를 불러왔습니다</Text>
                    </Box>
                )
            )}
        </Box>
    );
};
