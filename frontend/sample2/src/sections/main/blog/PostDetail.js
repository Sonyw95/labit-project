import React, { useState } from 'react';
import {
    Container,
    Paper,
    Text,
    Title,
    Group,
    Avatar,
    ActionIcon,
    Badge,
    Divider,
    TextInput,
    Button,
    Textarea,
    Stack,
    Box,
    Image,
    Anchor,
    Card,
    Switch,
    useMantineColorScheme,
    useMantineTheme,
    Affix,
    Transition,
    rem,
    Space,
    Flex,
    Center
} from '@mantine/core';
import {
    IconHeart,
    IconShare,
    IconBookmark,
    IconMessageCircle,
    IconSun,
    IconMoon,
    IconChevronUp,
    IconChevronDown,
    IconArrowLeft,
    IconArrowRight,
    IconDots,
    IconEye,
    IconCalendar
} from '@tabler/icons-react';

export default function PostDetail() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(null);

    const isDark = colorScheme === 'dark';

    // 2025 트렌드: 유기적 형태의 그라데이션 배경
    const gradientBg = isDark
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)';

    // 댓글 데이터 (예시)
    const comments = [
        {
            id: 1,
            author: 'Alice Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
            content: '정말 유익한 포스트네요! 특히 모바일 우선 디자인 부분이 인상깊었습니다.',
            timestamp: '2시간 전',
            likes: 12,
            replies: [
                {
                    id: 11,
                    author: 'Bob Smith',
                    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
                    content: '저도 동감입니다. 2025년 트렌드를 잘 반영했네요!',
                    timestamp: '1시간 전',
                    likes: 5
                }
            ]
        },
        {
            id: 2,
            author: 'Charlie Brown',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
            content: 'Mantine v8의 새로운 기능들이 정말 인상적이네요. 다음 프로젝트에 적용해보고 싶습니다.',
            timestamp: '3시간 전',
            likes: 8,
            replies: []
        }
    ];

    const handleCommentSubmit = () => {
        console.log('댓글 작성:', commentText);
        setCommentText('');
    };

    const handleReplySubmit = (commentId) => {
        console.log('답글 작성:', replyText, '댓글 ID:', commentId);
        setReplyText('');
        setShowReplyForm(null);
    };

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box style={{ minHeight: '100vh', background: isDark ? theme.colors.dark[8] : theme.colors.gray[0] }}>
            {/* PostPage Navigator - 2025 트렌드: Bento Box 스타일의 네비게이션 */}
            <Paper
                shadow="sm"
                p="md"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                    background: isDark ? 'rgba(36, 36, 36, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 0
                }}
            >
                <Container size="xl">
                    <Group justify="space-between" align="center">
                        <Group>
                            <ActionIcon
                                variant="light"
                                size="lg"
                                style={{
                                    background: gradientBg,
                                    color: 'white',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <IconArrowLeft size="1.2rem" />
                            </ActionIcon>
                            <Text size="sm" c="dimmed">이전 포스트</Text>
                        </Group>

                        <Group>
                            <Switch
                                size="md"
                                color="violet"
                                onLabel={<IconSun size="1rem" />}
                                offLabel={<IconMoon size="1rem" />}
                                checked={!isDark}
                                onChange={() => toggleColorScheme()}
                                styles={{
                                    track: {
                                        background: gradientBg
                                    }
                                }}
                            />
                        </Group>

                        <Group>
                            <Text size="sm" c="dimmed">다음 포스트</Text>
                            <ActionIcon
                                variant="light"
                                size="lg"
                                style={{
                                    background: gradientBg,
                                    color: 'white',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <IconArrowRight size="1.2rem" />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Container>
            </Paper>

            <Container size="md" py="xl">
                {/* PostPage Banner Image - 2025 트렌드: 유기적 형태와 그라데이션 */}
                <Paper
                    radius="xl"
                    overflow="hidden"
                    mb="xl"
                    style={{
                        position: 'relative',
                        background: gradientBg,
                        minHeight: '400px'
                    }}
                >
                    <Box
                        style={{
                            position: 'relative',
                            height: '400px',
                            background: `url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200') center/cover`,
                            borderRadius: theme.radius.xl,
                            overflow: 'hidden'
                        }}
                    >
                        {/* 유기적 형태의 오버레이 */}
                        <Box
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(45deg, ${isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.2)'} 0%, transparent 70%)`,
                                borderRadius: theme.radius.xl
                            }}
                        />

                        {/* 포스트 메타 정보 */}
                        <Box
                            style={{
                                position: 'absolute',
                                bottom: 30,
                                left: 30,
                                right: 30,
                                color: 'white'
                            }}
                        >
                            <Title order={1} size="h1" mb="md" style={{ fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                                2025 웹 디자인 트렌드와 Mantine v8의 혁신
                            </Title>
                            <Group gap="lg">
                                <Group gap="xs">
                                    <IconCalendar size="1rem" />
                                    <Text size="sm">2025년 6월 25일</Text>
                                </Group>
                                <Group gap="xs">
                                    <IconEye size="1rem" />
                                    <Text size="sm">1,234 views</Text>
                                </Group>
                            </Group>
                        </Box>
                    </Box>
                </Paper>

                {/* Author Info & Actions - 2025 트렌드: 카드 기반 레이아웃 */}
                <Card shadow="sm" padding="lg" radius="xl" mb="xl" style={{ border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}>
                    <Group justify="space-between" align="center">
                        <Group>
                            <Avatar
                                size="lg"
                                radius="xl"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                style={{
                                    border: `3px solid transparent`,
                                    background: gradientBg
                                }}
                            />
                            <Box>
                                <Text fw={600} size="lg">김개발자</Text>
                                <Text size="sm" c="dimmed">프론트엔드 개발자 • 5분 읽기</Text>
                            </Box>
                        </Group>

                        <Group gap="xs">
                            <ActionIcon
                                variant={liked ? "filled" : "light"}
                                color={liked ? "red" : "gray"}
                                size="lg"
                                radius="xl"
                                onClick={() => setLiked(!liked)}
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                <IconHeart size="1.2rem" />
                            </ActionIcon>
                            <ActionIcon variant="light" size="lg" radius="xl">
                                <IconShare size="1.2rem" />
                            </ActionIcon>
                            <ActionIcon
                                variant={bookmarked ? "filled" : "light"}
                                color={bookmarked ? "yellow" : "gray"}
                                size="lg"
                                radius="xl"
                                onClick={() => setBookmarked(!bookmarked)}
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                <IconBookmark size="1.2rem" />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card>

                {/* PostPage Content - 2025 트렌드: 개선된 가독성과 여백 활용 */}
                <Paper p="xl" radius="xl" shadow="sm" mb="xl" style={{ border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}>
                    <Stack gap="xl">
                        <Text size="lg" style={{ lineHeight: 1.8 }}>
                            2025년은 웹 디자인에서 혁신적인 변화를 가져올 것으로 예상됩니다.
                            특히 모바일 우선 디자인, 유기적 형태의 UI 요소, 그리고 AI 기반 개인화가
                            주요 트렌드로 떠오르고 있습니다.
                        </Text>

                        <Divider variant="dashed" />

                        <Box>
                            <Title order={2} size="h3" mb="md" style={{
                                background: gradientBg,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                주요 트렌드 분석
                            </Title>
                            <Text size="md" style={{ lineHeight: 1.7 }}>
                                Mantine v8.1.1에서는 CSS 모듈화, 새로운 스타일링 API, 그리고 향상된
                                다크모드 지원이 도입되었습니다. 이러한 변화는 개발자 경험을 크게 개선하며,
                                더욱 현대적이고 접근성이 뛰어난 웹 애플리케이션 구축을 가능하게 합니다.
                            </Text>
                        </Box>

                        <Card radius="lg" p="lg" style={{
                            background: isDark ? theme.colors.dark[6] : theme.colors.blue[0],
                            border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.blue[2]}`
                        }}>
                            <Text fw={600} mb="sm">💡 핵심 포인트</Text>
                            <Text size="sm" style={{ lineHeight: 1.6 }}>
                                2025년 웹 디자인은 사용자 경험을 중심으로 한 인터랙티브한 요소들과
                                지속가능한 디자인 접근법에 초점을 맞추고 있습니다.
                            </Text>
                        </Card>

                        <Group>
                            <Badge variant="gradient" gradient={{ from: 'blue', to: 'purple' }} size="lg">웹 디자인</Badge>
                            <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime' }} size="lg">Mantine</Badge>
                            <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="lg">2025 트렌드</Badge>
                        </Group>
                    </Stack>
                </Paper>

                {/* Comment Form - 2025 트렌드: 인터랙티브 폼 디자인 */}
                <Card shadow="sm" padding="xl" radius="xl" mb="xl" style={{
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                    background: isDark ? theme.colors.dark[7] : theme.colors.gray[0]
                }}>
                    <Title order={3} size="h4" mb="lg">
                        💬 댓글 작성
                    </Title>
                    <Stack>
                        <Textarea
                            placeholder="이 포스트에 대한 의견을 남겨보세요..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            minRows={4}
                            radius="lg"
                            style={{
                                '& .mantine-Textarea-input': {
                                    border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                    transition: 'all 0.3s ease'
                                },
                                '& .mantine-Textarea-input:focus': {
                                    borderImage: gradientBg,
                                    borderImageSlice: 1
                                }
                            }}
                        />
                        <Group justify="flex-end">
                            <Button
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'purple' }}
                                radius="xl"
                                size="md"
                                onClick={handleCommentSubmit}
                                disabled={!commentText.trim()}
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                댓글 등록
                            </Button>
                        </Group>
                    </Stack>
                </Card>

                {/* Comments List - 2025 트렌드: 카드 기반 계층 구조 */}
                <Card shadow="sm" padding="xl" radius="xl" style={{ border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}>
                    <Title order={3} size="h4" mb="xl">
                        💭 댓글 ({comments.length + comments.reduce((acc, comment) => acc + comment.replies.length, 0)})
                    </Title>

                    <Stack gap="xl">
                        {comments.map((comment) => (
                            <Box key={comment.id}>
                                {/* Main Comment */}
                                <Paper
                                    p="lg"
                                    radius="lg"
                                    style={{
                                        border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                                        background: isDark ? theme.colors.dark[6] : 'white'
                                    }}
                                >
                                    <Group align="flex-start" gap="md">
                                        <Avatar
                                            src={comment.avatar}
                                            radius="xl"
                                            size="md"
                                            style={{
                                                border: `2px solid transparent`,
                                                background: gradientBg
                                            }}
                                        />
                                        <Box style={{ flex: 1 }}>
                                            <Group justify="space-between" align="center" mb="xs">
                                                <Group gap="xs">
                                                    <Text fw={600}>{comment.author}</Text>
                                                    <Text size="xs" c="dimmed">{comment.timestamp}</Text>
                                                </Group>
                                                <ActionIcon variant="subtle" size="sm">
                                                    <IconDots size="1rem" />
                                                </ActionIcon>
                                            </Group>

                                            <Text mb="md" style={{ lineHeight: 1.6 }}>
                                                {comment.content}
                                            </Text>

                                            <Group gap="lg">
                                                <Group gap="xs">
                                                    <ActionIcon variant="subtle" size="sm" color="red">
                                                        <IconHeart size="0.9rem" />
                                                    </ActionIcon>
                                                    <Text size="sm" c="dimmed">{comment.likes}</Text>
                                                </Group>
                                                <Button
                                                    variant="subtle"
                                                    size="xs"
                                                    leftSection={<IconMessageCircle size="0.8rem" />}
                                                    onClick={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
                                                >
                                                    답글
                                                </Button>
                                            </Group>
                                        </Box>
                                    </Group>
                                </Paper>

                                {/* Reply Form */}
                                {showReplyForm === comment.id && (
                                    <Box ml="xl" mt="md">
                                        <Paper p="md" radius="lg" style={{
                                            border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                                            background: isDark ? theme.colors.dark[7] : theme.colors.gray[0]
                                        }}>
                                            <Stack gap="sm">
                                                <Textarea
                                                    placeholder="답글을 작성해보세요..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    minRows={2}
                                                    radius="md"
                                                />
                                                <Group justify="flex-end" gap="xs">
                                                    <Button
                                                        variant="subtle"
                                                        size="xs"
                                                        onClick={() => setShowReplyForm(null)}
                                                    >
                                                        취소
                                                    </Button>
                                                    <Button
                                                        variant="gradient"
                                                        gradient={{ from: 'teal', to: 'blue' }}
                                                        size="xs"
                                                        onClick={() => handleReplySubmit(comment.id)}
                                                        disabled={!replyText.trim()}
                                                    >
                                                        답글 등록
                                                    </Button>
                                                </Group>
                                            </Stack>
                                        </Paper>
                                    </Box>
                                )}

                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                    <Box ml="xl" mt="md">
                                        <Stack gap="md">
                                            {comment.replies.map((reply) => (
                                                <Paper
                                                    key={reply.id}
                                                    p="md"
                                                    radius="lg"
                                                    style={{
                                                        border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                                                        background: isDark ? theme.colors.dark[7] : theme.colors.gray[0]
                                                    }}
                                                >
                                                    <Group align="flex-start" gap="sm">
                                                        <Avatar
                                                            src={reply.avatar}
                                                            radius="xl"
                                                            size="sm"
                                                            style={{
                                                                border: `2px solid transparent`,
                                                                background: gradientBg
                                                            }}
                                                        />
                                                        <Box style={{ flex: 1 }}>
                                                            <Group gap="xs" mb="xs">
                                                                <Text fw={600} size="sm">{reply.author}</Text>
                                                                <Text size="xs" c="dimmed">{reply.timestamp}</Text>
                                                            </Group>
                                                            <Text size="sm" mb="xs" style={{ lineHeight: 1.5 }}>
                                                                {reply.content}
                                                            </Text>
                                                            <Group gap="xs">
                                                                <ActionIcon variant="subtle" size="xs" color="red">
                                                                    <IconHeart size="0.7rem" />
                                                                </ActionIcon>
                                                                <Text size="xs" c="dimmed">{reply.likes}</Text>
                                                            </Group>
                                                        </Box>
                                                    </Group>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Card>
            </Container>

            {/* Scroll to Top Button - 2025 트렌드: 부드러운 마이크로 인터랙션 */}
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={showScrollTop}>
                    {(transitionStyles) => (
                        <ActionIcon
                            size="xl"
                            radius="xl"
                            style={{
                                ...transitionStyles,
                                background: gradientBg,
                                color: 'white',
                                boxShadow: theme.shadows.lg
                            }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <IconChevronUp size="1.5rem" />
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </Box>
    );
}