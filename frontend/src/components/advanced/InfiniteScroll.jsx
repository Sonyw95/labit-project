import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useEffect, useMemo, useRef} from "react";
import {useIntersectionObserver} from "@/hooks/useIntersectionObserver.js";
import {ActionIcon, Box, Card, Container, Group, rem, Skeleton, Stack} from "@mantine/core";
import {IconArrowUp} from "@tabler/icons-react";



const SkeletonItem = ({ theme }) => (
    <Card
        style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
        }}
        p="lg"
        radius="md"
    >
        <Group align="flex-start" gap="md">
            <Skeleton height={120} width={200} radius="md" />
            <Box style={{ flex: 1 }}>
                <Skeleton height={20} width="80%" mb="xs" />
                <Skeleton height={16} width="60%" mb="sm" />
                <Skeleton height={14} width="40%" />
            </Box>
        </Group>
    </Card>
);

const ErrorState = ({ message, onRetry, theme }) => (
    <Card
        style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
        }}
        p="xl"
        radius="md"
    >
        <Stack align="center" gap="md">
            <Text style={{ color: theme.colors.text.secondary }}>
                {message}
            </Text>
            {onRetry && (
                <ActionIcon
                    variant="light"
                    size="lg"
                    onClick={onRetry}
                    style={{ color: theme.colors.primary }}
                >
                    <IconArrowUp size={20} />
                </ActionIcon>
            )}
        </Stack>
    </Card>
);
export const InfiniteScroll = ({
                                   items = [],
                                   renderItem,
                                   loadMore,
                                   hasNextPage = true,
                                   isLoading = false,
                                   isError = false,
                                   onRetry,
                                   threshold = 200,
                                   skeletonCount = 3,
                                   emptyMessage = "항목이 없습니다.",
                                   errorMessage = "데이터를 불러오는 중 오류가 발생했습니다.",
                                   ...props
                               }) => {
    const { theme } = useTheme();
    const loadingRef = useRef(null);
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        rootMargin: `${threshold}px`,
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isLoading && !isError) {
            loadMore?.();
        }
    }, [entry?.isIntersecting, hasNextPage, isLoading, isError, loadMore]);

    useEffect(() => {
        ref(loadingRef.current);
    }, [ref]);

    const skeletonItems = useMemo(() =>
            Array.from({ length: skeletonCount }, (_, index) => (
                <SkeletonItem key={`skeleton-${index}`} theme={theme} />
            ))
        , [skeletonCount, theme]);

    if (items.length === 0 && !isLoading && !isError) {
        return (
            <Container {...props}>
                <Box style={{ textAlign: 'center', padding: rem(40) }}>
                    <Text size="lg" style={{ color: theme.colors.text.secondary }}>
                        {emptyMessage}
                    </Text>
                </Box>
            </Container>
        );
    }

    return (
        <Container {...props}>
            <Stack gap="md">
                {items.map((item, index) => (
                    <Box key={item.id || index}>
                        {renderItem(item, index)}
                    </Box>
                ))}

                {isLoading && skeletonItems}

                {isError && (
                    <ErrorState
                        message={errorMessage}
                        onRetry={onRetry}
                        theme={theme}
                    />
                )}

                {hasNextPage && !isLoading && !isError && (
                    <Box ref={loadingRef} style={{ height: rem(20) }} />
                )}
            </Stack>
        </Container>
    );
};