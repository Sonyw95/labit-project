import React, { useState, useCallback, useEffect, memo } from 'react';
import {
    Stack,
    TextInput,
    Group,
    Button,
    Paper,
    Box,
    Badge,
    ActionIcon,
    Select,
    Switch,
    MultiSelect,
    FileInput,
    Image,
    Text,
    Alert,
    rem,
    useMantineColorScheme,
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
import { createLowlight, common } from 'lowlight';
import {
    IconDeviceFloppy,
    IconEye,
    IconPhoto,
    IconX,
    IconSettings,
    IconPin,
    IconEyeOff,
    IconUpload,
} from '@tabler/icons-react';
import {useTheme} from "../../hooks/useTheme.js";
import {useLocalStorage} from "@mantine/hooks";
import {useDebounce} from "../../hooks/useDebounce.js";
import {apiClient} from "../../services/apiClient.js";
import {showToast} from "../common/Toast.jsx";
import {formatters} from "../../utils/formatters.js";

// Lowlight 설정 (코드 하이라이팅)
const lowlight = createLowlight(common);

// 기본 에디터 컨텐츠
const defaultContent = `
<h2>제목을 입력하세요</h2>
<p>여기에 내용을 작성해보세요...</p>
<pre><code class="language-javascript">// 코드 예시
function hello() {
  console.log("Hello, World!");
}
</code></pre>
`;

// 태그 색상 매핑
const tagColors = {
    javascript: 'yellow',
    react: 'blue',
    node: 'green',
    css: 'cyan',
    html: 'orange',
    python: 'grape',
    java: 'red',
    spring: 'lime',
    aws: 'orange',
    docker: 'blue',
};

// 카테고리 옵션
const categoryOptions = [
    { value: 'tech', label: '기술' },
    { value: 'tutorial', label: '튜토리얼' },
    { value: 'review', label: '리뷰' },
    { value: 'opinion', label: '의견' },
    { value: 'news', label: '뉴스' },
];

// PostEdit 메인 컴포넌트
const PostEdit = memo(({
                           initialPost = null,
                           onSave,
                           onPreview,
                           onCancel,
                           navbarData = []
                       }) => {
    const { dark } = useTheme();

    // 폼 상태
    const [formData, setFormData] = useState({
        title: '',
        content: defaultContent,
        excerpt: '',
        bannerImage: null,
        tags: [],
        category: '',
        isHidden: false,
        isPinned: false,
        navbarId: '',
        ...initialPost
    });

    // UI 상태
    const [loading, setLoading] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [bannerPreview, setBannerPreview] = useState(initialPost?.bannerImage || null);
    const [availableTags, setAvailableTags] = useState([]);
    const [showSettings, setShowSettings] = useState(false);

    // 임시저장 키
    const draftKey = `post-draft-${initialPost?.id || 'new'}`;
    const [draftData, setDraftData] = useLocalStorage(draftKey, null);

    // 디바운스된 자동저장
    const debouncedFormData = useDebounce(formData, 2000);

    // 에디터 설정
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
        content: formData.content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFormData(prev => ({ ...prev, content: html }));
        },
    });

    // 컴포넌트 마운트 시 태그 목록 로드
    useEffect(() => {
        const loadTags = async () => {
            try {
                const response = await apiClient.tags.getAll();
                setAvailableTags(response.data.map(tag => ({
                    value: tag.name,
                    label: tag.name,
                    color: tagColors[tag.name.toLowerCase()] || 'gray'
                })));
            } catch (error) {
                console.error('Failed to load tags:', error);
            }
        };

        loadTags();

        // 임시저장 데이터 복원
        if (draftData && !initialPost) {
            // eslint-disable-next-line no-alert
            const shouldRestore = window.confirm('저장되지 않은 임시 데이터가 있습니다. 복원하시겠습니까?');
            if (shouldRestore) {
                setFormData(draftData);
                if (editor) {
                    editor.commands.setContent(draftData.content);
                }
                setBannerPreview(draftData.bannerImage);
            }
        }
    }, [draftData, initialPost, editor]);

    // 자동저장 (디바운스)
    useEffect(() => {
        if (debouncedFormData && JSON.stringify(debouncedFormData) !== JSON.stringify(draftData)) {
            setAutoSaving(true);
            setDraftData(debouncedFormData);

            // 자동저장 표시
            setTimeout(() => setAutoSaving(false), 1000);
        }
    }, [debouncedFormData, draftData, setDraftData]);

    // 배너 이미지 업로드 핸들러
    const handleBannerUpload = useCallback(async (file) => {
        if (!file) {
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB 제한
            showToast.error('오류', '파일 크기는 10MB 이하여야 합니다.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.files.upload(file, 'banners');
            const imageUrl = response.data.url;

            setFormData(prev => ({ ...prev, bannerImage: imageUrl }));
            setBannerPreview(imageUrl);

            showToast.success('성공', '배너 이미지가 업로드되었습니다.');
        } catch (error) {
            showToast.error('오류', '이미지 업로드에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    // 배너 이미지 제거
    const handleBannerRemove = useCallback(() => {
        setFormData(prev => ({ ...prev, bannerImage: null }));
        setBannerPreview(null);
    }, []);

    // 태그 추가
    const handleTagAdd = useCallback((newTags) => {
        setFormData(prev => ({ ...prev, tags: newTags }));
    }, []);

    // 임시저장
    const handleSaveDraft = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.posts.saveDraft(formData);
            showToast.success('임시저장', '임시저장되었습니다.');

            // 임시저장 후 초안 데이터 클리어
            setDraftData(null);
        } catch (error) {
            showToast.error('오류', '임시저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [formData, setDraftData]);

    // 저장
    const handleSave = useCallback(async () => {
        if (!formData.title.trim()) {
            showToast.error('오류', '제목을 입력해주세요.');
            return;
        }

        if (!formData.content.trim()) {
            showToast.error('오류', '내용을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (initialPost?.id) {
                response = await apiClient.posts.update(initialPost.id, formData);
            } else {
                response = await apiClient.posts.create(formData);
            }

            showToast.success('성공', '포스트가 저장되었습니다.');

            // 저장 후 초안 데이터 클리어
            setDraftData(null);

            onSave?.(response.data);
        } catch (error) {
            showToast.error('오류', '저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [formData, initialPost, onSave, setDraftData]);

    // 미리보기
    const handlePreview = useCallback(() => {
        onPreview?.(formData);
    }, [formData, onPreview]);

    // 에디터에 이미지 삽입
    const insertImage = useCallback(async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            try {
                const response = await apiClient.files.upload(file, 'posts');
                const imageUrl = response.data.url;

                if (editor) {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                }

                showToast.success('성공', '이미지가 삽입되었습니다.');
            } catch (error) {
                showToast.error('오류', '이미지 업로드에 실패했습니다.');
            }
        };

        input.click();
    }, [editor]);

    // 읽기 시간 계산
    const readingTime = formData.content
        ? formatters.readingTime(formData.content.replace(/<[^>]*>/g, ''))
        : '0분';

    return (
        <Stack gap="md">
            {/* 헤더 */}
            <Paper p="md" withBorder>
                <Group justify="space-between">
                    <Group gap="xs">
                        <Text size="lg" fw={600}>
                            {initialPost ? '포스트 편집' : '새 포스트 작성'}
                        </Text>
                        {autoSaving && (
                            <Badge size="sm" color="blue" variant="light">
                                자동저장 중...
                            </Badge>
                        )}
                    </Group>

                    <Group gap="xs">
                        <ActionIcon
                            variant="light"
                            onClick={() => setShowSettings(!showSettings)}
                            color={showSettings ? 'blue' : 'gray'}
                        >
                            <IconSettings size={16} />
                        </ActionIcon>

                        <Button
                            variant="light"
                            leftSection={<IconDeviceFloppy size={16} />}
                            onClick={handleSaveDraft}
                            loading={loading}
                        >
                            임시저장
                        </Button>

                        <Button
                            variant="outline"
                            leftSection={<IconEye size={16} />}
                            onClick={handlePreview}
                        >
                            미리보기
                        </Button>

                        <Button
                            leftSection={<IconDeviceFloppy size={16} />}
                            onClick={handleSave}
                            loading={loading}
                        >
                            {initialPost ? '업데이트' : '발행'}
                        </Button>
                    </Group>
                </Group>
            </Paper>

            <Group align="flex-start" gap="md">
                {/* 메인 에디터 */}
                <Box style={{ flex: 1 }}>
                    <Stack gap="md">
                        {/* 제목 입력 */}
                        <TextInput
                            placeholder="포스트 제목을 입력하세요..."
                            size="lg"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            styles={{
                                input: {
                                    fontSize: rem(24),
                                    fontWeight: 600,
                                    border: 'none',
                                    background: 'transparent',
                                    '&:focus': {
                                        borderColor: '#4c6ef5',
                                    }
                                }
                            }}
                        />

                        {/* 배너 이미지 */}
                        {bannerPreview ? (
                            <Box pos="relative">
                                <Image
                                    src={bannerPreview}
                                    h={300}
                                    radius="md"
                                    style={{ objectFit: 'cover' }}
                                />
                                <ActionIcon
                                    pos="absolute"
                                    top="xs"
                                    right="xs"
                                    color="red"
                                    variant="filled"
                                    onClick={handleBannerRemove}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Box>
                        ) : (
                            <FileInput
                                placeholder="배너 이미지를 선택하세요"
                                leftSection={<IconPhoto size={16} />}
                                accept="image/*"
                                onChange={handleBannerUpload}
                                clearable
                            />
                        )}

                        {/* 리치 텍스트 에디터 */}
                        <RichTextEditor editor={editor}>
                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Underline />
                                    <RichTextEditor.Strikethrough />
                                    <RichTextEditor.ClearFormatting />
                                    <RichTextEditor.Highlight />
                                    <RichTextEditor.Code />
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
                                    <RichTextEditor.CodeBlock />
                                    <ActionIcon
                                        variant="subtle"
                                        onClick={insertImage}
                                        title="이미지 삽입"
                                    >
                                        <IconUpload size={16} />
                                    </ActionIcon>
                                </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>

                            <RichTextEditor.Content
                                style={{
                                    minHeight: rem(500),
                                    background: dark ? '#0d1117' : '#ffffff',
                                    color: dark ? '#f0f6fc' : '#1e293b',
                                }}
                            />
                        </RichTextEditor>

                        {/* 요약 */}
                        <TextInput
                            label="요약"
                            placeholder="포스트 요약을 입력하세요 (선택사항)"
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        />

                        {/* 읽기 시간 표시 */}
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                예상 읽기 시간: {readingTime}
                            </Text>
                            <Text size="sm" c="dimmed">
                                •
                            </Text>
                            <Text size="sm" c="dimmed">
                                단어 수: {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length}
                            </Text>
                        </Group>
                    </Stack>
                </Box>

                {/* 사이드바 설정 */}
                {showSettings && (
                    <Box w={300}>
                        <Stack gap="md">
                            <Paper p="md" withBorder>
                                <Stack gap="md">
                                    <Text fw={600} size="sm">발행 설정</Text>

                                    <Switch
                                        label="비공개 포스트"
                                        description="체크하면 포스트가 숨겨집니다"
                                        checked={formData.isHidden}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            isHidden: e.target.checked
                                        }))}
                                        thumbIcon={
                                            formData.isHidden ? (
                                                <IconEyeOff size={12} style={{ color: 'red' }} />
                                            ) : (
                                                <IconEye size={12} style={{ color: 'green' }} />
                                            )
                                        }
                                    />

                                    <Switch
                                        label="상단 고정"
                                        description="체크하면 포스트가 상단에 고정됩니다"
                                        checked={formData.isPinned}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            isPinned: e.target.checked
                                        }))}
                                        thumbIcon={
                                            formData.isPinned ? (
                                                <IconPin size={12} style={{ color: 'blue' }} />
                                            ) : (
                                                <IconPin size={12} style={{ color: 'gray' }} />
                                            )
                                        }
                                    />
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="md">
                                    <Text fw={600} size="sm">카테고리 및 태그</Text>

                                    <Select
                                        label="카테고리"
                                        placeholder="카테고리를 선택하세요"
                                        data={categoryOptions}
                                        value={formData.category}
                                        onChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            category: value
                                        }))}
                                        clearable
                                    />

                                    <MultiSelect
                                        label="태그"
                                        placeholder="태그를 선택하거나 새로 추가하세요"
                                        data={availableTags}
                                        value={formData.tags}
                                        onChange={handleTagAdd}
                                        searchable
                                        creatable
                                        getCreateLabel={(query) => `+ "${query}" 태그 생성`}
                                        onCreate={(query) => {
                                            const newTag = { value: query, label: query, color: 'gray' };
                                            setAvailableTags(prev => [...prev, newTag]);
                                            return newTag;
                                        }}
                                        maxDropdownHeight={200}
                                    />

                                    <Box>
                                        <Text size="xs" c="dimmed" mb="xs">선택된 태그:</Text>
                                        <Group gap="xs">
                                            {formData.tags.map(tag => (
                                                <Badge
                                                    key={tag}
                                                    color={tagColors[tag.toLowerCase()] || 'gray'}
                                                    variant="light"
                                                    size="sm"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </Group>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="md">
                                    <Text fw={600} size="sm">네비게이션</Text>

                                    <Select
                                        label="네비게이션 메뉴"
                                        placeholder="포스트를 표시할 메뉴를 선택하세요"
                                        data={navbarData.map(nav => ({
                                            value: nav.id,
                                            label: nav.label
                                        }))}
                                        value={formData.navbarId}
                                        onChange={(value) => setFormData(prev => ({
                                            ...prev,
                                            navbarId: value
                                        }))}
                                        clearable
                                    />

                                    {formData.navbarId && (
                                        <Alert color="blue" variant="light">
                                            이 포스트는 "{navbarData.find(nav => nav.id === formData.navbarId)?.label}" 메뉴에 표시됩니다.
                                        </Alert>
                                    )}
                                </Stack>
                            </Paper>

                            <Paper p="md" withBorder>
                                <Stack gap="md">
                                    <Text fw={600} size="sm">SEO</Text>

                                    <TextInput
                                        label="URL 슬러그"
                                        placeholder="url-slug"
                                        value={formData.slug || formatters.createSlug(formData.title)}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            slug: e.target.value
                                        }))}
                                        description="URL에 사용될 슬러그입니다"
                                    />

                                    <Text size="xs" c="dimmed">
                                        미리보기: /posts/{formData.slug || formatters.createSlug(formData.title)}
                                    </Text>
                                </Stack>
                            </Paper>

                            {/* 임시저장 목록 */}
                            <Paper p="md" withBorder>
                                <Stack gap="md">
                                    <Text fw={600} size="sm">임시저장</Text>

                                    {draftData ? (
                                        <Alert color="yellow" variant="light">
                                            <Group justify="space-between">
                                                <Text size="xs">
                                                    저장되지 않은 변경사항이 있습니다.
                                                </Text>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    onClick={() => setDraftData(null)}
                                                >
                                                    삭제
                                                </Button>
                                            </Group>
                                        </Alert>
                                    ) : (
                                        <Text size="xs" c="dimmed">
                                            저장된 임시 데이터가 없습니다.
                                        </Text>
                                    )}
                                </Stack>
                            </Paper>
                        </Stack>
                    </Box>
                )}
            </Group>
        </Stack>
    );
});

PostEdit.displayName = 'PostEdit';

export default PostEdit;