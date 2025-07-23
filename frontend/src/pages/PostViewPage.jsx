import { memo, useState } from 'react';
import {
    Container,
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
    Card,
    ThemeIcon,
} from '@mantine/core';
import {
    IconHeart,
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
    IconHeartFilled,
} from '@tabler/icons-react';
import CommentSection from "../components/section/CommentSection.jsx";

// Mock data for demonstration
const mockPost = {
    id: '1',
    title: 'The Future of Web Design: Exploring Modern UI/UX Trends in 2025',
    summary: 'Discover the latest design trends that are shaping the digital landscape, from Bento Box layouts to immersive user experiences.',
    content: `
        <div style="line-height: 1.8; font-size: 16px; color: #333;">
            <p>In the rapidly evolving world of web design, 2025 has emerged as a pivotal year where creativity meets functionality. The digital landscape is witnessing unprecedented changes that are reshaping how we interact with websites and applications.</p>
            
            <h2 style="margin: 2rem 0 1rem 0; color: #2D3748; font-size: 1.5rem;">The Rise of Bento Box Layouts</h2>
            <p>One of the most significant trends we're seeing is the adoption of Bento Box layouts. Inspired by Japanese lunch boxes, these modular designs create organized, digestible content sections that enhance user experience.</p>
            
            <h2 style="margin: 2rem 0 1rem 0; color: #2D3748; font-size: 1.5rem;">Immersive Typography</h2>
            <p>Typography is no longer just functional—it's becoming a central design element. Large, expressive fonts are being used as visual centerpieces, creating hierarchy and emotional impact.</p>
            
            <h2 style="margin: 2rem 0 1rem 0; color: #2D3748; font-size: 1.5rem;">Micro-Interactions and Animations</h2>
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

const mockComments = [
    {
        id: '1',
        author: { nickname: 'Alex Kim', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60' },
        content: 'This is a fantastic overview of current design trends. The Bento Box layout is something I\'ve been experimenting with.',
        createdDate: '2025-01-15T14:30:00Z',
        likeCount: 5
    },
    {
        id: '2',
        author: { nickname: 'Maria Rodriguez', profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60' },
        content: 'Really insightful article! I love how you explained the evolution from traditional layouts to these modern approaches.',
        createdDate: '2025-01-15T16:45:00Z',
        likeCount: 3
    }
];

// const CommentSection = ({ comments }) => {
//     return (
//         <Stack spacing="xl">
//             <Group align="center" spacing="md">
//                 <ThemeIcon size={40} variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
//                     <IconMessageCircle size={20} />
//                 </ThemeIcon>
//                 <Title order={2} size="h3" fw={600}>
//                     Comments ({comments.length})
//                 </Title>
//             </Group>
//
//             <Stack spacing="lg">
//                 {comments.map((comment) => (
//                     <Card key={comment.id} shadow="sm" padding="lg" radius="md" withBorder>
//                         <Group align="flex-start" spacing="md">
//                             <Avatar src={comment.author.profileImage} size="md" radius="xl" />
//                             <Box flex={1}>
//                                 <Group justify="space-between" align="center" mb="xs">
//                                     <Text fw={500} size="sm">
//                                         {comment.author.nickname}
//                                     </Text>
//                                     <Text size="xs" c="dimmed">
//                                         {new Date(comment.createdDate).toLocaleDateString()}
//                                     </Text>
//                                 </Group>
//                                 <Text size="sm" mb="md">
//                                     {comment.content}
//                                 </Text>
//                                 <Group spacing="xs">
//                                     <ActionIcon variant="subtle" size="sm">
//                                         <IconHeart size={14} />
//                                     </ActionIcon>
//                                     <Text size="xs" c="dimmed">{comment.likeCount}</Text>
//                                 </Group>
//                             </Box>
//                         </Group>
//                     </Card>
//                 ))}
//             </Stack>
//         </Stack>
//     );
// };

const PostViewPage = memo(() => {
    const [isLiked, setIsLiked] = useState(mockPost.isLiked);
    const [likeCount, setLikeCount] = useState(mockPost.likeCount);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const post = mockPost;
    const comments = mockComments;
    const user = { id: '1', role: 'USER' }; // Mock user
    const isAuthenticated = true;

    const handleToggleLike = () => {
        if (!isAuthenticated) {
            return;
        }
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            // Could add toast notification here
        } catch (error) {
            console.error('Failed to copy link');
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
                style={{
                    background: `linear-gradient(135deg, 
                        rgba(109, 40, 217, 0.9) 0%, 
                        rgba(147, 51, 234, 0.8) 25%, 
                        rgba(168, 85, 247, 0.7) 50%, 
                        rgba(196, 181, 253, 0.6) 100%), 
                        url(${post.thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay',
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container size="lg" style={{ zIndex: 2 }}>
                    <Stack spacing="xl" align="center">
                        {/* Category Badge */}
                        <Badge
                            size="lg"
                            variant="white"
                            color={post.category.color}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '8px 16px'
                            }}
                        >
                            {post.category.label}
                        </Badge>

                        {/* Main Title */}
                        <Title
                            order={1}
                            size="3.5rem"
                            fw={800}
                            ta="center"
                            c="white"
                            style={{
                                lineHeight: 1.1,
                                textShadow: '2px 4px 12px rgba(0,0,0,0.3)',
                                maxWidth: '900px',
                            }}
                        >
                            {post.title}
                        </Title>

                        {/* Subtitle */}
                        <Text
                            size="xl"
                            ta="center"
                            c="rgba(255,255,255,0.9)"
                            fw={400}
                            style={{
                                maxWidth: '600px',
                                lineHeight: 1.6,
                                textShadow: '1px 2px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            {post.summary}
                        </Text>
                    </Stack>
                </Container>

                {/* Decorative Elements */}
                <Box
                    style={{
                        position: 'absolute',
                        top: '10%',
                        right: '10%',
                        width: '200px',
                        height: '200px',
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        borderRadius: '50%',
                        filter: 'blur(1px)',
                    }}
                />
            </Box>

            <Container size="lg" mt="-4rem" style={{ position: 'relative', zIndex: 3 }}>
                {/* Author Info Card */}
                <Card
                    shadow="xl"
                    radius="xl"
                    padding="xl"
                    mb="xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}
                >
                    <Group justify="space-between" align="flex-start">
                        <Group align="center" spacing="lg">
                            <Avatar
                                src={post.author.profileImage}
                                alt={post.author.nickname}
                                size="xl"
                                radius="xl"
                                style={{
                                    border: '3px solid #e2e8f0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Box>
                                <Text fw={700} size="lg" mb="xs">
                                    {post.author.nickname}
                                </Text>
                                <Group spacing="lg" c="dimmed">
                                    <Group spacing="xs">
                                        <IconCalendar size={16} />
                                        <Text size="sm">
                                            {formatDate(post.publishedDate)}
                                        </Text>
                                    </Group>
                                    <Group spacing="xs">
                                        <IconEye size={16} />
                                        <Text size="sm">{post.viewCount.toLocaleString()}</Text>
                                    </Group>
                                    <Group spacing="xs">
                                        <IconMessageCircle size={16} />
                                        <Text size="sm">{post.commentCount}</Text>
                                    </Group>
                                </Group>
                            </Box>
                        </Group>

                        {/* Action Buttons */}
                        <Group spacing="md">
                            <ActionIcon
                                variant={isLiked ? "filled" : "light"}
                                color={isLiked ? "red" : "gray"}
                                size="xl"
                                radius="xl"
                                onClick={handleToggleLike}
                                style={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                            </ActionIcon>
                            <Text fw={600} size="sm">{likeCount}</Text>

                            <ActionIcon
                                variant="light"
                                size="xl"
                                radius="xl"
                                onClick={handleShare}
                                style={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
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
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
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
                        <Group spacing="xs" mt="lg">
                            <IconTag size={16} color="#6B7280" />
                            {post.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="gradient"
                                    gradient={{ from: 'violet', to: 'blue', deg: 45 }}
                                    size="sm"
                                    style={{ fontWeight: 500 }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </Group>
                    )}
                </Card>

                {/* Content Section */}
                <Card shadow="sm" radius="xl" padding="3rem" mb="xl">
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        style={{
                            lineHeight: 1.8,
                            fontSize: '18px',
                            color: '#374151'
                        }}
                    />
                </Card>

                {/* Floating Action Button */}
                <ActionIcon
                    variant="gradient"
                    gradient={{ from: 'violet', to: 'blue' }}
                    size="xl"
                    radius="xl"
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        zIndex: 1000,
                        boxShadow: '0 8px 25px rgba(109, 40, 217, 0.3)',
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

export default PostViewPage;