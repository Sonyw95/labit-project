import { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
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
    Tooltip,
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
            <Container size="lg">
                <Center h={400}>
                    <Stack align="center" spacing="md">
                        <Loader size="lg" />
                        <Text>포스트를 불러오는 중...</Text>
                    </Stack>
                </Center>
            </Container>
        );
    }

    // 에러 상태
    if (isError) {
        return (
            <Container size="lg">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="포스트 로드 실패"
                    color="red"
                    action={
                        <ActionIcon variant="light" color="red" onClick={() => refetch()}>
                            <IconRefresh size={16} />
                        </ActionIcon>
                    }
                >
                    {error?.message || '포스트를 불러오는 중 오류가 발생했습니다.'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="lg">
            <Stack spacing="xl">
                {/* Breadcrumbs */}

                {/* 카테고리 탭 */}
                <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="pills"
                >
                    <Tabs.List>
                        {categoryOptions.map((category) => (
                            <Tabs.Tab key={category.id} value={category.id}>
                                {category.label}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs>

                {/* 포스트 그리드 */}
                {visiblePosts.length === 0 ? (
                    <Center h={300}>
                        <Text size="lg" c="dimmed">
                            {selectedCategory === 'all'
                                ? '아직 작성된 포스트가 없습니다.'
                                : '해당 카테고리에 포스트가 없습니다.'
                            }
                        </Text>
                    </Center>
                ) : (
                    <Grid>
                        {visiblePosts.map((post, index) => (
                            <Grid.Col key={`${post.id}-${index}`} span={{ base: 12, sm: 6, lg: 4 }}>
                                <Transition
                                    mounted
                                    transition="fade"
                                    duration={300}
                                    timingFunction="ease"
                                >
                                    {(styles) => (
                                        <div style={styles}>
                                            <PostCard post={post} />
                                        </div>
                                    )}
                                </Transition>
                            </Grid.Col>
                        ))}
                    </Grid>
                )}

                {/* 무한 스크롤 로더 */}
                {!showPagination && hasNextPage && (
                    <Center>
                        <Group>
                            {isFetchingNextPage ? (
                                <Loader size="md" />
                            ) : (
                                <Tooltip label="스크롤하여 더 많은 포스트 보기">
                                    <ActionIcon
                                        size="lg"
                                        variant="light"
                                        onClick={handleLoadMore}
                                    >
                                        <IconRefresh size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </Group>
                    </Center>
                )}

                {/* 페이지네이션 */}
                {showPagination && totalPages > 1 && (
                    <Center>
                        <Pagination
                            value={currentPage}
                            onChange={setCurrentPage}
                            total={totalPages}
                            size="md"
                            withEdges
                            siblings={2}
                        />
                    </Center>
                )}
            </Stack>
        </Container>
    );
}

export default PostList;