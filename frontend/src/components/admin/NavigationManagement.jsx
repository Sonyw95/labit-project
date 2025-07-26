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
    rem,
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
    useNavigationTree,
    useToggleNavigationStatus,
    useUpdateNavigation,
    useUpdateNavigationOrder
} from "../../hooks/api/useApi.js";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import {Icons} from "@/utils/Icons.jsx";

const NavigationManagement = () => {
    const { dark } = useTheme();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedItems, setExpandedItems] = useState(new Set());

    // velog 스타일 색상 팔레트
    const velogColors = useMemo(() => ({
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
        success: '#12B886',
        error: '#FA5252',
        warning: '#FD7E14',
        cardBg: dark ? '#242529' : '#FFFFFF',
    }), [dark]);

    // API hooks (기존 유지)
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

    // 평면 구조로 변환 (DnD용) - 메모이제이션
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
    }, [navigations, expandedItems]);

    // 부모 메뉴 옵션 생성 - 메모이제이션
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

    // 로딩 및 변형 상태 - 메모이제이션
    const isFormLoading = useMemo(() =>
            createMutation.isPending || updateMutation.isPending,
        [createMutation.isPending, updateMutation.isPending]
    );

    // 이벤트 핸들러들 - useCallback으로 리렌더링 방지
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
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.index === destination.index) return;

        const items = Array.from(flatNavigations);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        const orderData = items.map((item, index) => ({
            id: item.id,
            sortOrder: index,
            parentId: item.parentId
        }));

        updateOrderMutation.mutate(orderData);
    }, [flatNavigations, updateOrderMutation]);

    // 네비게이션 아이템 컴포넌트 - 메모이제이션
    const NavigationItem = useCallback(({ item, index }) => {
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
                        <Box
                            p="md"
                            mb="sm"
                            style={{
                                backgroundColor: snapshot.isDragging
                                    ? `${velogColors.primary}15`
                                    : velogColors.cardBg,
                                border: `1px solid ${snapshot.isDragging
                                    ? velogColors.primary
                                    : velogColors.border}`,
                                borderRadius: rem(8),
                                opacity: item.isActive ? 1 : 0.6,
                                transition: 'all 0.2s ease',
                                boxShadow: snapshot.isDragging
                                    ? `0 4px 12px ${velogColors.primary}30`
                                    : dark
                                        ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Group justify="space-between">
                                <Group gap="sm">
                                    {/* 드래그 핸들 */}
                                    <Box {...provided.dragHandleProps}>
                                        <IconGripVertical
                                            size={18}
                                            style={{
                                                cursor: 'grab',
                                                color: velogColors.subText
                                            }}
                                        />
                                    </Box>

                                    {/* 펼치기/접기 버튼 */}
                                    {hasChildren && (
                                        <ActionIcon
                                            variant="subtle"
                                            size="sm"
                                            onClick={() => handleToggleExpand(item.id)}
                                            style={{
                                                color: velogColors.subText,
                                                backgroundColor: 'transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = velogColors.hover;
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

                                    {/* 메뉴 정보 */}
                                    <Group gap="xs">
                                        {item.icon && (
                                            <Icons icon={item.icon} size={16} />
                                            // <Text
                                            //     size="sm"
                                            //     style={{ color: velogColors.subText }}
                                            // >
                                            //     {item.icon}
                                            // </Text>
                                        )}
                                        <Text
                                            fw={500}
                                            style={{ color: velogColors.text }}
                                        >
                                            {item.label}
                                        </Text>
                                        {item.href && (
                                            <Badge
                                                variant="light"
                                                size="xs"
                                                leftSection={<IconLink size={10} />}
                                                style={{
                                                    backgroundColor: `${velogColors.primary}15`,
                                                    color: velogColors.primary,
                                                    border: `1px solid ${velogColors.primary}30`,
                                                }}
                                            >
                                                {item.href}
                                            </Badge>
                                        )}
                                    </Group>
                                </Group>

                                {/* 액션 버튼들 */}
                                <Group gap="xs">
                                    <Tooltip label={item.isActive ? '활성화됨' : '비활성화됨'}>
                                        <ActionIcon
                                            variant="subtle"
                                            size="sm"
                                            color={item.isActive ? velogColors.success : velogColors.error}
                                            onClick={() => handleToggleStatus(item.id)}
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = velogColors.hover;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
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
                                            onClick={() => handleOpenModal(item)}
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
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label="삭제">
                                        <ActionIcon
                                            variant="subtle"
                                            size="sm"
                                            color={velogColors.error}
                                            onClick={() => handleDelete(item.id)}
                                            style={{
                                                backgroundColor: 'transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = `${velogColors.error}15`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>

                            {/* 설명 */}
                            {item.description && (
                                <Text
                                    size="xs"
                                    mt="xs"
                                    style={{
                                        color: velogColors.subText,
                                        paddingLeft: rem(42) // 아이콘들과 정렬
                                    }}
                                >
                                    {item.description}
                                </Text>
                            )}
                        </Box>
                    </Box>
                )}
            </Draggable>
        );
    }, [expandedItems, handleToggleExpand, handleToggleStatus, handleOpenModal, handleDelete, velogColors, dark]);

    // 빈 상태 컴포넌트
    const EmptyState = useMemo(() => (
        <Box
            p="3rem"
            style={{
                backgroundColor: velogColors.cardBg,
                border: `1px solid ${velogColors.border}`,
                borderRadius: rem(12),
                textAlign: 'center',
            }}
        >
            <IconFolder
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
                등록된 네비게이션 메뉴가 없습니다
            </Text>
            <Text
                size="sm"
                mt="xs"
                style={{ color: velogColors.subText }}
            >
                새 메뉴를 추가해보세요
            </Text>
        </Box>
    ), [velogColors]);

    // 로딩 상태
    if (isLoading) {
        return (
            <Box style={{ color: velogColors.text }}>
                <Text>네비게이션 데이터를 불러오는 중...</Text>
            </Box>
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
                네비게이션 데이터를 불러오는데 실패했습니다.
            </Alert>
        );
    }

    return (
        <Box
            // style={{ backgroundColor: velogColors.background }}
        >
            {/* velog 스타일 헤더 */}
            <Group justify="space-between" mb="xl">
                <Stack gap="xs">
                    <Text
                        size="xl"
                        fw={700}
                        style={{
                            color: velogColors.text,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        네비게이션 관리
                    </Text>
                    <Text
                        size="sm"
                        style={{ color: velogColors.subText }}
                    >
                        드래그 앤 드롭으로 메뉴 순서를 변경할 수 있습니다
                    </Text>
                </Stack>

                <Button
                    leftSection={<IconPlus size={18} />}
                    onClick={() => handleOpenModal()}
                    size="md"
                    radius="md"
                    style={{
                        backgroundColor: velogColors.primary,
                        border: 'none',
                        fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0CA678';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = velogColors.primary;
                    }}
                >
                    새 메뉴 추가
                </Button>
            </Group>

            {/* 드래그 앤 드롭 리스트 */}
            {flatNavigations.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="navigation-list">
                        {(provided) => (
                            <Box {...provided.droppableProps} ref={provided.innerRef}>
                                {flatNavigations.map((item, index) => (
                                    <NavigationItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                    />
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                EmptyState
            )}

            {/* velog 스타일 모달 */}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Text
                        fw={600}
                        size="lg"
                        style={{ color: velogColors.text }}
                    >
                        {editingItem ? '메뉴 수정' : '새 메뉴 추가'}
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
                        label="메뉴 이름"
                        placeholder="메뉴 이름을 입력하세요"
                        required
                        {...form.getInputProps('label')}
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

                    <TextInput
                        label="링크 URL"
                        placeholder="/path/to/page"
                        {...form.getInputProps('href')}
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
                        label="부모 메뉴"
                        placeholder="부모 메뉴를 선택하세요"
                        data={parentOptions}
                        clearable
                        {...form.getInputProps('parentId')}
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

                    <TextInput
                        label="아이콘"
                        placeholder="아이콘 클래스 또는 문자"
                        {...form.getInputProps('icon')}
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
                        placeholder="메뉴에 대한 설명을 입력하세요"
                        rows={3}
                        {...form.getInputProps('description')}
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

                    <Switch
                        label="활성화"
                        description="메뉴를 사용자에게 표시할지 설정합니다"
                        {...form.getInputProps('isActive', { type: 'checkbox' })}
                        styles={{
                            label: { color: velogColors.text, fontWeight: 500 },
                            description: { color: velogColors.subText },
                            track: {
                                backgroundColor: form.values.isActive
                                    ? velogColors.primary
                                    : velogColors.border,
                            }
                        }}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="subtle"
                            onClick={close}
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
                            취소
                        </Button>
                        <Button
                            onClick={() => form.onSubmit(handleSubmit)()}
                            loading={isFormLoading}
                            style={{
                                backgroundColor: velogColors.primary,
                                border: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#0CA678';
                            }}
                            onMouseLeave={(e) => {
                                if (!isFormLoading) {
                                    e.currentTarget.style.backgroundColor = velogColors.primary;
                                }
                            }}
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