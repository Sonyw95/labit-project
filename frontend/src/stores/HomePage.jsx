import {memo, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Stack,
    Box,
    Text,
    Group,
    Avatar,
    Badge,
    Button,
    Grid,
    Divider,
    ActionIcon,
    Loader,
    Center,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconBrandGithub,
    IconMail,
    IconMapPin,
    IconCalendar,
    IconEye,
    IconArrowRight,
    IconTrendingUp,
    IconClock,
    IconTag,
} from '@tabler/icons-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import useAuthStore from "../stores/authStore.js";
import { postService } from "../api/service.js";
import PostCard from "../components/section/post/PostCard.jsx";

const MainPage = memo(() => {
        const navigate = useNavigate();
        const { user } = useAuthStore();
        const { colorScheme } = useMantineColorScheme();

        // velog 스타일 색상
        const velogColors = {
            primary: '#12B886',
            text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
            subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
            background: colorScheme === 'dark' ? '#1A1B23' : '#f8f9fa',
            border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
            hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
            section: colorScheme === 'dark' ? '#1E1F25' : '#FAFAFA',
        };

        // 최신 포스트 조회
        const { data: latestPosts, isLoading: latestLoading } = useInfiniteQuery({
            queryKey: ['posts', 'latest'],
            queryFn: () => postService.getPosts({ page: 0, size: 6 }),
            getNextPageParam: () => undefined, // 첫 페이지만
            staleTime: 5 * 60 * 1000,
        });

        // 인기 포스트 조회 (예시)
        const { data: popularPosts, isLoading: popularLoading } = useInfiniteQuery({
            queryKey: ['posts', 'popular'],
            queryFn: () => postService.getPosts({ page: 0, size: 4, sort: 'likeCount,desc' }),
            getNextPageParam: () => undefined,
            staleTime: 5 * 60 * 1000,
        });

        const latestPostsList = useMemo(() => {
            return latestPosts?.pages?.[0]?.content || [];
        }, [latestPosts]);

        const popularPostsList = useMemo(() => {
            return popularPosts?.pages?.[0]?.content || [];
        }, [popularPosts]);

        // 관리자 정보 (임시 데이터)
        const adminInfo = {
            name: "김개발자",
            role: "Full Stack Developer",
            bio: "안녕하세요! 웹 개발과 새로운 기술에 관심이 많은 개발자입니다. React, Node.js, Spring Boot를 주로 사용하며, 사용자 경험을 중시하는 서비스를 만들고 있습니다.",
            profileImage: "https://via.placeholder.com/120x120?text=Profile",
            location: "Seoul, Korea",
            email: "developer@example.com",
            github: "https://github.com/developer",
            totalPosts: latestPostsList.length || 0,
            totalViews: "12.5K"
        };

        // 인기 태그 (임시 데이터)
        const popularTags = [
            { name: "React", count: 24 },
            { name: "JavaScript", count: 18 },
            { name: "TypeScript", count: 15 },
            { name: "Node.js", count: 12 },
            { name: "Spring Boot", count: 10 },
            { name: "Vue.js", count: 8 }
        ];

        return (
            <Box bg={velogColors.background} style={{ minHeight: '100vh' }}>
                <Container size="xl" py="3rem">
                    <Stack gap="4rem">
                        {/* Hero Section - Admin 명함 */}
                        <Box
                            p="3rem"
                            style={{
                                // backgroundColor: velogColors.section,
                                // borderRadius: '16px',
                                // border: `1px solid ${velogColors.border}`,
                            }}
                        >
                            <Grid>
                                <Grid.Col span={{ base: 12, md: 8 }}>
                                    <Stack gap="xl">
                                        <Group gap="xl">
                                            <Avatar
                                                src={adminInfo.profileImage}
                                                alt={adminInfo.name}
                                                size="xl"
                                                style={{
                                                    border: `3px solid ${velogColors.primary}`,
                                                }}
                                            />
                                            <Box>
                                                <Text
                                                    size="2.5rem"
                                                    fw={800}
                                                    c={velogColors.text}
                                                    style={{
                                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {adminInfo.name}
                                                </Text>
                                                <Text
                                                    size="xl"
                                                    c={velogColors.primary}
                                                    fw={600}
                                                    mt="xs"
                                                >
                                                    {adminInfo.role}
                                                </Text>
                                                <Group gap="md" mt="sm" c={velogColors.subText}>
                                                    <Group gap="xs">
                                                        <IconMapPin size={16} />
                                                        <Text size="sm">{adminInfo.location}</Text>
                                                    </Group>
                                                    <Group gap="xs">
                                                        <IconCalendar size={16} />
                                                        <Text size="sm">2020년부터</Text>
                                                    </Group>
                                                </Group>
                                            </Box>
                                        </Group>

                                        <Text
                                            size="lg"
                                            c={velogColors.subText}
                                            lh={1.6}
                                            style={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            }}
                                        >
                                            {adminInfo.bio}
                                        </Text>

                                        <Group gap="md">
                                            <ActionIcon
                                                component="a"
                                                href={adminInfo.github}
                                                target="_blank"
                                                size="lg"
                                                variant="outline"
                                                color="gray"
                                                style={{
                                                    borderColor: velogColors.border,
                                                    color: velogColors.text,
                                                    '&:hover': {
                                                        backgroundColor: velogColors.hover,
                                                        borderColor: velogColors.primary,
                                                    }
                                                }}
                                            >
                                                <IconBrandGithub size={20} />
                                            </ActionIcon>
                                            <ActionIcon
                                                component="a"
                                                href={`mailto:${adminInfo.email}`}
                                                size="lg"
                                                variant="outline"
                                                color="gray"
                                                style={{
                                                    borderColor: velogColors.border,
                                                    color: velogColors.text,
                                                    '&:hover': {
                                                        backgroundColor: velogColors.hover,
                                                        borderColor: velogColors.primary,
                                                    }
                                                }}
                                            >
                                                <IconMail size={20} />
                                            </ActionIcon>
                                        </Group>
                                    </Stack>
                                </Grid.Col>

                                {/*<Grid.Col span={{ base: 12, md: 4 }}>*/}
                                {/*    <Stack gap="lg">*/}
                                {/*        <Box*/}
                                {/*            p="lg"*/}
                                {/*            style={{*/}
                                {/*                backgroundColor: velogColors.background,*/}
                                {/*                borderRadius: '12px',*/}
                                {/*                border: `1px solid ${velogColors.border}`,*/}
                                {/*                textAlign: 'center'*/}
                                {/*            }}*/}
                                {/*        >*/}
                                {/*            <Stack gap="md">*/}
                                {/*                <Text fw={600} c={velogColors.text}>블로그 통계</Text>*/}
                                {/*                <Group justify="center" gap="xl">*/}
                                {/*                    <Box style={{ textAlign: 'center' }}>*/}
                                {/*                        <Text size="xl" fw={700} c={velogColors.primary}>*/}
                                {/*                            {adminInfo.totalPosts}*/}
                                {/*                        </Text>*/}
                                {/*                        <Text size="sm" c={velogColors.subText}>*/}
                                {/*                            포스트*/}
                                {/*                        </Text>*/}
                                {/*                    </Box>*/}
                                {/*                    <Box style={{ textAlign: 'center' }}>*/}
                                {/*                        <Text size="xl" fw={700} c={velogColors.primary}>*/}
                                {/*                            {adminInfo.totalViews}*/}
                                {/*                        </Text>*/}
                                {/*                        <Text size="sm" c={velogColors.subText}>*/}
                                {/*                            조회수*/}
                                {/*                        </Text>*/}
                                {/*                    </Box>*/}
                                {/*                </Group>*/}
                                {/*            </Stack>*/}
                                {/*        </Box>*/}

                                {/*        /!* 인기 태그 *!/*/}
                                {/*        <Box*/}
                                {/*            p="lg"*/}
                                {/*            style={{*/}
                                {/*                backgroundColor: velogColors.background,*/}
                                {/*                borderRadius: '12px',*/}
                                {/*                border: `1px solid ${velogColors.border}`,*/}
                                {/*            }}*/}
                                {/*        >*/}
                                {/*            <Stack gap="md">*/}
                                {/*                <Group gap="xs">*/}
                                {/*                    <IconTag size={16} color={velogColors.primary} />*/}
                                {/*                    <Text fw={600} c={velogColors.text}>인기 태그</Text>*/}
                                {/*                </Group>*/}
                                {/*                <Group gap="xs">*/}
                                {/*                    {popularTags.slice(0, 6).map((tag) => (*/}
                                {/*                        <Badge*/}
                                {/*                            key={tag.name}*/}
                                {/*                            variant="light"*/}
                                {/*                            size="sm"*/}
                                {/*                            style={{*/}
                                {/*                                backgroundColor: `${velogColors.primary}15`,*/}
                                {/*                                color: velogColors.primary,*/}
                                {/*                                cursor: 'pointer',*/}
                                {/*                            }}*/}
                                {/*                            onClick={() => navigate(`/posts?tag=${tag.name}`)}*/}
                                {/*                        >*/}
                                {/*                            {tag.name} {tag.count}*/}
                                {/*                        </Badge>*/}
                                {/*                    ))}*/}
                                {/*                </Group>*/}
                                {/*            </Stack>*/}
                                {/*        </Box>*/}
                                {/*    </Stack>*/}
                                {/*</Grid.Col>*/}
                            </Grid>
                        </Box>

                        {/* 최신 포스트 섹션 */}
                        <Stack gap="xl">
                            <Group justify="space-between" align="center">
                                <Group gap="sm">
                                    <IconClock size={24} color={velogColors.primary} />
                                    <Text
                                        size="2rem"
                                        fw={700}
                                        c={velogColors.text}
                                        style={{
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }}
                                    >
                                        최신 포스트
                                    </Text>
                                </Group>
                                <Button
                                    variant="subtle"
                                    rightSection={<IconArrowRight size={16} />}
                                    onClick={() => navigate('/posts')}
                                    style={{
                                        color: velogColors.primary,
                                        '&:hover': {
                                            backgroundColor: `${velogColors.primary}15`,
                                        }
                                    }}
                                >
                                    전체 보기
                                </Button>
                            </Group>

                            {latestLoading ? (
                                <Center py="xl">
                                    <Loader size="lg" color={velogColors.primary} />
                                </Center>
                            ) : (
                                <Grid gutter="xl">
                                    {latestPostsList.slice(0, 6).map((post) => (
                                        <Grid.Col key={post.id} span={{ base: 12, sm: 6, lg: 4 }}>
                                            <PostCard post={post} />
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            )}
                        </Stack>

                        <Divider color={velogColors.border} />

                        {/* 인기 포스트 섹션 */}
                        <Stack gap="xl">
                            <Group gap="sm">
                                <IconTrendingUp size={24} color={velogColors.primary} />
                                <Text
                                    size="2rem"
                                    fw={700}
                                    c={velogColors.text}
                                    style={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    인기 포스트
                                </Text>
                            </Group>

                            {popularLoading ? (
                                <Center py="xl">
                                    <Loader size="lg" color={velogColors.primary} />
                                </Center>
                            ) : (
                                <Grid gutter="xl">
                                    {popularPostsList.slice(0, 4).map((post) => (
                                        <Grid.Col key={post.id} span={{ base: 12, sm: 6 }}>
                                            <PostCard post={post} />
                                        </Grid.Col>
                                    ))}
                                </Grid>
                            )}
                        </Stack>

                        {/* CTA 섹션 */}
                        <Box
                            p="3rem"
                            style={{
                                backgroundColor: velogColors.section,
                                borderRadius: '16px',
                                border: `1px solid ${velogColors.border}`,
                                textAlign: 'center'
                            }}
                        >
                            <Stack gap="lg" align="center">
                                <Text
                                    size="1.5rem"
                                    fw={700}
                                    c={velogColors.text}
                                    style={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    더 많은 개발 이야기가 궁금하신가요?
                                </Text>
                                <Text size="lg" c={velogColors.subText}>
                                    새로운 포스트가 업데이트될 때마다 알림을 받아보세요!
                                </Text>
                                <Group gap="md">
                                    <Button
                                        size="lg"
                                        onClick={() => navigate('/posts')}
                                        style={{
                                            backgroundColor: velogColors.primary,
                                            '&:hover': {
                                                backgroundColor: '#0CA678'
                                            }
                                        }}
                                    >
                                        모든 포스트 보기
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => navigate('/about')}
                                        style={{
                                            borderColor: velogColors.border,
                                            color: velogColors.text,
                                            '&:hover': {
                                                backgroundColor: velogColors.hover,
                                                borderColor: velogColors.primary,
                                            }
                                        }}
                                    >
                                        About
                                    </Button>
                                </Group>
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        );
    }
)
export default MainPage;