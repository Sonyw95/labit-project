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
    ScrollArea,
    Grid,
    Card, BackgroundImage, Anchor
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
    IconHeart,
    IconHeartFilled
} from '@tabler/icons-react';
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useCommentsByPost, useDeletePost, usePost, useTogglePostLike} from "@/hooks/api/useApi.js";
import {useNavigate, useParams, Link} from "react-router-dom";
import useAuthStore from "@/stores/authStore.js";
import {showToast} from "@/components/advanced/Toast.jsx";
import CommentSection from "@/components/section/CommentSection.jsx";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import {backgroundBlur} from "@/utils/helpers.jsx";

const PostViewPage = memo(() => {
    const theme = useMantineTheme();
    const { dark } = useTheme();
    const { postId } = useParams();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [toc, setToc] = useState([]);

    const { data: post, isLoading } = usePost(postId);
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
                    pre.style.overflowX = 'auto';
                    pre.style.padding = '1rem';
                    pre.style.borderRadius = '0.5rem';
                    pre.style.background = dark ? '#1e1e1e' : '#f5f5f5';
                }
            });
            const headings = Array.from(contentRef.current.querySelectorAll('h2'))
                .filter(el => el.id && el.innerText)
                .map(el => ({
                    id: el.id,
                    text: el.innerText,
                }));

            setToc(headings);
        }
    }, [dark, post?.content]);

    const handleDeletePost = async () => {
        try {
            await deletePostMutation.mutateAsync(postId);
            showToast.success('포스트 삭제', '포스트가 삭제되었습니다.');
            navigate('/posts');
        } catch (error) {
            showToast.error('삭제 실패', '포스트 삭제 중 오류가 발생했습니다.');
        }
        setDeleteModalOpened(false);
    };

    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '좋아요를 누르려면 로그인이 필요합니다.');
            return;
        }
        try {
            await toggleLikeMutation.mutateAsync(postId);
        } catch (error) {
            showToast.error('오류 발생', '좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: post.title,
                text: post.summary,
                url: window.location.href,
            });
        } catch (error) {
            await navigator.clipboard.writeText(window.location.href);
            showToast.success('링크 복사', '포스트 링크가 클립보드에 복사되었습니다.');
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const isAuthor = user && ( user.role.toLowerCase().include('admin') ||  post && user.id === post.author.id );

    if (isLoading) {
        return <Center h="50vh"><Loader size="lg" /></Center>;
    }

    return (
        <Box>
            <BackgroundImage
                src={post.thumbnailUrl}
                radius="md"
                style={{
                    padding: '2rem',
                    color: 'white',
                    backgroundBlendMode: 'darken',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <Container size="lg" py="xl" >
                    <Grid gutter="xl">

                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Stack spacing="xs">

                                <Badge variant="filled" color="grape" size="lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{post.category.label}</Badge>
                                <Title order={1} size={rem(40)} style={{ fontWeight: 800, color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{post.title}</Title>
                                <Text size="lg" style={{ color: 'rgba(255,255,255,0.9)' }}>{post.summary}</Text>
                                <Group spacing="md" mt="md">
                                    <Avatar src={post.author.profileImage} radius="xl" />
                                    <Box>
                                        <Text fw={600} style={{ color: 'white' }}>{post.author.nickname}</Text>
                                        <Group spacing="xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                            <Group spacing={4}><IconCalendar size={14} /><Text size="xs">{formatDate(post.publishedDate)}</Text></Group>
                                            <Group spacing={4}><IconEye size={14} /><Text size="xs">{post.viewCount.toLocaleString()}</Text></Group>
                                            <Group spacing={4}><IconMessageCircle size={14} /><Text size="xs">{post.commentCount}</Text></Group>
                                        </Group>
                                    </Box>
                                </Group>
                            </Stack>

                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Card shadow="md" radius="md" padding="lg" withBorder>
                                <Stack>
                                    <Text fw={600} size="sm">목차</Text>
                                    {toc.map(({ id, text }) => (
                                        <Anchor key={id} href={`#${id}`} size="sm" c="dimmed" display="block" my={4}>
                                            {text}
                                        </Anchor>
                                    ))}
                                    <Divider my="sm" />
                                    <ActionIcon variant="light" size="lg" onClick={handleShare}><IconShare size={18} /></ActionIcon>
                                    <ActionIcon variant="light" size="lg" onClick={handleToggleLike}>
                                        {post.isLiked ? <IconHeartFilled color="red" size={18} /> : <IconHeart size={18} />}
                                    </ActionIcon>
                                    <ActionIcon variant="light" size="lg"><IconBookmark size={18} /></ActionIcon>
                                    {isAuthor && (
                                        <Menu shadow="md">
                                            <Menu.Target><ActionIcon variant="light" size="lg"><IconDots size={18} /></ActionIcon></Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => console.log('Edit post')}>수정</Menu.Item>
                                                <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => setDeleteModalOpened(true)}>삭제</Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    )}
                                </Stack>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Container>
            </BackgroundImage>


            <Container size="lg" py="xl">
                {post.tags && (
                    <Group wrap="wrap" mb="md">
                        <IconTag size={16} style={{ color: theme.colors.gray[6] }} />
                        {post.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                size="sm"
                                radius="sm"
                                component={Link}
                                to={`/tags/${tag}`}
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </Group>
                )}

                {/*<Paper p="lg" radius="md" withBorder bg={dark ? theme.colors.dark[7] : theme.white}>*/}
                {/*</Paper>*/}
                <ScrollArea offsetScrollbars>
                    <Box
                        ref={contentRef}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        style={{
                            lineHeight: 1.8,
                            fontSize: rem(17),
                            color: dark ? theme.colors.gray[3] : theme.colors.gray[8],
                            wordBreak: 'break-word',
                        }}
                    />
                </ScrollArea>

                <Divider my="xl" />

                {/*<Paper p="md" radius="md" withBorder shadow="sm" bg={dark ? theme.colors.dark[6] : theme.colors.gray[0]}>*/}
                {/*</Paper>*/}
                <CommentSection comments={comments} />

            </Container>

            <ActionIcon
                variant="gradient"
                gradient={{ from: 'violet', to: 'blue' }}
                size="xl"
                radius="xl"
                pos="fixed"
                bottom={rem(32)}
                right={rem(32)}
                style={{
                    zIndex: 1000,
                    boxShadow: dark ? '0 8px 25px rgba(139, 92, 246, 0.4)' : '0 8px 25px rgba(109, 40, 217, 0.3)',
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <IconArrowUp size={20} />
            </ActionIcon>

            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="포스트 삭제"
                centered
                radius="lg"
            >
                <Stack>
                    <Text>정말로 이 포스트를 삭제하시겠습니까?</Text>
                    <Text size="sm" c="dimmed">삭제된 포스트는 복구할 수 없습니다.</Text>
                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={() => setDeleteModalOpened(false)} radius="md">취소</Button>
                        <Button color="red" onClick={handleDeletePost} radius="md">삭제</Button>
                    </Group>
                </Stack>
            </Modal>
        </Box>
    );
});

export default PostViewPage;
