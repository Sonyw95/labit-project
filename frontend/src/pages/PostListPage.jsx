import {memo, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {
    ActionIcon,
    Box,
    Center,
    Container,
    Group,
    Loader, Pagination, rem,
    Stack,
    Text,
    UnstyledButton,
    useMantineColorScheme
} from "@mantine/core";
import {useDebouncedValue} from "@mantine/hooks";
import {useNavigationTree} from "@/hooks/api/useApi.js";
import {useInfiniteQuery} from "@tanstack/react-query";
import {postService} from "@/api/service.js";
import {IconAlertCircle, IconRefresh} from "@tabler/icons-react";
import PostList from "@/components/section/post/PostList.jsx";

const POSTS_PER_PAGE = 12;
const INFINITE_SCROLL_THRESHOLD = POSTS_PER_PAGE;


const PostListPage = memo( () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { colorScheme } = useMantineColorScheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#f8f9fa',
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
                <Container size="xl" py="xl">
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
                <Container size="xl" py="xl">
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
            <Container size="xl" py="xl">
                <Stack gap="2rem">
                    {/* velog 스타일 네비게이션 */}
                    <Box>
                        {/* 메인 탭 (트렌딩, 최신, 이번 주) */}
                        <Group gap="xl" mb="lg">
                            {['trending', 'latest', 'week'].map((tab) => {
                                const labels = { trending: '트렌딩', latest: '최신', week: '이번 주' };
                                const isActive = selectedCategory === 'all' && tab === 'latest';

                                return (
                                    <UnstyledButton
                                        key={tab}
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            const newSearchParams = new URLSearchParams(searchParams);
                                            newSearchParams.delete('category');
                                            setSearchParams(newSearchParams);
                                        }}
                                        style={{
                                            fontSize: rem(20),
                                            fontWeight: 600,
                                            color: isActive ? velogColors.text : velogColors.subText,
                                            padding: `${rem(8)} 0`,
                                            borderBottom: isActive ? `2px solid ${velogColors.primary}` : '2px solid transparent',
                                            transition: 'all 0.2s ease',
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = velogColors.text;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.color = velogColors.subText;
                                            }
                                        }}
                                    >
                                        {labels[tab]}
                                    </UnstyledButton>
                                );
                            })}
                        </Group>

                        {/* 카테고리 필터 */}
                        {categoryOptions.length > 1 && (
                            <Group gap="md" wrap="wrap">
                                {categoryOptions.map((category) => {
                                    const isActive = selectedCategory === category.id;

                                    return (
                                        <UnstyledButton
                                            key={category.id}
                                            onClick={() => handleCategoryChange(category.id)}
                                            style={{
                                                fontSize: rem(14),
                                                fontWeight: 500,
                                                color: isActive ? 'white' : velogColors.subText,
                                                backgroundColor: isActive ? velogColors.primary : 'transparent',
                                                padding: `${rem(6)} ${rem(12)}`,
                                                borderRadius: rem(12),
                                                border: isActive ? 'none' : `1px solid ${velogColors.border}`,
                                                transition: 'all 0.2s ease',
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = velogColors.hover;
                                                    e.currentTarget.style.color = velogColors.text;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = velogColors.subText;
                                                }
                                            }}
                                        >
                                            {category.label}
                                        </UnstyledButton>
                                    );
                                })}
                            </Group>
                        )}
                    </Box>

                    {/* 구분선 */}
                    <Box
                        style={{
                            height: '1px',
                            backgroundColor: velogColors.border,
                            margin: `${rem(8)} 0`
                        }}
                    />

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
                        ) : <PostList posts={visiblePosts}/>
                    }

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
})

export default PostListPage;