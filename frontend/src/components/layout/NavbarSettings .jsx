import React, { useState, useCallback, memo } from 'react';
import {
    Box,
    Stack,
    Group,
    Text,
    ActionIcon,
    Button,
    TextInput,
    Select,
    Switch,
    Badge,
    ThemeIcon,
    Collapse,
    Modal,
    Paper,
    ScrollArea,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconGripVertical,
    IconPlus,
    IconEdit,
    IconTrash,
    IconChevronDown,
    IconChevronRight,
    IconFolder,
    IconFile,
    IconLink,
    IconSettings,
    IconHome,
    IconArticle,
    IconTags,
    IconUser,
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {useTheme} from "../../hooks/useTheme.js";
import {showToast} from "../common/Toast.jsx";
import {useLocalStorage} from "../../hooks/useLocalStorage.js";

// 기본 네비게이션 구조
const defaultNavStructure = [
    {
        id: 'home',
        label: '홈',
        icon: 'IconHome',
        type: 'page',
        href: '/',
        visible: true,
        order: 0,
        children: []
    },
    {
        id: 'posts',
        label: '게시글',
        icon: 'IconArticle',
        type: 'category',
        href: '/posts',
        visible: true,
        order: 1,
        children: [
            {
                id: 'all-posts',
                label: '전체 게시글',
                icon: 'IconFile',
                type: 'page',
                href: '/posts',
                visible: true,
                order: 0,
                children: []
            },
            {
                id: 'featured',
                label: '추천 게시글',
                icon: 'IconFile',
                type: 'page',
                href: '/posts/featured',
                visible: true,
                order: 1,
                children: []
            }
        ]
    },
    {
        id: 'tags',
        label: '태그',
        icon: 'IconTags',
        type: 'page',
        href: '/tags',
        visible: true,
        order: 2,
        children: []
    },
    {
        id: 'about',
        label: '소개',
        icon: 'IconUser',
        type: 'page',
        href: '/about',
        visible: true,
        order: 3,
        children: []
    }
];

// 아이콘 매핑
const iconMap = {
    IconHome,
    IconArticle,
    IconTags,
    IconUser,
    IconFolder,
    IconFile,
    IconLink,
    IconSettings,
};

// NavItem 컴포넌트
const NavItem = memo(({
                          item,
                          index,
                          level = 0,
                          onEdit,
                          onDelete,
                          onToggleCollapse,
                          collapsed = false,
                          isDragging = false
                      }) => {
    const { dark } = useTheme();

    const Icon = iconMap[item.icon] || IconFile;
    const hasChildren = item.children && item.children.length > 0;
    const isCollapsed = collapsed;

    return (
        <Box>
            <Paper
                p="sm"
                mb="xs"
                style={{
                    background: isDragging
                        ? (dark ? '#21262d' : '#f3f4f6')
                        : (dark ? '#161b22' : '#ffffff'),
                    border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                    marginLeft: rem(level * 20),
                    transform: isDragging ? 'rotate(5deg)' : 'none',
                    opacity: isDragging ? 0.8 : 1,
                }}
            >
                <Group justify="space-between">
                    <Group gap="xs" style={{ flex: 1 }}>
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            style={{ cursor: 'grab' }}
                        >
                            <IconGripVertical size={14} />
                        </ActionIcon>

                        {hasChildren && (
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={() => onToggleCollapse(item.id)}
                            >
                                {isCollapsed ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}
                            </ActionIcon>
                        )}

                        <ThemeIcon
                            size="sm"
                            radius="sm"
                            variant="light"
                            color={item.visible ? 'blue' : 'gray'}
                        >
                            <Icon size={14} />
                        </ThemeIcon>

                        <Stack gap={2} style={{ flex: 1 }}>
                            <Group gap="xs">
                                <Text size="sm" fw={500}>
                                    {item.label}
                                </Text>
                                <Badge
                                    size="xs"
                                    color={item.type === 'category' ? 'blue' : 'gray'}
                                    variant="light"
                                >
                                    {item.type}
                                </Badge>
                                {!item.visible && (
                                    <Badge size="xs" color="red" variant="light">
                                        숨김
                                    </Badge>
                                )}
                            </Group>

                            {item.href && (
                                <Text size="xs" c="dimmed">
                                    {item.href}
                                </Text>
                            )}
                        </Stack>
                    </Group>

                    <Group gap="xs">
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => onEdit(item)}
                        >
                            <IconEdit size={14} />
                        </ActionIcon>

                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            color="red"
                            onClick={() => onDelete(item.id)}
                        >
                            <IconTrash size={14} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>

            {hasChildren && !isCollapsed && (
                <Collapse in={!isCollapsed}>
                    <Droppable droppableId={`children-${item.id}`} type="nav-item">
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                ml={rem(20)}
                            >
                                {item.children.map((child, childIndex) => (
                                    <Draggable
                                        key={child.id}
                                        draggableId={child.id}
                                        index={childIndex}
                                    >
                                        {(provided, snapshot) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <NavItem
                                                    item={child}
                                                    index={childIndex}
                                                    level={level + 1}
                                                    onEdit={onEdit}
                                                    onDelete={onDelete}
                                                    onToggleCollapse={onToggleCollapse}
                                                    isDragging={snapshot.isDragging}
                                                />
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </Collapse>
            )}
        </Box>
    );
});

NavItem.displayName = 'NavItem';

// EditModal 컴포넌트
const EditModal = memo(({
                            opened,
                            onClose,
                            item,
                            onSave,
                            isNew = false
                        }) => {
    const [formData, setFormData] = useState({
        label: '',
        icon: 'IconFile',
        type: 'page',
        href: '',
        visible: true,
        ...item
    });

    const iconOptions = Object.keys(iconMap).map(key => ({
        value: key,
        label: key.replace('Icon', '')
    }));

    const handleSave = useCallback(() => {
        if (!formData.label.trim()) {
            showToast.error('오류', '레이블을 입력해주세요.');
            return;
        }

        onSave(formData);
        onClose();
    }, [formData, onSave, onClose]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isNew ? '새 메뉴 추가' : '메뉴 편집'}
            size="md"
        >
            <Stack gap="md">
                <TextInput
                    label="레이블"
                    placeholder="메뉴 이름을 입력하세요"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    required
                />

                <Select
                    label="아이콘"
                    data={iconOptions}
                    value={formData.icon}
                    onChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                />

                <Select
                    label="타입"
                    data={[
                        { value: 'page', label: '페이지' },
                        { value: 'category', label: '카테고리' },
                        { value: 'link', label: '링크' }
                    ]}
                    value={formData.type}
                    onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                />

                <TextInput
                    label="경로"
                    placeholder="/path/to/page"
                    value={formData.href}
                    onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                />

                <Switch
                    label="표시"
                    description="메뉴에 표시할지 설정합니다"
                    checked={formData.visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                />

                <Group justify="flex-end" gap="xs">
                    <Button variant="light" onClick={onClose}>
                        취소
                    </Button>
                    <Button onClick={handleSave}>
                        {isNew ? '추가' : '저장'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
});

EditModal.displayName = 'EditModal';

// NavbarSettings 메인 컴포넌트
const NavbarSettings = memo(() => {


    const [navStructure, setNavStructure] = useLocalStorage('nav_structure', defaultNavStructure);
    const [collapsedItems, setCollapsedItems] = useState(new Set());
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isNewItem, setIsNewItem] = useState(false);

    // 드래그 완료 핸들러
    const handleDragEnd = useCallback((result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        setNavStructure(prev => {
            const newStructure = [...prev];

            // 같은 레벨에서의 이동
            if (source.droppableId === destination.droppableId) {
                if (source.droppableId === 'nav-root') {
                    // 루트 레벨 이동
                    const [removed] = newStructure.splice(source.index, 1);
                    newStructure.splice(destination.index, 0, removed);
                } else {
                    // 하위 레벨 이동
                    const parentId = source.droppableId.replace('children-', '');
                    const parent = findItemById(newStructure, parentId);
                    if (parent && parent.children) {
                        const [removed] = parent.children.splice(source.index, 1);
                        parent.children.splice(destination.index, 0, removed);
                    }
                }
            } else {
                // 다른 레벨로의 이동
                // 복잡한 로직이므로 간단화
                showToast.info('알림', '같은 레벨 내에서만 이동 가능합니다.');
                return prev;
            }

            return newStructure;
        });
    }, [setNavStructure]);

    // 아이템 찾기 헬퍼
    const findItemById = useCallback((items, id) => {
        for (const item of items) {
            if (item.id === id) {
                return item;
            }
            if (item.children) {
                const found = findItemById(item.children, id);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }, []);

    // 아이템 편집
    const handleEdit = useCallback((item) => {
        setCurrentItem(item);
        setIsNewItem(false);
        setEditModalOpened(true);
    }, []);

    // 새 아이템 추가
    const handleAddNew = useCallback(() => {
        setCurrentItem(null);
        setIsNewItem(true);
        setEditModalOpened(true);
    }, []);

    // 아이템 삭제
    const handleDelete = useCallback((itemId) => {
        setNavStructure(prev => {
            const removeItem = (items) => {
                return items.filter(item => {
                    if (item.id === itemId) {
                        return false;
                    }
                    if (item.children) {
                        item.children = removeItem(item.children);
                    }
                    return true;
                });
            };

            return removeItem([...prev]);
        });

        showToast.success('삭제 완료', '메뉴 항목이 삭제되었습니다.');
    }, [setNavStructure]);

    // 아이템 저장
    const handleSave = useCallback((itemData) => {
        if (isNewItem) {
            const newItem = {
                ...itemData,
                id: `item-${Date.now()}`,
                order: navStructure.length,
                children: []
            };

            setNavStructure(prev => [...prev, newItem]);
            showToast.success('추가 완료', '새 메뉴 항목이 추가되었습니다.');
        } else {
            setNavStructure(prev => {
                const updateItem = (items) => {
                    return items.map(item => {
                        if (item.id === currentItem.id) {
                            return { ...item, ...itemData };
                        }
                        if (item.children) {
                            return { ...item, children: updateItem(item.children) };
                        }
                        return item;
                    });
                };

                return updateItem([...prev]);
            });

            showToast.success('수정 완료', '메뉴 항목이 수정되었습니다.');
        }
    }, [isNewItem, currentItem, navStructure.length, setNavStructure]);

    // 접기/펼치기 토글
    const handleToggleCollapse = useCallback((itemId) => {
        setCollapsedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    // 기본값 복원
    const handleReset = useCallback(() => {
        setNavStructure(defaultNavStructure);
        showToast.success('복원 완료', '기본 네비게이션 구조로 복원되었습니다.');
    }, [setNavStructure]);

    return (
        <Box>
            <Group justify="space-between" mb="md">
                <Text size="lg" fw={600}>
                    네비게이션 설정
                </Text>
                <Group gap="xs">
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={14} />}
                        onClick={handleAddNew}
                    >
                        새 메뉴 추가
                    </Button>
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={handleReset}
                    >
                        기본값 복원
                    </Button>
                </Group>
            </Group>

            <Text size="sm" c="dimmed" mb="lg">
                드래그 앤 드롭으로 메뉴 순서를 변경하고, 편집 버튼으로 메뉴를 수정할 수 있습니다.
            </Text>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="nav-root" type="nav-item">
                    {(provided) => (
                        <ScrollArea h={600}>
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {navStructure.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <NavItem
                                                    item={item}
                                                    index={index}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onToggleCollapse={handleToggleCollapse}
                                                    collapsed={collapsedItems.has(item.id)}
                                                    isDragging={snapshot.isDragging}
                                                />
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        </ScrollArea>
                    )}
                </Droppable>
            </DragDropContext>

            <EditModal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                item={currentItem}
                onSave={handleSave}
                isNew={isNewItem}
            />
        </Box>
    );
});

NavbarSettings.displayName = 'NavbarSettings';

export default NavbarSettings;