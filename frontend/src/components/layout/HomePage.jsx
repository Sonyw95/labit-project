import HeroSection from "@/components/HeroSection.jsx";
import PostList from "@/components/PostList.jsx";
import React, {useEffect, useState} from "react";
import {recentPosts, techStack} from "@/constants/data.js";
import {Box, Button, Center, Container, Group, rem, Stack, Text, Title} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {IconChevronRight, IconSparkles} from "@tabler/icons-react";


const HomePage = () => {
    const {loading, dark} = useOutletContext();
    const [currentTech, setCurrentTech] = useState(0);
    // 기술 스택 텍스트 변경 효과
    useEffect(() => {
        if (!loading) {
            const techTimer = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % techStack.length);
            }, 3000);

            return () => clearInterval(techTimer);
        }
    }, [loading, techStack.length]);
    return(
        <>
            <HeroSection currentTech={currentTech} dark={dark} />
            <Container size="lg">
                <Stack gap='xl' mb='xl'>
                    {/* Header Section */}
                    <Group justify="space-between" gap="xs" mb='md'>
                        <Box style={{ flex: 1 }}>
                            <Group gap="xs" mb="xs">
                                <IconSparkles
                                    size={24}
                                    color={dark ? '#60a5fa' : '#3b82f6'}
                                />
                                <Title
                                    order={2}
                                    size="h1"
                                    style={{
                                        backgroundImage: dark
                                            ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                                            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 800,
                                        fontSize: rem(32),
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    최근 게시글
                                </Title>
                            </Group>
                            <Text
                                size="lg"
                                c={dark ? 'gray.4' : 'gray.6'}
                                style={{ maxWidth: '600px' }}
                            >
                                최신 기술 트렌드와 개발 인사이트를 담은 포스트들을 만나보세요
                            </Text>
                        </Box>

                        <Button
                            variant="light"
                            size="md"
                            radius="xl"
                            rightSection={<IconChevronRight size={16} />}
                            style={{
                                background: dark
                                    ? 'rgba(96, 165, 250, 0.1)'
                                    : 'rgba(59, 130, 246, 0.1)',
                                border: `1px solid ${dark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                                color: dark ? '#60a5fa' : '#3b82f6',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark
                                        ? 'rgba(96, 165, 250, 0.2)'
                                        : 'rgba(59, 130, 246, 0.2)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            모든 글 보기
                        </Button>
                    </Group>
                </Stack>
                <PostList posts={recentPosts} dark={dark} />
                {!loading && (
                    <Center mt="xl">
                        <Button
                            variant="outline"
                            size="lg"
                            mb='xl'
                            radius="xl"
                            leftSection={<IconChevronRight size={18} />}
                            style={{
                                border: `2px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                                color: dark ? '#ffffff' : '#475569',
                                background: 'transparent',
                                fontWeight: 600,
                                padding: `${rem(12)} ${rem(32)}`,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    background: dark
                                        ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
                                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                    borderColor: dark ? '#3a3a3a' : '#cbd5e1',
                                    transform: 'translateY(-2px)',
                                    boxShadow: dark
                                        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                                        : '0 8px 25px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            더 많은 글 보기
                        </Button>
                    </Center>
                )}
            </Container>
        </>
    )
}


export default HomePage;