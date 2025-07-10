import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    Container,
    Stack,
    Group,
    Text,
    Button,
    Select,
    TextInput,
    Badge,
    Center,
    Pagination,
    ActionIcon,
    Skeleton,
    Box,
    Paper,
    Divider,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconSearch,
    IconFilter,
    IconSortDescending,
    IconSortAscending,
    IconRefresh,
    IconPlus,
    IconEye,
    IconEyeOff,
    IconLock,
    IconAlertCircle,
    IconFileX,
} from '@tabler/icons-react';
import {useTheme} from "@/hooks/useTheme.js";
import {useAuth} from "@/contexts/AuthContext.jsx";
import {useDebounce} from "@/hooks/useDebounce.js";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "@/services/apiClient.js";
import {showToast} from "@/components/common/Toast.jsx";
import InfiniteScroll from "@/components/common/InfiniteScroll.jsx";
import PostCard2 from "@/components/blog/PostCard2.jsx";

// 포스트 스켈레톤 컴포넌트
const PostSkeleton = memo(() => {
    const { dark } = useTheme();

    return (
        <Paper
            p="lg"
            radius="md"
            withBorder
            style={{
                background: dark ? '#161b22' : '#ffffff',
                border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
            }}
        >
            <Group align="flex-start" gap="md">
                {/* 이미지 스켈레톤 */}
                <Skeleton
                    height={120}
                    width={200}
                    radius="md"
                    style={{ flexShrink: 0 }}
                />

                {/* 콘텐츠 스켈레톤 */}
                <Box style={{ flex: 1 }}>
                    <Stack gap="sm">
                        {/* 제목 스켈레톤 */}
                        <Skeleton height={24} width="80%" />

                        {/* 요약 스켈레톤 */}
                        <Stack gap="xs">
                            <Skeleton height={16} width="100%" />
                            <Skeleton height={16} width="60%" />
                        </Stack>

                        {/* 메타 정보 스켈레톤 */}
                        <Group justify="space-between" mt="md">
                            <Group gap="xs">
                                <Skeleton height={14} width={80} />
                                <Skeleton height={14} width={60} />
                            </Group>
                            <Group gap="lg">
                                <Skeleton height={14} width={40} />
                                <Skeleton height={14} width={40} />
                            </Group>
                        </Group>
                    </Stack>
                </Box>
            </Group>
        </Paper>
    );
});

PostSkeleton.displayName = 'PostSkeleton';

// 포스트 목록 스켈레톤
const PostListSkeleton = memo(({ count = 6 }) => (
    <Stack gap="md">
        {Array.from({ length: count }).map((_, index) => (
            <PostSkeleton key={index} />
        ))}
    </Stack>
));

PostListSkeleton.displayName = 'PostListSkeleton';

// 빈 상태 컴포넌트
const EmptyState = memo(({
                             type = 'empty',
                             title,
                             description,
                             action,
                             icon: Icon = IconFileX
                         }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const getEmptyConfig = () => {
        switch (type) {
            case 'empty':
                return {
                    title: title || '포스트가 없습니다',
                    description: description || '아직 작성된 포스트가 없습니다. 첫 번째 포스트를 작성해보세요!',
                    icon: IconFileX,
                    color: 'gray',
                };
            case 'no-permission':
                return {
                    title: title || '접근 권한이 없습니다',
                    description: description || '이 포스트들을 볼 수 있는 권한이 없습니다. 로그인하거나 관리자에게 문의하세요.',
                    icon: IconLock,
                    color: 'red',
                };
            case 'search-empty':
                return {
                    title: title || '검색 결과가 없습니다',
                    description: description || '검색 조건에 맞는 포스트를 찾을 수 없습니다. 다른 키워드로 검색해보세요.',
                    icon: IconSearch,
                    color: 'blue',
                };
            case 'error':
                return {
                    title: title || '오류가 발생했습니다',
                    description: description || '포스트를 불러오는 중 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.',
                    icon: IconAlertCircle,
                    color: 'red',
                };
            default:
                return {
                    title: title || '포스트가 없습니다',
                    description: description || '표시할 포스트가 없습니다.',
                    icon: IconFileX,
                    color: 'gray',
                };
        }
    };

    const config = getEmptyConfig();
    const EmptyIcon = Icon || config.icon;

    return (
        <Center py={rem(80)}>
            <Stack align="center" gap="md" style={{ textAlign: 'center', maxWidth: rem(400) }}>
                <Box
                    style={{
                        width: rem(80),
                        height: rem(80),
                        borderRadius: '50%',
                        background: dark ? '#21262d' : '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <EmptyIcon size={32} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                </Box>

                <Stack align="center" gap="xs">
                    <Text size="lg" fw={600} c={dark ? '#f0f6fc' : '#1e293b'}>
                        {config.title}
                    </Text>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                        {config.description}
                    </Text>
                </Stack>

                {action && (
                    <Box mt="md">
                        {action}
                    </Box>
                )}
            </Stack>
        </Center>
    );
});

EmptyState.displayName = 'EmptyState';

// 메인 PostList 컴포넌트
const PostList = memo(({
                           categoryId,
                           tagId,
                           searchQuery: propSearchQuery,
                           showCreateButton = true,
                           onCreatePost,
                           pageSize = 12,
                           enableInfiniteScroll = false,
                           ...props
                       }) => {
    const { dark } = useTheme();
    const { isAuthenticated, user } = useAuth();

    // 상태 관리
    const [searchQuery, setSearchQuery] = useState(propSearchQuery || '');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterBy, setFilterBy] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // 디바운스된 검색어
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

    // API 쿼리 파라미터 메모이제이션
    const queryParams = useMemo(() => ({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery,
        sortBy,
        sortOrder,
        categoryId,
        tagId,
        filter: filterBy,
    }), [currentPage, pageSize, debouncedSearchQuery, sortBy, sortOrder, categoryId, tagId, filterBy]);

    // 포스트 목록 쿼리
    const {
        data: postsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['posts', queryParams],
        queryFn: () => apiClient.posts.getAll(queryParams),
        keepPreviousData: true,
        staleTime: 2 * 60 * 1000, // 2분
        cacheTime: 5 * 60 * 1000, // 5분
        onError: (error) => {
            console.error('Failed to fetch posts:', error);
            showToast.error('오류', '포스트를 불러오는데 실패했습니다.');
        },
    });

    // 검색어 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, sortBy, sortOrder, filterBy, categoryId, tagId]);

    // 외부에서 전달된 검색어 업데이트
    useEffect(() => {
        if (propSearchQuery !== undefined) {
            setSearchQuery(propSearchQuery);
        }
    }, [propSearchQuery]);

    // 검색 핸들러
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
    }, []);

    // 정렬 토글
    const handleSortToggle = useCallback(() => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    }, []);

    // 새로고침
    const handleRefresh = useCallback(() => {
        refetch();
        showToast.info('새로고침', '포스트 목록을 새로고침했습니다.');
    }, [refetch]);

    // 필터 옵션
    const filterOptions = useMemo(() => [
        { value: 'all', label: '전체' },
        { value: 'published', label: '발행됨' },
        { value: 'draft', label: '임시저장' },
        { value: 'featured', label: '추천' },
        { value: 'popular', label: '인기' },
        ...(isAuthenticated ? [{ value: 'my', label: '내 포스트' }] : []),
    ], [isAuthenticated]);

    // 정렬 옵션
    const sortOptions = useMemo(() => [
        { value: 'createdAt', label: '작성일' },
        { value: 'updatedAt', label: '수정일' },
        { value: 'title', label: '제목' },
        { value: 'viewsCount', label: '조회수' },
        { value: 'likesCount', label: '좋아요' },
    ], []);

    // 포스트 데이터 추출
    const posts = postsData?.data?.posts || [];
    const totalPages = postsData?.data?.totalPages || 1;
    const totalCount = postsData?.data?.totalCount || 0;
    const hasNextPage = postsData?.data?.hasNextPage || false;

    // 권한 확인
    const hasPermission = useMemo(() => {
        if (filterBy === 'my' && !isAuthenticated) {
            return false;
        }
        return true;
    }, [filterBy, isAuthenticated]);

    // 로딩 상태
    if (isLoading) {
        return (
            <Container size="xl" py="md">
                <PostListSkeleton count={pageSize} />
            </Container>
        );
    }

    // 권한 없음
    if (!hasPermission) {
        return (
            <Container size="xl" py="md">
                <EmptyState
                    type="no-permission"
                    action={
                        <Button
                            leftSection={<IconEye size={16} />}
                            onClick={() => setFilterBy('all')}
                        >
                            전체 포스트 보기
                        </Button>
                    }
                />
            </Container>
        );
    }

    // 에러 상태
    if (isError) {
        return (
            <Container size="xl" py="md">
                <EmptyState
                    type="error"
                    description={error?.message || '포스트를 불러오는 중 문제가 발생했습니다.'}
                    action={
                        <Group gap="xs">
                            <Button
                                leftSection={<IconRefresh size={16} />}
                                onClick={handleRefresh}
                                loading={isFetching}
                            >
                                다시 시도
                            </Button>
                        </Group>
                    }
                />
            </Container>
        );
    }

    // 빈 상태
    if (posts.length === 0) {
    // if (posts.length === 0) {
        const emptyType = debouncedSearchQuery ? 'search-empty' : 'empty';

        return (
            <Container size="xl" py="md">
                <EmptyState
                    type={emptyType}
                    action={
                        <Group gap="xs">
                            {showCreateButton && isAuthenticated && (
                                <Button
                                    leftSection={<IconPlus size={16} />}
                                    onClick={onCreatePost}
                                >
                                    새 포스트 작성
                                </Button>
                            )}
                            {debouncedSearchQuery && (
                                <Button
                                    variant="light"
                                    onClick={() => setSearchQuery('')}
                                >
                                    검색 초기화
                                </Button>
                            )}
                        </Group>
                    }
                />
            </Container>
        );
    }

    return (
        <Container size="xl" py="md" {...props}>
            <Stack gap="lg">
                {/* 헤더 */}
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Group gap="xs">
                            <Text size="xl" fw={700}>
                                포스트 목록
                            </Text>
                            <Badge variant="light" size="sm">
                                {totalCount.toLocaleString()}개
                            </Badge>
                        </Group>
                        {(categoryId || tagId || debouncedSearchQuery) && (
                            <Group gap="xs">
                                {categoryId && (
                                    <Badge color="blue" variant="light">
                                        카테고리: {categoryId}
                                    </Badge>
                                )}
                                {tagId && (
                                    <Badge color="green" variant="light">
                                        태그: {tagId}
                                    </Badge>
                                )}
                                {debouncedSearchQuery && (
                                    <Badge color="orange" variant="light">
                                        검색: {debouncedSearchQuery}
                                    </Badge>
                                )}
                            </Group>
                        )}
                    </Stack>

                    <Group gap="xs">
                        {showCreateButton && isAuthenticated && (
                            <Button
                                leftSection={<IconPlus size={16} />}
                                onClick={onCreatePost}
                            >
                                새 포스트
                            </Button>
                        )}
                        <ActionIcon
                            variant="light"
                            onClick={handleRefresh}
                            loading={isFetching}
                        >
                            <IconRefresh size={16} />
                        </ActionIcon>
                    </Group>
                </Group>

                {/* 검색 및 필터 */}
                <Paper p="md" withBorder>
                    <Stack gap="md">
                        <Group grow>
                            <TextInput
                                placeholder="포스트 검색..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                leftSection={<IconSearch size={16} />}
                                rightSection={
                                    searchQuery && (
                                        <ActionIcon
                                            variant="subtle"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <IconEyeOff size={14} />
                                        </ActionIcon>
                                    )
                                }
                            />
                            <Button
                                variant="light"
                                leftSection={<IconFilter size={16} />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                필터
                            </Button>
                        </Group>

                        {showFilters && (
                            <>
                                <Divider />
                                <Group grow>
                                    <Select
                                        label="필터"
                                        value={filterBy}
                                        onChange={setFilterBy}
                                        data={filterOptions}
                                    />
                                    <Select
                                        label="정렬"
                                        value={sortBy}
                                        onChange={setSortBy}
                                        data={sortOptions}
                                        rightSection={
                                            <ActionIcon
                                                variant="subtle"
                                                onClick={handleSortToggle}
                                            >
                                                {sortOrder === 'desc' ? (
                                                    <IconSortDescending size={16} />
                                                ) : (
                                                    <IconSortAscending size={16} />
                                                )}
                                            </ActionIcon>
                                        }
                                    />
                                </Group>
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* 포스트 목록 */}
                {enableInfiniteScroll ? (
                    <InfiniteScroll
                        hasMore={hasNextPage}
                        loading={isFetching}
                        onLoadMore={() => {
                            if (hasNextPage) {
                                setCurrentPage(prev => prev + 1);
                            }
                        }}
                    >
                        <Stack gap="md">
                            {posts.map((post) => (
                                <PostCard2 key={post.id} post={post} />
                            ))}
                        </Stack>
                    </InfiniteScroll>
                ) : (
                    <>
                        <Stack gap="md">
                            {posts.map((post) => (
                                <PostCard2 key={post.id} post={post} />
                            ))}
                        </Stack>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <Center mt="xl">
                                <Pagination
                                    total={totalPages}
                                    value={currentPage}
                                    onChange={setCurrentPage}
                                    siblings={1}
                                    boundaries={1}
                                    size="md"
                                />
                            </Center>
                        )}
                    </>
                )}

                {/* 로딩 오버레이 */}
                {isFetching && !isLoading && (
                    <Center py="md">
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                업데이트 중...
                            </Text>
                        </Group>
                    </Center>
                )}
            </Stack>
        </Container>
    );
});

PostList.displayName = 'PostList';

export default PostList;