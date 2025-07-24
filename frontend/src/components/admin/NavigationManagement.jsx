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
    Switch,
    Alert,
    Stack,
    Badge,
    Tooltip,
    Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconGripVertical,
    IconChevronDown,
    IconChevronRight,
    IconEye,
    IconEyeOff,
    IconLink,
    IconFolder,
    IconAlertCircle,
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    useCreateNavigation,
    useDeleteNavigation,
    useNavigationTree, useToggleNavigationStatus,
    useUpdateNavigation, useUpdateNavigationOrder
} from "../../hooks/api/useApi.js";

const NavigationManagement = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedItems, setExpandedItems] = useState(new Set());

    const {
        data: navigations,
        isLoading,
        error
    } = useNavigationTree();

    const createMutation = useCreateNavigation();
    const updateMutation = useUpdateNavigation();
    const deleteMutation = useDeleteNavigation();
    const updateOrderMutation = useUpdateNavigationOrder();
    const toggleStatusMutation = useToggleNavigationStatus();

    const form = useForm({
        initialValues: {
            label: '',
            href: '',
            icon: '',
            description: '',
            parentId: null,
            isActive: true,
        },
        validate: {
            label: (value) => (!value ? '메뉴 이름을 입력하세요' : null),
        },
    });


    // 평면 구조로 변환 (DnD용)
    const flatNavigations = useMemo(() => {
        if (!navigations) {
            return [];
        }

        const flatten = (items, depth = 0) => {
            return items.reduce((acc, item) => {
                acc.push({ ...item, depth });
                if (item.children && expandedItems.has(item.id)) {
                    acc.push(...flatten(item.children, depth + 1));
                }
                return acc;
            }, []);
        };

        return flatten(navigations);
    }, [expandedItems]);

    // 부모 메뉴 옵션 생성
    const parentOptions = useMemo(() => {
        if (!navigations) {
            return [];
        }

        const buildOptions = (items, depth = 0) => {
            return items.reduce((acc, item) => {
                const prefix = '—'.repeat(depth);
                acc.push({
                    value: item.id.toString(),
                    label: `${prefix} ${item.label}`
                });
                if (item.children) {
                    acc.push(...buildOptions(item.children, depth + 1));
                }
                return acc;
            }, []);
        };

        return [
            { value: '', label: '최상위 메뉴' },
            ...buildOptions(navigations)
        ];
    }, [navigations]);

    const handleOpenModal = useCallback((item = null) => {
        setEditingItem(item);
        if (item) {
            form.setValues({
                label: item.label || '',
                href: item.href || '',
                icon: item.icon || '',
                description: item.description || '',
                parentId: item.parentId ? item.parentId.toString() : '',
                isActive: item.isActive ?? true,
            });
        } else {
            form.reset();
        }
        open();
    }, [form, open]);

    const handleSubmit = useCallback((values) => {
        const data = {
            ...values,
            parentId: values.parentId ? parseInt(values.parentId, 10) : null,
        };

        if (editingItem) {
            updateMutation.mutate(
                { id: editingItem.id, data },
                { onSuccess: close }
            );
        } else {
            createMutation.mutate(data, { onSuccess: close });
        }
    }, [editingItem, updateMutation, createMutation, close]);

    const handleDelete = useCallback((id) => {
        if (window.confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
            deleteMutation.mutate(id);
        }
    }, [deleteMutation]);

    const handleToggleStatus = useCallback((id) => {
        toggleStatusMutation.mutate(id);
    }, [toggleStatusMutation]);

    const handleToggleExpand = useCallback((id) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleDragEnd = useCallback((result) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;
        if (source.index === destination.index) {
            return;
        }

        const items = Array.from(flatNavigations);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        // 순서 업데이트를 위한 데이터 준비
        const orderData = items.map((item, index) => ({
            id: item.id,
            sortOrder: index,
            parentId: item.parentId
        }));

        updateOrderMutation.mutate(orderData);
    }, [flatNavigations, updateOrderMutation]);

    const renderNavigationItem = useCallback((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);

        return (
            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                {(provided, snapshot) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...provided.draggableProps.style,
                            marginLeft: item.depth * 20,
                        }}
                    >
                        <Paper
                            p="sm"
                            mb="xs"
                            shadow={snapshot.isDragging ? 'md' : 'xs'}
                            bg={snapshot.isDragging ? 'blue.0' : undefined}
                            style={{
                                opacity: item.isActive ? 1 : 0.6,
                            }}
                        >
                            <Group justify="space-between">
                                <Group>
                                    <div {...provided.dragHandleProps}>
                                        <IconGripVertical
                                            size={16}
                                            style={{ cursor: 'grab' }}
                                        />
                                    </div>

                                    {hasChildren && (
                                        <ActionIcon
                                            variant="subtle"
                                            size="sm"
                                            onClick={() => handleToggleExpand(item.id)}
                                        >
                                            {isExpanded ? (
                                                <IconChevronDown size={14} />
                                            ) : (
                                                <IconChevronRight size={14} />
                                            )}
                                        </ActionIcon>
                                    )}

                                    <Group gap="xs">
                                        {item.icon && (
                                            <Text size="sm" c="dimmed">
                                                {item.icon}
                                            </Text>
                                        )}
                                        <Text fw={500}>{item.label}</Text>
                                        {item.href && (
                                            <Badge
                                                variant="light"
                                                color="blue"
                                                size="xs"
                                                leftSection={<IconLink size={10} />}
                                            >
                                                {item.href}
                                            </Badge>
                                        )}
                                    </Group>
                                </Group>

                                <Group gap="xs">
                                    <Tooltip label={item.isActive ? '활성화됨' : '비활성화됨'}>
                                        <ActionIcon
                                            variant="subtle"
                                            color={item.isActive ? 'green' : 'red'}
                                            onClick={() => handleToggleStatus(item.id)}
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
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label="삭제">
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>

                            {item.description && (
                                <Text size="xs" c="dimmed" mt="xs">
                                    {item.description}
                                </Text>
                            )}
                        </Paper>
                    </Box>
                )}
            </Draggable>
        );
    }, [expandedItems, handleToggleExpand, handleToggleStatus, handleOpenModal, handleDelete]);

    if (isLoading) {
        return <Text>네비게이션 데이터를 불러오는 중...</Text>;
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
                네비게이션 데이터를 불러오는데 실패했습니다.
            </Alert>
        );
    }

    return (
        <Box>
            <Group justify="between" mb="lg">
                <div>
                    <Text size="lg" fw={600} mb="xs">
                        네비게이션 관리
                    </Text>
                    <Text size="sm" c="dimmed">
                        드래그 앤 드롭으로 메뉴 순서를 변경할 수 있습니다
                    </Text>
                </div>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => handleOpenModal()}
                >
                    새 메뉴 추가
                </Button>
            </Group>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="navigation-list">
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {flatNavigations.map((item, index) =>
                                renderNavigationItem(item, index)
                            )}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            {flatNavigations.length === 0 && (
                <Paper p="xl" ta="center">
                    <IconFolder size={48} color="gray" />
                    <Text size="lg" mt="md" c="dimmed">
                        등록된 네비게이션 메뉴가 없습니다
                    </Text>
                    <Text size="sm" c="dimmed">
                        새 메뉴를 추가해보세요
                    </Text>
                </Paper>
            )}

            <Modal
                opened={opened}
                onClose={close}
                title={editingItem ? '메뉴 수정' : '새 메뉴 추가'}
                size="md"
            >
                <Stack>
                    <TextInput
                        label="메뉴 이름"
                        placeholder="메뉴 이름을 입력하세요"
                        required
                        {...form.getInputProps('label')}
                    />

                    <TextInput
                        label="링크 URL"
                        placeholder="/path/to/page"
                        {...form.getInputProps('href')}
                    />

                    <Select
                        label="부모 메뉴"
                        placeholder="부모 메뉴를 선택하세요"
                        data={parentOptions}
                        clearable
                        {...form.getInputProps('parentId')}
                    />

                    <TextInput
                        label="아이콘"
                        placeholder="아이콘 클래스 또는 문자"
                        {...form.getInputProps('icon')}
                    />

                    <Textarea
                        label="설명"
                        placeholder="메뉴에 대한 설명을 입력하세요"
                        rows={3}
                        {...form.getInputProps('description')}
                    />

                    <Switch
                        label="활성화"
                        description="메뉴를 사용자에게 표시할지 설정합니다"
                        {...form.getInputProps('isActive', { type: 'checkbox' })}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" onClick={close}>
                            취소
                        </Button>
                        <Button
                            onClick={() => form.onSubmit(handleSubmit)()}
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingItem ? '수정' : '추가'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Box>
    );
};

export default NavigationManagement;