import React, { memo, useMemo, useCallback } from 'react';
import {
    Box,
    Group,
    Text,
    ActionIcon,
    Badge,
    Menu,
    rem,
} from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconFolder,
    IconEdit,
    IconTrash,
    IconDots,
} from '@tabler/icons-react';
import {useTheme} from "@/contexts/ThemeContext.jsx";

const FolderItem = memo(({
                             folder,
                             depth = 0,
                             expandedFolders,
                             selectedFolder,
                             onToggleExpand,
                             onFolderSelect,
                             onEdit,
                             onDelete
                         }) => {
    const { themeColors } = useTheme();
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolder?.id === folder.id;

    const styles = useMemo(() => ({
        container: {
            marginLeft: depth * 20,
            cursor: 'pointer',
            backgroundColor: isSelected ? themeColors.selectedBg : themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(8),
            transition: 'all 0.2s ease',
        },
        expandButton: {
            color: themeColors.subText,
            backgroundColor: 'transparent',
        },
        folderIcon: {
            color: themeColors.warning
        },
        folderName: {
            color: themeColors.text
        },
        badge: {
            backgroundColor: `${themeColors.primary}15`,
            color: themeColors.primary,
            border: `1px solid ${themeColors.primary}30`,
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
        },
        description: {
            color: themeColors.subText,
            paddingLeft: rem(hasChildren ? 28 : 22)
        }
    }), [depth, isSelected, themeColors, hasChildren]);

    const handleFolderClick = useCallback(() => {
        if (onFolderSelect) {
            onFolderSelect(folder);
        }
    }, [onFolderSelect, folder]);

    const handleToggleExpand = useCallback((e) => {
        e.stopPropagation();
        if (onToggleExpand) {
            onToggleExpand(folder.id);
        }
    }, [onToggleExpand, folder.id]);

    const handleEdit = useCallback((e) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(folder);
        }
    }, [onEdit, folder]);

    const handleDelete = useCallback((e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(folder.id);
        }
    }, [onDelete, folder.id]);

    const handleMouseEnter = useCallback((e) => {
        if (!isSelected) {
            e.currentTarget.style.backgroundColor = themeColors.hover;
        }
    }, [isSelected, themeColors.hover]);

    const handleMouseLeave = useCallback((e) => {
        if (!isSelected) {
            e.currentTarget.style.backgroundColor = themeColors.background;
        }
    }, [isSelected, themeColors.background]);

    const handleExpandButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? themeColors.border
            : 'transparent';
    }, [themeColors.border]);

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
        <Box mb="xs">
            <Box
                p="md"
                style={styles.container}
                onClick={handleFolderClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="treeitem"
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-selected={isSelected}
                aria-label={`폴더: ${folder.name}`}
                tabIndex={0}
            >
                <Group justify="space-between">
                    <Group gap="sm">
                        {hasChildren && (
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={handleToggleExpand}
                                style={styles.expandButton}
                                onMouseEnter={(e) => handleExpandButtonHover(e, true)}
                                onMouseLeave={(e) => handleExpandButtonHover(e, false)}
                                aria-label={isExpanded ? '접기' : '펼치기'}
                            >
                                {isExpanded ? (
                                    <IconChevronDown size={16} />
                                ) : (
                                    <IconChevronRight size={16} />
                                )}
                            </ActionIcon>
                        )}
                        <IconFolder size={18} style={styles.folderIcon} aria-hidden="true" />
                        <Text fw={500} style={styles.folderName}>
                            {folder.name}
                        </Text>
                        <Badge
                            variant="light"
                            size="xs"
                            radius="md"
                            style={styles.badge}
                            aria-label={`${folder.fileCount || 0}개 파일`}
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
                                style={styles.menuButton}
                                onMouseEnter={(e) => handleMenuButtonHover(e, true)}
                                onMouseLeave={(e) => handleMenuButtonHover(e, false)}
                                aria-label="폴더 옵션 메뉴"
                            >
                                <IconDots size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown style={styles.dropdown}>
                            <Menu.Item
                                leftSection={<IconEdit size={16} />}
                                onClick={handleEdit}
                                style={styles.menuItem}
                            >
                                수정
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

                {folder.description && (
                    <Text
                        size="xs"
                        mt="xs"
                        style={styles.description}
                    >
                        {folder.description}
                    </Text>
                )}
            </Box>

            {isExpanded && hasChildren && (
                <Box mt="xs" role="group" aria-label={`${folder.name} 하위 폴더`}>
                    {folder.children.map(child => (
                        <FolderItem
                            key={child.id}
                            folder={child}
                            depth={depth + 1}
                            expandedFolders={expandedFolders}
                            selectedFolder={selectedFolder}
                            onToggleExpand={onToggleExpand}
                            onFolderSelect={onFolderSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
});

FolderItem.displayName = 'FolderItem';

export default FolderItem;