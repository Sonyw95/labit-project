import {useOutletContext, useParams} from "react-router-dom";
import {Box, Button, Center, Container, Divider, Group, rem, Stack, Text, Title} from "@mantine/core";
import PostList from "@/components/PostList.jsx";
import {recentPosts} from "@/constants/data.js";
import React from "react";
import {IconChevronRight, IconSparkles} from "@tabler/icons-react";

const PostPage = () => {
    // const {category} = useParams();
    const {dark} = useOutletContext();
    return (
        <>
            <Container size='lg'>
                <Stack gap='xl' mb='xl' mt='xl'>
                    {/* Header Section */}
                    <Group justify="center" gap="xs" mb='md'>
                        <Box style={{ flex: 1 }}>
                            <Center gap="xs" mb="xs">
                                <IconSparkles
                                    size={24}
                                    color={dark ? '#60a5fa' : '#3b82f6'}
                                />
                                <Title
                                    ml={10}
                                    order={2}
                                    size="h1"
                                    style={{
                                        backgroundImage: dark
                                            ? 'linear-gradient(135deg, var(--mantine-color-white) 0%, var(--mantine-color-gray-3) 100%)'
                                            : 'linear-gradient(135deg, var(--mantine-color-gray-7) 0%, var(--mantine-color-gray-8) 100%)',
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
                            </Center>
                            <Center>
                                <Text
                                    size="lg"
                                    c={dark ? 'gray.4' : 'gray.6'}
                                    style={{ maxWidth: '600px' }}
                                >
                                    최신 기술 트렌드와 개발 인사이트를 담은 포스트들을 만나보세요
                                </Text>
                            </Center>

                        </Box>

                        <Button
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                            size="md"
                            radius="md"
                            leftSection={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                            }
                            style={{
                                boxShadow: '0 4px 12px rgba(34, 139, 230, 0.4)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(34, 139, 230, 0.5)',
                                }
                            }}
                            onClick={() => {
                                // 포스팅 페이지로 이동하거나 모달 열기
                                console.log('포스트 작성 버튼 클릭');
                            }}
                        >
                            새 포스트 작성
                        </Button>
                    </Group>
                </Stack>
            </Container>
            <PostList posts={recentPosts} dark={dark} />
        </>
    )
}

export default PostPage