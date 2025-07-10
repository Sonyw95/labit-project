import {useTheme} from "../hooks/useTheme.js";
import BannerSection from "../components/layout/BannerSection.jsx";
import {RECENT_POSTS, TECH_STACK} from "../constants/data.js";
import {Box, Button, Center, Container, Grid, Group, rem, Stack, Title, Text} from "@mantine/core";
import {IconChevronRight, IconSparkles} from "@tabler/icons-react";
import PostCard from "@/components/blog/PostCard.jsx";


const MainHomePage = () => {
    const {dark} = useTheme();
    // const {loading} = useOutletContext();
    return(
        <>
            <BannerSection
                variant="hero"
                title="LABit"
                // description="확장 가능하고 안정적인 백엔드 시스템 구축 경험을 나눕니다."
                techStack={TECH_STACK}
                backgroundImage= '/upload/images/banner.gif'
                showScrollIndicator
            />
            <BannerSection
                variant="stats"
            />
            <Container size="lg" mt={rem(40)}>
                <Stack gap='xl' mb='xl'>
                    {/* Header Section */}
                    <Group justify="space-between" gap="xs" mb='md'>
                        <Box style={{ flex: 1 }} p='xl'>
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
                <Grid gutter='lg'>
                    {RECENT_POSTS.map((post, index) => (
                        <Grid.Col key={post.id} span={{ base: 12, sm: 6, lg: 4 }}>
                            <PostCard key={post.id} post={post} />
                            {/*<PostCard post={post} index={index} dark={dark} />*/}
                        </Grid.Col>
                    ))}
                </Grid>
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
            </Container>
        </>
    )
}

export default MainHomePage;