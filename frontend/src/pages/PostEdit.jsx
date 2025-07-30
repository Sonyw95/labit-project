import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Stack,
    TextInput,
    Textarea,
    Select,
    MultiSelect,
    Button,
    Group,
    FileInput,
    Switch,
    LoadingOverlay,
    Text,
    Image,
    ActionIcon,
    Box,
    Modal,
    useMantineColorScheme,
    rem,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { IconUpload, IconX, IconEye, IconSettings, IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

// 코드 하이라이트를 위한 언어 설정
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import { showToast } from "@/components/advanced/Toast.jsx";
import { useCreatePost, useNavigationTree, usePost, useUpdatePost } from "@/hooks/api/useApi.js";

const lowlight = createLowlight({})
// 언어 등록
lowlight.register('javascript', javascript);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('css', css);
lowlight.register('html', html);

function PostEditPage() {
    const { colorScheme } = useMantineColorScheme();
    const { postId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!postId;

    // velog 스타일 색상 팔레트
    const themeColors = useMemo(() => ({
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#FFFFFF',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
        success: '#12B886',
        error: '#FA5252',
        cardBg: colorScheme === 'dark' ? '#242529' : '#FFFFFF',
    }), [colorScheme]);

    // 상태 관리 (기존 유지)
    const [previewMode, setPreviewMode] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);

    // API 훅 (기존 유지)
    const { data: navigationTree } = useNavigationTree();
    const { data: existingPost, isLoading: isLoadingPost } = usePost(postId, { enabled: isEdit });
    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();

    // 로딩 상태 메모이제이션
    const isFormLoading = useMemo(() =>
            createPostMutation.isLoading || updatePostMutation.isLoading,
        [createPostMutation.isLoading, updatePostMutation.isLoading]
    );

    // Rich Text Editor 설정 (기존 유지)
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'javascript',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                style: `min-height: 500px; padding: 0; background-color: transparent; color: ${themeColors.text};`,
            },
        },
    });

    // 폼 관리 (기존 유지)
    const form = useForm({
        initialValues: {
            title: '',
            content: '',
            summary: '',
            thumbnailUrl: '',
            tags: [],
            categoryId: '',
            status: 'DRAFT',
            isFeatured: false,
        },
        validate: {
            title: (value) => (!value ? '제목을 입력해주세요.' : null),
            content: (value) => (!value ? '내용을 입력해주세요.' : null),
        },
    });

    // 카테고리 옵션 생성 - 메모이제이션
    const categoryOptions = useMemo(() =>
            navigationTree
                ?.filter(nav => nav.href)
                ?.map(nav => ({
                    value: nav.id.toString(),
                    label: nav.label,
                })) || [],
        [navigationTree]
    );

    // 기존 포스트 데이터 로드 (기존 유지)
    useEffect(() => {
        if (existingPost) {
            form.setValues({
                title: existingPost.title || '',
                content: existingPost.content || '',
                summary: existingPost.summary || '',
                thumbnailUrl: existingPost.thumbnailUrl || '',
                tags: existingPost.tags || [],
                categoryId: existingPost.category?.id?.toString() || '',
                status: existingPost.status || 'DRAFT',
                isFeatured: existingPost.isFeatured || false,
            });

            if (editor && existingPost.content) {
                editor.commands.setContent(existingPost.content);
            }

            setThumbnailPreview(existingPost.thumbnailUrl);
        }
    }, [existingPost, editor]);

    // 에디터 내용 변경 시 폼 업데이트 (기존 유지)
    useEffect(() => {
        if (editor) {
            const updateContent = () => {
                const html = editor.getHTML();
                form.setFieldValue('content', html);
            };

            editor.on('update', updateContent);
            return () => editor.off('update', updateContent);
        }
    }, [editor, form]);

    // 이벤트 핸들러들 - useCallback으로 메모이제이션
    const handleThumbnailUpload = useCallback(async (file) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setThumbnailPreview(previewUrl);
            showToast.success('썸네일 업로드', '썸네일 이미지가 설정되었습니다.')
        }
    }, []);

    const removeThumbnail = useCallback(() => {
        setThumbnailPreview(null);
        form.setFieldValue('thumbnailUrl', '');
    }, [form]);

    const handleSubmit = useCallback(async (values) => {
        try {
            const postData = {
                ...values,
                categoryId: values.categoryId ? parseInt(values.categoryId, 10) : null,
            };

            if (isEdit) {
                await updatePostMutation.mutateAsync({ id: postId, data: postData });
                showToast.success('포스트 수정 완료', '포스트가 성공적으로 수정되었습니다.')
            } else {
                await createPostMutation.mutateAsync(postData);
                showToast.success('포스트 생성 완료', '포스트가 성공적으로 생성되었습니다.')
            }

            navigate('/posts');
        } catch (error) {
            showToast.error('오류 발생', '포스트 저장 중 오류가 발생했습니다.')
        }
    }, [isEdit, updatePostMutation, createPostMutation, postId, navigate]);

    const handleSaveDraft = useCallback(() => {
        form.setFieldValue('status', 'DRAFT');
        form.onSubmit(handleSubmit)();
    }, [form, handleSubmit]);

    const handlePublish = useCallback(() => {
        form.setFieldValue('status', 'PUBLISHED');
        form.onSubmit(handleSubmit)();
    }, [form, handleSubmit]);

    const togglePreview = useCallback(() => {
        setPreviewMode(!previewMode);
    }, [previewMode]);

    // velog 스타일 버튼 컴포넌트
    const VelogButton = useCallback(({ children, variant = 'filled', size = 'md', ...props }) => {
        const isOutline = variant === 'outline';
        const isLight = variant === 'light';
        const isSmall = size === 'sm';

        return (
            <Button
                {...props}
                variant="unstyled"
                style={{
                    backgroundColor: isOutline || isLight ? 'transparent' : themeColors.primary,
                    color: isOutline ? themeColors.text : isLight ? themeColors.primary : 'white',
                    border: isOutline ? `1px solid ${themeColors.border}` : isLight ? `1px solid ${themeColors.primary}` : 'none',
                    borderRadius: rem(6),
                    padding: isSmall ? `${rem(6)} ${rem(12)}` : `${rem(8)} ${rem(16)}`,
                    fontSize: isSmall ? rem(13) : rem(14),
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    height: isSmall ? rem(32) : rem(36),
                    ...props.style,
                }}
                onMouseEnter={(e) => {
                    if (isOutline) {
                        e.currentTarget.style.backgroundColor = themeColors.hover;
                    } else if (isLight) {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                    } else {
                        e.currentTarget.style.backgroundColor = '#0CA678';
                    }
                }}
                onMouseLeave={(e) => {
                    if (isOutline || isLight) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    } else {
                        e.currentTarget.style.backgroundColor = themeColors.primary;
                    }
                }}
            >
                {children}
            </Button>
        );
    }, [themeColors]);

    if (isLoadingPost) {
        return (
            <Box
                style={{
                    backgroundColor: themeColors.background,
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                <LoadingOverlay
                    visible
                    loaderProps={{ color: themeColors.primary, size: 'lg' }}
                />
            </Box>
        );
    }

    return (
        <Box
            style={{
                backgroundColor: themeColors.background,
                minHeight: '100vh',
                transition: 'background-color 0.2s ease'
            }}
        >
            {/* velog 스타일 상단 헤더 - 플로팅 */}
            <Box
                style={{
                    position: 'fixed',
                        left: 0,
                    right: 0,
                    zIndex: 100,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: `${themeColors.background}95`,
                    borderBottom: `1px solid ${themeColors.border}`,
                }}
            >
                <Container size="lg">
                    <Group justify="space-between" p="md">
                        <Group gap="md">
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                onClick={() => navigate(-1)}
                                style={{
                                    color: themeColors.subText,
                                    backgroundColor: 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = themeColors.hover;
                                    e.currentTarget.style.color = themeColors.text;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = themeColors.subText;
                                }}
                            >
                                <IconArrowLeft size={20} />
                            </ActionIcon>

                            <Text
                                size="lg"
                                fw={600}
                                style={{ color: themeColors.text }}
                            >
                                {isEdit ? '포스트 수정' : '새 글 작성'}
                            </Text>
                        </Group>

                        <Group gap="sm">
                            <VelogButton
                                variant="light"
                                size="sm"
                                leftSection={<IconEye size={16} />}
                                onClick={togglePreview}
                            >
                                {previewMode ? '편집' : '미리보기'}
                            </VelogButton>

                            <VelogButton
                                variant="outline"
                                size="sm"
                                leftSection={<IconSettings size={16} />}
                                onClick={openSettings}
                            >
                                설정
                            </VelogButton>

                            <VelogButton
                                variant="outline"
                                size="sm"
                                onClick={handleSaveDraft}
                                loading={isFormLoading}
                            >
                                임시저장
                            </VelogButton>

                            <VelogButton
                                size="sm"
                                onClick={handlePublish}
                                loading={isFormLoading}
                            >
                                발행
                            </VelogButton>
                        </Group>
                    </Group>
                </Container>
            </Box>

            {/* 메인 에디터 영역 */}
            <Container size="lg" style={{ paddingTop: rem(100) }}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="xl" pb="xl">
                        {/* velog 스타일 제목 - 매우 크고 자연스럽게 */}
                        <TextInput
                            placeholder="제목을 입력하세요"
                            required
                            size="xl"
                            {...form.getInputProps('title')}
                            styles={{
                                wrapper: {
                                    marginTop: rem(20),
                                    marginBottom: rem(20),
                                },
                                input: {
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: `2px solid transparent`,
                                    borderRadius: 0,
                                    fontSize: rem(48),
                                    fontWeight: 700,
                                    color: themeColors.text,
                                    padding: `${rem(20)} 0`,
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    lineHeight: 1.2,
                                    '&:focus': {
                                        borderBottomColor: themeColors.primary,
                                    },
                                    '&::placeholder': {
                                        color: themeColors.subText,
                                        opacity: 0.6,
                                    }
                                }
                            }}
                        />

                        {/* velog 스타일 에디터 */}
                        <Box>
                            {previewMode ? (
                                // 완전히 자연스러운 미리보기
                                <Box
                                    style={{
                                        backgroundColor: 'transparent',
                                        minHeight: rem(600),
                                        color: themeColors.text,
                                        lineHeight: 1.8,
                                        fontSize: rem(18),
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: form.values.content || '<p style="color: #ADB5BD; font-style: italic;">내용을 입력해주세요...</p>'
                                        }}
                                        style={{
                                            minHeight: rem(600),
                                            '& h1': { fontSize: rem(36), fontWeight: 700, marginBottom: rem(24), color: themeColors.text, lineHeight: 1.3 },
                                            '& h2': { fontSize: rem(28), fontWeight: 600, marginBottom: rem(20), color: themeColors.text, lineHeight: 1.3 },
                                            '& h3': { fontSize: rem(22), fontWeight: 600, marginBottom: rem(16), color: themeColors.text, lineHeight: 1.3 },
                                            '& p': { fontSize: rem(18), lineHeight: 1.8, marginBottom: rem(20), color: themeColors.text },
                                            '& blockquote': {
                                                borderLeft: `4px solid ${themeColors.primary}`,
                                                paddingLeft: rem(20),
                                                marginLeft: 0,
                                                fontStyle: 'italic',
                                                color: themeColors.subText,
                                                fontSize: rem(18),
                                                lineHeight: 1.8,
                                            },
                                            '& code': {
                                                backgroundColor: themeColors.hover,
                                                padding: `${rem(3)} ${rem(6)}`,
                                                borderRadius: rem(4),
                                                fontSize: rem(15),
                                                color: themeColors.text,
                                                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                            },
                                            '& pre': {
                                                backgroundColor: themeColors.hover,
                                                padding: rem(20),
                                                borderRadius: rem(8),
                                                overflow: 'auto',
                                                fontSize: rem(15),
                                                lineHeight: 1.6,
                                                marginBottom: rem(20),
                                            }
                                        }}
                                    />
                                </Box>
                            ) : (
                                // 완전히 자연스러운 에디터
                                <Box>
                                    <RichTextEditor
                                        editor={editor}
                                        styles={{
                                            root: {
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                            },
                                            toolbar: {
                                                border: 'none',
                                                borderBottom: `1px solid ${themeColors.border}`,
                                                padding: `${rem(16)} 0`,
                                                marginBottom: rem(20),
                                                position: 'sticky',
                                                top: rem(80),
                                                zIndex: 50,
                                                backdropFilter: 'blur(8px)',
                                                backgroundColor: `${themeColors.background}95`,
                                            },
                                            content: {
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                '& .ProseMirror': {
                                                    color: themeColors.text,
                                                    fontSize: rem(18),
                                                    lineHeight: 1.8,
                                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                                    minHeight: rem(600),
                                                    padding: 0,
                                                    outline: 'none',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                },
                                                '& .ProseMirror p': {
                                                    margin: `${rem(20)} 0`,
                                                },
                                                '& .ProseMirror h1': {
                                                    fontSize: rem(36),
                                                    fontWeight: 700,
                                                    margin: `${rem(40)} 0 ${rem(20)} 0`,
                                                    color: themeColors.text,
                                                    lineHeight: 1.3,
                                                },
                                                '& .ProseMirror h2': {
                                                    fontSize: rem(28),
                                                    fontWeight: 600,
                                                    margin: `${rem(32)} 0 ${rem(16)} 0`,
                                                    color: themeColors.text,
                                                    lineHeight: 1.3,
                                                },
                                                '& .ProseMirror h3': {
                                                    fontSize: rem(22),
                                                    fontWeight: 600,
                                                    margin: `${rem(24)} 0 ${rem(12)} 0`,
                                                    color: themeColors.text,
                                                    lineHeight: 1.3,
                                                },
                                                '& .ProseMirror blockquote': {
                                                    borderLeft: `4px solid ${themeColors.primary}`,
                                                    paddingLeft: rem(20),
                                                    marginLeft: 0,
                                                    fontStyle: 'italic',
                                                    color: themeColors.subText,
                                                },
                                                '& .ProseMirror code': {
                                                    backgroundColor: themeColors.hover,
                                                    padding: `${rem(3)} ${rem(6)}`,
                                                    borderRadius: rem(4),
                                                    fontSize: rem(15),
                                                    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                                },
                                                '& .ProseMirror pre': {
                                                    backgroundColor: themeColors.hover,
                                                    padding: rem(20),
                                                    borderRadius: rem(8),
                                                    overflow: 'auto',
                                                    fontSize: rem(15),
                                                    lineHeight: 1.6,
                                                    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                                },
                                                '& .ProseMirror ul, & .ProseMirror ol': {
                                                    paddingLeft: rem(24),
                                                },
                                                '& .ProseMirror li': {
                                                    margin: `${rem(8)} 0`,
                                                },
                                                '& .ProseMirror p.is-editor-empty:first-of-type::before': {
                                                    content: '"내용을 입력하세요..."',
                                                    float: 'left',
                                                    color: themeColors.subText,
                                                    pointerEvents: 'none',
                                                    height: 0,
                                                    fontStyle: 'italic',
                                                    opacity: 0.6,
                                                }
                                            }
                                        }}
                                    >
                                        <RichTextEditor.Toolbar>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Bold />
                                                <RichTextEditor.Italic />
                                                <RichTextEditor.Underline />
                                                <RichTextEditor.Strikethrough />
                                                <RichTextEditor.ClearFormatting />
                                                <RichTextEditor.Highlight />
                                            </RichTextEditor.ControlsGroup>

                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.H1 />
                                                <RichTextEditor.H2 />
                                                <RichTextEditor.H3 />
                                            </RichTextEditor.ControlsGroup>

                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Blockquote />
                                                <RichTextEditor.BulletList />
                                                <RichTextEditor.OrderedList />
                                            </RichTextEditor.ControlsGroup>

                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Link />
                                                <RichTextEditor.Unlink />
                                            </RichTextEditor.ControlsGroup>

                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Code />
                                                <RichTextEditor.CodeBlock />
                                            </RichTextEditor.ControlsGroup>
                                        </RichTextEditor.Toolbar>

                                        <RichTextEditor.Content />
                                    </RichTextEditor>
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </form>
            </Container>

            {/* velog 스타일 설정 모달 */}
            <Modal
                opened={settingsOpened}
                onClose={closeSettings}
                title={
                    <Text
                        fw={600}
                        size="lg"
                        style={{ color: themeColors.text }}
                    >
                        글 설정
                    </Text>
                }
                size="md"
                radius="md"
                styles={{
                    content: {
                        backgroundColor: themeColors.background,
                    },
                    header: {
                        backgroundColor: themeColors.background,
                        borderBottom: `1px solid ${themeColors.border}`,
                    }
                }}
            >
                <Stack gap="xl">
                    {/* 요약 */}
                    <Box>
                        <Text
                            fw={500}
                            mb="sm"
                            style={{ color: themeColors.text }}
                        >
                            요약
                        </Text>
                        <Textarea
                            placeholder="포스트 요약을 입력하세요"
                            minRows={3}
                            maxRows={5}
                            {...form.getInputProps('summary')}
                            styles={{
                                input: {
                                    backgroundColor: themeColors.cardBg,
                                    borderColor: themeColors.border,
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
                    </Box>

                    {/* 카테고리 */}
                    <Box>
                        <Text
                            fw={500}
                            mb="sm"
                            style={{ color: themeColors.text }}
                        >
                            카테고리
                        </Text>
                        <Select
                            placeholder="카테고리를 선택하세요"
                            data={categoryOptions}
                            searchable
                            clearable
                            {...form.getInputProps('categoryId')}
                            styles={{
                                input: {
                                    backgroundColor: themeColors.cardBg,
                                    borderColor: themeColors.border,
                                    color: themeColors.text,
                                    '&:focus': {
                                        borderColor: themeColors.primary,
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* 태그 */}
                    <Box>
                        <Text
                            fw={500}
                            mb="sm"
                            style={{ color: themeColors.text }}
                        >
                            태그
                        </Text>
                        <MultiSelect
                            placeholder="태그를 입력하세요"
                            data={[]}
                            searchable
                            creatable
                            getCreateLabel={(query) => `+ ${query} 태그 추가`}
                            onCreate={(query) => {
                                return { value: query, label: query };
                            }}
                            {...form.getInputProps('tags')}
                            styles={{
                                input: {
                                    backgroundColor: themeColors.cardBg,
                                    borderColor: themeColors.border,
                                    color: themeColors.text,
                                    '&:focus': {
                                        borderColor: themeColors.primary,
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* 썸네일 */}
                    <Box>
                        <Text
                            fw={500}
                            mb="sm"
                            style={{ color: themeColors.text }}
                        >
                            썸네일
                        </Text>
                        <Stack gap="sm">
                            {thumbnailPreview ? (
                                <Box style={{ position: 'relative' }}>
                                    <Image
                                        src={thumbnailPreview}
                                        alt="썸네일 미리보기"
                                        height={150}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: rem(8),
                                        }}
                                    />
                                    <ActionIcon
                                        variant="filled"
                                        color="red"
                                        size="sm"
                                        style={{
                                            position: 'absolute',
                                            top: rem(8),
                                            right: rem(8),
                                        }}
                                        onClick={removeThumbnail}
                                    >
                                        <IconX size={12} />
                                    </ActionIcon>
                                </Box>
                            ) : (
                                <FileInput
                                    placeholder="썸네일 이미지 선택"
                                    leftSection={<IconUpload size={16} />}
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    styles={{
                                        input: {
                                            backgroundColor: themeColors.cardBg,
                                            borderColor: themeColors.border,
                                            color: themeColors.text,
                                            '&:focus': {
                                                borderColor: themeColors.primary,
                                            }
                                        }
                                    }}
                                />
                            )}

                            <TextInput
                                placeholder="또는 이미지 URL 직접 입력"
                                {...form.getInputProps('thumbnailUrl')}
                                onChange={(event) => {
                                    form.getInputProps('thumbnailUrl').onChange(event);
                                    setThumbnailPreview(event.target.value);
                                }}
                                styles={{
                                    input: {
                                        backgroundColor: themeColors.cardBg,
                                        borderColor: themeColors.border,
                                        color: themeColors.text,
                                        '&:focus': {
                                            borderColor: themeColors.primary,
                                        }
                                    }
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* 발행 설정 */}
                    <Box>
                        <Text
                            fw={500}
                            mb="sm"
                            style={{ color: themeColors.text }}
                        >
                            발행 설정
                        </Text>
                        <Stack gap="md">
                            <Select
                                label="상태"
                                data={[
                                    { value: 'DRAFT', label: '임시저장' },
                                    { value: 'PUBLISHED', label: '발행됨' },
                                    { value: 'PRIVATE', label: '비공개' },
                                ]}
                                {...form.getInputProps('status')}
                                styles={{
                                    label: { color: themeColors.text, fontWeight: 500 },
                                    input: {
                                        backgroundColor: themeColors.cardBg,
                                        borderColor: themeColors.border,
                                        color: themeColors.text,
                                        '&:focus': {
                                            borderColor: themeColors.primary,
                                        }
                                    }
                                }}
                            />

                            <Switch
                                label="추천 포스트"
                                description="메인 페이지에 추천 포스트로 표시"
                                {...form.getInputProps('isFeatured', { type: 'checkbox' })}
                                styles={{
                                    label: { color: themeColors.text, fontWeight: 500 },
                                    description: { color: themeColors.subText },
                                    track: {
                                        backgroundColor: form.values.isFeatured
                                            ? themeColors.primary
                                            : themeColors.border,
                                    }
                                }}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Modal>
        </Box>
    );
}

export default PostEditPage;