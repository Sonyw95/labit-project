import {memo, useEffect, useState} from 'react';
import {
    Stack,
    Text,
    Textarea,
    Button,
    Group,
    Divider,
    Box,
} from '@mantine/core';
import { IconMessageCircle, IconSend } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import useAuthStore from "../../stores/authStore.js";
import {useCreateComment} from "@/hooks/api/useApi.js";
import CommentItem from "./CommentItem.jsx";
import {showToast} from "../advanced/Toast.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useCommentsByPost} from "../../hooks/api/useApi.js";

const CommentSection = memo(({ postId }) => {
    const { isAuthenticated } = useAuthStore();
    const { themeColors } = useTheme();

    // 댓글 목록을 직접 가져오기
    const { data: comments = [], isLoading, refetch } = useCommentsByPost(postId);
    const createCommentMutation = useCreateComment();
    const [isWriting, setIsWriting] = useState(false);

    // 디버깅용 - 댓글 데이터 변화 추적
    useEffect(() => {
        console.log(`[CommentSection] 댓글 데이터 변경됨 (PostID: ${postId}):`, comments);
    }, [comments, postId]);
    // 댓글 작성 폼
    const form = useForm({
        initialValues: {
            content: '',
        },
        validate: {
            content: (value) => (!value.trim() ? '댓글 내용을 입력해주세요.' : null),
        },
    });

    // 댓글 작성
    const handleSubmitComment = async (values) => {
        if (!isAuthenticated) {
            showToast.warning("로그인 필요", "댓글을 작성하려면 로그인이 필요합니다.");
            return;
        }

        try {
            await createCommentMutation.mutateAsync({
                postId: parseInt(postId, 10),
                content: values.content,
            });

            form.reset();
            setIsWriting(false);

            showToast.success("댓글 작성 완료", '댓글이 성공적으로 작성되었습니다.');

            // 혹시 캐시 업데이트가 안 됐을 경우를 대비해 강제 refetch
            setTimeout(() => {
                refetch();
            }, 100);

        } catch (error) {
            showToast.error("댓글 작성 실패", '댓글이 작성 중 오류가 발생했습니다.');
        }
    };

    return (
        <Stack gap="xl">
            {/* 댓글 헤더 */}
            <Group gap="sm">
                <IconMessageCircle size={24} color={themeColors.primary} />
                <Text
                    fw={700}
                    size="xl"
                    c={themeColors.text}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                    댓글 {comments.length}개
                </Text>
            </Group>

            {/* 댓글 작성 영역 */}
            <Box>
                {!isAuthenticated ? (
                    <Box
                        p="xl"
                        style={{
                            backgroundColor: themeColors.hover,
                            border: `1px solid ${themeColors.border}`,
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}
                    >
                        <Text c={themeColors.subText} size="lg">
                            댓글을 작성하려면 로그인해주세요.
                        </Text>
                    </Box>
                ) : (
                    <form onSubmit={form.onSubmit(handleSubmitComment)}>
                        <Stack gap="md">
                            <Textarea
                                placeholder="댓글을 입력하세요..."
                                minRows={isWriting ? 5 : 3}
                                autosize
                                {...form.getInputProps('content')}
                                onFocus={() => setIsWriting(true)}
                                styles={{
                                    input: {
                                        backgroundColor: themeColors.inputBg,
                                        border: `2px solid ${themeColors.border}`,
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        color: themeColors.text,
                                        '&:focus': {
                                            borderColor: themeColors.primary,
                                        },
                                        '&::placeholder': {
                                            color: themeColors.subText,
                                        }
                                    }
                                }}
                            />

                            {isWriting && (
                                <Group justify="flex-end" gap="md">
                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        onClick={() => {
                                            setIsWriting(false);
                                            form.reset();
                                        }}
                                        style={{
                                            color: themeColors.subText,
                                            '&:hover': {
                                                backgroundColor: themeColors.hover
                                            }
                                        }}
                                        aria-label="취소 버튼"
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        leftSection={<IconSend size={16} />}
                                        loading={createCommentMutation.isLoading}
                                        style={{
                                            backgroundColor: themeColors.primary,
                                            '&:hover': {
                                                backgroundColor: '#0CA678'
                                            }
                                        }}
                                        aria-label="댓글 등록 버튼"
                                    >
                                        댓글 등록
                                    </Button>
                                </Group>
                            )}
                        </Stack>
                    </form>
                )}
            </Box>

            {/* 구분선 */}
            <Divider color={themeColors.border} />

            {/* 댓글 목록 */}
            <Stack gap="lg">
                {comments.length === 0 ? (
                    <Box py="3rem" style={{ textAlign: 'center' }}>
                        <Text c={themeColors.subText} size="lg">
                            아직 댓글이 없어요.
                        </Text>
                        <Text c={themeColors.subText} size="md" mt="xs">
                            첫 번째 댓글을 작성해보세요! 💬
                        </Text>
                    </Box>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                        />
                    ))
                )}
            </Stack>
        </Stack>
    );
})

export default CommentSection;