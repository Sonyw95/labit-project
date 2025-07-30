import { useDisclosure } from '@mantine/hooks';
import {
    Box,
    Group,
    Button,
    Text,
    Alert,
    Stack,
    Grid,
    Loader,
    Center,
    rem,
} from '@mantine/core';
import {
    IconFolderPlus,
    IconUpload,
    IconAlertCircle,
    IconFile,
} from '@tabler/icons-react';
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useCallback, useMemo, useState} from "react";
import {
    useAdminAssets,
    useCreateAssetFolder, useDeleteAssetFile,
    useDeleteAssetFolder,
    useMoveAsset,
    useUpdateAssetFolder, useUpdateAssetOrder, useUploadAssetFile
} from "@/hooks/api/useApi.js";
import {modals} from "@mantine/modals";

const AssetManagement = () => {
    const { themeColors, dark } = useTheme();
    const [folderModalOpened, { open: openFolderModal, close: closeFolderModal }] = useDisclosure(false);
    const [uploadModalOpened, { open: openUploadModal }] = useDisclosure(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

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

    const styles = useMemo(() => ({
        container: {
            backgroundColor: themeColors.background
        },
        sidePanel: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(12),
            height: rem(600),
            overflowY: 'auto',
            boxShadow: dark
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        mainPanel: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(12),
            height: rem(600),
            overflowY: 'auto',
            boxShadow: dark
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        sectionTitle: {
            color: themeColors.text
        },
        fileCount: {
            color: themeColors.subText
        },
        primaryButton: {
            backgroundColor: themeColors.primary,
            border: 'none',
        },
        emptyState: {
            textAlign: 'center',
            padding: rem(48),
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(12),
        },
        emptyIcon: {
            color: themeColors.subText,
            opacity: 0.5
        },
        emptyTitle: {
            color: themeColors.text
        },
        emptyDescription: {
            color: themeColors.subText
        },
        alertRoot: {
            backgroundColor: `${themeColors.error}10`,
            border: `1px solid ${themeColors.error}30`,
        },
        alertMessage: {
            color: themeColors.text,
        }
    }), [themeColors, dark]);

    const getFileSize = useCallback((bytes) => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / k**i).toFixed(2))} ${sizes[i]}`;
    }, []);

    const handleOpenFolderModal = useCallback((folder = null) => {
        setEditingFolder(folder);
        openFolderModal();
    }, [openFolderModal]);

    const handleCloseFolderModal = useCallback(() => {
        setEditingFolder(null);
        closeFolderModal();
    }, [closeFolderModal]);

    const handleDeleteFolder = useCallback((id) => modals.openConfirmModal({
        title: '확인 요청',
        children: (
            <Text size="sm">
                정말로 이 폴더를 삭제하시겠습니까? 하위 파일도 모두 삭제됩니다.
            </Text>
        ),
        labels: { confirm: '삭제', cancel: '취소' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteFolderMutation.mutate(id),
    }), [deleteFolderMutation])

    const handleDeleteFile = useCallback((id) => modals.openConfirmModal({
        title: '확인 요청',
        children: (
            <Text size="sm">
                정말로 이 파일을 삭제하시겠습니까?
            </Text>
        ),
        labels: { confirm: '삭제', cancel: '취소' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteFileMutation.mutate(id),
    }), [deleteFileMutation])


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

    const handleFolderSelect = useCallback((folder) => {
        setSelectedFolder(folder);
    }, []);

    const handleCopyFileUrl = useCallback((file) => {
        navigator.clipboard.writeText(file.url);
    }, []);

    const handleNewFolderButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? '#0CA678'
            : themeColors.primary;
    }, [themeColors.primary]);

    const handleUploadButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? '#0CA678'
            : themeColors.primary;
    }, [themeColors.primary]);

    const EmptyFilesState = useMemo(() => (
        <Box style={styles.emptyState}>
            <IconFile
                size={64}
                style={styles.emptyIcon}
                aria-hidden="true"
            />
            <Text
                size="lg"
                mt="md"
                fw={500}
                style={styles.emptyTitle}
            >
                파일이 없습니다
            </Text>
            <Text
                size="sm"
                mt="xs"
                style={styles.emptyDescription}
            >
                파일을 업로드해보세요
            </Text>
        </Box>
    ), [styles]);

    if (isLoading) {
        return (
            <Center style={{ color: themeColors.text }} role="status" aria-live="polite">
                <Loader size="lg" color={themeColors.primary} />
            </Center>
        );
    }

    if (error) {
        return (
            <Alert
                icon={<IconAlertCircle size={18} />}
                color="red"
                variant="light"
                styles={{
                    root: styles.alertRoot,
                    message: styles.alertMessage
                }}
                role="alert"
                aria-live="assertive"
            >
                에셋 데이터를 불러오는데 실패했습니다.
            </Alert>
        );
    }

    return (
        <Box style={styles.container} role="main" aria-labelledby="asset-management-title">
            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Box p="xl" style={styles.sidePanel}>
                        <Group justify="space-between" mb="xl">
                            <Text
                                fw={700}
                                size="lg"
                                style={styles.sectionTitle}
                                id="folder-tree-title"
                            >
                                폴더
                            </Text>
                            <Button
                                size="sm"
                                radius="md"
                                leftSection={<IconFolderPlus size={16} aria-hidden="true" />}
                                onClick={() => handleOpenFolderModal()}
                                style={styles.primaryButton}
                                onMouseEnter={(e) => handleNewFolderButtonHover(e, true)}
                                onMouseLeave={(e) => handleNewFolderButtonHover(e, false)}
                                aria-label="새 폴더 생성"
                            >
                                새 폴더
                            </Button>
                        </Group>

                        <FolderTree
                            folders={assetTree.folders}
                            expandedFolders={expandedFolders}
                            selectedFolder={selectedFolder}
                            onToggleExpand={handleToggleExpand}
                            onFolderSelect={handleFolderSelect}
                            onEdit={handleOpenFolderModal}
                            onDelete={handleDeleteFolder}
                        />
                    </Box>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Box p="xl" style={styles.mainPanel}>
                        <Group justify="space-between" mb="xl">
                            <Stack gap="xs">
                                <Text
                                    fw={700}
                                    size="lg"
                                    style={styles.sectionTitle}
                                    id="file-list-title"
                                >
                                    {selectedFolder ? selectedFolder.name : '루트 폴더'}
                                </Text>
                                <Text
                                    size="sm"
                                    style={styles.fileCount}
                                    role="status"
                                    aria-live="polite"
                                >
                                    {assetTree.files.length}개 파일
                                </Text>
                            </Stack>
                            <Button
                                leftSection={<IconUpload size={18} aria-hidden="true" />}
                                onClick={openUploadModal}
                                size="md"
                                radius="md"
                                style={styles.primaryButton}
                                onMouseEnter={(e) => handleUploadButtonHover(e, true)}
                                onMouseLeave={(e) => handleUploadButtonHover(e, false)}
                                aria-label="파일 업로드"
                            >
                                파일 업로드
                            </Button>
                        </Group>

                        {assetTree.files.length === 0 ? (
                            EmptyFilesState
                        ) : (
                            <Grid
                                gutter="lg"
                                role="grid"
                                aria-labelledby="file-list-title"
                            >
                                {assetTree.files.map(file => (
                                    <Grid.Col key={file.id} span={{ base: 6, sm: 4, lg: 3 }}>
                                        <FileCard
                                            file={file}
                                            onCopyUrl={handleCopyFileUrl}
                                            onDelete={handleDeleteFile}
                                            getFileSize={getFileSize}
                                        />
                                    </Grid.Col>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Grid.Col>
            </Grid>

            {/* 폴더 생성/수정 모달과 업로드 모달은 별도 컴포넌트로 분리 권장 */}
        </Box>
    );
};

export default AssetManagement;