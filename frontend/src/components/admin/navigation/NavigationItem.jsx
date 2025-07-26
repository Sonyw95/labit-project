import React, { memo, useMemo, useCallback } from 'react';
import {
    Box,
    Group,
    Text,
    ActionIcon,
    Badge,
    Tooltip,
    rem,
} from '@mantine/core';
import {
    IconGripVertical,
    IconChevronDown,
    IconChevronRight,
    IconEye,
    IconEyeOff,
    IconLink,
    IconEdit,
    IconTrash,
} from '@tabler/icons-react';
import { Draggable } from '@hello-pangea/dnd';
import { Icons } from "@/utils/Icons.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const AdminNavigationItem = memo(({
                                 item,
                                 index,
                                 isExpanded,
                                 onToggleExpand,
                                 onToggleStatus,
                                 onEdit,
                                 onDelete
                             }) => {
    const { velogColors, dark } = useTheme();
    const hasChildren = item.children && item.children.length > 0;

    const styles = useMemo(() => ({
        container: () => ({
            marginLeft: item.depth * 20,
        }),
        itemBox: (isDragging) => ({
            backgroundColor: isDragging
                ? `${velogColors.primary}15`
                : velogColors.background,
            border: `1px solid ${isDragging
                ? velogColors.primary
                : velogColors.border}`,
            borderRadius: rem(8),
            opacity: item.isActive ? 1 : 0.6,
            transition: 'all 0.2s ease',
            boxShadow: isDragging
                ? `0 4px 12px ${velogColors.primary}30`
                : dark
                    ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
        }),
        dragHandle: {
            cursor: 'grab',
            color: velogColors.subText
        },
        expandButton: {
            color: velogColors.subText,
            backgroundColor: 'transparent',
        },
        menuLabel: {
            color: velogColors.text
        },
        linkBadge: {
            backgroundColor: `${velogColors.primary}15`,
            color: velogColors.primary,
            border: `1px solid ${velogColors.primary}30`,
        },
        statusButton: (isActive) => ({
            color: isActive ? velogColors.success : velogColors.error,
            backgroundColor: 'transparent',
        }),
        actionButton: {
            color: velogColors.subText,
            backgroundColor: 'transparent',
        },
        deleteButton: {
            color: velogColors.error,
            backgroundColor: 'transparent',
        },
        description: {
            color: velogColors.subText,
            paddingLeft: rem(42)
        }
    }), [item.depth, item.isActive, velogColors, dark]);

    const handleToggleExpand = useCallback(() => {
        if (onToggleExpand) {
            onToggleExpand(item.id);
        }
    }, [onToggleExpand, item.id]);

    const handleToggleStatus = useCallback(() => {
        if (onToggleStatus) {
            onToggleStatus(item.id);
        }
    }, [onToggleStatus, item.id]);

    const handleEdit = useCallback(() => {
        if (onEdit) {
            onEdit(item);
        }
    }, [onEdit, item]);

    const handleDelete = useCallback(() => {
        if (onDelete) {
            onDelete(item.id);
        }
    }, [onDelete, item.id]);

    const handleExpandButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? velogColors.hover
            : 'transparent';
    }, [velogColors.hover]);

    const handleActionButtonHover = useCallback((e, isEntering) => {
        if (isEntering) {
            e.currentTarget.style.backgroundColor = velogColors.hover;
            e.currentTarget.style.color = velogColors.text;
        } else {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = velogColors.subText;
        }
    }, [velogColors.hover, velogColors.text, velogColors.subText]);

    const handleDeleteButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? `${velogColors.error}15`
            : 'transparent';
    }, [velogColors.error]);

    const handleStatusButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? velogColors.hover
            : 'transparent';
    }, [velogColors.hover]);

    return (
        <Draggable
            key={item.id}
            draggableId={item.id.toString()}
            index={index}
        >
            {(provided, snapshot) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                        ...styles.container(snapshot.isDragging)
                    }}
                >
                    <Box
                        p="md"
                        mb="sm"
                        style={styles.itemBox(snapshot.isDragging)}
                        role="listitem"
                        aria-label={`네비게이션 항목: ${item.label}`}
                    >
                        <Group justify="space-between">
                            <Group gap="sm">
                                <Box {...provided.dragHandleProps}>
                                    <IconGripVertical
                                        size={18}
                                        style={styles.dragHandle}
                                        aria-label="드래그 핸들"
                                    />
                                </Box>

                                {hasChildren && (
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={handleToggleExpand}
                                        style={styles.expandButton}
                                        onMouseEnter={(e) => handleExpandButtonHover(e, true)}
                                        onMouseLeave={(e) => handleExpandButtonHover(e, false)}
                                        aria-label={isExpanded ? '접기' : '펼치기'}
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded ? (
                                            <IconChevronDown size={16} />
                                        ) : (
                                            <IconChevronRight size={16} />
                                        )}
                                    </ActionIcon>
                                )}

                                <Group gap="xs">
                                    {item.icon && (
                                        <Icons
                                            icon={item.icon}
                                            size={16}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <Text
                                        fw={500}
                                        style={styles.menuLabel}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.href && (
                                        <Badge
                                            variant="light"
                                            size="xs"
                                            leftSection={<IconLink size={10} aria-hidden="true" />}
                                            style={styles.linkBadge}
                                            aria-label={`링크: ${item.href}`}
                                        >
                                            {item.href}
                                        </Badge>
                                    )}
                                </Group>
                            </Group>

                            <Group gap="xs" role="group" aria-label="액션 버튼">
                                <Tooltip label={item.isActive ? '활성화됨' : '비활성화됨'}>
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={handleToggleStatus}
                                        style={styles.statusButton(item.isActive)}
                                        onMouseEnter={(e) => handleStatusButtonHover(e, true)}
                                        onMouseLeave={(e) => handleStatusButtonHover(e, false)}
                                        aria-label={item.isActive ? '비활성화하기' : '활성화하기'}
                                        aria-pressed={item.isActive}
                                    >
                                        {item.isActive ? (
                                            <IconEye size={16} />
                                        ) : (
                                            <IconEyeOff size={16} />
                                        )}
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="수정">
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={handleEdit}
                                        style={styles.actionButton}
                                        onMouseEnter={(e) => handleActionButtonHover(e, true)}
                                        onMouseLeave={(e) => handleActionButtonHover(e, false)}
                                        aria-label={`${item.label} 수정`}
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="삭제">
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        onClick={handleDelete}
                                        style={styles.deleteButton}
                                        onMouseEnter={(e) => handleDeleteButtonHover(e, true)}
                                        onMouseLeave={(e) => handleDeleteButtonHover(e, false)}
                                        aria-label={`${item.label} 삭제`}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>

                        {item.description && (
                            <Text
                                size="xs"
                                mt="xs"
                                style={styles.description}
                            >
                                {item.description}
                            </Text>
                        )}
                    </Box>
                </Box>
            )}
        </Draggable>
    );
});

AdminNavigationItem.displayName = 'AdminNavigationItem';

export default AdminNavigationItem;