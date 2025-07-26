import {memo, useState} from 'react';
import {
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
    Box,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconHeart,
    IconHeartFilled,
    IconMessageCircle,
    IconDots,
    IconEdit,
    IconTrash,
    IconSend,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {useCreateComment, useDeleteComment, useToggleCommentLike, useUpdateComment} from "../../hooks/api/useApi.js";
import useAuthStore from "../../stores/authStore.js";
import {showToast} from "../advanced/Toast.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const CommentItem = memo(({ comment, postId, depth = 0 }) => {
    const { user, isAuthenticated } = useAuthStore();
    const { dark } = useTheme();

    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
        replyBg: dark ? '#1E1F25' : '#F8F9FA',
        inputBg: dark ? '#2B2D31' : '#FFFFFF',
    };

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
    const isLiked = comment?.isLiked;

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
        }
        return date.toLocaleDateString('ko-KR');
    };

    // 댓글 수정
    const handleUpdateComment = async (values) => {
        try {
            await updateCommentMutation.mutateAsync({
                id: comment.id,
                data: values,
            });

            setIsEditing(false);
            showToast.success("댓글 수정 완료", "댓글이 수정되었습니다.")
        } catch (error) {
            showToast.error("댓글 수정 실패", "댓글이 수정 중 오류가 발생했습니다.")
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async () => {
        try {
            await deleteCommentMutation.mutateAsync(comment.id);
            showToast.success("댓글 삭제", "댓글이 삭제되었습니다.")
        } catch (error) {
            showToast.error("삭제 실패", "댓글이 삭제 중 오류가 발생했습니다.")
        }
        setDeleteModalOpened(false);
    };

    // 좋아요 토글
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            showToast.warning("로그인 필요", "좋아요를 누르려면 로그인이 필요합니다.")
            return;
        }
        try {
            await toggleLikeMutation.mutateAsync(comment.id);
        } catch (error) {
            showToast.error("오류 발생", "좋아요 처리 중 오류가 발생했습니다.")
        }
    };

    // 답글 작성
    const handleCreateReply = async (values) => {
        if (!isAuthenticated) {
            showToast.warning("로그인 필요", "답글을 작성하려면 로그인이 필요합니다.")
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
            showToast.success("답글 작성 완료", '답글이 성공적으로 작성되었습니다.')
        } catch (error) {
            showToast.error('답글 작성 실패', error.message || '답글 작성 중 오류가 발생했습니다.')
        }
    };

    return (
        <Box>
            <Box
                style={{
                    marginLeft: depth * 40,
                    borderLeft: depth > 0 ? `3px solid ${velogColors.primary}` : 'none',
                    paddingLeft: depth > 0 ? '1rem' : 0,
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    backgroundColor: depth > 0 ? velogColors.replyBg : 'transparent',
                    borderRadius: depth > 0 ? '0 8px 8px 0' : 0,
                }}
            >
                <Stack gap="md">
                    {/* 댓글 헤더 */}
                    <Group justify="space-between">
                        <Group gap="md">
                            <Avatar
                                src={comment.author.profileImage}
                                alt={comment.author.nickname}
                                size="md"
                                style={{
                                    border: `2px solid ${velogColors.border}`
                                }}
                            />
                            <Box>
                                <Group gap="xs" align="center">
                                    <Text
                                        fw={600}
                                        size="md"
                                        c={velogColors.text}
                                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                                    >
                                        {comment.author.nickname}
                                    </Text>
                                    {depth > 0 && (
                                        <Badge
                                            size="xs"
                                            variant="light"
                                            color={velogColors.primary}
                                            style={{
                                                backgroundColor: `${velogColors.primary}15`,
                                                color: velogColors.primary,
                                            }}
                                        >
                                            답글
                                        </Badge>
                                    )}
                                </Group>
                                <Text size="sm" c={velogColors.subText} mt={2}>
                                    {formatDate(comment.createdDate)}
                                    {comment.modifiedDate !== comment.createdDate && ' (수정됨)'}
                                </Text>
                            </Box>
                        </Group>

                        {/* 메뉴 */}
                        {(isAuthor || isAdmin) && !comment.isDeleted && (
                            <Menu shadow="md" width={150}>
                                <Menu.Target>
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        c={velogColors.subText}
                                        style={{
                                            '&:hover': {
                                                backgroundColor: velogColors.hover
                                            }
                                        }}
                                    >
                                        <IconDots size={16} />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown
                                    style={{
                                        backgroundColor: velogColors.background,
                                        border: `1px solid ${velogColors.border}`,
                                    }}
                                >
                                    <Menu.Item
                                        leftSection={<IconEdit size={14} />}
                                        onClick={() => setIsEditing(true)}
                                        style={{ color: velogColors.text }}
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
                            <Stack gap="md">
                                <Textarea
                                    {...editForm.getInputProps('content')}
                                    minRows={3}
                                    autosize
                                    styles={{
                                        input: {
                                            backgroundColor: velogColors.inputBg,
                                            border: `2px solid ${velogColors.border}`,
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            color: velogColors.text,
                                            '&:focus': {
                                                borderColor: velogColors.primary,
                                            }
                                        }
                                    }}
                                />
                                <Group justify="flex-end" gap="sm">
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        color="gray"
                                        onClick={() => {
                                            setIsEditing(false);
                                            editForm.setValues({ content: comment.content });
                                        }}
                                        style={{
                                            color: velogColors.subText,
                                            '&:hover': {
                                                backgroundColor: velogColors.hover
                                            }
                                        }}
                                        aria-label="취소 버튼"
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        loading={updateCommentMutation.isLoading}
                                        style={{
                                            backgroundColor: velogColors.primary,
                                            '&:hover': {
                                                backgroundColor: '#0CA678'
                                            }
                                        }}
                                        aria-label="수정 버튼"
                                    >
                                        수정
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    ) : (
                        <Text
                            style={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: '15px',
                                color: velogColors.text,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                            }}
                        >
                            {comment.content}
                        </Text>
                    )}

                    {/* 댓글 액션 */}
                    {!comment.isDeleted && !isEditing && (
                        <Group gap="lg">
                            <Group gap="xs">
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={handleToggleLike}
                                    loading={toggleLikeMutation.isLoading}
                                    color={isLiked ? 'red' : 'gray'}
                                    style={{
                                        '&:hover': {
                                            backgroundColor: velogColors.hover
                                        }
                                    }}
                                >
                                    {isLiked ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
                                </ActionIcon>
                                <Text size="sm" c={velogColors.subText} fw={500}>
                                    {comment.likeCount}
                                </Text>
                            </Group>

                            {canReply && (
                                <Button
                                    variant="subtle"
                                    size="sm"
                                    leftSection={<IconMessageCircle size={14} />}
                                    onClick={() => setIsReplying(!isReplying)}
                                    style={{
                                        color: velogColors.subText,
                                        '&:hover': {
                                            backgroundColor: velogColors.hover,
                                            color: velogColors.primary
                                        }
                                    }}
                                    aria-label="답글 버튼"
                                >
                                    답글
                                </Button>
                            )}
                        </Group>
                    )}

                    {/* 답글 작성 폼 */}
                    {isReplying && (
                        <Box mt="md">
                            <form onSubmit={replyForm.onSubmit(handleCreateReply)}>
                                <Stack gap="md">
                                    <Textarea
                                        placeholder="답글을 입력하세요..."
                                        {...replyForm.getInputProps('content')}
                                        minRows={3}
                                        autosize
                                        styles={{
                                            input: {
                                                backgroundColor: velogColors.inputBg,
                                                border: `2px solid ${velogColors.border}`,
                                                borderRadius: '8px',
                                                fontSize: '15px',
                                                color: velogColors.text,
                                                '&:focus': {
                                                    borderColor: velogColors.primary,
                                                },
                                                '&::placeholder': {
                                                    color: velogColors.subText,
                                                }
                                            }
                                        }}
                                    />
                                    <Group justify="flex-end" gap="sm">
                                        <Button
                                            variant="subtle"
                                            size="sm"
                                            color="gray"
                                            onClick={() => {
                                                setIsReplying(false);
                                                replyForm.reset();
                                            }}
                                            style={{
                                                color: velogColors.subText,
                                                '&:hover': {
                                                    backgroundColor: velogColors.hover
                                                }
                                            }}
                                            aria-label="취소 버튼"
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            leftSection={<IconSend size={14} />}
                                            loading={createReplyMutation.isLoading}
                                            style={{
                                                backgroundColor: velogColors.primary,
                                                '&:hover': {
                                                    backgroundColor: '#0CA678'
                                                }
                                            }}
                                            aria-label="답글 등록 버튼"
                                        >
                                            답글 등록
                                        </Button>
                                    </Group>
                                </Stack>
                            </form>
                        </Box>
                    )}
                </Stack>

                {/* 삭제 확인 모달 */}
                <Modal
                    opened={deleteModalOpened}
                    onClose={() => setDeleteModalOpened(false)}
                    title={
                        <Text fw={600} size="lg" c={velogColors.text}>
                            댓글 삭제
                        </Text>
                    }
                    centered
                    size="sm"
                    styles={{
                        content: {
                            backgroundColor: velogColors.background,
                        },
                        header: {
                            backgroundColor: velogColors.background,
                            borderBottom: `1px solid ${velogColors.border}`,
                        }
                    }}
                >
                    <Stack gap="lg">
                        <Text c={velogColors.text}>
                            정말로 이 댓글을 삭제하시겠습니까?
                        </Text>
                        <Group justify="flex-end" gap="md">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpened(false)}
                                style={{
                                    borderColor: velogColors.border,
                                    color: velogColors.subText
                                }}
                                aria-label="취소 버튼"
                            >
                                취소
                            </Button>
                            <Button
                                color="red"
                                onClick={handleDeleteComment}
                                loading={deleteCommentMutation.isPending}
                                aria-label="삭제 버튼"
                            >
                                삭제
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Box>

            {/* 답글들 */}
            {comment.replies && comment.replies.length > 0 && (
                <Stack gap="sm" mt="sm">
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
        </Box>
    );
});

export default CommentItem;