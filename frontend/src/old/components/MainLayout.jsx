import React, { useState, useEffect } from 'react';
import {
    AppShell,
    Burger,
    Group,
    Text,
    NavLink,
    ScrollArea,
    Avatar,
    Badge,
    Button,
    ActionIcon,
    Container,
    Title,
    Box,
    ThemeIcon,
    Stack,
    Card,
    Image,
    UnstyledButton,
    rem,
    useMantineColorScheme,
    useMantineTheme,
    Center,
    RingProgress,
    BackgroundImage,
} from '@mantine/core';
import {
    IconHome,
    IconCode,
    IconBrandGithub,
    IconBrandLinkedin,
    IconSun,
    IconMoon,
    IconArticle,
    IconTags,
    IconUser,
    IconSearch,
    IconBell,
    IconSettings,
    IconBookmark,
    IconTrendingUp,
    IconCalendar,
    IconEye,
    IconHeart,
    IconShare,
    IconChevronRight,
    IconSparkles,
} from '@tabler/icons-react';

// Banner 이미지 URL (임시)
const banner = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop';

// BackgroundBlur 유틸리티 함수
const BackgroundBlur = ({ color, alpha }) => ({
    backgroundImage: `linear-gradient(${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}, ${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')})`,
});

// Logo 컴포넌트
const Logo = ({ radius, size, style, isLogo }) => (
    <div style={{
        width: size === 'lg' ? '48px' : '32px',
        height: size === 'lg' ? '48px' : '32px',
        borderRadius: radius === 'xl' ? '50%' : '8px',
        background: '#4c6ef5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'lg' ? '18px' : '14px',
        ...style
    }}>
        {isLogo === false ? 'LB' : <IconCode size={18} />}
    </div>
);

const TechBlogLayout = () => {
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentTech, setCurrentTech] = useState(0);

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const dark = colorScheme === 'dark';
    const techStack = ['Java', 'Spring', 'React'];

    // 로딩 효과 시뮬레이션
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prevProgress + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(timer);
    }, []);

    // 기술 스택 텍스트 변경 효과
    useEffect(() => {
        if (!loading) {
            const techTimer = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % techStack.length);
            }, 3000);

            return () => clearInterval(techTimer);
        }
    }, [loading, techStack.length]);

    // 네비게이션 메뉴 아이템
    const navigationItems = [
        { icon: IconHome, label: '홈', href: '/', active: true },
        { icon: IconArticle, label: '게시글', href: '/posts', badge: '42' },
        { icon: IconTags, label: '태그', href: '/tags' },
        { icon: IconTrendingUp, label: '인기글', href: '/trending' },
        { icon: IconBookmark, label: '북마크', href: '/bookmarks' },
        { icon: IconUser, label: '소개', href: '/about' },
    ];

    // 인기 태그
    const popularTags = [
        { name: 'React', count: 15, color: 'blue' },
        { name: 'Spring Boot', count: 12, color: 'green' },
        { name: 'Java', count: 18, color: 'orange' },
        { name: 'TypeScript', count: 8, color: 'indigo' },
        { name: 'AWS', count: 6, color: 'yellow' },
    ];

    // 최근 게시글
    const recentPosts = [
        {
            id: 1,
            title: 'Spring Boot 3.0과 Virtual Threads 활용하기',
            excerpt: 'Spring Boot 3.0에서 도입된 Virtual Threads를 활용한 고성능 웹 애플리케이션 개발 방법을 알아봅니다.',
            date: '2025-06-20',
            readTime: '5분',
            views: 1240,
            likes: 32,
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop'
        },
        {
            id: 2,
            title: 'React Server Components 심화 가이드',
            excerpt: 'RSC의 동작 원리와 실제 프로덕션에서의 활용 사례를 통해 Modern React 개발을 마스터해보세요.',
            date: '2025-06-18',
            readTime: '8분',
            views: 892,
            likes: 28,
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop'
        },
        {
            id: 3,
            title: 'Microservices Architecture with Docker',
            excerpt: 'Docker와 Kubernetes를 활용한 마이크로서비스 아키텍처 설계 및 운영 경험을 공유합니다.',
            date: '2025-06-15',
            readTime: '12분',
            views: 756,
            likes: 19,
            image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=200&fit=crop'
        }
    ];

    // 커스텀 로딩 컴포넌트
    const CustomLoader = () => (
        <Center style={{ height: '100vh' }}>
            <Stack align="center" gap="xl">
                <Box style={{ position: 'relative' }}>
                    <RingProgress
                        size={120}
                        thickness={8}
                        sections={[
                            {
                                value: progress,
                                color: dark ? '#4c6ef5' : '#339af0',
                            }
                        ]}
                        label={
                            <Center>
                                <ThemeIcon
                                    size="xl"
                                    radius="xl"
                                    style={{
                                        background: dark ? '#4c6ef5' : '#339af0',
                                        animation: 'spin 2s linear infinite',
                                        boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                    }}
                                >
                                    <IconCode size={24} />
                                </ThemeIcon>
                            </Center>
                        }
                        style={{
                            filter: 'none', // 플랫 디자인: 필터 제거
                        }}
                    />

                    {/* 주변 회전하는 점들 */}
                    <Box
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 140,
                            height: 140,
                            animation: 'rotate 3s linear infinite',
                        }}
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: dark ? '#4c6ef5' : '#339af0',
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-70px)`,
                                    boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                    animation: `pulse 1s ease-in-out infinite ${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                <Stack align="center" gap="xs">
                    <Text
                        size="xl"
                        fw={700}
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                            animation: 'fadeInUp 0.8s ease-out',
                        }}
                    >
                        LABit
                    </Text>
                    <Text
                        size="sm"
                        c="dimmed"
                        style={{
                            animation: 'fadeInUp 0.8s ease-out 0.2s both',
                        }}
                    >
                        기술과 성장의 기록을 불러오는 중...
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                        style={{
                            animation: 'fadeInUp 0.8s ease-out 0.4s both',
                        }}
                    >
                        {Math.round(progress)}%
                    </Text>
                </Stack>
            </Stack>
        </Center>
    );

    if (loading) {
        return (
            <Box
                style={{
                    height: '100vh',
                    background: dark
                        ? '#0d1117'  // 매우 어두운 배경
                        : '#f8fafc',
                    overflow: 'hidden',
                }}
            >
                <CustomLoader />
            </Box>
        );
    }

    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{
                width: 280,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
            style={{
                background: dark ? '#0d1117' : '#f8fafc',  // 매우 어두운 배경
            }}
        >
            {/* Header */}
            <AppShell.Header style={{
                background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 헤더
                borderBottom: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
            }}>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened(!opened)}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Group gap="xs">
                            <ThemeIcon
                                size="lg"
                                radius="md"
                                style={{
                                    background: '#4c6ef5',
                                    boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                }}
                            >
                                <IconCode size={18} />
                            </ThemeIcon>
                            <div>
                                <Text
                                    size="lg"
                                    fw={700}
                                    style={{
                                        color: dark ? '#ffffff' : '#1e293b',
                                    }}
                                >
                                    LABit
                                </Text>
                                <Text size="xs" c="dimmed">
                                    기술과 성장의 기록
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    <Group gap="xs">
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="md"
                            style={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                }
                            }}
                        >
                            <IconSearch size={18} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="md"
                            style={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                }
                            }}
                        >
                            <IconBell size={18} />
                        </ActionIcon>
                        <ActionIcon
                            variant="light"
                            size="lg"
                            radius="md"
                            onClick={toggleColorScheme}
                            style={{
                                background: dark ? '#21262d' : '#f3f4f6',  // 어두운 배경
                                border: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#30363d' : '#e5e7eb',  // 어두운 호버 색상
                                }
                            }}
                        >
                            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>

            {/* Navbar */}
            <AppShell.Navbar p="md" style={{
                background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 네비바
                borderRight: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
            }}>
                <AppShell.Section>
                    <Group mb="md">
                        <Logo
                            radius="xl"
                            size="lg"
                            style={{
                                border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,
                                boxShadow: 'none', // 플랫 디자인: 그림자 제거
                            }}
                            isLogo={false}
                        />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={600}>
                                LABit
                            </Text>
                            <Text size="xs" c="dimmed">
                                Full Stack Developer
                            </Text>
                            <Badge
                                size="xs"
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    marginTop: 4,
                                }}
                            >
                                4년 9개월차
                            </Badge>
                        </div>
                    </Group>
                </AppShell.Section>

                <AppShell.Section grow my="md" component={ScrollArea}>
                    <Stack gap="xs">
                        {navigationItems.map((item) => (
                            <NavLink
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                leftSection={
                                    <item.icon
                                        size={18}
                                        style={{
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                }
                                rightSection={
                                    item.badge ? (
                                        <Badge size="xs" style={{ background: '#ef4444', color: 'white' }}>
                                            {item.badge}
                                        </Badge>
                                    ) : item.active ? (
                                        <IconSparkles size={14} style={{ color: '#4c6ef5' }} />
                                    ) : null
                                }
                                active={item.active}
                                style={{
                                    borderRadius: rem(8),
                                    padding: rem(12),
                                    marginBottom: rem(4),
                                    background: item.active
                                        ? (dark ? '#21262d' : '#f3f4f6')  // 어두운 활성 배경
                                        : 'transparent',
                                    border: 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                        transform: 'translateX(4px)',
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                </AppShell.Section>

                <AppShell.Section>
                    <Text size="xs" fw={600} mb="xs" c="dimmed" tt="uppercase">
                        인기 태그
                    </Text>
                    <Stack gap="xs">
                        {popularTags.map((tag) => (
                            <UnstyledButton
                                key={tag.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: rem(8),
                                    borderRadius: rem(6),
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                    }
                                }}
                            >
                                <Group gap="xs">
                                    <Badge size="xs" style={{
                                        background: tag.color === 'blue' ? '#3b82f6' :
                                            tag.color === 'green' ? '#10b981' :
                                                tag.color === 'orange' ? '#f59e0b' :
                                                    tag.color === 'indigo' ? '#6366f1' :
                                                        '#eab308',
                                        color: 'white'
                                    }}>
                                        {tag.name}
                                    </Badge>
                                </Group>
                                <Text size="xs" c="dimmed">
                                    {tag.count}
                                </Text>
                            </UnstyledButton>
                        ))}
                    </Stack>
                </AppShell.Section>

                <AppShell.Section mt="md">
                    <Group>
                        <ActionIcon
                            component="a"
                            href="https://github.com"
                            variant="subtle"
                            size="lg"
                            radius="md"
                            style={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                }
                            }}
                        >
                            <IconBrandGithub size={18} />
                        </ActionIcon>
                        <ActionIcon
                            component="a"
                            href="https://linkedin.com"
                            variant="subtle"
                            size="lg"
                            radius="md"
                            style={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                }
                            }}
                        >
                            <IconBrandLinkedin size={18} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="md"
                            style={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                }
                            }}
                        >
                            <IconSettings size={18} />
                        </ActionIcon>
                    </Group>
                </AppShell.Section>
            </AppShell.Navbar>

            {/* Main Content */}
            <AppShell.Main>
                {/* Full Screen Hero Section */}
                <BackgroundImage src={banner}>
                    <Box
                        style={{
                            minHeight: '100vh',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: rem(60),
                            ...BackgroundBlur({ color: '#000', alpha: 0.7})
                        }}
                    >
                        <Container size="md" style={{ position: 'relative', zIndex: 10 }}>
                            <Stack align="center" gap={rem(50)} style={{ textAlign: 'center' }}>
                                {/* Badge */}
                                <Badge
                                    size="lg"
                                    radius="xl"
                                    style={{
                                        background: '#4c6ef5',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 20px',
                                        fontSize: rem(14),
                                        fontWeight: 500,
                                        animation: 'fadeInDown 0.8s ease-out',
                                    }}
                                >
                                    ✨ Welcome to LABit
                                </Badge>

                                {/* Main Headline */}
                                <Stack gap="md" align="center">
                                    <Title
                                        order={1}
                                        style={{
                                            fontSize: rem(64),
                                            fontWeight: 300,
                                            lineHeight: 1.1,
                                            color: '#fff',
                                            animation: 'fadeInUp 0.8s ease-out 0.2s both',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        Let's learn
                                    </Title>

                                    <Box style={{ position: 'relative', height: rem(80) }}>
                                        <Title
                                            order={1}
                                            style={{
                                                fontSize: rem(80),
                                                fontWeight: 700,
                                                lineHeight: 1,
                                                color: currentTech === 0
                                                    ? '#f59e0b' // Java
                                                    : currentTech === 1
                                                        ? '#10b981' // Spring
                                                        : '#3b82f6', // React
                                                animation: 'smoothChange 0.6s ease-in-out',
                                                letterSpacing: '-0.03em',
                                            }}
                                            key={currentTech}
                                        >
                                            {techStack[currentTech]}
                                        </Title>
                                    </Box>
                                </Stack>

                                {/* Description */}
                                <Text
                                    size="xl"
                                    style={{
                                        maxWidth: 600,
                                        lineHeight: 1.6,
                                        color: '#94a3b8',
                                        fontWeight: 400,
                                        animation: 'fadeInUp 0.8s ease-out 0.6s both',
                                    }}
                                >
                                    풀스택 개발자의 학습 여정을 기록하며,
                                    <Text span style={{ color: '#e2e8f0', fontWeight: 500 }}>
                                        실무 경험과 인사이트
                                    </Text>를 공유하는 공간입니다.
                                </Text>

                                {/* Tech Stack Indicators */}
                                <Group justify="center" gap="xl" style={{ animation: 'fadeInUp 0.8s ease-out 0.8s both' }}>
                                    {[
                                        { name: 'Java', icon: '☕', active: currentTech === 0 },
                                        { name: 'Spring', icon: '🍃', active: currentTech === 1 },
                                        { name: 'React', icon: '⚛️', active: currentTech === 2 },
                                    ].map((tech) => (
                                        <Stack key={tech.name} align="center" gap="xs">
                                            <Box
                                                style={{
                                                    width: rem(60),
                                                    height: rem(60),
                                                    borderRadius: '50%',
                                                    background: tech.active ? '#4c6ef5' : '#21262d',  // 매우 어두운 비활성 색상
                                                    border: tech.active ? '3px solid #60a5fa' : '3px solid #30363d',  // 어두운 보더
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: rem(24),
                                                    transition: 'all 0.5s ease',
                                                    transform: tech.active ? 'scale(1.1)' : 'scale(1)',
                                                    boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                                }}
                                            >
                                                {tech.icon}
                                            </Box>
                                            <Text
                                                size="sm"
                                                style={{
                                                    color: tech.active ? '#e2e8f0' : '#9ca3af',
                                                    fontWeight: tech.active ? 600 : 400,
                                                    transition: 'all 0.5s ease',
                                                }}
                                            >
                                                {tech.name}
                                            </Text>
                                        </Stack>
                                    ))}
                                </Group>

                                {/* Action Buttons */}
                                <Group gap="md" style={{ animation: 'fadeInUp 0.8s ease-out 1s both' }}>
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        rightSection={<IconChevronRight size={18} />}
                                        style={{
                                            background: '#4c6ef5',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 32px',
                                            fontSize: rem(16),
                                            fontWeight: 500,
                                            boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: '#3b82f6',
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    >
                                        블로그 둘러보기
                                    </Button>

                                    <Button
                                        size="lg"
                                        radius="xl"
                                        variant="outline"
                                        leftSection={<IconUser size={18} />}
                                        style={{
                                            padding: '12px 32px',
                                            fontSize: rem(16),
                                            fontWeight: 500,
                                            background: 'transparent',
                                            color: '#8b949e',  // 어두운 테마의 텍스트
                                            border: '2px solid #30363d',  // 어두운 보더
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    >
                                        개발자 소개
                                    </Button>
                                </Group>

                                {/* Progress Indicator */}
                                <Box style={{ animation: 'fadeInUp 0.8s ease-out 1.2s both' }}>
                                    <Group gap="xs" justify="center">
                                        {techStack.map((_, index) => (
                                            <Box
                                                key={index}
                                                style={{
                                                    width: currentTech === index ? rem(24) : rem(8),
                                                    height: rem(4),
                                                    borderRadius: rem(2),
                                                    background: currentTech === index ? '#4c6ef5' : '#6b7280',
                                                    transition: 'all 0.5s ease',
                                                }}
                                            />
                                        ))}
                                    </Group>
                                </Box>

                                {/* Scroll Hint */}
                                <Box
                                    style={{
                                        marginTop: rem(60),
                                        animation: 'fadeInUp 0.8s ease-out 1.4s both',
                                    }}
                                >
                                    <Stack align="center" gap="xs">
                                        <Text size="sm" c="dimmed">
                                            스크롤하여 더 많은 콘텐츠 보기
                                        </Text>
                                        <Box
                                            style={{
                                                width: rem(1),
                                                height: rem(40),
                                                background: '#30363d',  // 어두운 그레이
                                                borderRadius: rem(1),
                                                animation: 'gentlePulse 2s ease-in-out infinite',
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </Container>
                    </Box>
                </BackgroundImage>

                <Container size="lg">
                    {/* Recent Posts */}
                    <Title order={2} mb="md" style={{ color: dark ? '#f0f6fc' : '#1e293b' }}>  {/* 매우 밝은 텍스트 */}
                        최근 게시글
                    </Title>

                    <Stack gap="md">
                        {recentPosts.map((post) => (
                            <Card
                                key={post.id}
                                padding="lg"
                                radius="md"
                                style={{
                                    background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 카드 배경
                                    border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        borderColor: dark ? '#30363d' : '#d1d5db',  // 어두운 호버 보더
                                    }
                                }}
                            >
                                <Group align="flex-start" gap="md">
                                    <Image
                                        src={post.image}
                                        h={120}
                                        w={200}
                                        radius="md"
                                        style={{
                                            flexShrink: 0,
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Box style={{ flex: 1 }}>
                                        <Title order={3} size="h4" mb="xs">
                                            {post.title}
                                        </Title>
                                        <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                                            {post.excerpt}
                                        </Text>
                                        <Group justify="space-between" align="center">
                                            <Group gap="xs">
                                                <IconCalendar size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />  {/* 어두운 테마 아이콘 */}
                                                <Text size="xs" c="dimmed">{post.date}</Text>
                                                <Text size="xs" c="dimmed">·</Text>
                                                <Text size="xs" c="dimmed">{post.readTime} 읽기</Text>
                                            </Group>
                                            <Group gap="lg">
                                                <Group gap="xs">
                                                    <IconEye size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />  {/* 어두운 테마 아이콘 */}
                                                    <Text size="xs" c="dimmed">{post.views}</Text>
                                                </Group>
                                                <Group gap="xs">
                                                    <IconHeart size={14} style={{ color: '#ef4444' }} />
                                                    <Text size="xs" c="dimmed">{post.likes}</Text>
                                                </Group>
                                                <ActionIcon
                                                    variant="subtle"
                                                    size="sm"
                                                    style={{
                                                        '&:hover': {
                                                            background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                                        }
                                                    }}
                                                >
                                                    <IconShare size={14} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                    </Box>
                                </Group>
                            </Card>
                        ))}
                    </Stack>
                </Container>

                <style>
                    {`
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                        
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        
                        @keyframes rotate {
                            from { transform: translate(-50%, -50%) rotate(0deg); }
                            to { transform: translate(-50%, -50%) rotate(360deg); }
                        }
                        
                        @keyframes pulse {
                            0%, 100% { 
                                opacity: 1; 
                                transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1);
                            }
                            50% { 
                                opacity: 0.5; 
                                transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1.2);
                            }
                        }
                        
                        @keyframes fadeInDown {
                            from {
                                opacity: 0;
                                transform: translateY(-20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        
                        @keyframes fadeInUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        
                        @keyframes smoothChange {
                            0% { 
                                opacity: 0; 
                                transform: scale(0.95); 
                            }
                            100% { 
                                opacity: 1; 
                                transform: scale(1); 
                            }
                        }
                        
                        @keyframes gentlePulse {
                            0%, 100% { opacity: 0.5; }
                            50% { opacity: 1; }
                        }
                    `}
                </style>
            </AppShell.Main>
        </AppShell>
    );
};

export default TechBlogLayout;