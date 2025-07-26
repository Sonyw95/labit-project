import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Group,
    Button,
    Text,
    ActionIcon,
    Modal,
    TextInput,
    Textarea,
    Select,
    Alert,
    Stack,
    Badge,
    Grid,
    Image,
    Progress,
    Menu,
    useMantineColorScheme,
    rem, Loader, Center, Container,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
    IconEdit,
    IconTrash,
    IconChevronDown,
    IconChevronRight,
    IconFolder,
    IconFolderPlus,
    IconFile,
    IconUpload,
    IconDownload,
    IconCopy,
    IconAlertCircle,
    IconPhoto,
    IconVideo,
    IconFileText,
    IconDots,
} from '@tabler/icons-react';
import {
    useAdminAssets,
    useCreateAssetFolder,
    useDeleteAssetFile,
    useDeleteAssetFolder,
    useMoveAsset,
    useUpdateAssetFolder,
    useUpdateAssetOrder,
    useUploadAssetFile
} from "../../hooks/api/useApi.js";

const AssetManagement = () => {
    const { colorScheme } = useMantineColorScheme();
    const [folderModalOpened, { open: openFolderModal, close: closeFolderModal }] = useDisclosure(false);
    const [uploadModalOpened, { open: openUploadModal, close: closeUploadModal }] = useDisclosure(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [uploadProgress, setUploadProgress] = useState(0);

    // velog 스타일 색상 팔레트
    const velogColors = useMemo(() => ({
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#FFFFFF',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
        success: '#12B886',
        error: '#FA5252',
        warning: '#FD7E14',
        info: '#339AF0',
        cardBg: colorScheme === 'dark' ? '#242529' : '#FFFFFF',
        selectedBg: colorScheme === 'dark' ? '#2B4570' : '#E7F5FF',
    }), [colorScheme]);

    // API hooks (기존 유지)
    const {
        data: assets,
        isLoading,
        error
    } = useAdminAssets();

    const createFolderMutation = useCreateAssetFolder();
    const updateFolderMutation = useUpdateAssetFolder();
    const deleteFolderMutation = useDeleteAssetFolder();
    const moveAssetMutation = useMoveAsset();
    const updateOrderMutation = useUpdateAssetOrder();
    const uploadFileMutation = useUploadAssetFile();
    const deleteFileMutation = useDeleteAssetFile();

    const folderForm = useForm({
        initialValues: {
            name: '',
            description: '',
            parentId: null,
        },
        validate: {
            name: (value) => (!value ? '폴더 이름을 입력하세요' : null),
        },
    });

    // 로딩 상태 메모이제이션
    const isFolderFormLoading = useMemo(() =>
            createFolderMutation.isPending || updateFolderMutation.isPending,
        [createFolderMutation.isPending, updateFolderMutation.isPending]
    );

    // 트리 구조로 변환 - 메모이제이션
    const assetTree = useMemo(() => {
        if (!assets) { return { folders: [], files: [] }; }

        const folders = assets.filter(item => item.type === 'folder');
        const files = assets.filter(item => item.type === 'file');

        const buildFolderTree = (items, parentId = null) => {
            return items
                .filter(item => item.parentId === parentId)
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map(item => ({
                    ...item,
                    children: buildFolderTree(items, item.id)
                }));
        };

        return {
            folders: buildFolderTree(folders),
            files: files.filter(file => file.folderId === selectedFolder?.id || (!selectedFolder && !file.folderId))
        };
    }, [assets, selectedFolder]);

    // 폴더 옵션 생성 - 메모이제이션
    const folderOptions = useMemo(() => {
        if (!assets) return [];

        const folders = assets.filter(item => item.type === 'folder');
        const buildOptions = (items, depth = 0) => {
            return items.reduce((acc, item) => {
                const prefix = '—'.repeat(depth);
                acc.push({
                    value: item.id.toString(),
                    label: `${prefix} ${item.name}`
                });
                if (item.children) {
                    acc.push(...buildOptions(item.children, depth + 1));
                }
                return acc;
            }, []);
        };

        return [
            { value: '', label: '루트 폴더' },
            ...buildOptions(assetTree.folders)
        ];
    }, [assets, assetTree.folders]);

    // 유틸리티 함수들 - useCallback으로 메모이제이션
    const getFileIcon = useCallback((fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return <IconPhoto size={18} style={{ color: velogColors.info }} />;
        } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
            return <IconVideo size={18} style={{ color: velogColors.error }} />;
        } else if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(extension)) {
            return <IconFileText size={18} style={{ color: velogColors.warning }} />;
        }
        return <IconFile size={18} style={{ color: velogColors.subText }} />;
    }, [velogColors]);

    const getFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }, []);

    // 이벤트 핸들러들 - useCallback으로 리렌더링 방지
    const handleOpenFolderModal = useCallback((folder = null) => {
        setEditingFolder(folder);
        if (folder) {
            folderForm.setValues({
                name: folder.name || '',
                description: folder.description || '',
                parentId: folder.parentId ? folder.parentId.toString() : '',
            });
        } else {
            folderForm.reset();
            if (selectedFolder) {
                folderForm.setFieldValue('parentId', selectedFolder.id.toString());
            }
        }
        openFolderModal();
    }, [folderForm, openFolderModal, selectedFolder]);

    const handleFolderSubmit = useCallback((values) => {
        const data = {
            ...values,
            parentId: values.parentId ? parseInt(values.parentId, 10) : null,
        };

        if (editingFolder) {
            updateFolderMutation.mutate(
                { id: editingFolder.id, data },
                { onSuccess: closeFolderModal }
            );
        } else {
            createFolderMutation.mutate(data, { onSuccess: closeFolderModal });
        }
    }, [editingFolder, updateFolderMutation, createFolderMutation, closeFolderModal]);

    const handleDeleteFolder = useCallback((id) => {
        if (window.confirm('정말로 이 폴더를 삭제하시겠습니까? 하위 파일도 모두 삭제됩니다.')) {
            deleteFolderMutation.mutate(id);
        }
    }, [deleteFolderMutation]);

    const handleDeleteFile = useCallback((id) => {
        if (window.confirm('정말로 이 파일을 삭제하시겠습니까?')) {
            deleteFileMutation.mutate(id);
        }
    }, [deleteFileMutation]);

    const handleToggleExpand = useCallback((id) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleFileUpload = useCallback((files) => {
        if (!files || files.length === 0) return;

        files.forEach(file => {
            uploadFileMutation.mutate({
                file,
                folderId: selectedFolder?.id
            });
        });
        closeUploadModal();
    }, [uploadFileMutation, selectedFolder, closeUploadModal]);

    const handleCopyFileUrl = useCallback((file) => {
        navigator.clipboard.writeText(file.url);
        // showToast.success('URL 복사됨', '파일 URL이 클립보드에 복사되었습니다.');
    }, []);

    // 폴더 렌더링 컴포넌트 - useCallback으로 메모이제이션
    const FolderItem = useCallback(({ folder, depth = 0 }) => {
        const isExpanded = expandedFolders.has(folder.id);
        const hasChildren = folder.children && folder.children.length > 0;
        const isSelected = selectedFolder?.id === folder.id;

        return (
            <Box key={folder.id} mb="xs">
                <Box
                    p="md"
                    style={{
                        marginLeft: depth * 20,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? velogColors.selectedBg : velogColors.cardBg,
                        border: `1px solid ${velogColors.border}`,
                        borderRadius: rem(8),
                        transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedFolder(folder)}
                    onMouseEnter={(e) => {
                        if (!isSelected) {
                            e.currentTarget.style.backgroundColor = velogColors.hover;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isSelected) {
                            e.currentTarget.style.backgroundColor = velogColors.cardBg;
                        }
                    }}
                >
                    <Group justify="space-between">
                        <Group gap="sm">
                            {hasChildren && (
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleExpand(folder.id);
                                    }}
                                    style={{
                                        color: velogColors.subText,
                                        backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = velogColors.border;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    {isExpanded ? (
                                        <IconChevronDown size={16} />
                                    ) : (
                                        <IconChevronRight size={16} />
                                    )}
                                </ActionIcon>
                            )}
                            <IconFolder size={18} style={{ color: velogColors.warning }} />
                            <Text
                                fw={500}
                                style={{ color: velogColors.text }}
                            >
                                {folder.name}
                            </Text>
                            <Badge
                                variant="light"
                                size="xs"
                                radius="md"
                                style={{
                                    backgroundColor: `${velogColors.primary}15`,
                                    color: velogColors.primary,
                                    border: `1px solid ${velogColors.primary}30`,
                                }}
                            >
                                {folder.fileCount || 0}개
                            </Badge>
                        </Group>

                        <Menu position="bottom-end">
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        color: velogColors.subText,
                                        backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = velogColors.hover;
                                        e.currentTarget.style.color = velogColors.text;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = velogColors.subText;
                                    }}
                                >
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown
                                style={{
                                    backgroundColor: velogColors.cardBg,
                                    border: `1px solid ${velogColors.border}`,
                                }}
                            >
                                <Menu.Item
                                    leftSection={<IconEdit size={16} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenFolderModal(folder);
                                    }}
                                    style={{ color: velogColors.text }}
                                >
                                    수정
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={16} />}
                                    color="red"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFolder(folder.id);
                                    }}
                                >
                                    삭제
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>

                    {folder.description && (
                        <Text
                            size="xs"
                            mt="xs"
                            style={{
                                color: velogColors.subText,
                                paddingLeft: rem(hasChildren ? 28 : 22)
                            }}
                        >
                            {folder.description}
                        </Text>
                    )}
                </Box>

                {isExpanded && hasChildren && (
                    <Box mt="xs">
                        {folder.children.map(child => (
                            <FolderItem key={child.id} folder={child} depth={depth + 1} />
                        ))}
                    </Box>
                )}
            </Box>
        );
    }, [expandedFolders, selectedFolder, handleToggleExpand, handleOpenFolderModal, handleDeleteFolder, velogColors]);

    // 파일 렌더링 컴포넌트 - useCallback으로 메모이제이션
    const FileCard = useCallback(({ file }) => {
        const isImage = file.mimeType?.startsWith('image/');

        return (
            <Box
                style={{
                    backgroundColor: velogColors.cardBg,
                    border: `1px solid ${velogColors.border}`,
                    borderRadius: rem(12),
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: colorScheme === 'dark'
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = colorScheme === 'dark'
                        ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                        : '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = colorScheme === 'dark'
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.06)';
                }}
            >
                {/* 파일 미리보기 */}
                <Box
                    style={{
                        height: rem(140),
                        backgroundColor: isImage ? 'transparent' : velogColors.hover,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    {isImage ? (
                        <Image
                            src={file.url}
                            alt={file.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        getFileIcon(file.name)
                    )}
                </Box>

                {/* 파일 정보 */}
                <Box p="md">
                    <Group justify="space-between" mb="xs">
                        <Text
                            fw={500}
                            size="sm"
                            style={{
                                color: velogColors.text,
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            title={file.name}
                        >
                            {file.name}
                        </Text>
                        <Menu position="bottom-end">
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    style={{
                                        color: velogColors.subText,
                                        backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = velogColors.hover;
                                        e.currentTarget.style.color = velogColors.text;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = velogColors.subText;
                                    }}
                                >
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown
                                style={{
                                    backgroundColor: velogColors.cardBg,
                                    border: `1px solid ${velogColors.border}`,
                                }}
                            >
                                <Menu.Item
                                    leftSection={<IconDownload size={16} />}
                                    component="a"
                                    href={file.url}
                                    download={file.name}
                                    style={{ color: velogColors.text }}
                                >
                                    다운로드
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconCopy size={16} />}
                                    onClick={() => handleCopyFileUrl(file)}
                                    style={{ color: velogColors.text }}
                                >
                                    URL 복사
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={16} />}
                                    color="red"
                                    onClick={() => handleDeleteFile(file.id)}
                                >
                                    삭제
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>

                    <Text
                        size="xs"
                        style={{ color: velogColors.subText }}
                    >
                        {getFileSize(file.size)}
                    </Text>
                </Box>
            </Box>
        );
    }, [getFileIcon, getFileSize, handleCopyFileUrl, handleDeleteFile, velogColors, colorScheme]);

    // 빈 상태 컴포넌트들 - 메모이제이션
    const EmptyFilesState = useMemo(() => (
        <Box
            style={{
                textAlign: 'center',
                padding: rem(48),
                backgroundColor: velogColors.cardBg,
                border: `1px solid ${velogColors.border}`,
                borderRadius: rem(12),
            }}
        >
            <IconFile
                size={64}
                style={{
                    color: velogColors.subText,
                    opacity: 0.5
                }}
            />
            <Text
                size="lg"
                mt="md"
                fw={500}
                style={{ color: velogColors.text }}
            >
                파일이 없습니다
            </Text>
            <Text
                size="sm"
                mt="xs"
                style={{ color: velogColors.subText }}
            >
                파일을 업로드해보세요
            </Text>
        </Box>
    ), [velogColors]);

    // 로딩 상태
    if (isLoading) {
        return (
            <Center style={{ color: velogColors.text }}>
                <Loader/>
            </Center>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <Alert
                icon={<IconAlertCircle size={18} />}
                color="red"
                variant="light"
                styles={{
                    root: {
                        backgroundColor: `${velogColors.error}10`,
                        border: `1px solid ${velogColors.error}30`,
                    },
                    message: {
                        color: velogColors.text,
                    }
                }}
            >
                에셋 데이터를 불러오는데 실패했습니다.
            </Alert>
        );
    }

    return (
        <Box style={{ backgroundColor: velogColors.background }}>
            <Grid gutter="lg">
                {/* 폴더 트리 */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Box
                        p="xl"
                        style={{
                            backgroundColor: velogColors.cardBg,
                            border: `1px solid ${velogColors.border}`,
                            borderRadius: rem(12),
                            height: rem(600),
                            overflowY: 'auto',
                            boxShadow: colorScheme === 'dark'
                                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}
                    >
                        <Group justify="space-between" mb="xl">
                            <Text
                                fw={700}
                                size="lg"
                                style={{ color: velogColors.text }}
                            >
                                폴더
                            </Text>
                            <Button
                                size="sm"
                                radius="md"
                                leftSection={<IconFolderPlus size={16} />}
                                onClick={() => handleOpenFolderModal()}
                                aria-label="폴더 새로 만들기"
                                style={{
                                    backgroundColor: velogColors.primary,
                                    border: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0CA678';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = velogColors.primary;
                                }}
                            >
                                새 폴더
                            </Button>
                        </Group>

                        {/* 루트 폴더 */}
                        <Box
                            p="md"
                            mb="sm"
                            style={{
                                cursor: 'pointer',
                                backgroundColor: !selectedFolder ? velogColors.selectedBg : velogColors.cardBg,
                                border: `1px solid ${velogColors.border}`,
                                borderRadius: rem(8),
                                transition: 'all 0.2s ease',
                            }}
                            onClick={() => setSelectedFolder(null)}
                            onMouseEnter={(e) => {
                                if (selectedFolder) {
                                    e.currentTarget.style.backgroundColor = velogColors.hover;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedFolder) {
                                    e.currentTarget.style.backgroundColor = velogColors.cardBg;
                                }
                            }}
                        >
                            <Group gap="sm">
                                <IconFolder size={18} style={{ color: velogColors.warning }} />
                                <Text
                                    fw={500}
                                    style={{ color: velogColors.text }}
                                >
                                    루트 폴더
                                </Text>
                            </Group>
                        </Box>

                        {assetTree.folders.map(folder => (
                            <FolderItem key={folder.id} folder={folder} />
                        ))}
                    </Box>
                </Grid.Col>

                {/* 파일 목록 */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Box
                        p="xl"
                        style={{
                            backgroundColor: velogColors.cardBg,
                            border: `1px solid ${velogColors.border}`,
                            borderRadius: rem(12),
                            height: rem(600),
                            overflowY: 'auto',
                            boxShadow: colorScheme === 'dark'
                                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}
                    >
                        <Group justify="space-between" mb="xl">
                            <Stack gap="xs">
                                <Text
                                    fw={700}
                                    size="lg"
                                    style={{ color: velogColors.text }}
                                >
                                    {selectedFolder ? selectedFolder.name : '루트 폴더'}
                                </Text>
                                <Text
                                    size="sm"
                                    style={{ color: velogColors.subText }}
                                >
                                    {assetTree.files.length}개 파일
                                </Text>
                            </Stack>
                            <Button
                                leftSection={<IconUpload size={18} />}
                                onClick={openUploadModal}
                                size="md"
                                radius="md"
                                style={{
                                    backgroundColor: velogColors.primary,
                                    border: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0CA678';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = velogColors.primary;
                                }}
                                aria-label="파일 얿로드 번튼"
                            >
                                파일 업로드
                            </Button>
                        </Group>

                        {assetTree.files.length === 0 ? (
                            EmptyFilesState
                        ) : (
                            <Grid gutter="lg">
                                {assetTree.files.map(file => (
                                    <Grid.Col key={file.id} span={{ base: 6, sm: 4, lg: 3 }}>
                                        <FileCard file={file} />
                                    </Grid.Col>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Grid.Col>
            </Grid>

            {/* 폴더 생성/수정 모달 */}
            <Modal
                opened={folderModalOpened}
                onClose={closeFolderModal}
                title={
                    <Text
                        fw={600}
                        size="lg"
                        style={{ color: velogColors.text }}
                    >
                        {editingFolder ? '폴더 수정' : '새 폴더 생성'}
                    </Text>
                }
                size="md"
                radius="md"
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
                    <TextInput
                        label="폴더 이름"
                        placeholder="폴더 이름을 입력하세요"
                        required
                        {...folderForm.getInputProps('name')}
                        styles={{
                            label: { color: velogColors.text, fontWeight: 500 },
                            input: {
                                backgroundColor: velogColors.background,
                                borderColor: velogColors.border,
                                color: velogColors.text,
                                '&:focus': {
                                    borderColor: velogColors.primary,
                                }
                            }
                        }}
                    />

                    <Select
                        label="부모 폴더"
                        placeholder="부모 폴더를 선택하세요"
                        data={folderOptions}
                        clearable
                        {...folderForm.getInputProps('parentId')}
                        styles={{
                            label: { color: velogColors.text, fontWeight: 500 },
                            input: {
                                backgroundColor: velogColors.background,
                                borderColor: velogColors.border,
                                color: velogColors.text,
                                '&:focus': {
                                    borderColor: velogColors.primary,
                                }
                            }
                        }}
                    />

                    <Textarea
                        label="설명"
                        placeholder="폴더에 대한 설명을 입력하세요"
                        rows={3}
                        {...folderForm.getInputProps('description')}
                        styles={{
                            label: { color: velogColors.text, fontWeight: 500 },
                            input: {
                                backgroundColor: velogColors.background,
                                borderColor: velogColors.border,
                                color: velogColors.text,
                                '&:focus': {
                                    borderColor: velogColors.primary,
                                }
                            }
                        }}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="subtle"
                            onClick={closeFolderModal}
                            style={{
                                color: velogColors.subText,
                                backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = velogColors.hover;
                                e.currentTarget.style.color = velogColors.text;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = velogColors.subText;
                            }}
                            aria-label="취소 버튼"
                        >
                            취소
                        </Button>
                        <Button
                            onClick={() => folderForm.onSubmit(handleFolderSubmit)()}
                            loading={isFolderFormLoading}
                            style={{
                                backgroundColor: velogColors.primary,
                                border: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#0CA678';
                            }}
                            onMouseLeave={(e) => {
                                if (!isFolderFormLoading) {
                                    e.currentTarget.style.backgroundColor = velogColors.primary;
                                }
                            }}
                            aria-label="수동또는 생성 버튼"
                        >
                            {editingFolder ? '수정' : '생성'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* 파일 업로드 모달 */}
            <Modal
                opened={uploadModalOpened}
                onClose={closeUploadModal}
                title={
                    <Text
                        fw={600}
                        size="lg"
                        style={{ color: velogColors.text }}
                    >
                        파일 업로드
                    </Text>
                }
                size="lg"
                radius="md"
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
                    <Text
                        size="sm"
                        style={{ color: velogColors.subText }}
                    >
                        업로드 위치: {selectedFolder ? selectedFolder.name : '루트 폴더'}
                    </Text>

                    <Dropzone
                        onDrop={handleFileUpload}
                        maxSize={50 * 1024 ** 2} // 50MB
                        multiple
                        styles={{
                            root: {
                                backgroundColor: velogColors.background,
                                borderColor: velogColors.border,
                                '&[data-accept]': {
                                    backgroundColor: `${velogColors.success}10`,
                                    borderColor: velogColors.success,
                                },
                                '&[data-reject]': {
                                    backgroundColor: `${velogColors.error}10`,
                                    borderColor: velogColors.error,
                                }
                            }
                        }}
                    >
                        <Group justify="center" gap="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload size={52} style={{ color: velogColors.success }} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconAlertCircle size={52} style={{ color: velogColors.error }} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size={52} style={{ color: velogColors.subText }} />
                            </Dropzone.Idle>

                            <Stack align="center" gap="xs">
                                <Text
                                    size="xl"
                                    style={{ color: velogColors.text }}
                                >
                                    파일을 드래그하거나 클릭하여 업로드
                                </Text>
                                <Text
                                    size="sm"
                                    style={{ color: velogColors.subText }}
                                >
                                    최대 50MB까지 업로드 가능합니다
                                </Text>
                            </Stack>
                        </Group>
                    </Dropzone>

                    {uploadProgress > 0 && (
                        <Progress
                            value={uploadProgress}
                            size="md"
                            radius="md"
                            styles={{
                                bar: {
                                    backgroundColor: velogColors.primary,
                                }
                            }}
                        />
                    )}
                </Stack>
            </Modal>
        </Box>
    );
};

export default AssetManagement;