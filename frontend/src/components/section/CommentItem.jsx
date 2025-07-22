import { useState } from 'react';
import {
    Paper,
    Group,
    Avatar,
    Text,
    ActionIcon,
    Menu,
    Button,
    Textarea,
    Stack,
    Badge,
    Modal,
} from '@mantine/core';
import {
    IconHeart,
    IconMessageCircle,
    IconDots,
    IconEdit,
    IconTrash,
    IconSend,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import useAuthStore from '../../store/authStore';
import {
    useUpdateComment,
    useDeleteComment,
    useToggleCommentLike,
    useCreateComment,
} from '../../hooks/useCommentApi';

function CommentItem({ comment, postId, depth = 0 }) {
    const { user, isAuthenticated } = useAuthStore();

    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    // API 훅
    const updateCommentMutation = useUpdateComment();
    const deleteCommentMutation = useDeleteComment();
    const toggleLikeMutation = useToggleCommentLike();
    const createReplyMutation = useCreateComment();

    // 수정 폼
    const editForm = useForm({
        initialValues: {
            content: comment.content,
        },
        validate: {
            content: (value) => (!value.trim() ? '댓글 내용을 입력해주세요.' : null),
        },
    });

    // 답글 작성 폼
    const replyForm = useForm({
        initialValues: {
            content: '',
        },
        validate: {
            content: (value) => (!value.trim() ? '답글 내용을 입력해주세요.' : null),
        },
    });

    // 권한 확인
    const isAuthor = user && user.id === comment.author.id;
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
    const canReply = depth < 1; // 대댓글까지만 허용

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes}분 전`;
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } return date.toLocaleDateString('ko-KR');
    };

    // 댓글 수정
    const handleUpdateComment = async (values) => {
        try {
            await updateCommentMutation.mutateAsync({
                id: comment.id,
                data: values,
            });

            setIsEditing(false);
            notifications.show({
                title: '댓글 수정 완료',
                message: '댓글이 수정되었습니다.',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: '수정 실패',
                message: '댓글 수정 중 오류가 발생했습니다.',
                color: 'red',
            });
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async () => {
        try {
            await deleteCommentMutation.mutateAsync(comment.id);
            notifications.show({
                title: '댓글 삭제',
                message: '댓글이 삭제되었습니다.',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: '삭제 실패',
                message: '댓글 삭제 중 오류가 발생했습니다.',
                color: 'red',
            });
        }
        setDeleteModalOpened(false);
    };

    // 좋아요 토글
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            notifications.show({
                title: '로그인 필요',
                message: '좋아요를 누르려면 로그인이 필요합니다.',
                color: 'yellow',
            });
            return;
        }

        try {
            await toggleLikeMutation.mutateAsync(comment.id);
        } catch (error) {
            notifications.show({
                title: '오류 발생',
                message: '좋아요 처리 중 오류가 발생했습니다.',
                color: 'red',
            });
        }
    };

    // 답글 작성
    const handleCreateReply = async (values) => {
        if (!isAuthenticated) {
            notifications.show({
                title: '로그인 필요',
                message: '답글을 작성하려면 로그인이 필요합니다.',
                color: 'yellow',
            });
            return;
        }

        try {
            await createReplyMutation.mutateAsync({
                postId: parseInt(postId, 10),
                content: values.content,
                parentId: comment.id,
            });

            replyForm.reset();
            setIsReplying(false);

            notifications.show({
                title: '답글 작성 완료',
                message: '답글이 성공적으로 작성되었습니다.',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: '답글 작성 실패',
                message: error.message || '답글 작성 중 오류가 발생했습니다.',
                color: 'red',
            });
        }
    };

    return (
        <div style={{ marginLeft: depth * 20 }}>
            <Paper
                withBorder={depth === 0}
                p="md"
                style={{
                    backgroundColor: depth > 0 ? 'var(--mantine-color-gray-0)' : 'white',
                    borderLeft: depth > 0 ? '3px solid var(--mantine-color-blue-3)' : 'none',
                }}
            >
                <Stack spacing="md">
                    {/* 댓글 헤더 */}
                    <Group justify="space-between">
                        <Group>
                            <Avatar
                                src={comment.author.profileImage}
                                alt={comment.author.nickname}
                                size="sm"
                            />
                            <div>
                                <Group spacing="xs">
                                    <Text fw={500} size="sm">{comment.author.nickname}</Text>
                                    {depth > 0 && (
                                        <Badge size="xs" variant="light">답글</Badge>
                                    )}
                                </Group>
                                <Text size="xs" c="dimmed">
                                    {formatDate(comment.createdDate)}
                                    {comment.modifiedDate !== comment.createdDate && ' (수정됨)'}
                                </Text>
                            </div>
                        </Group>

                        {/* 메뉴 */}
                        {(isAuthor || isAdmin) && !comment.isDeleted && (
                            <Menu shadow="md" width={150}>
                                <Menu.Target>
                                    <ActionIcon variant="subtle" size="sm">
                                        <IconDots size={16} />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        leftSection={<IconEdit size={14} />}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        수정
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconTrash size={14} />}
                                        color="red"
                                        onClick={() => setDeleteModalOpened(true)}
                                    >
                                        삭제
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )}
                    </Group>

                    {/* 댓글 내용 */}
                    {isEditing ? (
                        <form onSubmit={editForm.onSubmit(handleUpdateComment)}>
                            <Stack spacing="sm">
                                <Textarea
                                    {...editForm.getInputProps('content')}
                                    minRows={3}
                                    autosize
                                />
                                <Group justify="flex-end">
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => {
                                            setIsEditing(false);
                                            editForm.setValues({ content: comment.content });
                                        }}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="xs"
                                        loading={updateCommentMutation.isLoading}
                                    >
                                        수정
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    ) : (
                        <Text style={{ whiteSpace: 'pre-wrap' }}>
                            {comment.content}
                        </Text>
                    )}

                    {/* 댓글 액션 */}
                    {!comment.isDeleted && !isEditing && (
                        <Group spacing="md">
                            <Group spacing="xs">
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={handleToggleLike}
                                    loading={toggleLikeMutation.isLoading}
                                >
                                    <IconHeart size={16} />
                                </ActionIcon>
                                <Text size="sm">{comment.likeCount}</Text>
                            </Group>

                            {canReply && (
                                <Button
                                    variant="subtle"
                                    size="xs"
                                    leftSection={<IconMessageCircle size={14} />}
                                    onClick={() => setIsReplying(!isReplying)}
                                >
                                    답글
                                </Button>
                            )}
                        </Group>
                    )}

                    {/* 답글 작성 폼 */}
                    {isReplying && (
                        <form onSubmit={replyForm.onSubmit(handleCreateReply)}>
                            <Stack spacing="sm">
                                <Textarea
                                    placeholder="답글을 입력하세요..."
                                    {...replyForm.getInputProps('content')}
                                    minRows={3}
                                    autosize
                                />
                                <Group justify="flex-end">
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => {
                                            setIsReplying(false);
                                            replyForm.reset();
                                        }}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="xs"
                                        leftSection={<IconSend size={14} />}
                                        loading={createReplyMutation.isLoading}
                                    >
                                        답글 작성
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    )}
                </Stack>

                {/* 삭제 확인 모달 */}
                <Modal
                    opened={deleteModalOpened}
                    onClose={() => setDeleteModalOpened(false)}
                    title="댓글 삭제"
                    centered
                    size="sm"
                >
                    <Stack>
                        <Text>정말로 이 댓글을 삭제하시겠습니까?</Text>
                        <Group justify="flex-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpened(false)}
                            >
                                취소
                            </Button>
                            <Button
                                color="red"
                                onClick={handleDeleteComment}
                                loading={deleteCommentMutation.isLoading}
                            >
                                삭제
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Paper>

            {/* 답글들 */}
            {comment.replies && comment.replies.length > 0 && (
                <Stack spacing="md" mt="md">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            depth={depth + 1}
                        />
                    ))}
                </Stack>
            )}
        </div>
    );
}

export default CommentItem;