import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Container,
    Stack,
    Tabs,
    Grid,
    Pagination,
    Center,
    Loader,
    Text,
    Alert,
    Transition,
    Group,
    ActionIcon,
    Box,
    useMantineColorScheme,
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import {useNavigationTree} from "@/hooks/api/useApi.js";
import {postService} from "@/api/service.js";
import PostCard from "@/components/section/post/PostCard.jsx";

const POSTS_PER_PAGE = 12;
const INFINITE_SCROLL_THRESHOLD = POSTS_PER_PAGE;

function PostList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { colorScheme } = useMantineColorScheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#FFFFFF',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
    };

    // 상태 관리
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [showPagination, setShowPagination] = useState(false);

    // 디바운스된 카테고리 (리렌더링 방지)
    const [debouncedCategory] = useDebouncedValue(selectedCategory, 300);

    // 네비게이션 데이터 조회
    const { data: navigationTree } = useNavigationTree();

    // 카테고리 옵션 생성 (중복 코드 방지)
    const categoryOptions = useMemo(() => {
        if (!navigationTree) {
            return [];
        }

        const categories = [{ id: 'all', label: '전체', href: null }];

        const extractCategories = (items) => {
            items.forEach(item => {
                if (item.href && item.href.startsWith('/posts/')) {
                    categories.push({
                        id: item.id.toString(),
                        label: item.label,
                        href: item.href,
                    });
                }
                if (item.children && item.children.length > 0) {
                    extractCategories(item.children);
                }
            });
        };

        extractCategories(navigationTree);
        return categories;
    }, [navigationTree]);

    // 포스트 데이터 조회 (무한 스크롤)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['posts', 'infinite', debouncedCategory],
        queryFn: ({ pageParam = 0 }) => {
            const params = { page: pageParam, size: POSTS_PER_PAGE };

            if (debouncedCategory === 'all') {
                return postService.getPosts(params);
            }
            return postService.getPostsByCategory(parseInt(debouncedCategory, 10), params);

        },
        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }
            return lastPage.number + 1;
        },
        enabled: !!debouncedCategory,
        staleTime: 5 * 60 * 1000,
        keepPreviousData: false,
    });

    // 전체 포스트 배열 생성
    const allPosts = useMemo(() => {
        if (!data) {
            return [];
        }
        return data.pages.flatMap(page => page.content || []);
    }, [data]);

    // URL에서 카테고리 초기화
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category') || 'all';
        setSelectedCategory(categoryFromUrl);
    }, [searchParams]);

    // 카테고리 변경 시 URL 업데이트
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);

        const newSearchParams = new URLSearchParams(searchParams);
        if (category === 'all') {
            newSearchParams.delete('category');
        } else {
            newSearchParams.set('category', category);
        }
        setSearchParams(newSearchParams);
    };

    // 포스트 표시 로직 (무한스크롤 vs 페이지네이션)
    useEffect(() => {
        if (!allPosts.length) {
            setVisiblePosts([]);
            setShowPagination(false);
            return;
        }

        if (allPosts.length <= INFINITE_SCROLL_THRESHOLD) {
            // 12개 이하: 무한 스크롤
            setVisiblePosts(allPosts);
            setShowPagination(false);
        } else {
            // 12개 초과: 페이지네이션
            const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
            const endIndex = startIndex + POSTS_PER_PAGE;
            setVisiblePosts(allPosts.slice(startIndex, endIndex));
            setShowPagination(true);
        }
    }, [allPosts, currentPage]);

    // 무한 스크롤 트리거
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage && allPosts.length <= INFINITE_SCROLL_THRESHOLD) {
            fetchNextPage();
        }
    };

    // 페이지네이션 계산
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    // 로딩 상태
    if (isLoading) {
        return (
            <Box bg={velogColors.background} style={{ minHeight: '100vh' }}>
                <Container size="lg" py="xl">
                    <Center h={400}>
                        <Stack align="center" gap="lg">
                            <Loader size="lg" color={velogColors.primary} />
                            <Text size="lg" c={velogColors.subText}>
                                포스트를 불러오는 중...
                            </Text>
                        </Stack>
                    </Center>
                </Container>
            </Box>
        );
    }

    // 에러 상태
    if (isError) {
        return (
            <Box bg={velogColors.background} style={{ minHeight: '100vh' }}>
                <Container size="lg" py="xl">
                    <Center>
                        <Box
                            p="xl"
                            style={{
                                backgroundColor: velogColors.hover,
                                border: `1px solid ${velogColors.border}`,
                                borderRadius: '12px',
                                textAlign: 'center',
                                maxWidth: '400px'
                            }}
                        >
                            <Stack align="center" gap="lg">
                                <IconAlertCircle size={48} color="red" />
                                <Text size="lg" fw={600} c={velogColors.text}>
                                    포스트 로드 실패
                                </Text>
                                <Text size="md" c={velogColors.subText}>
                                    {error?.message || '포스트를 불러오는 중 오류가 발생했습니다.'}
                                </Text>
                                <ActionIcon
                                    variant="filled"
                                    size="lg"
                                    onClick={() => refetch()}
                                    style={{ backgroundColor: velogColors.primary }}
                                >
                                    <IconRefresh size={20} />
                                </ActionIcon>
                            </Stack>
                        </Box>
                    </Center>
                </Container>
            </Box>
        );
    }

    return (
        <Box bg={velogColors.background} style={{ minHeight: '100vh' }}>
            <Container size="lg" py="xl">
                <Stack gap="3rem">
                    {/* velog 스타일 헤더 */}
                    <Group justify="space-between" align="center">
                        {/* 좌측: 정렬 탭 */}
                        <Tabs
                            value={selectedCategory === 'all' ? 'latest' : selectedCategory}
                            onChange={(value) => {
                                if (['latest', 'trending', 'week'].includes(value)) {
                                    setSelectedCategory('all');
                                } else {
                                    handleCategoryChange(value);
                                }
                            }}
                            variant="unstyled"
                            styles={{
                                list: {
                                    gap: '2rem',
                                },
                                tab: {
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: velogColors.subText,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: `3px solid transparent`,
                                    borderRadius: 0,
                                    padding: '0.5rem 0',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: velogColors.text,
                                        backgroundColor: 'transparent',
                                    },
                                    '&[data-active]': {
                                        color: velogColors.primary,
                                        borderBottomColor: velogColors.primary,
                                        backgroundColor: 'transparent',
                                    }
                                }
                            }}
                        >
                            <Tabs.List>
                                <Tabs.Tab value="latest">최신</Tabs.Tab>
                                <Tabs.Tab value="trending">트렌딩</Tabs.Tab>
                                <Tabs.Tab value="week">이번 주</Tabs.Tab>
                            </Tabs.List>
                        </Tabs>

                        {/* 우측: 카테고리 드롭다운 */}
                        {categoryOptions.length > 1 && (
                            <Group gap="md">
                                <Text size="sm" c={velogColors.subText}>카테고리:</Text>
                                <Box>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        style={{
                                            backgroundColor: velogColors.background,
                                            border: `1px solid ${velogColors.border}`,
                                            borderRadius: '6px',
                                            padding: '6px 12px',
                                            color: velogColors.text,
                                            fontSize: '14px',
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            cursor: 'pointer',
                                            outline: 'none',
                                        }}
                                    >
                                        {categoryOptions.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </Box>
                            </Group>
                        )}
                    </Group>

                    {/* 구분선 */}
                    <Box style={{ height: '1px', backgroundColor: velogColors.border, margin: '1rem 0' }} />

                    {/* 포스트 그리드 */}
                    {visiblePosts.length === 0 ? (
                        <Center py="6rem">
                            <Stack align="center" gap="lg">
                                <Text size="xl" c={velogColors.subText} fw={500}>
                                    {selectedCategory === 'all'
                                        ? '아직 작성된 포스트가 없어요'
                                        : '해당 카테고리에 포스트가 없어요'
                                    }
                                </Text>
                                <Text size="md" c={velogColors.subText}>
                                    첫 번째 포스트를 작성해보세요! ✍️
                                </Text>
                            </Stack>
                        </Center>
                    ) : (
                        <Grid gutter="xl">
                            {visiblePosts.map((post, index) => (
                                <Grid.Col
                                    key={`${post.id}-${index}`}
                                    span={{ base: 12, sm: 6, lg: 4 }}
                                    style={{ display: 'flex' }}
                                >
                                    <Transition
                                        mounted
                                        transition="fade-up"
                                        duration={300}
                                        timingFunction="ease"
                                    >
                                        {(styles) => (
                                            <div style={{ ...styles, width: '100%', display: 'flex' }}>
                                                <PostCard post={post} />
                                            </div>
                                        )}
                                    </Transition>
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}

                    {/* 무한 스크롤 로더 - velog 스타일 */}
                    {!showPagination && hasNextPage && (
                        <Center py="xl">
                            {isFetchingNextPage ? (
                                <Group gap="md">
                                    <Loader size="md" color={velogColors.primary} />
                                    <Text size="md" c={velogColors.subText}>
                                        더 많은 포스트 로딩중...
                                    </Text>
                                </Group>
                            ) : (
                                <ActionIcon
                                    size="xl"
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    style={{
                                        borderColor: velogColors.border,
                                        color: velogColors.primary,
                                        backgroundColor: velogColors.background,
                                        '&:hover': {
                                            backgroundColor: velogColors.hover,
                                            borderColor: velogColors.primary,
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = velogColors.hover;
                                        e.currentTarget.style.borderColor = velogColors.primary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = velogColors.background;
                                        e.currentTarget.style.borderColor = velogColors.border;
                                    }}
                                >
                                    <IconRefresh size={24} />
                                </ActionIcon>
                            )}
                        </Center>
                    )}

                    {/* 페이지네이션 - velog 스타일 */}
                    {showPagination && totalPages > 1 && (
                        <Center py="xl">
                            <Pagination
                                value={currentPage}
                                onChange={setCurrentPage}
                                total={totalPages}
                                size="lg"
                                withEdges
                                siblings={2}
                                styles={{
                                    control: {
                                        backgroundColor: velogColors.background,
                                        color: velogColors.text,
                                        border: `1px solid ${velogColors.border}`,
                                        '&:hover': {
                                            backgroundColor: velogColors.hover,
                                        },
                                        '&[data-active]': {
                                            backgroundColor: velogColors.primary,
                                            borderColor: velogColors.primary,
                                            color: 'white',
                                        }
                                    }
                                }}
                            />
                        </Center>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}

export default PostList;