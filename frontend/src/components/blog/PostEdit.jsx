// import React, { useState, useCallback, useEffect, memo } from 'react';
// import {
//     Stack,
//     TextInput,
//     Group,
//     Button,
//     Paper,
//     Box,
//     Badge,
//     ActionIcon,
//     Select,
//     Switch,
//     MultiSelect,
//     FileInput,
//     Image,
//     Text,
//     Alert,
//     rem,
//     useMantineColorScheme,
// } from '@mantine/core';
// import { RichTextEditor, Link } from '@mantine/tiptap';
// import { useEditor } from '@tiptap/react';
// import Highlight from '@tiptap/extension-highlight';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// import { createLowlight, common } from 'lowlight';
// import {
//     IconDeviceFloppy,
//     IconEye,
//     IconPhoto,
//     IconX,
//     IconSettings,
//     IconPin,
//     IconEyeOff,
//     IconUpload,
// } from '@tabler/icons-react';
// import {useTheme} from "../../hooks/useTheme.js";
// import {useLocalStorage} from "@mantine/hooks";
// import {useDebounce} from "../../hooks/useDebounce.js";
// import {apiClient} from "../../services/apiClient.js";
// import {showToast} from "../common/Toast.jsx";
// import {formatters} from "../../utils/formatters.js";
//
// // Lowlight 설정 (코드 하이라이팅)
// const lowlight = createLowlight(common);
//
// // 기본 에디터 컨텐츠
// const defaultContent = `
// <h2>제목을 입력하세요</h2>
// <p>여기에 내용을 작성해보세요...</p>
// <pre><code class="language-javascript">// 코드 예시
// function hello() {
//   console.log("Hello, World!");
// }
// </code></pre>
// `;
//
// // 태그 색상 매핑
// const tagColors = {
//     javascript: 'yellow',
//     react: 'blue',
//     node: 'green',
//     css: 'cyan',
//     html: 'orange',
//     python: 'grape',
//     java: 'red',
//     spring: 'lime',
//     aws: 'orange',
//     docker: 'blue',
// };
//
// // 카테고리 옵션
// const categoryOptions = [
//     { value: 'tech', label: '기술' },
//     { value: 'tutorial', label: '튜토리얼' },
//     { value: 'review', label: '리뷰' },
//     { value: 'opinion', label: '의견' },
//     { value: 'news', label: '뉴스' },
// ];
//
// // PostEdit 메인 컴포넌트
// const PostEdit = memo(({
//                            initialPost = null,
//                            onSave,
//                            onPreview,
//                            onCancel,
//                            navbarData = []
//                        }) => {
//     const { dark } = useTheme();
//
//     // 폼 상태
//     const [formData, setFormData] = useState({
//         title: '',
//         content: defaultContent,
//         excerpt: '',
//         bannerImage: null,
//         tags: [],
//         category: '',
//         isHidden: false,
//         isPinned: false,
//         navbarId: '',
//         ...initialPost
//     });
//
//     // UI 상태
//     const [loading, setLoading] = useState(false);
//     const [autoSaving, setAutoSaving] = useState(false);
//     const [bannerPreview, setBannerPreview] = useState(initialPost?.bannerImage || null);
//     const [availableTags, setAvailableTags] = useState([]);
//     const [showSettings, setShowSettings] = useState(false);
//
//     // 임시저장 키
//     const draftKey = `post-draft-${initialPost?.id || 'new'}`;
//     const [draftData, setDraftData] = useLocalStorage(draftKey, null);
//
//     // 디바운스된 자동저장
//     const debouncedFormData = useDebounce(formData, 2000);
//
//     // 에디터 설정
//     const editor = useEditor({
//         extensions: [
//             StarterKit,
//             Underline,
//             Link,
//             Superscript,
//             SubScript,
//             Highlight,
//             TextAlign.configure({ types: ['heading', 'paragraph'] }),
//             CodeBlockLowlight.configure({
//                 lowlight,
//                 defaultLanguage: 'javascript',
//             }),
//         ],
//         content: formData.content,
//         onUpdate: ({ editor }) => {
//             const html = editor.getHTML();
//             setFormData(prev => ({ ...prev, content: html }));
//         },
//     });
//
//     // 컴포넌트 마운트 시 태그 목록 로드
//     useEffect(() => {
//         const loadTags = async () => {
//             try {
//                 const response = await apiClient.tags.getAll();
//                 setAvailableTags(response.data.map(tag => ({
//                     value: tag.name,
//                     label: tag.name,
//                     color: tagColors[tag.name.toLowerCase()] || 'gray'
//                 })));
//             } catch (error) {
//                 console.error('Failed to load tags:', error);
//             }
//         };
//
//         loadTags();
//
//         // // 임시저장 데이터 복원
//         // if (draftData && !initialPost) {
//         //     // eslint-disable-next-line no-alert
//         //     const shouldRestore = window.confirm('저장되지 않은 임시 데이터가 있습니다. 복원하시겠습니까?');
//         //     if (shouldRestore) {
//         //         setFormData(draftData);
//         //         if (editor) {
//         //             editor.commands.setContent(draftData.content);
//         //         }
//         //         setBannerPreview(draftData.bannerImage);
//         //     }
//         // }
//     }, [draftData, initialPost, editor]);
//
//     // 자동저장 (디바운스)
//     useEffect(() => {
//         if (debouncedFormData && JSON.stringify(debouncedFormData) !== JSON.stringify(draftData)) {
//             setAutoSaving(true);
//             setDraftData(debouncedFormData);
//
//             // 자동저장 표시
//             setTimeout(() => setAutoSaving(false), 1000);
//         }
//     }, [debouncedFormData, draftData, setDraftData]);
//
//     // 배너 이미지 업로드 핸들러
//     const handleBannerUpload = useCallback(async (file) => {
//         if (!file) {
//             return;
//         }
//
//         if (file.size > 10 * 1024 * 1024) { // 10MB 제한
//             showToast.error('오류', '파일 크기는 10MB 이하여야 합니다.');
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const response = await apiClient.files.upload(file, 'banners');
//             const imageUrl = response.data.url;
//
//             setFormData(prev => ({ ...prev, bannerImage: imageUrl }));
//             setBannerPreview(imageUrl);
//
//             showToast.success('성공', '배너 이미지가 업로드되었습니다.');
//         } catch (error) {
//             showToast.error('오류', '이미지 업로드에 실패했습니다.');
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     // 배너 이미지 제거
//     const handleBannerRemove = useCallback(() => {
//         setFormData(prev => ({ ...prev, bannerImage: null }));
//         setBannerPreview(null);
//     }, []);
//
//     // 태그 추가
//     const handleTagAdd = useCallback((newTags) => {
//         setFormData(prev => ({ ...prev, tags: newTags }));
//     }, []);
//
//     // 임시저장
//     const handleSaveDraft = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.posts.saveDraft(formData);
//             showToast.success('임시저장', '임시저장되었습니다.');
//
//             // 임시저장 후 초안 데이터 클리어
//             setDraftData(null);
//         } catch (error) {
//             showToast.error('오류', '임시저장에 실패했습니다.');
//         } finally {
//             setLoading(false);
//         }
//     }, [formData, setDraftData]);
//
//     // 저장
//     const handleSave = useCallback(async () => {
//         if (!formData.title.trim()) {
//             showToast.error('오류', '제목을 입력해주세요.');
//             return;
//         }
//
//         if (!formData.content.trim()) {
//             showToast.error('오류', '내용을 입력해주세요.');
//             return;
//         }
//
//         setLoading(true);
//         try {
//             let response;
//             if (initialPost?.id) {
//                 response = await apiClient.posts.update(initialPost.id, formData);
//             } else {
//                 response = await apiClient.posts.create(formData);
//             }
//
//             showToast.success('성공', '포스트가 저장되었습니다.');
//
//             // 저장 후 초안 데이터 클리어
//             setDraftData(null);
//
//             onSave?.(response.data);
//         } catch (error) {
//             showToast.error('오류', '저장에 실패했습니다.');
//         } finally {
//             setLoading(false);
//         }
//     }, [formData, initialPost, onSave, setDraftData]);
//
//     // 미리보기
//     const handlePreview = useCallback(() => {
//         onPreview?.(formData);
//     }, [formData, onPreview]);
//
//     // 에디터에 이미지 삽입
//     const insertImage = useCallback(async () => {
//         const input = document.createElement('input');
//         input.type = 'file';
//         input.accept = 'image/*';
//
//         input.onchange = async (e) => {
//             const file = e.target.files[0];
//             if (!file) {
//                 return;
//             }
//             try {
//                 const response = await apiClient.files.upload(file, 'posts');
//                 const imageUrl = response.data.url;
//
//                 if (editor) {
//                     editor.chain().focus().setImage({ src: imageUrl }).run();
//                 }
//
//                 showToast.success('성공', '이미지가 삽입되었습니다.');
//             } catch (error) {
//                 showToast.error('오류', '이미지 업로드에 실패했습니다.');
//             }
//         };
//
//         input.click();
//     }, [editor]);
//
//     // 읽기 시간 계산
//     const readingTime = formData.content
//         ? formatters.readingTime(formData.content.replace(/<[^>]*>/g, ''))
//         : '0분';
//
//     return (
//         <Stack gap="md">
//             {/* 헤더 */}
//             <Paper p="md" withBorder>
//                 <Group justify="space-between">
//                     <Group gap="xs">
//                         <Text size="lg" fw={600}>
//                             {initialPost ? '포스트 편집' : '새 포스트 작성'}
//                         </Text>
//                         {autoSaving && (
//                             <Badge size="sm" color="blue" variant="light">
//                                 자동저장 중...
//                             </Badge>
//                         )}
//                     </Group>
//
//                     <Group gap="xs">
//                         <ActionIcon
//                             variant="light"
//                             onClick={() => setShowSettings(!showSettings)}
//                             color={showSettings ? 'blue' : 'gray'}
//                         >
//                             <IconSettings size={16} />
//                         </ActionIcon>
//
//                         <Button
//                             variant="light"
//                             leftSection={<IconDeviceFloppy size={16} />}
//                             onClick={handleSaveDraft}
//                             loading={loading}
//                         >
//                             임시저장
//                         </Button>
//
//                         <Button
//                             variant="outline"
//                             leftSection={<IconEye size={16} />}
//                             onClick={handlePreview}
//                         >
//                             미리보기
//                         </Button>
//
//                         <Button
//                             leftSection={<IconDeviceFloppy size={16} />}
//                             onClick={handleSave}
//                             loading={loading}
//                         >
//                             {initialPost ? '업데이트' : '발행'}
//                         </Button>
//                     </Group>
//                 </Group>
//             </Paper>
//
//             <Group align="flex-start" gap="md">
//                 {/* 메인 에디터 */}
//                 <Box style={{ flex: 1 }}>
//                     <Stack gap="md">
//                         {/* 제목 입력 */}
//                         <TextInput
//                             placeholder="포스트 제목을 입력하세요..."
//                             size="lg"
//                             value={formData.title}
//                             onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                             styles={{
//                                 input: {
//                                     fontSize: rem(24),
//                                     fontWeight: 600,
//                                     border: 'none',
//                                     background: 'transparent',
//                                     '&:focus': {
//                                         borderColor: '#4c6ef5',
//                                     }
//                                 }
//                             }}
//                         />
//
//                         {/* 배너 이미지 */}
//                         {bannerPreview ? (
//                             <Box pos="relative">
//                                 <Image
//                                     src={bannerPreview}
//                                     h={300}
//                                     radius="md"
//                                     style={{ objectFit: 'cover' }}
//                                 />
//                                 <ActionIcon
//                                     pos="absolute"
//                                     top="xs"
//                                     right="xs"
//                                     color="red"
//                                     variant="filled"
//                                     onClick={handleBannerRemove}
//                                 >
//                                     <IconX size={16} />
//                                 </ActionIcon>
//                             </Box>
//                         ) : (
//                             <FileInput
//                                 placeholder="배너 이미지를 선택하세요"
//                                 leftSection={<IconPhoto size={16} />}
//                                 accept="image/*"
//                                 onChange={handleBannerUpload}
//                                 clearable
//                             />
//                         )}
//
//                         {/* 리치 텍스트 에디터 */}
//                         <RichTextEditor editor={editor}>
//                             <RichTextEditor.Toolbar sticky stickyOffset={60}>
//                                 <RichTextEditor.ControlsGroup>
//                                     <RichTextEditor.Bold />
//                                     <RichTextEditor.Italic />
//                                     <RichTextEditor.Underline />
//                                     <RichTextEditor.Strikethrough />
//                                     <RichTextEditor.ClearFormatting />
//                                     <RichTextEditor.Highlight />
//                                     <RichTextEditor.Code />
//                                 </RichTextEditor.ControlsGroup>
//
//                                 <RichTextEditor.ControlsGroup>
//                                     <RichTextEditor.H1 />
//                                     <RichTextEditor.H2 />
//                                     <RichTextEditor.H3 />
//                                     <RichTextEditor.H4 />
//                                 </RichTextEditor.ControlsGroup>
//
//                                 <RichTextEditor.ControlsGroup>
//                                     <RichTextEditor.Blockquote />
//                                     <RichTextEditor.Hr />
//                                     <RichTextEditor.BulletList />
//                                     <RichTextEditor.OrderedList />
//                                     <RichTextEditor.Subscript />
//                                     <RichTextEditor.Superscript />
//                                 </RichTextEditor.ControlsGroup>
//
//                                 <RichTextEditor.ControlsGroup>
//                                     <RichTextEditor.Link />
//                                     <RichTextEditor.Unlink />
//                                 </RichTextEditor.ControlsGroup>
//
//                                 <RichTextEditor.ControlsGroup>
//                                     <RichTextEditor.AlignLeft />
//                                     <RichTextEditor.AlignCenter />
//                                     <RichTextEditor.AlignJustify />
//                                     <RichTextEditor.AlignRight />
//                                 </RichTextEditor.ControlsGroup>
//
//                                 <RichTextEditor.ControlsGroup>
//                                     <RichTextEditor.CodeBlock />
//                                     <ActionIcon
//                                         variant="subtle"
//                                         onClick={insertImage}
//                                         title="이미지 삽입"
//                                     >
//                                         <IconUpload size={16} />
//                                     </ActionIcon>
//                                 </RichTextEditor.ControlsGroup>
//                             </RichTextEditor.Toolbar>
//
//                             <RichTextEditor.Content
//                                 style={{
//                                     minHeight: rem(500),
//                                     background: dark ? '#0d1117' : '#ffffff',
//                                     color: dark ? '#f0f6fc' : '#1e293b',
//                                 }}
//                             />
//                         </RichTextEditor>
//
//                         {/* 요약 */}
//                         <TextInput
//                             label="요약"
//                             placeholder="포스트 요약을 입력하세요 (선택사항)"
//                             value={formData.excerpt}
//                             onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
//                         />
//
//                         {/* 읽기 시간 표시 */}
//                         <Group gap="xs">
//                             <Text size="sm" c="dimmed">
//                                 예상 읽기 시간: {readingTime}
//                             </Text>
//                             <Text size="sm" c="dimmed">
//                                 •
//                             </Text>
//                             <Text size="sm" c="dimmed">
//                                 단어 수: {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length}
//                             </Text>
//                         </Group>
//                     </Stack>
//                 </Box>
//
//                 {/* 사이드바 설정 */}
//                 {showSettings && (
//                     <Box w={300}>
//                         <Stack gap="md">
//                             <Paper p="md" withBorder>
//                                 <Stack gap="md">
//                                     <Text fw={600} size="sm">발행 설정</Text>
//
//                                     <Switch
//                                         label="비공개 포스트"
//                                         description="체크하면 포스트가 숨겨집니다"
//                                         checked={formData.isHidden}
//                                         onChange={(e) => setFormData(prev => ({
//                                             ...prev,
//                                             isHidden: e.target.checked
//                                         }))}
//                                         thumbIcon={
//                                             formData.isHidden ? (
//                                                 <IconEyeOff size={12} style={{ color: 'red' }} />
//                                             ) : (
//                                                 <IconEye size={12} style={{ color: 'green' }} />
//                                             )
//                                         }
//                                     />
//
//                                     <Switch
//                                         label="상단 고정"
//                                         description="체크하면 포스트가 상단에 고정됩니다"
//                                         checked={formData.isPinned}
//                                         onChange={(e) => setFormData(prev => ({
//                                             ...prev,
//                                             isPinned: e.target.checked
//                                         }))}
//                                         thumbIcon={
//                                             formData.isPinned ? (
//                                                 <IconPin size={12} style={{ color: 'blue' }} />
//                                             ) : (
//                                                 <IconPin size={12} style={{ color: 'gray' }} />
//                                             )
//                                         }
//                                     />
//                                 </Stack>
//                             </Paper>
//
//                             <Paper p="md" withBorder>
//                                 <Stack gap="md">
//                                     <Text fw={600} size="sm">카테고리 및 태그</Text>
//
//                                     <Select
//                                         label="카테고리"
//                                         placeholder="카테고리를 선택하세요"
//                                         data={categoryOptions}
//                                         value={formData.category}
//                                         onChange={(value) => setFormData(prev => ({
//                                             ...prev,
//                                             category: value
//                                         }))}
//                                         clearable
//                                     />
//
//                                     <MultiSelect
//                                         label="태그"
//                                         placeholder="태그를 선택하거나 새로 추가하세요"
//                                         data={availableTags}
//                                         value={formData.tags}
//                                         onChange={handleTagAdd}
//                                         searchable
//                                         creatable
//                                         getCreateLabel={(query) => `+ "${query}" 태그 생성`}
//                                         onCreate={(query) => {
//                                             const newTag = { value: query, label: query, color: 'gray' };
//                                             setAvailableTags(prev => [...prev, newTag]);
//                                             return newTag;
//                                         }}
//                                         maxDropdownHeight={200}
//                                     />
//
//                                     <Box>
//                                         <Text size="xs" c="dimmed" mb="xs">선택된 태그:</Text>
//                                         <Group gap="xs">
//                                             {formData.tags.map(tag => (
//                                                 <Badge
//                                                     key={tag}
//                                                     color={tagColors[tag.toLowerCase()] || 'gray'}
//                                                     variant="light"
//                                                     size="sm"
//                                                 >
//                                                     {tag}
//                                                 </Badge>
//                                             ))}
//                                         </Group>
//                                     </Box>
//                                 </Stack>
//                             </Paper>
//
//                             <Paper p="md" withBorder>
//                                 <Stack gap="md">
//                                     <Text fw={600} size="sm">네비게이션</Text>
//
//                                     <Select
//                                         label="네비게이션 메뉴"
//                                         placeholder="포스트를 표시할 메뉴를 선택하세요"
//                                         data={navbarData.map(nav => ({
//                                             value: nav.id,
//                                             label: nav.label
//                                         }))}
//                                         value={formData.navbarId}
//                                         onChange={(value) => setFormData(prev => ({
//                                             ...prev,
//                                             navbarId: value
//                                         }))}
//                                         clearable
//                                     />
//
//                                     {formData.navbarId && (
//                                         <Alert color="blue" variant="light">
//                                             이 포스트는 "{navbarData.find(nav => nav.id === formData.navbarId)?.label}" 메뉴에 표시됩니다.
//                                         </Alert>
//                                     )}
//                                 </Stack>
//                             </Paper>
//
//                             <Paper p="md" withBorder>
//                                 <Stack gap="md">
//                                     <Text fw={600} size="sm">SEO</Text>
//
//                                     <TextInput
//                                         label="URL 슬러그"
//                                         placeholder="url-slug"
//                                         value={formData.slug || formatters.createSlug(formData.title)}
//                                         onChange={(e) => setFormData(prev => ({
//                                             ...prev,
//                                             slug: e.target.value
//                                         }))}
//                                         description="URL에 사용될 슬러그입니다"
//                                     />
//
//                                     <Text size="xs" c="dimmed">
//                                         미리보기: /posts/{formData.slug || formatters.createSlug(formData.title)}
//                                     </Text>
//                                 </Stack>
//                             </Paper>
//
//                             {/* 임시저장 목록 */}
//                             <Paper p="md" withBorder>
//                                 <Stack gap="md">
//                                     <Text fw={600} size="sm">임시저장</Text>
//
//                                     {draftData ? (
//                                         <Alert color="yellow" variant="light">
//                                             <Group justify="space-between">
//                                                 <Text size="xs">
//                                                     저장되지 않은 변경사항이 있습니다.
//                                                 </Text>
//                                                 <Button
//                                                     size="xs"
//                                                     variant="light"
//                                                     onClick={() => setDraftData(null)}
//                                                 >
//                                                     삭제
//                                                 </Button>
//                                             </Group>
//                                         </Alert>
//                                     ) : (
//                                         <Text size="xs" c="dimmed">
//                                             저장된 임시 데이터가 없습니다.
//                                         </Text>
//                                     )}
//                                 </Stack>
//                             </Paper>
//                         </Stack>
//                     </Box>
//                 )}
//             </Group>
//         </Stack>
//     );
// });
//
// PostEdit.displayName = 'PostEdit';
//
// export default PostEdit;

import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Text,
    Stack,
    Group,
    Button,
    TextInput,
    Textarea,
    Select,
    MultiSelect,
    Paper,
    Box,
    ActionIcon,
    Badge,
    Card,
    Divider,
    Switch,
    Tooltip,
    Progress,
    Affix,
    Transition,
    FileInput,
    Image,
    useComputedColorScheme,
    useMantineColorScheme,
    Tabs,
    Alert,
    LoadingOverlay,
    Modal,
    Grid,
    Title,
    Avatar,
    Center
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
import { CodeHighlight } from '@mantine/code-highlight';
import { createLowlight } from 'lowlight';
import ts from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import {
    IconDeviceFloppy,
    IconEye,
    IconSun,
    IconMoon,
    IconCode,
    IconPhoto,
    IconTag,
    IconCategory,
    IconArrowUp,
    IconSparkles,
    IconRobot,
    IconBrandGithub,
    IconCopy,
    IconCheck,
    IconAlertCircle,
    IconInfoCircle,
    IconX
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

// Lowlight 설정 (code highlighting)
const lowlight = createLowlight();
lowlight.register({ ts, javascript, python, java, css, html });

// 2025년 트렌드 반영: AI 기반 태그 제안 시뮬레이션
const suggestedTags = [
    'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js',
    '웹개발', '프론트엔드', '백엔드', 'UI/UX', '디자인',
    '2025트렌드', 'AI', '머신러닝', '데이터분석', '성능최적화',
    '접근성', '반응형웹', 'PWA', '서버사이드렌더링', 'API',
    'Spring Boot', 'Java', 'Spring Framework', 'Mantine'
];

const categories = [
    { value: 'tech', label: '💻 기술' },
    { value: 'design', label: '🎨 디자인' },
    { value: 'frontend', label: '⚛️ 프론트엔드' },
    { value: 'backend', label: '🔧 백엔드' },
    { value: 'tutorial', label: '📚 튜토리얼' },
    { value: 'review', label: '⭐ 리뷰' },
    { value: 'news', label: '📰 뉴스' },
    { value: 'career', label: '💼 커리어' },
    { value: 'trends', label: '🚀 트렌드' }
];

// 2025년 트렌드: 유기적 형태와 글래스모피즘을 반영한 플로팅 툴바
function FloatingToolbar({ onSave, onPreview, isDraft, saveProgress }) {
    const computedColorScheme = useComputedColorScheme('light');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Affix position={{ bottom: 20, right: 20 }}>
            <Stack gap="xs">
                {/* 저장 진행률 표시 */}
                {saveProgress > 0 && (
                    <Paper
                        p="sm"
                        style={{
                            background: computedColorScheme === 'light'
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'rgba(20, 20, 20, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: computedColorScheme === 'light'
                                ? '1px solid rgba(0, 0, 0, 0.1)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            boxShadow: computedColorScheme === 'light'
                                ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                                : '0 8px 32px rgba(255, 255, 255, 0.05)',
                            width: '200px'
                        }}
                    >
                        <Text size="xs" mb="xs">저장 중...</Text>
                        <Progress value={saveProgress} size="xs" radius="xl" />
                    </Paper>
                )}

                {/* 메인 액션 버튼들 */}
                <Paper
                    p="xs"
                    style={{
                        background: computedColorScheme === 'light'
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: computedColorScheme === 'light'
                            ? '1px solid rgba(0, 0, 0, 0.1)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        boxShadow: computedColorScheme === 'light'
                            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                            : '0 8px 32px rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <Stack gap="xs">
                        <Tooltip label="미리보기" position="left">
                            <ActionIcon
                                variant="light"
                                size="lg"
                                onClick={onPreview}
                                style={{
                                    transition: 'all 0.2s ease',
                                    background: 'rgba(34, 139, 230, 0.1)',
                                    '&:hover': {
                                        background: 'rgba(34, 139, 230, 0.2)',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <IconEye size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={isDraft ? "임시저장" : "발행하기"} position="left">
                            <ActionIcon
                                variant="filled"
                                size="lg"
                                onClick={onSave}
                                style={{
                                    background: isDraft
                                        ? 'linear-gradient(135deg, var(--mantine-color-orange-6), var(--mantine-color-yellow-6))'
                                        : 'linear-gradient(135deg, var(--mantine-color-green-6), var(--mantine-color-teal-6))',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <IconDeviceFloppy size={20} color="white" />
                            </ActionIcon>
                        </Tooltip>
                    </Stack>
                </Paper>

                {/* 맨 위로 버튼 - 2025 트렌드: 마이크로 애니메이션 */}
                <Transition mounted={showScrollTop} transition="slide-up" duration={200}>
                    {(styles) => (
                        <ActionIcon
                            style={{
                                ...styles,
                                background: 'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-grape-6))',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '50%',
                                boxShadow: computedColorScheme === 'light'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                                    : '0 8px 32px rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                            }}
                            size="xl"
                            onClick={scrollToTop}
                        >
                            <IconArrowUp size={24} color="white" />
                        </ActionIcon>
                    )}
                </Transition>
            </Stack>
        </Affix>
    );
}

// 2025년 트렌드: AI 지원 컴포넌트
function AIAssistant({ onSuggestTags, onSuggestTitle, onOptimizeContent, isLoading }) {
    const computedColorScheme = useComputedColorScheme('light');
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            p="md"
            style={{
                background: computedColorScheme === 'light'
                    ? 'linear-gradient(135deg, rgba(67, 56, 202, 0.05), rgba(147, 51, 234, 0.05))'
                    : 'linear-gradient(135deg, rgba(67, 56, 202, 0.1), rgba(147, 51, 234, 0.1))',
                border: computedColorScheme === 'light'
                    ? '1px solid rgba(67, 56, 202, 0.2)'
                    : '1px solid rgba(147, 51, 234, 0.2)',
                borderRadius: '16px',
                position: 'relative',
            }}
        >
            <LoadingOverlay visible={isLoading} />

            <Group justify="space-between" mb="md">
                <Group>
                    <Avatar
                        size="sm"
                        style={{
                            background: 'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-grape-6))',
                        }}
                    >
                        <IconRobot size={16} color="white" />
                    </Avatar>
                    <Text fw={600} size="sm">AI 어시스턴트</Text>
                    <Badge variant="light" color="violet" size="xs">
                        Beta
                    </Badge>
                </Group>
                <ActionIcon
                    variant="subtle"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <IconSparkles size={16} />
                </ActionIcon>
            </Group>

            <Transition mounted={isExpanded} transition="slide-down" duration={200}>
                {(styles) => (
                    <div style={styles}>
                        <Text size="xs" c="dimmed" mb="md">
                            AI가 당신의 글쓰기를 도와드립니다
                        </Text>

                        <Stack gap="xs">
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<IconTag size={14} />}
                                onClick={onSuggestTags}
                                fullWidth
                            >
                                태그 제안받기
                            </Button>
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<IconSparkles size={14} />}
                                onClick={onSuggestTitle}
                                fullWidth
                            >
                                제목 개선하기
                            </Button>
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<IconCheck size={14} />}
                                onClick={onOptimizeContent}
                                fullWidth
                            >
                                내용 최적화
                            </Button>
                        </Stack>
                    </div>
                )}
            </Transition>
        </Card>
    );
}

// 코드 블록 삽입 모달
function CodeBlockModal({ opened, onClose, onInsert }) {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'css', label: 'CSS' },
        { value: 'html', label: 'HTML' },
        { value: 'json', label: 'JSON' },
        { value: 'bash', label: 'Bash' }
    ];

    const handleInsert = () => {
        onInsert(code, language);
        setCode('');
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="코드 블록 삽입"
            size="lg"
            style={{
                backdropFilter: 'blur(10px)'
            }}
        >
            <Stack gap="md">
                <Select
                    label="언어 선택"
                    data={languages}
                    value={language}
                    onChange={setLanguage}
                />

                <Textarea
                    label="코드"
                    placeholder="여기에 코드를 입력하세요..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={10}
                    style={{
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                    }}
                />

                {code && (
                    <Box>
                        <Text size="sm" fw={500} mb="xs">미리보기:</Text>
                        <CodeHighlight
                            code={code}
                            language={language}
                            radius="md"
                        />
                    </Box>
                )}

                <Group justify="flex-end">
                    <Button variant="light" onClick={onClose}>
                        취소
                    </Button>
                    <Button onClick={handleInsert} disabled={!code.trim()}>
                        삽입
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

// 메인 PostEditForm 컴포넌트
export default function PostEditForm() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');

    const [saveProgress, setSaveProgress] = useState(0);
    const [isAILoading, setIsAILoading] = useState(false);
    const [codeModalOpened, setCodeModalOpened] = useState(false);
    const [previewModalOpened, setPreviewModalOpened] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isDraft, setIsDraft] = useState(true);

    // Mantine Form 설정
    const form = useForm({
        initialValues: {
            title: '',
            subtitle: '',
            content: '',
            category: '',
            tags: [],
            bannerImage: null,
            metaDescription: '',
            isPublished: false
        },
        validate: {
            title: (value) => (!value ? '제목을 입력해주세요' : null),
            category: (value) => (!value ? '카테고리를 선택해주세요' : null),
            content: (value) => (!value ? '내용을 입력해주세요' : null)
        }
    });

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
                defaultLanguage: 'javascript'
            })
        ],
        content: form.values.content,
        onUpdate: ({ editor }) => {
            form.setFieldValue('content', editor.getHTML());
        }
    });

    // AI 기능들 (시뮬레이션)
    const handleAISuggestTags = async () => {
        setIsAILoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 시뮬레이션

        const aiSuggested = suggestedTags
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        setSelectedTags(prev => [...new Set([...prev, ...aiSuggested])]);
        form.setFieldValue('tags', [...new Set([...form.values.tags, ...aiSuggested])]);

        notifications.show({
            title: 'AI 태그 제안',
            message: `${aiSuggested.length}개의 태그가 제안되었습니다!`,
            color: 'violet'
        });
        setIsAILoading(false);
    };

    const handleAISuggestTitle = async () => {
        setIsAILoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const suggestions = [
            "2025년 웹 개발 트렌드: 미래를 이끄는 기술들",
            "개발자가 알아야 할 최신 React 패턴과 베스트 프랙티스",
            "효율적인 코드 작성을 위한 TypeScript 활용법"
        ];

        const suggested = suggestions[Math.floor(Math.random() * suggestions.length)];
        form.setFieldValue('title', suggested);

        notifications.show({
            title: 'AI 제목 제안',
            message: '새로운 제목이 제안되었습니다!',
            color: 'blue'
        });
        setIsAILoading(false);
    };

    const handleAIOptimizeContent = async () => {
        setIsAILoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        notifications.show({
            title: 'AI 내용 최적화',
            message: '내용이 SEO와 가독성을 위해 최적화되었습니다!',
            color: 'green'
        });
        setIsAILoading(false);
    };

    // 코드 블록 삽입
    const handleInsertCodeBlock = (code, language) => {
        if (editor) {
            editor.chain().focus().setCodeBlock({ language }).insertContent(code).run();
        }
    };

    // 저장 및 발행
    const handleSave = async () => {
        if (form.validate().hasErrors) {
            notifications.show({
                title: '입력 오류',
                message: '필수 필드를 모두 입력해주세요.',
                color: 'red'
            });
            return;
        }

        setSaveProgress(0);

        // 저장 진행률 시뮬레이션
        const interval = setInterval(() => {
            setSaveProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    notifications.show({
                        title: isDraft ? '임시저장 완료' : '발행 완료',
                        message: isDraft ? '포스트가 임시저장되었습니다.' : '포스트가 성공적으로 발행되었습니다!',
                        color: isDraft ? 'orange' : 'green'
                    });
                    setTimeout(() => setSaveProgress(0), 2000);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

    const handlePreview = () => {
        setPreviewModalOpened(true);
    };

    return (
        <Box style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-body)' }}>
            <Container size="lg" py="xl">
                {/* 헤더 */}
                <Paper
                    p="xl"
                    mb="xl"
                    style={{
                        background: computedColorScheme === 'light'
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))'
                            : 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.9))',
                        backdropFilter: 'blur(20px)',
                        border: computedColorScheme === 'light'
                            ? '1px solid rgba(0, 0, 0, 0.08)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        boxShadow: computedColorScheme === 'light'
                            ? '0 20px 40px rgba(0, 0, 0, 0.1)'
                            : '0 20px 40px rgba(255, 255, 255, 0.02)'
                    }}
                >
                    <Group justify="space-between" align="center">
                        <Box>
                            <Title
                                order={1}
                                style={{
                                    background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-violet-6))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
                                }}
                            >
                                포스트 작성
                            </Title>
                            <Text c="dimmed" mt="xs">
                                2025년 트렌드를 반영한 현대적 에디터로 멋진 글을 작성해보세요
                            </Text>
                        </Box>

                        <Group>
                            {/* 다크모드 토글 - 2025 트렌드 반영 */}
                            <Tooltip label={`${colorScheme === 'dark' ? '라이트' : '다크'} 모드`}>
                                <ActionIcon
                                    variant="light"
                                    size="lg"
                                    onClick={() => toggleColorScheme()}
                                    style={{
                                        background: colorScheme === 'dark'
                                            ? 'linear-gradient(135deg, var(--mantine-color-yellow-4), var(--mantine-color-orange-4))'
                                            : 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6))',
                                        color: 'white',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                                </ActionIcon>
                            </Tooltip>

                            <Switch
                                label="발행모드"
                                checked={!isDraft}
                                onChange={(event) => setIsDraft(!event.currentTarget.checked)}
                                color="green"
                                size="md"
                            />
                        </Group>
                    </Group>
                </Paper>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        {/* 메인 에디터 영역 */}
                        <Stack gap="lg">
                            {/* 기본 정보 */}
                            <Paper
                                p="lg"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(255, 255, 255, 0.8)'
                                        : 'rgba(30, 30, 30, 0.8)',
                                    backdropFilter: 'blur(20px)',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px'
                                }}
                            >
                                <Stack gap="md">
                                    <TextInput
                                        label="제목"
                                        placeholder="포스트 제목을 입력하세요..."
                                        size="lg"
                                        {...form.getInputProps('title')}
                                        styles={{
                                            input: {
                                                fontSize: '1.25rem',
                                                fontWeight: 600
                                            }
                                        }}
                                    />

                                    <TextInput
                                        label="부제목"
                                        placeholder="부제목을 입력하세요 (선택사항)"
                                        {...form.getInputProps('subtitle')}
                                    />

                                    <Group grow>
                                        <Select
                                            label="카테고리"
                                            placeholder="카테고리를 선택하세요"
                                            data={categories}
                                            {...form.getInputProps('category')}
                                        />

                                        <FileInput
                                            label="배너 이미지"
                                            placeholder="이미지를 선택하세요"
                                            accept="image/*"
                                            leftSection={<IconPhoto size={16} />}
                                            {...form.getInputProps('bannerImage')}
                                        />
                                    </Group>
                                </Stack>
                            </Paper>

                            {/* Rich Text Editor */}
                            <Paper
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(255, 255, 255, 0.8)'
                                        : 'rgba(30, 30, 30, 0.8)',
                                    backdropFilter: 'blur(20px)',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                }}
                            >
                                <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                                    <Group justify="space-between">
                                        <Text fw={600}>내용 작성</Text>
                                        <Group gap="xs">
                                            <Tooltip label="코드 블록 삽입">
                                                <ActionIcon
                                                    variant="light"
                                                    onClick={() => setCodeModalOpened(true)}
                                                >
                                                    <IconCode size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Group>
                                </Box>

                                <RichTextEditor
                                    editor={editor}
                                    style={{
                                        border: 'none'
                                    }}
                                >
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
                                            <RichTextEditor.Undo />
                                            <RichTextEditor.Redo />
                                        </RichTextEditor.ControlsGroup>
                                    </RichTextEditor.Toolbar>

                                    <RichTextEditor.Content
                                        style={{
                                            minHeight: '400px',
                                            fontSize: '16px',
                                            lineHeight: 1.6
                                        }}
                                    />
                                </RichTextEditor>
                            </Paper>

                            {/* SEO 설정 */}
                            <Paper
                                p="lg"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(255, 255, 255, 0.8)'
                                        : 'rgba(30, 30, 30, 0.8)',
                                    backdropFilter: 'blur(20px)',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px'
                                }}
                            >
                                <Text fw={600} mb="md">SEO 설정</Text>
                                <Textarea
                                    label="메타 설명"
                                    placeholder="검색 엔진에 표시될 설명을 입력하세요 (150자 이내 권장)"
                                    maxLength={160}
                                    {...form.getInputProps('metaDescription')}
                                />
                                <Text size="xs" c="dimmed" mt="xs">
                                    {form.values.metaDescription.length}/160 문자
                                </Text>
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        {/* 사이드바 */}
                        <Stack gap="lg">
                            {/* AI 어시스턴트 - 2025 트렌드 */}
                            <AIAssistant
                                onSuggestTags={handleAISuggestTags}
                                onSuggestTitle={handleAISuggestTitle}
                                onOptimizeContent={handleAIOptimizeContent}
                                isLoading={isAILoading}
                            />

                            {/* 태그 선택 */}
                            <Paper
                                p="lg"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(255, 255, 255, 0.8)'
                                        : 'rgba(30, 30, 30, 0.8)',
                                    backdropFilter: 'blur(20px)',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px'
                                }}
                            >
                                <Text fw={600} mb="md">태그</Text>
                                <MultiSelect
                                    placeholder="태그를 선택하거나 새로 입력하세요"
                                    data={suggestedTags}
                                    searchable
                                    creatable
                                    getCreateLabel={(query) => `+ "${query}" 태그 생성`}
                                    onCreate={(query) => {
                                        const item = { value: query, label: query };
                                        suggestedTags.push(query);
                                        return item;
                                    }}
                                    value={selectedTags}
                                    onChange={(value) => {
                                        setSelectedTags(value);
                                        form.setFieldValue('tags', value);
                                    }}
                                    leftSection={<IconTag size={16} />}
                                />

                                {selectedTags.length > 0 && (
                                    <Box mt="md">
                                        <Text size="sm" c="dimmed" mb="xs">선택된 태그:</Text>
                                        <Group gap="xs">
                                            {selectedTags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="light"
                                                    size="sm"
                                                    rightSection={
                                                        <ActionIcon
                                                            size="xs"
                                                            variant="transparent"
                                                            onClick={() => {
                                                                const newTags = selectedTags.filter(t => t !== tag);
                                                                setSelectedTags(newTags);
                                                                form.setFieldValue('tags', newTags);
                                                            }}
                                                        >
                                                            <IconX size={10} />
                                                        </ActionIcon>
                                                    }
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </Group>
                                    </Box>
                                )}
                            </Paper>

                            {/* 발행 설정 */}
                            <Paper
                                p="lg"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(255, 255, 255, 0.8)'
                                        : 'rgba(30, 30, 30, 0.8)',
                                    backdropFilter: 'blur(20px)',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px'
                                }}
                            >
                                <Text fw={600} mb="md">발행 설정</Text>
                                <Stack gap="md">
                                    <Alert
                                        icon={isDraft ? <IconAlertCircle size={16} /> : <IconCheck size={16} />}
                                        color={isDraft ? "orange" : "green"}
                                        variant="light"
                                    >
                                        <Text size="sm">
                                            {isDraft
                                                ? "임시저장 모드: 포스트가 비공개로 저장됩니다"
                                                : "발행 모드: 포스트가 공개적으로 발행됩니다"
                                            }
                                        </Text>
                                    </Alert>

                                    <Group justify="space-between">
                                        <Text size="sm">댓글 허용</Text>
                                        <Switch defaultChecked size="sm" />
                                    </Group>

                                    <Group justify="space-between">
                                        <Text size="sm">공유 허용</Text>
                                        <Switch defaultChecked size="sm" />
                                    </Group>
                                </Stack>
                            </Paper>

                            {/* 통계 및 정보 */}
                            <Paper
                                p="lg"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'linear-gradient(135deg, rgba(34, 139, 230, 0.05), rgba(99, 102, 241, 0.05))'
                                        : 'linear-gradient(135deg, rgba(34, 139, 230, 0.1), rgba(99, 102, 241, 0.1))',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(34, 139, 230, 0.2)'
                                        : '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: '16px'
                                }}
                            >
                                <Text fw={600} mb="md">작성 정보</Text>
                                <Stack gap="xs">
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">글자 수</Text>
                                        <Text size="sm" fw={500}>
                                            {form.values.content.replace(/<[^>]*>/g, '').length}자
                                        </Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">예상 읽기 시간</Text>
                                        <Text size="sm" fw={500}>
                                            {Math.max(1, Math.ceil(form.values.content.replace(/<[^>]*>/g, '').length / 300))}분
                                        </Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">태그 수</Text>
                                        <Text size="sm" fw={500}>
                                            {selectedTags.length}개
                                        </Text>
                                    </Group>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>

            {/* 플로팅 툴바 - 2025 트렌드 반영 */}
            <FloatingToolbar
                onSave={handleSave}
                onPreview={handlePreview}
                isDraft={isDraft}
                saveProgress={saveProgress}
            />

            {/* 코드 블록 삽입 모달 */}
            <CodeBlockModal
                opened={codeModalOpened}
                onClose={() => setCodeModalOpened(false)}
                onInsert={handleInsertCodeBlock}
            />

            {/* 미리보기 모달 */}
            <Modal
                opened={previewModalOpened}
                onClose={() => setPreviewModalOpened(false)}
                title="포스트 미리보기"
                size="xl"
                style={{
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Stack gap="md">
                    {form.values.bannerImage && (
                        <Image
                            src={URL.createObjectURL(form.values.bannerImage)}
                            alt="배너 이미지"
                            radius="md"
                            h={200}
                            fit="cover"
                        />
                    )}

                    <Box>
                        <Badge color="blue" mb="sm">
                            {categories.find(cat => cat.value === form.values.category)?.label || '카테고리'}
                        </Badge>
                        <Title order={1} mb="xs">{form.values.title || '제목'}</Title>
                        {form.values.subtitle && (
                            <Text size="lg" c="dimmed" mb="md">{form.values.subtitle}</Text>
                        )}
                    </Box>

                    <Box
                        style={{
                            border: '1px solid var(--mantine-color-gray-3)',
                            borderRadius: '8px',
                            padding: '16px',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}
                        dangerouslySetInnerHTML={{
                            __html: form.values.content || '<p>내용을 입력해주세요...</p>'
                        }}
                    />

                    {selectedTags.length > 0 && (
                        <Box>
                            <Text size="sm" fw={500} mb="xs">태그:</Text>
                            <Group gap="xs">
                                {selectedTags.map((tag) => (
                                    <Badge key={tag} variant="light" size="sm">
                                        #{tag}
                                    </Badge>
                                ))}
                            </Group>
                        </Box>
                    )}
                </Stack>
            </Modal>
        </Box>
    );
}