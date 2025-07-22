import React, { useState } from 'react';
import {
    Container,
    Title,
    Text,
    Button,
    Card,
    Image,
    Badge,
    Group,
    ActionIcon,
    SimpleGrid,
    Grid,
    Stack,
    Center,
    Box,
    Avatar,
    Paper,
    Tabs,
    Overlay,
    rem,
    useMantineColorScheme,
    useMantineTheme
} from '@mantine/core';
import {
    IconHeart,
    IconBookmark,
    IconEye,
    IconArrowRight,
    IconTrendingUp,
    IconFlame,
    IconBrandReact,
    IconBrandTypescript,
    IconBrandNextjs,
    IconSettings,
    IconPalette,
    IconRocket,
    IconSparkles,
    IconBolt,
    IconMail,
    IconRss,
    IconArrowUpRight,
    IconTarget,
    IconTrophy,
    IconChevronRight, IconZip, IconSearch
} from '@tabler/icons-react';

// 샘플 블로그 데이터
const featuredPost = {
    id: 1,
    title: "React 19와 Next.js 15로 만드는 차세대 웹앱",
    excerpt: "Server Components와 Suspense를 활용한 완전히 새로운 개발 경험. 실제 프로덕션 사례와 함께 알아보는 최신 React 생태계의 모든 것.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "React",
    author: "김개발",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "2일 전",
    readTime: "12분",
    views: "2.1k",
    likes: 156,
    comments: 42,
    trending: true
};

const recentPosts = [
    {
        id: 2,
        title: "TypeScript 5.7 완전 정복: 타입 안전성의 새로운 차원",
        excerpt: "최신 타입 시스템과 컴파일러 최적화로 개발 생산성이 2배 향상됩니다.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "TypeScript",
        author: "이타입",
        date: "3일 전",
        readTime: "8분",
        views: "1.8k",
        likes: 89,
        hot: true
    },
    {
        id: 3,
        title: "Next.js App Router: 실전 성능 최적화 가이드",
        excerpt: "Core Web Vitals 점수를 90점대로 끌어올리는 실무 최적화 기법들을 공개합니다.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Next.js",
        author: "박넥스트",
        date: "5일 전",
        readTime: "15분",
        views: "3.2k",
        likes: 234
    },
    {
        id: 4,
        title: "Spring Boot 3.2 + Virtual Threads 성능 벤치마크",
        excerpt: "기존 대비 10배 빠른 처리량을 달성한 Virtual Threads 도입 후기입니다.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Spring",
        author: "정스프링",
        date: "1주 전",
        readTime: "10분",
        views: "1.5k",
        likes: 67
    },
    {
        id: 5,
        title: "Figma to Code: AI 도구들의 현실적 비교 분석",
        excerpt: "디자인을 코드로 자동 변환하는 AI 도구들을 실제 프로젝트에 적용해본 후기입니다.",
        image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Design",
        author: "한디자인",
        date: "1주 전",
        readTime: "12분",
        views: "2.7k",
        likes: 145
    },
    {
        id: 6,
        title: "Claude 3.5와 ChatGPT-4o 코딩 어시스턴트 비교",
        excerpt: "실제 개발 업무에서 두 AI의 성능을 정확히 비교 분석했습니다.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "AI",
        author: "최인공",
        date: "2주 전",
        readTime: "18분",
        views: "4.1k",
        likes: 312
    }
];

const categoryData = [
    { value: "all", label: "전체", icon: IconSparkles, color: "blue" },
    { value: "React", label: "React", icon: IconBrandReact, color: "cyan" },
    { value: "TypeScript", label: "TypeScript", icon: IconBrandTypescript, color: "blue" },
    { value: "Next.js", label: "Next.js", icon: IconBrandNextjs, color: "gray" },
    { value: "Spring", label: "Spring", icon: IconSettings, color: "green" },
    { value: "Design", label: "Design", icon: IconPalette, color: "pink" },
    { value: "AI", label: "AI", icon: IconRocket, color: "violet" }
];

function BlogCard({ post, featured = false }) {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const theme = useMantineTheme();

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const handleBookmark = (e) => {
        e.stopPropagation();
        setBookmarked(!bookmarked);
    };

    if (featured) {
        return (
            <Paper
                shadow="xl"
                radius="xl"
                p={0}
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    background: theme.colorScheme === 'dark'
                        ? 'linear-gradient(135deg, #1a1b23 0%, #2d3748 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: theme.colorScheme === 'dark'
                        ? '1px solid #374151'
                        : '1px solid #e2e8f0'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = theme.colorScheme === 'dark'
                        ? '0 32px 64px -12px rgba(0, 0, 0, 0.6)'
                        : '0 32px 64px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--mantine-shadow-xl)';
                }}
            >
                <Box pos="relative" h={400}>
                    <Image
                        src={post.image}
                        alt={post.title}
                        fit="cover"
                        h="100%"
                    />
                    <Overlay
                        gradient={theme.colorScheme === 'dark'
                            ? "linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%)"
                            : "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)"
                        }
                    />

                    {/* 상단 배지들 */}
                    <Group pos="absolute" top={20} left={20} gap="xs">
                        {post.trending && (
                            <Badge
                                size="lg"
                                variant="gradient"
                                gradient={{ from: 'orange', to: 'red' }}
                                leftSection={<IconTrendingUp size={14} />}
                                style={{ fontWeight: 600 }}
                            >
                                트렌딩
                            </Badge>
                        )}
                        <Badge size="lg" variant="white" c="dark" style={{ fontWeight: 600 }}>
                            {post.category}
                        </Badge>
                    </Group>

                    {/* 액션 버튼들 */}
                    <Group pos="absolute" top={20} right={20} gap="xs">
                        <ActionIcon
                            variant={liked ? "filled" : "light"}
                            color={liked ? "red" : "white"}
                            onClick={handleLike}
                            size="lg"
                            radius="xl"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <IconHeart size={18} color={liked ? 'white' : 'black'} />
                        </ActionIcon>
                        <ActionIcon
                            variant={bookmarked ? "filled" : "light"}
                            color={bookmarked ? "yellow" : "white"}
                            onClick={handleBookmark}
                            size="lg"
                            radius="xl"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <IconBookmark size={18} color={bookmarked ? 'white' : 'black'} />
                        </ActionIcon>
                    </Group>

                    {/* 하단 콘텐츠 */}
                    <Box pos="absolute" bottom={0} left={0} right={0} p="xl">
                        <Stack gap="lg">
                            <div>
                                <Title order={2} size="1.75rem" fw={700} c="white" mb="sm" lh={1.3}>
                                    {post.title}
                                </Title>
                                <Text size="lg" c="white" opacity={0.9} lh={1.5} lineClamp={2}>
                                    {post.excerpt}
                                </Text>
                            </div>

                            <Group justify="space-between" align="flex-end">
                                <Group gap="sm">
                                    <Avatar src={post.authorAvatar} size="md" radius="xl" />
                                    <div>
                                        <Text fw={600} size="sm" c="white">{post.author}</Text>
                                        <Group gap="md">
                                            <Text size="xs" c="white" opacity={0.8}>
                                                {post.date} • {post.readTime}
                                            </Text>
                                            <Group gap="xs">
                                                <IconEye size={14} color="rgba(255, 255, 255, 0.8)" />
                                                <Text size="xs" c="white" opacity={0.8}>{post.views}</Text>
                                            </Group>
                                        </Group>
                                    </div>
                                </Group>

                                <Button
                                    variant="white"
                                    color="dark"
                                    size="md"
                                    radius="xl"
                                    rightSection={<IconArrowUpRight size={16} />}
                                    style={{ fontWeight: 600 }}
                                >
                                    읽어보기
                                </Button>
                            </Group>
                        </Stack>
                    </Box>
                </Box>
            </Paper>
        );
    }

    return (
        <Card
            shadow="md"
            padding="lg"
            radius="xl"
            withBorder
            style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = theme.colorScheme === 'dark'
                    ? '0 20px 40px -12px rgba(0, 0, 0, 0.4)'
                    : '0 20px 40px -12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
            }}
        >
            <Card.Section pos="relative">
                <Image
                    src={post.image}
                    height={220}
                    alt={post.title}
                    fit="cover"
                />
                {post.hot && (
                    <Badge
                        pos="absolute"
                        top={15}
                        right={15}
                        size="sm"
                        variant="gradient"
                        gradient={{ from: 'orange', to: 'red' }}
                        leftSection={<IconFlame size={12} />}
                    >
                        HOT
                    </Badge>
                )}
            </Card.Section>

            <Group justify="space-between" mt="lg" mb="xs">
                <Badge
                    size="md"
                    variant="light"
                    radius="md"
                >
                    {post.category}
                </Badge>
                <Group gap="xs">
                    <ActionIcon
                        variant={liked ? "filled" : "subtle"}
                        color={liked ? "red" : "gray"}
                        onClick={handleLike}
                        size="sm"
                        radius="xl"
                    >
                        <IconHeart size={14} />
                    </ActionIcon>
                    <Text size="xs" c="dimmed" fw={500}>{post.likes}</Text>
                </Group>
            </Group>

            <Title order={3} size="1.1rem" fw={700} mb="sm" lineClamp={2} lh={1.3}>
                {post.title}
            </Title>

            <Text size="sm" c="dimmed" mb="lg" lineClamp={2} lh={1.5}>
                {post.excerpt}
            </Text>

            <Stack gap="sm" mt="auto">
                <Group gap="sm">
                    <Avatar size="sm" name={post.author} color="initials" />
                    <div>
                        <Text size="sm" fw={600}>{post.author}</Text>
                        <Group gap="md">
                            <Text size="xs" c="dimmed">{post.date}</Text>
                            <Group gap={4}>
                                <IconEye size={12} />
                                <Text size="xs" c="dimmed">{post.views}</Text>
                            </Group>
                        </Group>
                    </div>
                </Group>
            </Stack>
        </Card>
    );
}

function CategoryTabs({ activeCategory, onCategoryChange, filteredCount }) {
    return (
        <Box mb="xl">
            <Tabs value={activeCategory} onChange={onCategoryChange} variant="pills" radius="xl">
                <Tabs.List justify="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    {categoryData.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <Tabs.Tab
                                key={category.value}
                                value={category.value}
                                leftSection={<IconComponent size={16} />}
                                style={{
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    padding: '12px 20px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {category.label}
                            </Tabs.Tab>
                        );
                    })}
                </Tabs.List>
            </Tabs>

            <Center mt="md">
                <Text size="sm" c="dimmed" fw={500}>
                    {activeCategory === "all" ? "모든 글" : `${activeCategory} 카테고리`} • {filteredCount}개의 게시물
                </Text>
            </Center>
        </Box>
    );
}

export default function Homepage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();

    const filteredPosts = activeCategory === "all"
        ? recentPosts
        : recentPosts.filter(post => post.category === activeCategory);

    return (
        <Box>
            {/* 완전히 새로운 히어로 섹션 */}
            <Box
                pos="relative"
                style={{
                    background: colorScheme === 'dark'
                        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                    overflow: 'hidden'
                }}
                py={rem(120)}
            >
                {/* 동적 배경 요소들 */}
                <Box
                    pos="absolute"
                    top="10%"
                    right="15%"
                    w={200}
                    h={200}
                    style={{
                        background: colorScheme === 'dark'
                            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <Box
                    pos="absolute"
                    bottom="20%"
                    left="10%"
                    w={150}
                    h={150}
                    style={{
                        background: colorScheme === 'dark'
                            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        animation: 'float 8s ease-in-out infinite reverse'
                    }}
                />

                <Container size="lg" pos="relative">
                    <Grid align="center" mih={500}>
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Stack gap="xl">
                                <div>
                                    <Badge
                                        size="xl"
                                        variant="gradient"
                                        gradient={{ from: 'blue', to: 'cyan' }}
                                        radius="xl"
                                        leftSection={<IconZip size={18} />}
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        개발자를 위한 최신 인사이트
                                    </Badge>

                                    <Title
                                        order={1}
                                        size={rem(48)}
                                        fw={800}
                                        lh={1.1}
                                        mt="xl"
                                        mb="lg"
                                        style={{
                                            background: colorScheme === 'dark'
                                                ? 'linear-gradient(45deg, #ffffff 0%, #94a3b8 100%)'
                                                : 'linear-gradient(45deg, #1e293b 0%, #475569 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        코드와 창의성이<br />
                                        만나는 공간 ⚡
                                    </Title>

                                    <Text
                                        size="xl"
                                        lh={1.6}
                                        c="dimmed"
                                        maw={500}
                                        fw={400}
                                    >
                                        최신 프레임워크부터 아키텍처 패턴까지,
                                        실무에서 바로 써먹을 수 있는 개발 지식을
                                        매주 큐레이션해서 전달합니다.
                                    </Text>
                                </div>

                                <Group gap="lg">
                                    <Button
                                        size="xl"
                                        radius="xl"
                                        variant="gradient"
                                        gradient={{ from: 'blue', to: 'cyan' }}
                                        leftSection={<IconRocket size={20} />}
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            padding: '16px 32px'
                                        }}
                                    >
                                        지금 시작하기
                                    </Button>
                                    <Button
                                        size="xl"
                                        radius="xl"
                                        variant="light"
                                        leftSection={<IconSearch size={20} />}
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            padding: '16px 32px'
                                        }}
                                    >
                                        둘러보기
                                    </Button>
                                </Group>

                                <Group gap="xl" mt="lg">
                                    <Group gap="xs">
                                        <IconTrophy size={20} color={theme.colors.yellow[6]} />
                                        <div>
                                            <Text size="lg" fw={700}>12k+</Text>
                                            <Text size="sm" c="dimmed">월간 독자</Text>
                                        </div>
                                    </Group>
                                    <Group gap="xs">
                                        <IconTarget size={20} color={theme.colors.green[6]} />
                                        <div>
                                            <Text size="lg" fw={700}>95%</Text>
                                            <Text size="sm" c="dimmed">만족도</Text>
                                        </div>
                                    </Group>
                                    <Group gap="xs">
                                        <IconBolt size={20} color={theme.colors.blue[6]} />
                                        <div>
                                            <Text size="lg" fw={700}>150+</Text>
                                            <Text size="sm" c="dimmed">아티클</Text>
                                        </div>
                                    </Group>
                                </Group>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Box
                                style={{
                                    position: 'relative',
                                    transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(2deg) scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'perspective(1000px) rotateY(-10deg) rotateX(5deg) scale(1)';
                                }}
                            >
                                <Paper
                                    shadow="xl"
                                    radius="xl"
                                    p="xl"
                                    style={{
                                        background: colorScheme === 'dark'
                                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                                            : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                                        border: colorScheme === 'dark'
                                            ? '1px solid #475569'
                                            : '1px solid #e2e8f0'
                                    }}
                                >
                                    <Stack gap="lg">
                                        <Group justify="space-between">
                                            <Badge variant="gradient" gradient={{ from: 'violet', to: 'purple' }}>
                                                💡 오늘의 팁
                                            </Badge>
                                            <IconSparkles size={24} color={theme.colors.yellow[6]} />
                                        </Group>

                                        <Title order={3} fw={700}>
                                            React 19의 use() 훅으로
                                            비동기 처리 혁신하기
                                        </Title>

                                        <Text c="dimmed">
                                            Promise를 직접 컴포넌트에서 사용할 수 있게 된
                                            새로운 use() 훅의 활용법과 실무 적용 사례를 살펴보세요.
                                        </Text>

                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <Avatar size="sm" name="김리액트" color="initials" />
                                                <Text size="sm" fw={500}>김리액트</Text>
                                            </Group>
                                            <Button variant="subtle" rightSection={<IconChevronRight size={16} />}>
                                                자세히 보기
                                            </Button>
                                        </Group>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Container>

                <style>
                    {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}
                </style>
            </Box>

            <Container size="xl" py="xl">
                {/* 추천 게시물 - 완전히 새로운 디자인 */}
                <Stack gap="xl" my={rem(80)}>
                    <Group justify="space-between" align="flex-end">
                        <div>
                            <Group mb="sm">
                                <IconTrendingUp size={24} color={theme.colors.orange[6]} />
                                <Badge size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                                    이번 주 인기글
                                </Badge>
                            </Group>
                            <Title order={2} size="2.5rem" fw={700} mb="sm">
                                지금 가장 뜨거운 이야기
                            </Title>
                            <Text c="dimmed" size="lg">
                                개발자들이 가장 많이 읽고, 가장 많이 공유한 아티클입니다
                            </Text>
                        </div>
                        <Button variant="subtle" rightSection={<IconArrowRight size={16} />}>
                            인기글 전체보기
                        </Button>
                    </Group>

                    <BlogCard post={featuredPost} featured />
                </Stack>

                {/* 카테고리 탭 */}
                <CategoryTabs
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    filteredCount={filteredPosts.length}
                />

                {/* 최근 게시물 그리드 */}
                <Stack gap="xl" my={rem(60)}>
                    <Group justify="space-between" align="flex-end">
                        <div>
                            <Title order={2} size="2rem" fw={700} mb="sm">
                                최신 게시물
                            </Title>
                            <Text c="dimmed" size="lg">
                                {activeCategory === "all"
                                    ? "모든 카테고리의 최신 글들을 확인해보세요"
                                    : `${activeCategory} 카테고리의 최신 글들입니다`}
                            </Text>
                        </div>
                    </Group>

                    <SimpleGrid
                        cols={{ base: 1, sm: 2, lg: 3 }}
                        spacing="xl"
                        verticalSpacing="xl"
                    >
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </SimpleGrid>

                    <Center mt={rem(60)}>
                        <Button
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                            size="xl"
                            radius="xl"
                            leftSection={<IconArrowRight size={18} />}
                            style={{
                                fontWeight: 600,
                                fontSize: '16px',
                                padding: '16px 40px'
                            }}
                        >
                            더 많은 글 탐험하기
                        </Button>
                    </Center>
                </Stack>

                {/* 구독 영역 */}
                <Paper
                    mt={rem(80)}
                    p="xl"
                    radius="xl"
                    withBorder
                    style={{
                        background: colorScheme === 'dark'
                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                            : 'linear-gradient(135deg, #f6f8ff 0%, #e8f2ff 100%)'
                    }}
                >
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="lg">
                                <div>
                                    <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md">
                                        💌 뉴스레터
                                    </Badge>
                                    <Title order={3} size="1.8rem" fw={700} mb="sm">
                                        개발 트렌드를 놓치지 마세요!
                                    </Title>
                                    <Text c="dimmed" size="lg">
                                        매주 화요일, 엄선된 개발 이야기와 최신 기술 트렌드를
                                        여러분의 메일함으로 배달해드립니다.
                                    </Text>
                                </div>
                                <Group>
                                    <Button
                                        variant="gradient"
                                        gradient={{ from: 'blue', to: 'cyan' }}
                                        size="lg"
                                        radius="xl"
                                        leftSection={<IconMail size={18} />}
                                    >
                                        이메일 구독하기
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        radius="xl"
                                        leftSection={<IconRss size={18} />}
                                    >
                                        RSS 피드
                                    </Button>
                                </Group>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="lg">
                                <div>
                                    <Badge size="lg" variant="gradient" gradient={{ from: 'pink', to: 'violet' }} mb="md">
                                        🌟 소셜 미디어
                                    </Badge>
                                    <Title order={3} size="1.8rem" fw={700} mb="sm">
                                        개발 커뮤니티와 소통해요
                                    </Title>
                                    <Text c="dimmed" size="lg">
                                        GitHub, Twitter, LinkedIn에서 더 많은 개발 이야기와
                                        실시간 인사이트를 만나보세요.
                                    </Text>
                                </div>
                                <Group>
                                    <Button variant="outline" radius="xl" size="md" color="dark">
                                        GitHub
                                    </Button>
                                    <Button variant="outline" radius="xl" size="md" color="blue">
                                        Twitter
                                    </Button>
                                    <Button variant="outline" radius="xl" size="md" color="blue">
                                        LinkedIn
                                    </Button>
                                </Group>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}