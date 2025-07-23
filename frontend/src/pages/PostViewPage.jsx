import {memo, useEffect, useRef, useState} from 'react';
import {
    Container,
    Paper,
    Stack,
    Text,
    Group,
    Badge,
    ActionIcon,
    Button,
    Divider,
    Avatar,
    Menu,
    Modal,
    Loader,
    Center,
    Box,
    Title,
    useMantineTheme,
    rem,
} from '@mantine/core';
import {
    IconShare,
    IconBookmark,
    IconEdit,
    IconTrash,
    IconDots,
    IconEye,
    IconCalendar,
    IconTag,
    IconArrowUp,
    IconMessageCircle,
} from '@tabler/icons-react';
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useCommentsByPost, useDeletePost, usePost, useTogglePostLike} from "@/hooks/api/useApi.js";
import {useNavigate, useParams} from "react-router-dom";
import useAuthStore from "@/stores/authStore.js";
import {showToast} from "@/components/advanced/Toast.jsx";
import CommentSection from "@/components/section/CommentSection.jsx";
import hljs from 'highlight.js';

// Mock data for demonstration
const mockPost = {
    id: '1',
    title: 'The Future of Web Design: Exploring Modern UI/UX Trends in 2025',
    summary: 'Discover the latest design trends that are shaping the digital landscape, from Bento Box layouts to immersive user experiences.',
    content: `
        <div>
            <p>In the rapidly evolving world of web design, 2025 has emerged as a pivotal year where creativity meets functionality. The digital landscape is witnessing unprecedented changes that are reshaping how we interact with websites and applications.</p>
            
            <h2>The Rise of Bento Box Layouts</h2>
            <p>One of the most significant trends we're seeing is the adoption of Bento Box layouts. Inspired by Japanese lunch boxes, these modular designs create organized, digestible content sections that enhance user experience.</p>
            
            <h2>Immersive Typography</h2>
            <p>Typography is no longer just functional—it's becoming a central design element. Large, expressive fonts are being used as visual centerpieces, creating hierarchy and emotional impact.</p>
            
            <h2>Micro-Interactions and Animations</h2>
            <p>Subtle animations and micro-interactions are adding personality to interfaces. These small details create delightful moments that enhance user engagement without overwhelming the experience.</p>
            
            <p>As we continue into 2025, these trends represent more than just aesthetic choices—they reflect a deeper understanding of user needs and technological capabilities.</p>
        </div>
    `,
    author: {
        id: '1',
        nickname: 'Sarah Chen',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=400&auto=format&fit=crop&q=60',
    },
    category: {
        label: 'Design',
        color: 'violet'
    },
    tags: ['UI/UX', 'Web Design', 'Trends', '2025'],
    publishedDate: '2025-01-15T10:00:00Z',
    viewCount: 1247,
    likeCount: 89,
    commentCount: 23,
    thumbnailUrl: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=1200&auto=format&fit=crop&q=80',
    isLiked: false,
};
const ModernBlogPostPage = memo(() => {
    const theme = useMantineTheme();
    const { dark } = useTheme();

    const { postId } = useParams();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    // API 훅
    const { data: post, isLoading, error } = usePost(postId)
    const { data: comments } = useCommentsByPost(postId);
    const deletePostMutation = useDeletePost();
    const toggleLikeMutation = useTogglePostLike();
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const codeBlocks = contentRef.current.querySelectorAll('pre');

            codeBlocks.forEach((pre) => {
                const code = pre.querySelector('code');
                if (code) {
                    hljs.highlightElement(code);
                }
            });
        }
    }, [dark, post?.content]);
    // 포스트 삭제
    const handleDeletePost = async () => {
        try {
            await deletePostMutation.mutateAsync(postId);
            showToast.success('포스트 삭제', '포스트가 삭제되었습니다.')
            navigate('/posts');
        } catch (error) {
            showToast.error('삭제 실패', '포스트 삭제 중 오류가 발생했습니다.')
        }
        setDeleteModalOpened(false);
    };

    // 좋아요 토글
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '좋아요를 누르려면 로그인이 필요합니다.')
            return;
        }
        try {
            await toggleLikeMutation.mutateAsync(postId);
        } catch (error) {
            showToast.error('오류 발생', '좋아요 처리 중 오류가 발생했습니다.')
        }
    };

    // 공유하기
    const handleShare = async () => {
        try {
            await navigator.share({
                title: post.title,
                text: post.summary,
                url: window.location.href,
            });
        } catch (error) {
            // Web Share API를 지원하지 않는 경우 클립보드에 복사
            await navigator.clipboard.writeText(window.location.href);
            showToast.success('링크 복사', '포스트 링크가 클립보드에 복사되었습니다.')
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isAuthor = user && post && user.id === post.author.id;

    if (isLoading) {
        return (
            <Center h="50vh">
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Box>
            {/* Hero Banner Section */}
            <Box
                pos="relative"
                h="60vh"
                style={{
                    backgroundImage: `linear-gradient(135deg, 
                        ${dark
                        ? 'rgba(0, 0, 0, 0.7), rgba(30, 41, 59, 0.8)'
                        : 'rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)'
                    }), url(${post.thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Container size="lg">
                    <Stack align="center" gap="xl">
                        {/* Category Badge */}
                        <Badge
                            size="lg"
                            variant="filled"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                color: theme.colors.gray[8],
                                fontSize: rem(14),
                                fontWeight: 600,
                                padding: `${rem(8)} ${rem(16)}`,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            {post.category.label}
                        </Badge>

                        {/* Main Title */}
                        <Title
                            order={1}
                            size={rem(56)}
                            fw={800}
                            ta="center"
                            c="white"
                            lh={1.1}
                            maw={900}
                            style={{
                                textShadow: '2px 4px 20px rgba(0,0,0,0.8)',
                            }}
                        >
                            {post.title}
                        </Title>

                        {/* Subtitle */}
                        <Text
                            size="xl"
                            ta="center"
                            c="rgba(255, 255, 255, 0.9)"
                            fw={400}
                            maw={600}
                            lh={1.6}
                            style={{
                                textShadow: '1px 2px 12px rgba(0,0,0,0.6)'
                            }}
                        >
                            {post.summary}
                        </Text>
                    </Stack>
                </Container>

                {/* Decorative Element */}
                <Box
                    pos="absolute"
                    top="15%"
                    right="8%"
                    w={150}
                    h={150}
                    style={{
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        borderRadius: '50%',
                        filter: 'blur(1px)',
                    }}
                />
                <Box
                    pos="absolute"
                    bottom="20%"
                    left="5%"
                    w={100}
                    h={100}
                    style={{
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                        borderRadius: '50%',
                        filter: 'blur(1px)',
                    }}
                />
            </Box>

            <Container size="lg" mt={rem(-64)} pos="relative" style={{ zIndex: 3 }}>
                {/* Author Info Card */}
                <Paper
                    shadow="xl"
                    p="xl"
                    mb="xl"
                    bg={dark ? theme.colors.dark[7] : theme.white}
                    style={{
                        border: dark
                            ? `1px solid ${theme.colors.dark[4]}`
                            : `1px solid ${theme.colors.gray[2]}`
                    }}
                >
                    <Group justify="space-between" align="flex-start">
                        <Group align="center" gap="lg">
                            <Avatar
                                src={post.author.profileImage}
                                alt={post.author.nickname}
                                size="xl"
                                radius="xl"
                                style={{
                                    border: dark
                                        ? `3px solid ${theme.colors.dark[4]}`
                                        : `3px solid ${theme.colors.gray[2]}`,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Box>
                                <Text fw={700} size="lg" mb="xs">
                                    {post.author.nickname}
                                </Text>
                                <Group gap="lg" c="dimmed">
                                    <Group gap="xs">
                                        <IconCalendar size={16} />
                                        <Text size="sm">
                                            {formatDate(post.publishedDate)}
                                        </Text>
                                    </Group>
                                    <Group gap="xs">
                                        <IconEye size={16} />
                                        <Text size="sm">{post.viewCount.toLocaleString()}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <IconMessageCircle size={16} />
                                        <Text size="sm">{post.commentCount}</Text>
                                    </Group>
                                </Group>
                            </Box>
                        </Group>

                        {/* Action Buttons */}
                        <Group gap="md">
                            {/*<ActionIcon*/}
                            {/*    variant={isLiked ? "filled" : "light"}*/}
                            {/*    color={isLiked ? "red" : "gray"}*/}
                            {/*    size="xl"*/}
                            {/*    radius="xl"*/}
                            {/*    onClick={handleToggleLike}*/}
                            {/*    style={{*/}
                            {/*        transition: 'all 0.2s ease',*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}*/}
                            {/*</ActionIcon>*/}
                            {/*<Text fw={600} size="sm">{likeCount}</Text>*/}

                            <ActionIcon
                                variant="light"
                                size="xl"
                                radius="xl"
                                onClick={handleShare}
                                style={{
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <IconShare size={20} />
                            </ActionIcon>

                            <ActionIcon
                                variant="light"
                                size="xl"
                                radius="xl"
                                style={{
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <IconBookmark size={20} />
                            </ActionIcon>

                            {isAuthor && (
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <ActionIcon variant="light" size="xl" radius="xl">
                                            <IconDots size={20} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={<IconEdit size={16} />}
                                            onClick={() => console.log('Edit post')}
                                        >
                                            수정
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<IconTrash size={16} />}
                                            color="red"
                                            onClick={() => setDeleteModalOpened(true)}
                                        >
                                            삭제
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </Group>
                    </Group>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <Group gap="xs" mt="lg">
                            <IconTag size={16} style={{ color: theme.colors.gray[6] }} />
                            {post.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="gradient"
                                    gradient={{ from: 'violet', to: 'blue', deg: 45 }}
                                    size="sm"
                                    fw={500}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </Group>
                    )}
                    <Divider size="sm" mb="xl" mt="xl" />

                    {/* Content Section */}
                    {/*<Container shadow="sm" p={rem(48)} mb="xl">*/}
                    {/*    <Box*/}
                    {/*        ref={contentRef}*/}
                    {/*        dangerouslySetInnerHTML={{__html: post.content}}*/}
                    {/*        style={{*/}
                    {/*            lineHeight: 1.8,*/}
                    {/*            fontSize: rem(14),*/}
                    {/*            color: dark ? theme.colors.gray[3] : theme.colors.gray[7],*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Container>*/}
                    <Box
                        ref={contentRef}
                        dangerouslySetInnerHTML={{__html: post.content}}
                        mt={100}
                        style={{
                            lineHeight: 1.8,
                            fontSize: rem(18),
                            color: dark ? theme.colors.gray[3] : theme.colors.gray[7],
                        }}
                    />
                </Paper>

                {/* Floating Action Button */}
                <ActionIcon
                    variant="gradient"
                    gradient={{from: 'violet', to: 'blue'}}
                    size="xl"
                    radius="xl"
                    pos="fixed"
                    bottom={rem(32)}
                    right={rem(32)}
                    style={{
                        zIndex: 1000,
                        boxShadow: dark
                            ? '0 8px 25px rgba(139, 92, 246, 0.4)'
                            : '0 8px 25px rgba(109, 40, 217, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <IconArrowUp size={20} />
                </ActionIcon>

                <Divider size="sm" mb="xl" />

                {/* Comments Section */}
                <CommentSection comments={comments} />

                {/* Delete Modal */}
                <Modal
                    opened={deleteModalOpened}
                    onClose={() => setDeleteModalOpened(false)}
                    title="포스트 삭제"
                    centered
                    radius="lg"
                >
                    <Stack>
                        <Text>정말로 이 포스트를 삭제하시겠습니까?</Text>
                        <Text size="sm" c="dimmed">
                            삭제된 포스트는 복구할 수 없습니다.
                        </Text>

                        <Group justify="flex-end" mt="md">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpened(false)}
                                radius="md"
                            >
                                취소
                            </Button>
                            <Button
                                color="red"
                                onClick={() => {/* handle delete */}}
                                radius="md"
                            >
                                삭제
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Container>
        </Box>
    );
});

export default ModernBlogPostPage;