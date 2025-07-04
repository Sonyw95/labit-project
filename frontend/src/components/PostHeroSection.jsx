import React, { useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Stack,
    Title,
    Text,
    TextInput,
    Group,
    Badge,
    Overlay,
    rem,
    ActionIcon,
    useMantineColorScheme,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import {
    IconSearch,
    IconArrowLeft,
    IconArrowRight,
    IconCalendar,
    IconEye,
    IconHeart,
} from '@tabler/icons-react';
import Autoplay from "embla-carousel-autoplay";

const PostHeroSection = ({
    featuredPosts = [],
    onSearch,
    searchPlaceholder = "게시글을 검색해보세요..."
}) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const autoplayRef = useRef(Autoplay({ delay: 1000 }));

    // 기본 featured posts 데이터
    const defaultPosts = [
        {
            id: 1,
            title: 'Spring Boot 3.0과 Virtual Threads의 혁신',
            excerpt: '새로운 Virtual Threads 기술로 더 효율적인 백엔드 개발을 경험해보세요.',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
            category: 'Spring Boot',
            date: '2025-07-04',
            views: 2340,
            likes: 89,
            readTime: '8분',
            featured: true
        },
        {
            id: 2,
            title: 'React Server Components 완벽 가이드',
            excerpt: 'RSC의 핵심 개념부터 실제 구현까지, 모던 React 개발의 새로운 패러다임을 탐구합니다.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
            category: 'React',
            date: '2025-07-02',
            views: 1820,
            likes: 67,
            readTime: '12분',
            featured: true
        },
        {
            id: 3,
            title: 'Microservices와 Docker Compose 실전 활용',
            excerpt: '컨테이너 기반 마이크로서비스 아키텍처 구축과 운영 노하우를 공유합니다.',
            image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop',
            category: 'DevOps',
            date: '2025-06-30',
            views: 1456,
            likes: 52,
            readTime: '15분',
            featured: true
        },
        {
            id: 4,
            title: 'TypeScript 고급 타입 시스템 마스터하기',
            excerpt: '복잡한 타입 추론부터 유틸리티 타입까지, TypeScript의 강력한 기능들을 깊이 있게 다룹니다.',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
            category: 'TypeScript',
            date: '2025-06-28',
            views: 1123,
            likes: 43,
            readTime: '10분',
            featured: true
        }
    ];

    const posts = featuredPosts.length > 0 ? featuredPosts : defaultPosts;

    const getCategoryColor = (category) => {
        const colors = {
            'Spring Boot': '#10b981',
            'React': '#3b82f6',
            'DevOps': '#f59e0b',
            'TypeScript': '#6366f1',
            'Java': '#f97316',
            'AWS': '#eab308'
        };
        return colors[category] || '#6b7280';
    };

    return (
        <Box
            style={{
                position: 'relative',
                minHeight: '70vh',
                overflow: 'hidden',
                marginBottom: rem(40),
            }}
        >
            <Carousel
                // plugins={[autoplayRef.current]}
                withIndicators
                withControls
                loop
                // nextControlIcon={
                //     <ActionIcon
                //         size="lg"
                //         radius="xl"
                //         style={{
                //             background: dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                //             color: dark ? '#ffffff' : '#1e293b',
                //             border: 'none',
                //             backdropFilter: 'blur(10px)',
                //         }}
                //     >
                //         <IconArrowRight size={18} />
                //     </ActionIcon>
                // }
                // previousControlIcon={
                //     <ActionIcon
                //         size="lg"
                //         radius="xl"
                //         style={{
                //             background: dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                //             color: dark ? '#ffffff' : '#1e293b',
                //             border: 'none',
                //             backdropFilter: 'blur(10px)',
                //         }}
                //     >
                //         <IconArrowLeft size={18} />
                //     </ActionIcon>
                // }
                styles={{
                    root: {
                        height: '70vh',
                    },
                    viewport: {
                        height: '100%',
                    },
                    container: {
                        height: '100%',
                    },
                    slide: {
                        height: '100%',
                    },
                    indicator: {
                        width: rem(12),
                        height: rem(4),
                        borderRadius: rem(2),
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        '&[data-active]': {
                            backgroundColor: '#4c6ef5',
                            width: rem(24),
                        },
                    },
                    indicators: {
                        bottom: rem(20),
                    },
                    controls: {
                        padding: rem(20),
                    },
                }}
            >
                {posts.map((post) => (
                    <Carousel.Slide key={post.id}>
                        <Box
                            style={{
                                height: '100%',
                                backgroundImage: `url(${post.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        >
                            <Overlay
                                color="#000"
                                opacity={0.6}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                                }}
                            />

                            <Container
                                size="lg"
                                style={{
                                    height: '100%',
                                    position: 'relative',
                                    zIndex: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Stack gap="xl" style={{ maxWidth: 600 }}>
                                    {/* Category Badge */}
                                    <Badge
                                        size="lg"
                                        radius="md"
                                        style={{
                                            background: getCategoryColor(post.category),
                                            color: 'white',
                                            fontSize: rem(14),
                                            fontWeight: 600,
                                            alignSelf: 'flex-start',
                                            animation: 'fadeInLeft 0.8s ease-out',
                                        }}
                                    >
                                        {post.category}
                                    </Badge>

                                    {/* Title */}
                                    <Title
                                        order={1}
                                        style={{
                                            fontSize: rem(48),
                                            fontWeight: 700,
                                            lineHeight: 1.2,
                                            color: '#ffffff',
                                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                            animation: 'fadeInUp 0.8s ease-out 0.2s both',
                                        }}
                                    >
                                        {post.title}
                                    </Title>

                                    {/* Excerpt */}
                                    <Text
                                        size="lg"
                                        style={{
                                            color: '#e2e8f0',
                                            lineHeight: 1.6,
                                            fontWeight: 400,
                                            textShadow: '0 1px 5px rgba(0,0,0,0.3)',
                                            animation: 'fadeInUp 0.8s ease-out 0.4s both',
                                        }}
                                    >
                                        {post.excerpt}
                                    </Text>

                                    {/* Meta Information */}
                                    <Group
                                        gap="xl"
                                        style={{
                                            animation: 'fadeInUp 0.8s ease-out 0.6s both',
                                        }}
                                    >
                                        <Group gap="xs">
                                            <IconCalendar size={16} style={{ color: '#94a3b8' }} />
                                            <Text size="sm" style={{ color: '#94a3b8' }}>
                                                {post.date}
                                            </Text>
                                        </Group>
                                        <Group gap="xs">
                                            <IconEye size={16} style={{ color: '#94a3b8' }} />
                                            <Text size="sm" style={{ color: '#94a3b8' }}>
                                                {post.views.toLocaleString()}
                                            </Text>
                                        </Group>
                                        <Group gap="xs">
                                            <IconHeart size={16} style={{ color: '#ef4444' }} />
                                            <Text size="sm" style={{ color: '#94a3b8' }}>
                                                {post.likes}
                                            </Text>
                                        </Group>
                                        <Text size="sm" style={{ color: '#94a3b8' }}>
                                            {post.readTime} 읽기
                                        </Text>
                                    </Group>
                                </Stack>
                            </Container>
                        </Box>
                    </Carousel.Slide>
                ))}
            </Carousel>

            {/* Search Section */}
            <Box
                style={{
                    position: 'absolute',
                    bottom: rem(-30),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    width: '100%',
                    maxWidth: rem(600),
                    padding: `0 ${rem(20)}`,
                }}
            >
                <Container size="sm">
                    <Box
                        style={{
                            background: dark
                                ? 'rgba(22, 27, 34, 0.95)'
                                : 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: rem(16),
                            padding: rem(8),
                            border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                            boxShadow: dark
                                ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            animation: 'fadeInUp 1s ease-out 0.8s both',
                        }}
                    >
                        <TextInput
                            size="lg"
                            radius="xl"
                            placeholder={searchPlaceholder}
                            leftSection={
                                <IconSearch
                                    size={20}
                                    style={{
                                        color: dark ? '#8b949e' : '#6b7280'
                                    }}
                                />
                            }
                            onChange={(event) => onSearch?.(event.currentTarget.value)}
                            styles={{
                                input: {
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: rem(16),
                                    padding: `${rem(16)} ${rem(50)}`,
                                    color: dark ? '#f0f6fc' : '#1e293b',
                                    '&::placeholder': {
                                        color: dark ? '#8b949e' : '#6b7280',
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }
                                },
                                section: {
                                    marginLeft: rem(20),
                                }
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            <style>
                {`
                    @keyframes fadeInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default PostHeroSection;