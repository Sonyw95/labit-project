import {memo, useCallback, useMemo} from "react";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {ActionIcon, Box, Group, Menu, rem, Text} from "@mantine/core";
import {
    IconCopy,
    IconDots,
    IconDownload,
    IconFile,
    IconFileText,
    IconPhoto,
    IconTrash,
    IconVideo
} from "@tabler/icons-react";

const FileCard = memo(({
                           file,
                           onCopyUrl,
                           onDelete,
                           getFileSize
                       }) => {
    const { themeColors, dark } = useTheme();
    const isImage = file.mimeType?.startsWith('image/');

    const getFileIcon = useMemo(() => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return <IconPhoto size={18} style={{ color: themeColors.info }} />;
        } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
            return <IconVideo size={18} style={{ color: themeColors.error }} />;
        } else if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(extension)) {
            return <IconFileText size={18} style={{ color: themeColors.warning }} />;
        }
        return <IconFile size={18} style={{ color: themeColors.subText }} />;
    }, [file.name, themeColors]);

    const styles = useMemo(() => ({
        container: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(12),
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            boxShadow: dark
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        preview: {
            height: rem(140),
            backgroundColor: isImage ? 'transparent' : themeColors.hover,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        fileName: {
            color: themeColors.text,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        fileSize: {
            color: themeColors.subText
        },
        menuButton: {
            color: themeColors.subText,
            backgroundColor: 'transparent',
        },
        dropdown: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
        },
        menuItem: {
            color: themeColors.text
        }
    }), [themeColors, dark, isImage]);

    const handleCopyUrl = useCallback(() => {
        if (onCopyUrl) {
            onCopyUrl(file);
        }
    }, [onCopyUrl, file]);

    const handleDelete = useCallback(() => {
        if (onDelete) {
            onDelete(file.id);
        }
    }, [onDelete, file.id]);

    const handleContainerHover = useCallback((e, isEntering) => {
        if (isEntering) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = dark
                ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px rgba(0, 0, 0, 0.1)';
        } else {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = dark
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)';
        }
    }, [dark]);

    const handleMenuButtonHover = useCallback((e, isEntering) => {
        if (isEntering) {
            e.currentTarget.style.backgroundColor = themeColors.hover;
            e.currentTarget.style.color = themeColors.text;
        } else {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = themeColors.subText;
        }
    }, [themeColors.hover, themeColors.text, themeColors.subText]);

    return (
        <Box
            style={styles.container}
            onMouseEnter={(e) => handleContainerHover(e, true)}
            onMouseLeave={(e) => handleContainerHover(e, false)}
            role="gridcell"
            aria-label={`파일: ${file.name}`}
        >
            <Box style={styles.preview}>
                {isImage ? (
                    <Image
                        src={file.url}
                        alt={file.name}
                        style={styles.image}
                        loading="lazy"
                    />
                ) : (
                    getFileIcon
                )}
            </Box>

            <Box p="md">
                <Group justify="space-between" mb="xs">
                    <Text
                        fw={500}
                        size="sm"
                        style={styles.fileName}
                        title={file.name}
                    >
                        {file.name}
                    </Text>
                    <Menu position="bottom-end">
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                style={styles.menuButton}
                                onMouseEnter={(e) => handleMenuButtonHover(e, true)}
                                onMouseLeave={(e) => handleMenuButtonHover(e, false)}
                                aria-label="파일 옵션 메뉴"
                            >
                                <IconDots size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown style={styles.dropdown}>
                            <Menu.Item
                                leftSection={<IconDownload size={16} />}
                                component="a"
                                href={file.url}
                                download={file.name}
                                style={styles.menuItem}
                            >
                                다운로드
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconCopy size={16} />}
                                onClick={handleCopyUrl}
                                style={styles.menuItem}
                            >
                                URL 복사
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconTrash size={16} />}
                                color="red"
                                onClick={handleDelete}
                            >
                                삭제
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Text size="xs" style={styles.fileSize}>
                    {getFileSize(file.size)}
                </Text>
            </Box>
        </Box>
    );
});

FileCard.displayName = 'FileCard';

export default FileCard;