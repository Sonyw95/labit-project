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
    Paper,
    Grid,
    Image,
    Card,
    Progress,
    Menu,
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
    useCreateAssetFolder, useDeleteAssetFile,
    useDeleteAssetFolder,
    useMoveAsset,
    useUpdateAssetFolder, useUpdateAssetOrder, useUploadAssetFile
} from "../../hooks/api/useApi.js";

const AssetManagement = () => {
    const [folderModalOpened, { open: openFolderModal, close: closeFolderModal }] = useDisclosure(false);
    const [uploadModalOpened, { open: openUploadModal, close: closeUploadModal }] = useDisclosure(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [uploadProgress, setUploadProgress] = useState(0);

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

    // 트리 구조로 변환
    const assetTree = useMemo(() => {
        if (!assets) {return { folders: [], files: [] };}

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

    // 폴더 옵션 생성
    const folderOptions = useMemo(() => {
        if (!assets) {
            return [];
        }

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

    const getFileIcon = useCallback((fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return <IconPhoto size={16} />;
        } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
            return <IconVideo size={16} />;
        } else if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(extension)) {
            return <IconFileText size={16} />;
        }
        return <IconFile size={16} />;
    }, []);

    const getFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`;
    }, []);

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

    const renderFolder = useCallback((folder, depth = 0) => {
        const isExpanded = expandedFolders.has(folder.id);
        const hasChildren = folder.children && folder.children.length > 0;

        return (
            <Box key={folder.id} mb="xs">
                <Paper
                    p="sm"
                    shadow="xs"
                    style={{
                        marginLeft: depth * 20,
                        cursor: 'pointer',
                        backgroundColor: selectedFolder?.id === folder.id ? 'var(--mantine-color-blue-light)' : undefined,
                    }}
                    onClick={() => setSelectedFolder(folder)}
                >
                    <Group justify="space-between">
                        <Group gap="xs">
                            {hasChildren && (
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleExpand(folder.id);
                                    }}
                                >
                                    {isExpanded ? (
                                        <IconChevronDown size={14} />
                                    ) : (
                                        <IconChevronRight size={14} />
                                    )}
                                </ActionIcon>
                            )}
                            <IconFolder size={16} />
                            <Text fw={500}>{folder.name}</Text>
                            <Badge variant="light" size="xs">
                                {folder.fileCount || 0}개 파일
                            </Badge>
                        </Group>

                        <Menu position="bottom-end">
                            <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconEdit size={14} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenFolderModal(folder);
                                    }}
                                >
                                    수정
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={14} />}
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
                        <Text size="xs" c="dimmed" mt="xs">
                            {folder.description}
                        </Text>
                    )}
                </Paper>

                {isExpanded && hasChildren && (
                    <Box>
                        {folder.children.map(child => renderFolder(child, depth + 1))}
                    </Box>
                )}
            </Box>
        );
    }, [expandedFolders, selectedFolder, handleToggleExpand, handleOpenFolderModal, handleDeleteFolder]);

    const renderFile = useCallback((file) => {
        const isImage = file.mimeType?.startsWith('image/');

        return (
            <Card key={file.id} shadow="xs" padding="sm" radius="md">
                <Card.Section>
                    {isImage ? (
                        <Image
                            src={file.url}
                            alt={file.name}
                            height={120}
                            fit="cover"
                        />
                    ) : (
                        <Box h={120} bg="gray.1" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {getFileIcon(file.name)}
                        </Box>
                    )}
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500} size="sm" truncate>
                        {file.name}
                    </Text>
                    <Menu position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                                <IconDots size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<IconDownload size={14} />}
                                component="a"
                                href={file.url}
                                download={file.name}
                            >
                                다운로드
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconCopy size={14} />}
                                onClick={() => handleCopyFileUrl(file)}
                            >
                                URL 복사
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                color="red"
                                onClick={() => handleDeleteFile(file.id)}
                            >
                                삭제
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Text size="xs" c="dimmed">
                    {getFileSize(file.size)}
                </Text>
            </Card>
        );
    }, [getFileIcon, getFileSize, handleCopyFileUrl, handleDeleteFile]);

    if (isLoading) {
        return <Text>에셋 데이터를 불러오는 중...</Text>;
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
                에셋 데이터를 불러오는데 실패했습니다.
            </Alert>
        );
    }

    return (
        <Grid>
            {/* 폴더 트리 */}
            <Grid.Col span={4}>
                <Paper p="md" shadow="xs" h="600px" style={{ overflowY: 'auto' }}>
                    <Group justify="between" mb="md">
                        <Text fw={600}>폴더</Text>
                        <Button
                            size="xs"
                            leftSection={<IconFolderPlus size={14} />}
                            onClick={() => handleOpenFolderModal()}
                        >
                            새 폴더
                        </Button>
                    </Group>

                    {/* 루트 폴더 */}
                    <Paper
                        p="sm"
                        mb="xs"
                        shadow="xs"
                        style={{
                            cursor: 'pointer',
                            backgroundColor: !selectedFolder ? 'var(--mantine-color-blue-light)' : undefined,
                        }}
                        onClick={() => setSelectedFolder(null)}
                    >
                        <Group>
                            <IconFolder size={16} />
                            <Text fw={500}>루트 폴더</Text>
                        </Group>
                    </Paper>

                    {assetTree.folders.map(folder => renderFolder(folder))}
                </Paper>
            </Grid.Col>

            {/* 파일 목록 */}
            <Grid.Col span={8}>
                <Paper p="md" shadow="xs" h="600px" style={{ overflowY: 'auto' }}>
                    <Group justify="between" mb="md">
                        <div>
                            <Text fw={600}>
                                {selectedFolder ? selectedFolder.name : '루트 폴더'}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {assetTree.files.length}개 파일
                            </Text>
                        </div>
                        <Button
                            leftSection={<IconUpload size={16} />}
                            onClick={openUploadModal}
                        >
                            파일 업로드
                        </Button>
                    </Group>

                    {assetTree.files.length === 0 ? (
                        <Box ta="center" py="xl">
                            <IconFile size={48} color="gray" />
                            <Text size="lg" mt="md" c="dimmed">
                                파일이 없습니다
                            </Text>
                            <Text size="sm" c="dimmed">
                                파일을 업로드해보세요
                            </Text>
                        </Box>
                    ) : (
                        <Grid>
                            {assetTree.files.map(file => (
                                <Grid.Col key={file.id} span={3}>
                                    {renderFile(file)}
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Grid.Col>

            {/* 폴더 생성/수정 모달 */}
            <Modal
                opened={folderModalOpened}
                onClose={closeFolderModal}
                title={editingFolder ? '폴더 수정' : '새 폴더 생성'}
                size="md"
            >
                <Stack>
                    <TextInput
                        label="폴더 이름"
                        placeholder="폴더 이름을 입력하세요"
                        required
                        {...folderForm.getInputProps('name')}
                    />

                    <Select
                        label="부모 폴더"
                        placeholder="부모 폴더를 선택하세요"
                        data={folderOptions}
                        clearable
                        {...folderForm.getInputProps('parentId')}
                    />

                    <Textarea
                        label="설명"
                        placeholder="폴더에 대한 설명을 입력하세요"
                        rows={3}
                        {...folderForm.getInputProps('description')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" onClick={closeFolderModal}>
                            취소
                        </Button>
                        <Button
                            onClick={() => folderForm.onSubmit(handleFolderSubmit)()}
                            loading={createFolderMutation.isPending || updateFolderMutation.isPending}
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
                title="파일 업로드"
                size="lg"
            >
                <Stack>
                    <Text size="sm" c="dimmed">
                        업로드 위치: {selectedFolder ? selectedFolder.name : '루트 폴더'}
                    </Text>

                    <Dropzone
                        onDrop={handleFileUpload}
                        maxSize={50 * 1024 ** 2} // 50MB
                        multiple
                    >
                        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload size={52} stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconAlertCircle size={52} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size={52} stroke={1.5} />
                            </Dropzone.Idle>

                            <div>
                                <Text size="xl" inline>
                                    파일을 드래그하거나 클릭하여 업로드
                                </Text>
                                <Text size="sm" c="dimmed" inline mt={7}>
                                    최대 50MB까지 업로드 가능합니다
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>

                    {uploadProgress > 0 && (
                        <Progress value={uploadProgress} />
                    )}
                </Stack>
            </Modal>
        </Grid>
    );
};

export default AssetManagement;