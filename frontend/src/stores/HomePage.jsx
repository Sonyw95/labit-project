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
    IconCode,
    IconBrandReact,
    IconBrandTypescript,
    IconBrandNextjs,
    IconSettings,
    IconPalette,
    IconRocket,
    IconSparkles,
    IconMail,
    IconRss,
    IconArrowUpRight,
} from '@tabler/icons-react';
import {useTheme} from "../contexts/ThemeContext.jsx";

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

function InteractiveCodeBlock({ dark }) {
    const [isHovered, setIsHovered] = useState(false);

    const codeBlockStyle = {
        background: dark
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: dark ? '1px solid #475569' : '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
        fontSize: '14px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
            ? dark
                ? '0 20px 40px -12px rgba(0, 0, 0, 0.8)'
                : '0 20px 40px -12px rgba(0, 0, 0, 0.6)'
            : 'none'
    };

    const typingText = "const developer = {\n  passion: 'infinite',\n  coffee: true,\n  sleep: Math.random() > 0.5\n};";

    return (
        <Box
            style={codeBlockStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            w={rem(300)}
        >
            <Group justify="space-between" mb="md">
                <Group gap="xs">
                    <Box w={12} h={12} style={{ background: '#ff5f57', borderRadius: '50%' }} />
                    <Box w={12} h={12} style={{ background: '#ffbd2e', borderRadius: '50%' }} />
                    <Box w={12} h={12} style={{ background: '#28ca42', borderRadius: '50%' }} />
                </Group>
                <Text size="xs" c="dimmed">developer.js</Text>
            </Group>
            <Text
                style={{
                    color: dark ? '#64ffda' : '#00f5ff',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                }}
            >
                {typingText}
            </Text>
            {isHovered && (
                <Box
                    pos="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h={3}
                    style={{
                        background: 'linear-gradient(90deg, #00f5ff, #7c3aed, #ec4899, #00f5ff)',
                        backgroundSize: '200% 100%',
                        animation: 'slideGradient 2s ease infinite'
                    }}
                />
            )}
        </Box>
    );
}

function HeroSection({dark}) {

    const heroBackgroundStyle = {
        background: dark
            ? 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
            : 'radial-gradient(circle at 50% 50%, #1e293b 0%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
    };
    return (
        <Box
            style={heroBackgroundStyle}
            py={rem(120)}
            // onMouseMove={handleMouseMove}
        >

            {/* Interactive Grid Background */}
            <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                style={{
                    backgroundImage: dark
                        ? `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`
                        : `linear-gradient(rgba(0, 245, 255, 0.2) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 245, 255, 0.2) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    opacity: 0.7
                }}
            />

            {/* Mouse Follower Effect */}
            {/*<Box*/}
            {/*    pos="absolute"*/}
            {/*    style={{*/}
            {/*        // left: mousePosition.x - 150,*/}
            {/*        // top: mousePosition.y - 150,*/}
            {/*        width: 300,*/}
            {/*        height: 300,*/}
            {/*        background: dark*/}
            {/*            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'*/}
            {/*            : 'radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',*/}
            {/*        borderRadius: '50%',*/}
            {/*        pointerEvents: 'none',*/}
            {/*        transition: 'all 0.3s ease'*/}
            {/*    }}*/}
            {/*/>*/}

            <Container size="xl" style={{ position: 'relative', zIndex: 10 }}>
                <Grid align="center" mih={400}>
                    <Grid.Col span={{ base: 12, md: 12 }}>
                        <Stack align="center" gap="xl">
                            {/* Geometric Logo */}
                            <Box
                                style={{
                                    position: 'relative',
                                    width: 120,
                                    height: 120
                                }}
                            >
                                <Box
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(45deg, #00f5ff, #7c3aed)',
                                        borderRadius: '20px',
                                        animation: 'pulse 3s ease-in-out infinite',
                                        transform: 'rotate(45deg)'
                                    }}
                                />
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '2rem',
                                        zIndex: 2
                                    }}
                                >
                                    ⚡
                                </Box>
                            </Box>

                            {/* Interactive Buttons */}
                            <Group gap="lg"/>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 12 }}>
                        <Stack align="center" gap="xl">
                            <InteractiveCodeBlock dark={dark} />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>

            <style>
                {`
          @keyframes floatParticle {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
              opacity: 0.8;
            }
            50% { 
              transform: translateY(-20px) rotate(180deg); 
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% { 
              transform: rotate(45deg) scale(1);
              opacity: 0.8;
            }
            50% { 
              transform: rotate(45deg) scale(1.1);
              opacity: 1;
            }
          }
          
          @keyframes slideGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
            </style>
        </Box>
    );
}

function FeaturedPostCard({ post, dark }) {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const handleBookmark = (e) => {
        e.stopPropagation();
        setBookmarked(!bookmarked);
    };

    const cardStyle = {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        background: dark
            ? 'linear-gradient(135deg, #1a1b23 0%, #2d3748 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: dark
            ? '1px solid #374151'
            : '1px solid #e2e8f0'
    };

    const overlayGradient = dark
        ? "linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%)"
        : "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)";

    const actionButtonStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
    };

    return (
        <Paper
            shadow="xl"
            radius="lg"
            p={0}
            style={cardStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                e.currentTarget.style.boxShadow = dark
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
                <Overlay gradient={overlayGradient} />

                {/* 배지 영역 */}
                <Group pos="absolute" top={20} left={20} gap="xs">
                    {post.trending && (
                        <Badge
                            size="lg"
                            variant="gradient"
                            gradient={{ from: 'orange', to: 'red' }}
                            leftSection={<IconTrendingUp size={14} />}
                        >
                            트렌딩
                        </Badge>
                    )}
                    <Badge size="lg" variant="white" c="dark">
                        {post.category}
                    </Badge>
                </Group>

                {/* 액션 버튼 */}
                <Group pos="absolute" top={20} right={20} gap="xs">
                    <ActionIcon
                        variant={liked ? "filled" : "light"}
                        color={liked ? "red" : "white"}
                        onClick={handleLike}
                        size="lg"
                        radius="lg"
                        style={actionButtonStyle}
                    >
                        <IconHeart size={18} color={liked ? 'white' : 'black'} />
                    </ActionIcon>
                    <ActionIcon
                        variant={bookmarked ? "filled" : "light"}
                        color={bookmarked ? "yellow" : "white"}
                        onClick={handleBookmark}
                        size="lg"
                        radius="lg"
                        style={actionButtonStyle}
                    >
                        <IconBookmark size={18} color={bookmarked ? 'white' : 'black'} />
                    </ActionIcon>
                </Group>

                {/* 콘텐츠 영역 */}
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
                                <Avatar src={post.authorAvatar} size="md" radius="lg" />
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
                                radius="lg"
                                rightSection={<IconArrowUpRight size={16} />}
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

function RegularBlogCard({ post, dark }) {
    const [liked, setLiked] = useState(false);

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const cardHoverEffect = {
        onMouseEnter: (e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = dark
                ? '0 20px 40px -12px rgba(0, 0, 0, 0.4)'
                : '0 20px 40px -12px rgba(0, 0, 0, 0.15)';
        },
        onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
        }
    };

    return (
        <Card
            shadow="md"
            padding="lg"
            radius="lg"
            withBorder
            style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%'
            }}
            {...cardHoverEffect}
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
                <Badge size="md" variant="light" radius="md">
                    {post.category}
                </Badge>
                <Group gap="xs">
                    <ActionIcon
                        variant={liked ? "filled" : "subtle"}
                        color={liked ? "red" : "gray"}
                        onClick={handleLike}
                        size="sm"
                        radius="lg"
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
            <Tabs value={activeCategory} onChange={onCategoryChange} variant="pills" radius="lg">
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
    const { dark } = useTheme();

    const filteredPosts = activeCategory === "all"
        ? recentPosts
        : recentPosts.filter(post => post.category === activeCategory);

    return (
        <Box>
            {/* 새로운 히어로 섹션 */}
            <HeroSection dark={dark}/>

            <Container size="xl" py="xl">
                {/* 추천 게시물 */}
                <Stack gap="xl" my={rem(80)}>
                    <Group justify="space-between" align="flex-end">
                        <div>
                            <Group mb="sm">
                                <IconTrendingUp size={24} color="var(--mantine-color-orange-6)" />
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

                    <FeaturedPostCard post={featuredPost} dark={dark}/>
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
                            <RegularBlogCard key={post.id} post={post} dark={dark} />
                        ))}
                    </SimpleGrid>

                    <Center mt={rem(60)}>
                        <Button
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                            size="xl"
                            radius="lg"
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
                    radius="lg"
                    withBorder
                    style={{
                        background: dark
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
                                        radius="lg"
                                        leftSection={<IconMail size={18} />}
                                    >
                                        이메일 구독하기
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        radius="lg"
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
                                    <Button variant="outline" radius="lg" size="md" color="dark">
                                        GitHub
                                    </Button>
                                    <Button variant="outline" radius="lg" size="md" color="blue">
                                        Twitter
                                    </Button>
                                    <Button variant="outline" radius="lg" size="md" color="blue">
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