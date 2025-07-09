// ========================================
// components/settings/NavBarSettings.jsx - NavBar 설정 컴포넌트
// ========================================
import React, { useState, useCallback } from 'react';
import {
    Modal,
    Box,
    Text,
    Button,
    Group,
    Stack,
    ActionIcon,
    TextInput,
    Select,
    Switch,
    Paper,
    Divider,
    Badge,
    Tooltip,
    useMantineColorScheme, Container
} from '@mantine/core';
import {
    IconGripVertical,
    IconTrash,
    IconPlus,
    IconFolder,
    IconFile,
    IconEye,
    IconEyeOff,
    IconChevronDown,
    IconChevronRight,
    IconSettings,
    IconDeviceFloppy
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {useToast} from "@/contexts/ToastContext.jsx";
import {useToggle} from "@/hooks/useToggle.js";

// 기본 네비게이션 구조
const defaultNavStructure = {
    id: 'root',
    type: 'folder',
    title: 'Navigation',
    children: [
        {
            id: 'home',
            type: 'item',
            title: '홈',
            icon: 'IconHome',
            href: '/',
            visible: true,
            order: 0
        },
        {
            id: 'blog',
            type: 'folder',
            title: '블로그',
            icon: 'IconArticle',
            visible: true,
            order: 1,
            children: [
                {
                    id: 'posts',
                    type: 'item',
                    title: '게시글',
                    href: '/posts',
                    visible: true,
                    order: 0
                },
                {
                    id: 'categories',
                    type: 'item',
                    title: '카테고리',
                    href: '/categories',
                    visible: true,
                    order: 1
                }
            ]
        },
        {
            id: 'about',
            type: 'item',
            title: '소개',
            icon: 'IconUser',
            href: '/about',
            visible: true,
            order: 2
        }
    ]
};

const NavBarSettings = ({ opened, onClose, currentNavData, onSave }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const toast = useToast();

    const [navStructure, setNavStructure] = useState(currentNavData || defaultNavStructure);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useToggle(false);
    const [expandedItems, setExpandedItems] = useState(new Set(['root', 'blog']));

    // 2025 트렌드: Bento Box 스타일
    const getModalStyles = () => ({
        content: {
            background: dark
                ? 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
            borderRadius: '20px',
            boxShadow: dark
                ? '0 25px 80px rgba(0, 0, 0, 0.4)'
                : '0 25px 80px rgba(0, 0, 0, 0.1)',
        }
    });

    // 드래그 앤 드롭 핸들러
    const handleDragEnd = useCallback((result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination, type } = result;

        if (type === 'TREE_ITEM') {
            // 트리 아이템 재정렬
            const newStructure = reorderTreeItems(
                navStructure,
                source,
                destination
            );
            setNavStructure(newStructure);
        }
    }, [navStructure]);

    // 트리 아이템 재정렬 로직
    const reorderTreeItems = (structure, source, destination) => {
        const clonedStructure = JSON.parse(JSON.stringify(structure));

        // 소스와 대상 부모 찾기
        const sourceParent = findParentById(clonedStructure, source.droppableId);
        const destParent = findParentById(clonedStructure, destination.droppableId);

        if (!sourceParent || !destParent) {
            return structure;
        }

        // 아이템 이동
        const [movedItem] = sourceParent.children.splice(source.index, 1);
        destParent.children.splice(destination.index, 0, movedItem);

        // order 속성 업데이트
        sourceParent.children.forEach((item, index) => {
            item.order = index;
        });

        if (sourceParent !== destParent) {
            destParent.children.forEach((item, index) => {
                item.order = index;
            });
        }

        return clonedStructure;
    };

    // ID로 부모 찾기
    const findParentById = (structure, id) => {
        if (structure.id === id) {
            return structure;
        }

        if (structure.children) {
            for (const child of structure.children) {
                const result = findParentById(child, id);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    };

    // 아이템 추가
    const addItem = useCallback((parentId, type = 'item') => {
        const newItem = {
            id: `item-${Date.now()}`,
            type,
            title: type === 'folder' ? '새 폴더' : '새 메뉴',
            icon: type === 'folder' ? 'IconFolder' : 'IconFile',
            href: type === 'item' ? '/new-page' : undefined,
            visible: true,
            order: 0,
            children: type === 'folder' ? [] : undefined
        };

        const newStructure = addItemToStructure(navStructure, parentId, newItem);
        setNavStructure(newStructure);
        setSelectedItem(newItem);
        setIsEditing(true);
    }, [navStructure]);

    // 구조에 아이템 추가
    const addItemToStructure = (structure, parentId, newItem) => {
        if (structure.id === parentId) {
            const children = structure.children || [];
            newItem.order = children.length;
            return {
                ...structure,
                children: [...children, newItem]
            };
        }

        if (structure.children) {
            return {
                ...structure,
                children: structure.children.map(child =>
                    addItemToStructure(child, parentId, newItem)
                )
            };
        }

        return structure;
    };

    // 아이템 삭제
    const deleteItem = useCallback((itemId) => {
        const newStructure = removeItemFromStructure(navStructure, itemId);
        setNavStructure(newStructure);

        if (selectedItem?.id === itemId) {
            setSelectedItem(null);
            setIsEditing(false);
        }

        toast.success('메뉴 항목이 삭제되었습니다.');
    }, [navStructure, selectedItem, toast]);

    // 구조에서 아이템 제거
    const removeItemFromStructure = (structure, itemId) => {
        if (structure.children) {
            const filteredChildren = structure.children
                .filter(child => child.id !== itemId)
                .map(child => removeItemFromStructure(child, itemId));

            return {
                ...structure,
                children: filteredChildren
            };
        }

        return structure;
    };

    // 아이템 업데이트
    const updateItem = useCallback((itemId, updates) => {
        const newStructure = updateItemInStructure(navStructure, itemId, updates);
        setNavStructure(newStructure);

        if (selectedItem?.id === itemId) {
            setSelectedItem({ ...selectedItem, ...updates });
        }
    }, [navStructure, selectedItem]);

    // 구조에서 아이템 업데이트
    const updateItemInStructure = (structure, itemId, updates) => {
        if (structure.id === itemId) {
            return { ...structure, ...updates };
        }

        if (structure.children) {
            return {
                ...structure,
                children: structure.children.map(child =>
                    updateItemInStructure(child, itemId, updates)
                )
            };
        }

        return structure;
    };

    // 확장/축소 토글
    const toggleExpanded = useCallback((itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    }, [expandedItems]);

    // 드래그 가능한 트리 아이템 렌더링
    const renderTreeItem = (item, index, parentId) => {
        const isExpanded = expandedItems.has(item.id);
        const hasChildren = item.children && item.children.length > 0;
        const isSelected = selectedItem?.id === item.id;

        return (
            <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        // style={{
                        //     ...provided.draggableProps.style,
                        //     opacity: snapshot.isDragging ? 0.8 : 1,
                        // }}
                    >
                        <Paper
                            p="xs"
                            mb="xs"
                            style={{
                                background: isSelected
                                    ? (dark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)')
                                    : (dark ? 'rgba(48, 54, 61, 0.3)' : 'rgba(248, 250, 252, 0.8)'),
                                border: `1px solid ${isSelected
                                    ? (dark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)')
                                    : (dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)')}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onClick={() => setSelectedItem(item)}
                        >
                            <Group gap="xs" wrap="nowrap">
                                {/* 드래그 핸들 */}
                                <div {...provided.dragHandleProps}>
                                    <IconGripVertical
                                        size={16}
                                        style={{
                                            color: dark ? '#8b949e' : '#64748b',
                                            cursor: 'grab'
                                        }}
                                    />
                                </div>

                                {/* 확장/축소 버튼 */}
                                {hasChildren && (
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpanded(item.id);
                                        }}
                                    >
                                        {isExpanded ? (
                                            <IconChevronDown size={14} />
                                        ) : (
                                            <IconChevronRight size={14} />
                                        )}
                                    </ActionIcon>
                                )}

                                {/* 아이콘 */}
                                <Box style={{ color: dark ? '#8b949e' : '#64748b' }}>
                                    {item.type === 'folder' ? <IconFolder size={16} /> : <IconFile size={16} />}
                                </Box>

                                {/* 제목 */}
                                <Text size="sm" style={{ flex: 1 }}>
                                    {item.title}
                                </Text>

                                {/* 뱃지들 */}
                                <Group gap="xs">
                                    {!item.visible && (
                                        <Badge size="xs" color="gray" variant="light">
                                            숨김
                                        </Badge>
                                    )}

                                    {item.href && (
                                        <Badge size="xs" color="blue" variant="light">
                                            링크
                                        </Badge>
                                    )}
                                </Group>

                                {/* 액션 버튼들 */}
                                <Group gap="xs">
                                    <Tooltip label="보이기/숨기기">
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateItem(item.id, { visible: !item.visible });
                                            }}
                                        >
                                            {item.visible ? (
                                                <IconEye size={14} />
                                            ) : (
                                                <IconEyeOff size={14} />
                                            )}
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label="삭제">
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteItem(item.id);
                                            }}
                                        >
                                            <IconTrash size={14} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>
                        </Paper>

                        {/* 자식 아이템들 */}
                        {hasChildren && isExpanded && (
                            <Droppable droppableId={item.id} type="TREE_ITEM">
                                {(provided) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        pl="xl"
                                        mt="xs"
                                    >
                                        {item.children.map((child, childIndex) =>
                                            renderTreeItem(child, childIndex, item.id)
                                        )}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        )}
                    </div>
                )}
            </Draggable>
        );
    };

    // 저장 핸들러
    const handleSave = useCallback(() => {
        onSave?.(navStructure);
        toast.success('네비게이션 설정이 저장되었습니다.');
        onClose();
    }, [navStructure, onSave, onClose, toast]);

    // 리셋 핸들러
    const handleReset = useCallback(() => {
        setNavStructure(defaultNavStructure);
        setSelectedItem(null);
        setIsEditing(false);
        toast.info('네비게이션 설정이 초기화되었습니다.');
    }, [toast]);

    return (
        <Container
            // opened={opened}
            // onClose={onClose}
            // title="네비게이션 설정"
            size="xl"
            // centered
            styles={getModalStyles}
        >
            <Box style={{ height: '70vh' }}>
                <Group align="flex-start" gap="md" style={{ height: '100%' }}>
                    {/* 왼쪽: 트리 구조 */}
                    <Box style={{ flex: 1, height: '100%' }}>
                        <Group justify="space-between" mb="md">
                            <Text size="sm" fw={600}>
                                메뉴 구조
                            </Text>
                            <Group gap="xs">
                                <Button
                                    size="xs"
                                    variant="light"
                                    leftSection={<IconPlus size={14} />}
                                    onClick={() => addItem('root', 'item')}
                                >
                                    메뉴 추가
                                </Button>
                                <Button
                                    size="xs"
                                    variant="light"
                                    leftSection={<IconFolder size={14} />}
                                    onClick={() => addItem('root', 'folder')}
                                >
                                    폴더 추가
                                </Button>
                            </Group>
                        </Group>

                        <Paper
                            p="md"
                            style={{
                                height: 'calc(100% - 60px)',
                                overflow: 'auto',
                                background: dark ? 'rgba(13, 17, 23, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                                border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                                borderRadius: '12px',
                            }}
                        >
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="root" type="TREE_ITEM">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {navStructure.children?.map((item, index) =>
                                                renderTreeItem(item, index, 'root')
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </Paper>
                    </Box>

                    {/* 오른쪽: 아이템 편집 */}
                    <Box style={{ width: '350px', height: '100%' }}>
                        <Text size="sm" fw={600} mb="md">
                            아이템 편집
                        </Text>

                        <Paper
                            p="md"
                            style={{
                                height: 'calc(100% - 60px)',
                                background: dark ? 'rgba(13, 17, 23, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                                border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                                borderRadius: '12px',
                            }}
                        >
                            {selectedItem ? (
                                <Stack gap="md">
                                    <TextInput
                                        label="제목"
                                        value={selectedItem.title}
                                        onChange={(event) =>
                                            updateItem(selectedItem.id, {
                                                title: event.currentTarget.value,
                                            })
                                        }
                                        placeholder="메뉴 제목을 입력하세요"
                                    />

                                    {selectedItem.type === 'item' && (
                                        <TextInput
                                            label="링크 (href)"
                                            value={selectedItem.href || ''}
                                            onChange={(event) =>
                                                updateItem(selectedItem.id, {
                                                    href: event.currentTarget.value,
                                                })
                                            }
                                            placeholder="/path/to/page"
                                        />
                                    )}

                                    <Select
                                        label="아이콘"
                                        value={selectedItem.icon || ''}
                                        onChange={(value) =>
                                            updateItem(selectedItem.id, { icon: value })
                                        }
                                        data={[
                                            { value: 'IconHome', label: '홈' },
                                            { value: 'IconArticle', label: '게시글' },
                                            { value: 'IconUser', label: '사용자' },
                                            { value: 'IconSettings', label: '설정' },
                                            { value: 'IconFolder', label: '폴더' },
                                            { value: 'IconFile', label: '파일' },
                                            { value: 'IconTags', label: '태그' },
                                            { value: 'IconBookmark', label: '북마크' },
                                            { value: 'IconTrendingUp', label: '인기' },
                                        ]}
                                        searchable
                                        clearable
                                    />

                                    <Switch
                                        label="표시"
                                        description="이 메뉴를 네비게이션에 표시합니다"
                                        checked={selectedItem.visible}
                                        onChange={(event) =>
                                            updateItem(selectedItem.id, {
                                                visible: event.currentTarget.checked,
                                            })
                                        }
                                    />

                                    {selectedItem.type === 'folder' && (
                                        <>
                                            <Divider />
                                            <Group justify="space-between">
                                                <Text size="sm" fw={500}>
                                                    하위 메뉴
                                                </Text>
                                                <Group gap="xs">
                                                    <Button
                                                        size="xs"
                                                        variant="light"
                                                        onClick={() => addItem(selectedItem.id, 'item')}
                                                    >
                                                        추가
                                                    </Button>
                                                </Group>
                                            </Group>
                                        </>
                                    )}

                                    <Divider />

                                    <Group gap="xs">
                                        <Button
                                            size="xs"
                                            variant="light"
                                            color="red"
                                            leftSection={<IconTrash size={14} />}
                                            onClick={() => deleteItem(selectedItem.id)}
                                        >
                                            삭제
                                        </Button>
                                    </Group>
                                </Stack>
                            ) : (
                                <Box
                                    style={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Stack align="center" gap="md">
                                        <IconSettings
                                            size={48}
                                            style={{ color: dark ? '#8b949e' : '#64748b', opacity: 0.5 }}
                                        />
                                        <Text size="sm" c="dimmed">
                                            편집할 메뉴 항목을 선택하세요
                                        </Text>
                                    </Stack>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Group>

                {/* 하단 액션 버튼들 */}
                <Group justify="space-between" mt="md">
                    <Button variant="light" color="gray" onClick={handleReset}>
                        초기화
                    </Button>

                    <Group gap="md">
                        <Button variant="light" onClick={onClose}>
                            취소
                        </Button>
                        <Button
                            leftSection={<IconDeviceFloppy size={16} />}
                            onClick={handleSave}
                        >
                            저장
                        </Button>
                    </Group>
                </Group>
            </Box>
        </Container>
    );
};

export default NavBarSettings;
