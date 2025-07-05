import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    Text,
    Group,
    Badge,
    Button,
    ActionIcon,
    Stack,
    Divider,
    Avatar,
    Box,
    Breadcrumbs,
    Anchor,
    Skeleton,
    Alert,
    Textarea,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconHeart,
    IconHeartFilled,
    IconBookmark,
    IconBookmarkFilled,
    IconShare,
    IconEye,
    IconCalendar,
    IconClock,
    IconArrowLeft,
    IconEdit,
    IconTrash,
    IconAlertCircle,
    IconSend,
} from '@tabler/icons-react';

// API Hooks
import {
    usePostQuery,
    useCommentsQuery,
    useLikePostMutation,
    useCreateCommentMutation,
    useDeletePostMutation,
} from '../api/queries';

// Contexts
import { useToast } from '../components/Toast';

// Components
import InfiniteScroll from '../components/InfiniteScroll';

// Utils
import { formatters } from '../utils/formatters';
import {useAuth} from "@/context/AuthContext.jsx";

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { success, error: showError } = useToast();
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    // Queries
    // const {
    //     data: post,
    //     isLoading: postLoading,
    //     error: postError,
    //     refetch: refetchPost,
    // } = usePostQuery(id);
    const {
        data: post,
        isLoading: postLoading,
        error: postError,
        refetch: refetchPost,
    } = usePostQuery(id);

    const {
        data: comments,
        isLoading: commentsLoading,
        error: commentsError,
        refetch: refetchComments,
    } = useCommentsQuery(id);

    // Mutations
    const likeMutation = useLikePostMutation();
    const commentMutation = useCreateCommentMutation();
    const deletePostMutation = useDeletePostMutation();

    // Effects
    useEffect(() => {
        // 조회수 증가는 쿼리에서 자동으로 처리됨
        // 북마크 상태 로드 (실제로는 API에서 가져와야 함)
        setIsBookmarked(false); // 임시
    }, [id]);

    // Handlers
    const handleLike = async () => {
        if (!isAuthenticated) {
            showError('로그인이 필요합니다.');
            return;
        }

        try {
            await likeMutation.mutateAsync({
                postId: parseInt(id),
                isLiked: post?.isLiked || false,
            });
        } catch (err) {
            showError('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const handleBookmark = () => {
        if (!isAuthenticated) {
            showError('로그인이 필요합니다.');
            return;
        }

        setIsBookmarked(!isBookmarked);
        success(isBookmarked ? '북마크에서 제거되었습니다.' : '북마크에 추가되었습니다.');
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post?.title,
                    text: post?.excerpt,
                    url: url,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(url);
                }
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            success('링크가 클립보드에 복사되었습니다.');
        }).catch(() => {
            showError('링크 복사에 실패했습니다.');
        });
    };

    const handleComment = async () => {
        if (!isAuthenticated) {
            showError('로그인이 필요합니다.');
            return;
        }

        if (!newComment.trim()) {
            showError('댓글 내용을 입력해주세요.');
            return;
        }

        setIsCommenting(true);

        try {
            await commentMutation.mutateAsync({
                postId: parseInt(id),
                commentData: {
                    content: newComment.trim(),
                },
            });

            setNewComment('');
            success('댓글이 작성되었습니다.');
            refetchComments();
        } catch (err) {
            showError('댓글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsCommenting(false);
        }
    };

    const handleEdit = () => {
        navigate(`/posts/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deletePostMutation.mutateAsync(parseInt(id));
            success('게시글이 삭제되었습니다.');
            navigate('/');
        } catch (err) {
            showError('게시글 삭제 중 오류가 발생했습니다.');
        }
    };

    // Loading state
    if (postLoading) {
        return (
            <Container size="md" py="xl">
                <Stack gap="md">
                    <Skeleton height={200} />
                    <Skeleton height={40} />
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={300} />
                </Stack>
            </Container>
        );
    }

    // Error state
    if (postError) {
        return (
            <Container size="md" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="오류 발생"
                    color="red"
                >
                    게시글을 불러오는 중 오류가 발생했습니다.
                    <Button
                        variant="light"
                        size="xs"
                        mt="sm"
                        onClick={() => refetchPost()}
                    >
                        다시 시도
                    </Button>
                </Alert>
            </Container>
        );
    }

    // Not found state
    if (!post) {
        return (
            <Container size="md" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="게시글을 찾을 수 없습니다"
                    color="yellow"
                >
                    요청하신 게시글이 존재하지 않거나 삭제되었습니다.
                   <Box>
                       <Button
                           variant="light"
                           size="xs"
                           mt="sm"
                           onClick={() => navigate('/')}
                       >
                           홈으로 돌아가기
                       </Button>
                   </Box>
                </Alert>
            </Container>
        );
    }

    const isAuthor = user?.id === post.author?.id;

    return (
        <Container size="md" py="xl">
            <Stack gap="xl">
                {/* Breadcrumbs */}
                <Breadcrumbs>
                    <Anchor onClick={() => navigate('/')}>홈</Anchor>
                    <Anchor onClick={() => navigate('/posts')}>게시글</Anchor>
                    <Text>{post.title}</Text>
                </Breadcrumbs>

                {/* Back Button */}
                <Group>
                    <Button
                        variant="subtle"
                        leftSection={<IconArrowLeft size={16} />}
                        onClick={() => navigate(-1)}
                    >
                        뒤로가기
                    </Button>
                </Group>

                {/* Main Content */}
                <Paper
                    p="xl"
                    style={{
                        background: dark ? '#161b22' : '#ffffff',
                        border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                    }}
                >
                    <Stack gap="lg">
                        {/* Header */}
                        <Stack gap="md">
                            <Title order={1} size="h1">
                                {post.title}
                            </Title>

                            {/* Meta Information */}
                            <Group justify="space-between" align="flex-start">
                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <Avatar
                                            src={post.author?.avatar}
                                            name={post.author?.name}
                                            size="sm"
                                        />
                                        <div>
                                            <Text size="sm" fw={600}>
                                                {post.author?.name}
                                            </Text>
                                            <Group gap="xs" c="dimmed">
                                                <IconCalendar size={12} />
                                                <Text size="xs">
                                                    {formatters.date.toRelative(post.createdAt)}
                                                </Text>
                                                <Text size="xs">·</Text>
                                                <IconClock size={12} />
                                                <Text size="xs">
                                                    {post.readTime}분 읽기
                                                </Text>
                                                <Text size="xs">·</Text>
                                                <IconEye size={12} />
                                                <Text size="xs">
                                                    {formatters.number.withCommas(post.views || 0)}회
                                                </Text>
                                            </Group>
                                        </div>
                                    </Group>

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <Group gap="xs">
                                            {post.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="light"
                                                    size="sm"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => navigate(`/tags/${tag}`)}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </Group>
                                    )}
                                </Stack>

                                {/* Actions */}
                                <Group gap="xs">
                                    {isAuthor && (
                                        <>
                                            <ActionIcon
                                                variant="light"
                                                size="lg"
                                                onClick={handleEdit}
                                                title="수정"
                                            >
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                size="lg"
                                                onClick={handleDelete}
                                                title="삭제"
                                                loading={deletePostMutation.isPending}
                                            >
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </>
                                    )}
                                </Group>
                            </Group>
                        </Stack>

                        <Divider />

                        {/* Content */}
                        <Box>
                            <div
                                style={{
                                    lineHeight: 1.7,
                                    fontSize: '16px',
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </Box>

                        <Divider />

                        {/* Post Actions */}
                        <Group justify="space-between">
                            <Group gap="lg">
                                <Button
                                    variant={post.isLiked ? "filled" : "light"}
                                    leftSection={
                                        post.isLiked ? (
                                            <IconHeartFilled size={16} />
                                        ) : (
                                            <IconHeart size={16} />
                                        )
                                    }
                                    onClick={handleLike}
                                    loading={likeMutation.isPending}
                                    color="red"
                                >
                                    {formatters.number.withCommas(post.likesCount || 0)}
                                </Button>

                                <Button
                                    variant={isBookmarked ? "filled" : "light"}
                                    leftSection={
                                        isBookmarked ? (
                                            <IconBookmarkFilled size={16} />
                                        ) : (
                                            <IconBookmark size={16} />
                                        )
                                    }
                                    onClick={handleBookmark}
                                    color="blue"
                                >
                                    북마크
                                </Button>
                            </Group>

                            <Button
                                variant="light"
                                leftSection={<IconShare size={16} />}
                                onClick={handleShare}
                            >
                                공유
                            </Button>
                        </Group>
                    </Stack>
                </Paper>

                {/* Comments Section */}
                <Paper
                    p="xl"
                    style={{
                        background: dark ? '#161b22' : '#ffffff',
                        border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                    }}
                >
                    <Stack gap="lg">
                        <Title order={3}>
                            댓글 {comments ? formatters.number.withCommas(comments.length) : 0}개
                        </Title>

                        {/* Comment Form */}
                        {isAuthenticated ? (
                            <Box>
                                <Stack gap="sm">
                                    <Textarea
                                        placeholder="댓글을 입력하세요..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        minRows={3}
                                        maxRows={6}
                                    />
                                    <Group justify="flex-end">
                                        <Button
                                            leftSection={<IconSend size={16} />}
                                            onClick={handleComment}
                                            loading={isCommenting}
                                            disabled={!newComment.trim()}
                                        >
                                            댓글 작성
                                        </Button>
                                    </Group>
                                </Stack>
                            </Box>
                        ) : (
                            <Alert color="blue">
                                댓글을 작성하려면 로그인이 필요합니다.
                                <Button
                                    variant="light"
                                    size="xs"
                                    mt="sm"
                                    onClick={() => navigate('/login')}
                                >
                                    로그인하기
                                </Button>
                            </Alert>
                        )}

                        <Divider />

                        {/* Comments List */}
                        {commentsLoading ? (
                            <Stack gap="md">
                                {[...Array(3)].map((_, index) => (
                                    <Box key={index}>
                                        <Group gap="sm" align="flex-start">
                                            <Skeleton height={40} circle />
                                            <Stack gap="xs" style={{ flex: 1 }}>
                                                <Skeleton height={20} width="30%" />
                                                <Skeleton height={60} />
                                                <Skeleton height={16} width="20%" />
                                            </Stack>
                                        </Group>
                                    </Box>
                                ))}
                            </Stack>
                        ) : commentsError ? (
                            <Alert
                                icon={<IconAlertCircle size={16} />}
                                title="댓글 로드 실패"
                                color="red"
                            >
                                댓글을 불러오는 중 오류가 발생했습니다.
                                <Button
                                    variant="light"
                                    size="xs"
                                    mt="sm"
                                    onClick={() => refetchComments()}
                                >
                                    다시 시도
                                </Button>
                            </Alert>
                        ) : comments && comments.length > 0 ? (
                            <Stack gap="md">
                                {comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        currentUser={user}
                                        onUpdate={refetchComments}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Box py="xl" style={{ textAlign: 'center' }}>
                                <Stack align="center" gap="sm">
                                    <Text size="lg" c="dimmed">
                                        💬
                                    </Text>
                                    <Text c="dimmed">
                                        첫 번째 댓글을 작성해보세요!
                                    </Text>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
};

// Comment Item Component
const CommentItem = ({ comment, currentUser, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isDeleting, setIsDeleting] = useState(false);

    const { success, error: showError } = useToast();
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const isAuthor = currentUser?.id === comment.author?.id;

    const handleEdit = async () => {
        if (!editContent.trim()) {
            showError('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            // API 호출은 실제 구현에서 처리
            success('댓글이 수정되었습니다.');
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            showError('댓글 수정 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) {
            return;
        }

        setIsDeleting(true);

        try {
            // API 호출은 실제 구현에서 처리
            success('댓글이 삭제되었습니다.');
            onUpdate();
        } catch (err) {
            showError('댓글 삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    return (
        <Box
            p="md"
            style={{
                background: dark ? '#0d1117' : '#f8fafc',
                borderRadius: 8,
                border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
            }}
        >
            <Group gap="sm" align="flex-start">
                <Avatar
                    src={comment.author?.avatar}
                    name={comment.author?.name}
                    size="md"
                />

                <Stack gap="xs" style={{ flex: 1 }}>
                    <Group justify="space-between" align="center">
                        <Group gap="xs">
                            <Text size="sm" fw={600}>
                                {comment.author?.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {formatters.date.toRelative(comment.createdAt)}
                            </Text>
                            {comment.updatedAt !== comment.createdAt && (
                                <Badge size="xs" variant="light">
                                    수정됨
                                </Badge>
                            )}
                        </Group>

                        {isAuthor && !isEditing && (
                            <Group gap="xs">
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    title="수정"
                                >
                                    <IconEdit size={14} />
                                </ActionIcon>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    size="sm"
                                    onClick={handleDelete}
                                    loading={isDeleting}
                                    title="삭제"
                                >
                                    <IconTrash size={14} />
                                </ActionIcon>
                            </Group>
                        )}
                    </Group>

                    {isEditing ? (
                        <Stack gap="sm">
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                minRows={2}
                                maxRows={6}
                            />
                            <Group gap="xs">
                                <Button size="xs" onClick={handleEdit}>
                                    저장
                                </Button>
                                <Button
                                    size="xs"
                                    variant="light"
                                    onClick={handleCancel}
                                >
                                    취소
                                </Button>
                            </Group>
                        </Stack>
                    ) : (
                        <Text size="sm" style={{ lineHeight: 1.5 }}>
                            {comment.content}
                        </Text>
                    )}

                    {/* Comment Actions */}
                    {!isEditing && (
                        <Group gap="lg">
                            <Button
                                variant="subtle"
                                size="xs"
                                leftSection={
                                    comment.isLiked ? (
                                        <IconHeartFilled size={12} />
                                    ) : (
                                        <IconHeart size={12} />
                                    )
                                }
                                color={comment.isLiked ? "red" : "gray"}
                            >
                                {comment.likesCount || 0}
                            </Button>

                            <Button
                                variant="subtle"
                                size="xs"
                                onClick={() => {
                                    // 답글 기능 구현
                                }}
                            >
                                답글
                            </Button>
                        </Group>
                    )}
                </Stack>
            </Group>
        </Box>
    );
};

export default BlogPost;