// ============================================================================
// src/pages/posts/PostEditPage.jsx - 포스트 편집 페이지
// ============================================================================

import {useState, useEffect, memo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
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
    Grid,
    Card,
    Text,
    Image,
    ActionIcon,
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

import { IconUpload, IconX, IconEye, IconDeviceFloppy } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

// 코드 하이라이트를 위한 언어 설정
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import html from 'highlight.js/lib/languages/xml';
import {useCreatePost, useNavigationTree, usePost, useUpdatePost} from "../hooks/api/useApi.js";
import {showToast} from "../components/advanced/Toast.jsx";



const lowlight = createLowlight();
// 언어 등록
lowlight.register('javascript', javascript);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('html', html);
const PostEditPage = memo(() => {

    const { postId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!postId;

    // 상태 관리
    const [previewMode, setPreviewMode] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // API 훅
    const { data: navigationTree } = useNavigationTree();
    const { data: existingPost, isLoading: isLoadingPost } = usePost(postId, { enabled: isEdit });
    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();

    // Rich Text Editor 설정
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
                style: 'min-height: 400px; padding: 12px;',
            },
        },
    });

    // 폼 관리
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

    // 카테고리 옵션 생성
    const categoryOptions = navigationTree
        ?.filter(nav => nav.href) // href가 있는 것만 (실제 페이지)
        ?.map(nav => ({
            value: nav.id.toString(),
            label: nav.label,
        })) || [];

    // 기존 포스트 데이터 로드
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

    // 에디터 내용 변경 시 폼 업데이트
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

    // 썸네일 파일 업로드 처리
    const handleThumbnailUpload = async (file) => {
        if (file) {
            // 실제 구현시에는 파일을 서버에 업로드하고 URL을 받아와야 함
            // 여기서는 로컬 미리보기만 구현
            const previewUrl = URL.createObjectURL(file);
            setThumbnailPreview(previewUrl);

            // TODO: 실제 파일 업로드 API 호출
            // const uploadedUrl = await uploadFile(file);
            // form.setFieldValue('thumbnailUrl', uploadedUrl);

            showToast.success('썸네일 업로드', '썸네일 이미지가 설정되었습니다.');
        }
    };

    // 썸네일 제거
    const removeThumbnail = () => {
        setThumbnailPreview(null);
        form.setFieldValue('thumbnailUrl', '');
    };

    // 폼 제출 처리
    const handleSubmit = async (values) => {
        try {
            const postData = {
                ...values,
                categoryId: values.categoryId ? parseInt(values.categoryId, 10) : null,
            };

            if (isEdit) {
                await updatePostMutation.mutateAsync({ id: postId, data: postData });
                showToast.success('포스트 수정 완료', '포스트가 성공적으로 수정되었습니다.');
            } else {
                await createPostMutation.mutateAsync(postData);
                showToast.success('포스트 생성 완료', '포스트가 성공적으로 생성되었습니다.');
            }

            // 성공 시 포스트 목록 또는 상세 페이지로 이동
            navigate('/posts');
        } catch (error) {
            showToast.error('오류 발생', error.message || '포스트 저장 중 오류가 발생했습니다.');
        }
    };

    // 임시저장
    const handleSaveDraft = () => {
        form.setFieldValue('status', 'DRAFT');
        form.onSubmit(handleSubmit)();
    };

    // 발행
    const handlePublish = () => {
        form.setFieldValue('status', 'PUBLISHED');
        form.onSubmit(handleSubmit)();
    };

    // 미리보기 토글
    const togglePreview = () => {
        setPreviewMode(!previewMode);
    };

    if (isLoadingPost) {
        return (
            <Container size="lg" pos="relative">
                <LoadingOverlay visible />
            </Container>
        );
    }

    return (
        <Container size="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="lg">
                    {/* 헤더 */}
                    <Paper shadow="sm" p="md">
                        <Group justify="space-between">
                            <Text size="xl" fw={600}>
                                {isEdit ? '포스트 수정' : '새 포스트 작성'}
                            </Text>

                            <Group>
                                <Button
                                    variant="light"
                                    leftSection={<IconEye size={16} />}
                                    onClick={togglePreview}
                                >
                                    {previewMode ? '편집 모드' : '미리보기'}
                                </Button>

                                <Button
                                    variant="outline"
                                    leftSection={<IconDeviceFloppy size={16} />}
                                    onClick={handleSaveDraft}
                                    loading={createPostMutation.isLoading || updatePostMutation.isLoading}
                                >
                                    임시저장
                                </Button>

                                <Button
                                    leftSection={<IconDeviceFloppy size={16} />}
                                    onClick={handlePublish}
                                    loading={createPostMutation.isLoading || updatePostMutation.isLoading}
                                >
                                    발행
                                </Button>
                            </Group>
                        </Group>
                    </Paper>

                    <Grid>
                        {/* 메인 편집 영역 */}
                        <Grid.Col span={8}>
                            <Stack spacing="md">
                                {/* 제목 */}
                                <TextInput
                                    label="제목"
                                    placeholder="포스트 제목을 입력하세요"
                                    required
                                    size="lg"
                                    {...form.getInputProps('title')}
                                />

                                {/* 요약 */}
                                <Textarea
                                    label="요약"
                                    placeholder="포스트 요약을 입력하세요"
                                    minRows={3}
                                    maxRows={5}
                                    {...form.getInputProps('summary')}
                                />

                                {/* 내용 편집기 */}
                                <div>
                                    <Text size="sm" fw={500} mb="xs">
                                        내용 *
                                    </Text>

                                    {previewMode ? (
                                        // 미리보기 모드
                                        <Paper withBorder p="md" mih={400}>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: form.values.content }}
                                                style={{ minHeight: '400px' }}
                                            />
                                        </Paper>
                                    ) : (
                                        // 편집 모드
                                        <RichTextEditor editor={editor}>
                                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
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
                                                    <RichTextEditor.H4 />
                                                </RichTextEditor.ControlsGroup>

                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.Blockquote />
                                                    <RichTextEditor.Hr />
                                                    <RichTextEditor.BulletList />
                                                    <RichTextEditor.OrderedList />
                                                    <RichTextEditor.Subscript />
                                                    <RichTextEditor.Superscript />
                                                </RichTextEditor.ControlsGroup>

                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.Link />
                                                    <RichTextEditor.Unlink />
                                                </RichTextEditor.ControlsGroup>

                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.AlignLeft />
                                                    <RichTextEditor.AlignCenter />
                                                    <RichTextEditor.AlignJustify />
                                                    <RichTextEditor.AlignRight />
                                                </RichTextEditor.ControlsGroup>

                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.Code />
                                                    <RichTextEditor.CodeBlock />
                                                </RichTextEditor.ControlsGroup>
                                            </RichTextEditor.Toolbar>

                                            <RichTextEditor.Content />
                                        </RichTextEditor>
                                    )}
                                </div>
                            </Stack>
                        </Grid.Col>

                        {/* 사이드바 */}
                        <Grid.Col span={4}>
                            <Stack spacing="md">
                                {/* 발행 설정 */}
                                <Card withBorder>
                                    <Card.Section withBorder inheritPadding py="xs">
                                        <Text fw={500}>발행 설정</Text>
                                    </Card.Section>

                                    <Stack mt="md" spacing="sm">
                                        <Select
                                            label="상태"
                                            data={[
                                                { value: 'DRAFT', label: '임시저장' },
                                                { value: 'PUBLISHED', label: '발행됨' },
                                                { value: 'PRIVATE', label: '비공개' },
                                            ]}
                                            {...form.getInputProps('status')}
                                        />

                                        <Switch
                                            label="추천 포스트"
                                            description="메인 페이지에 추천 포스트로 표시"
                                            {...form.getInputProps('isFeatured', { type: 'checkbox' })}
                                        />
                                    </Stack>
                                </Card>

                                {/* 카테고리 */}
                                <Card withBorder>
                                    <Card.Section withBorder inheritPadding py="xs">
                                        <Text fw={500}>카테고리</Text>
                                    </Card.Section>

                                    <Select
                                        mt="md"
                                        placeholder="카테고리를 선택하세요"
                                        data={categoryOptions}
                                        searchable
                                        clearable
                                        {...form.getInputProps('categoryId')}
                                    />
                                </Card>

                                {/* 태그 */}
                                <Card withBorder>
                                    <Card.Section withBorder inheritPadding py="xs">
                                        <Text fw={500}>태그</Text>
                                    </Card.Section>

                                    <MultiSelect
                                        mt="md"
                                        placeholder="태그를 입력하세요"
                                        data={[]}
                                        searchable
                                        creatable
                                        getCreateLabel={(query) => `+ ${query} 태그 추가`}
                                        onCreate={(query) => {
                                            return { value: query, label: query };
                                        }}
                                        {...form.getInputProps('tags')}
                                    />
                                </Card>

                                {/* 썸네일 */}
                                <Card withBorder>
                                    <Card.Section withBorder inheritPadding py="xs">
                                        <Text fw={500}>썸네일</Text>
                                    </Card.Section>

                                    <Stack mt="md" spacing="sm">
                                        {thumbnailPreview ? (
                                            <div style={{ position: 'relative' }}>
                                                <Image
                                                    src={thumbnailPreview}
                                                    alt="썸네일 미리보기"
                                                    height={120}
                                                    fit="cover"
                                                    radius="sm"
                                                />
                                                <ActionIcon
                                                    variant="filled"
                                                    color="red"
                                                    size="sm"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                    }}
                                                    onClick={removeThumbnail}
                                                >
                                                    <IconX size={12} />
                                                </ActionIcon>
                                            </div>
                                        ) : (
                                            <FileInput
                                                placeholder="썸네일 이미지 선택"
                                                leftSection={<IconUpload size={16} />}
                                                accept="image/*"
                                                onChange={handleThumbnailUpload}
                                            />
                                        )}

                                        <TextInput
                                            placeholder="또는 이미지 URL 직접 입력"
                                            {...form.getInputProps('thumbnailUrl')}
                                            onChange={(event) => {
                                                form.getInputProps('thumbnailUrl').onChange(event);
                                                setThumbnailPreview(event.target.value);
                                            }}
                                        />
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>

                    {/* 하단 액션 버튼 */}
                    <Paper shadow="sm" p="md">
                        <Group justify="flex-end">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                취소
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleSaveDraft}
                                loading={createPostMutation.isLoading || updatePostMutation.isLoading}
                            >
                                임시저장
                            </Button>

                            <Button
                                type="submit"
                                loading={createPostMutation.isLoading || updatePostMutation.isLoading}
                            >
                                {isEdit ? '수정' : '발행'}
                            </Button>
                        </Group>
                    </Paper>
                </Stack>
            </form>
        </Container>
    );
})

export default PostEditPage;