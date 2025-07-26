import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useDisclosure} from "@mantine/hooks";
import {useCallback, useMemo, useState} from "react";
import {
    useCreateNavigation,
    useDeleteNavigation, useNavigationTree,
    useToggleNavigationStatus, useUpdateNavigation,
    useUpdateNavigationOrder
} from "@/hooks/api/useApi.js";
import {modals} from "@mantine/modals";
import {Alert, Box, Button, Group, Stack, Text} from "@mantine/core";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";
import {IconAlertCircle, IconPlus} from "@tabler/icons-react";
import NavigationItem from "@/components/admin/navigation/NavigationItem.jsx";
import EmptyState from "@/components/admin/navigation/EmptyState.jsx";
import NavigationForm from "@/components/admin/navigation/NavigationForm.jsx";

const NavigationManagement = () => {
    const { velogColors } = useTheme();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedItems, setExpandedItems] = useState(new Set([2, 3]));

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

    const isFormLoading = useMemo(() =>
            createMutation.isPending || updateMutation.isPending,
        [createMutation.isPending, updateMutation.isPending]
    );

    const styles = useMemo(() => ({
        headerTitle: {
            color: velogColors.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.02em'
        },
        headerDescription: {
            color: velogColors.subText
        },
        addButton: {
            backgroundColor: velogColors.primary,
            border: 'none',
            fontWeight: 500,
        },
        alertRoot: {
            backgroundColor: `${velogColors.error}10`,
            border: `1px solid ${velogColors.error}30`,
        },
        alertMessage: {
            color: velogColors.text,
        }
    }), [velogColors]);

    const handleOpenModal = useCallback((item = null) => {
        setEditingItem(item);
        open();
    }, [open]);

    const handleCloseModal = useCallback(() => {
        setEditingItem(null);
        close();
    }, [close]);

    const handleSubmit = useCallback((values) => {
        const data = {
            ...values,
            parentId: values.parentId ? parseInt(values.parentId, 10) : null,
        };

        if (editingItem) {
            updateMutation.mutate(
                { id: editingItem.id, data },
                { onSuccess: handleCloseModal }
            );
        } else {
            createMutation.mutate(data, { onSuccess: handleCloseModal });
        }
    }, [editingItem, updateMutation, createMutation, handleCloseModal]);

    // const handleDelete = useCallback((id) => {
    //     if (window.confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
    //         deleteMutation.mutate(id);
    //     }
    // }, [deleteMutation]);

    const handleDelete = useCallback( (id) => modals.openConfirmModal({
        title: '확인 요청',
        children: (
            <Text size="sm">
                정말로 이 메뉴를 삭제하시겠습니까?
            </Text>
        ),
        labels: { confirm: '삭제', cancel: '취소' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => deleteMutation.mutate(id),
    }), [deleteMutation]);

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

        // parentId별로 그룹화하여 같은 부모를 가진 형제 요소들끼리 묶기
        const groupedByParent = items.reduce((acc, item) => {
            const parentId = item.parentId || null; // null 또는 undefined를 null로 통일
            if (!acc[parentId]) {
                acc[parentId] = [];
            }
            acc[parentId].push(item);
            return acc;
        }, {});

        // 각 그룹(형제 요소들) 내에서 순서대로 sortOrder 부여
        const orderData = [];
        Object.values(groupedByParent).forEach(siblings => {
            siblings.forEach((item, index) => {
                orderData.push({
                    id: item.id,
                    sortOrder: index + 1, // 1부터 시작
                    parentId: item.parentId
                });
            });
        });
        updateOrderMutation.mutate(orderData);
    }, [flatNavigations, updateOrderMutation]);

    const handleAddButtonHover = useCallback((e, isEntering) => {
        e.currentTarget.style.backgroundColor = isEntering
            ? '#0CA678'
            : velogColors.primary;
    }, [velogColors.primary]);

    if (isLoading) {
        return (
            <Box style={{ color: velogColors.text }} role="status" aria-live="polite">
                <Text>네비게이션 데이터를 불러오는 중...</Text>
            </Box>
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
                네비게이션 데이터를 불러오는데 실패했습니다.
            </Alert>
        );
    }

    return (
        <Box role="main" aria-labelledby="navigation-management-title">
            <Group justify="space-between" mb="xl">
                <Stack gap="xs">
                    <Text
                        id="navigation-management-title"
                        size="xl"
                        fw={700}
                        style={styles.headerTitle}
                    >
                        네비게이션 관리
                    </Text>
                    <Text
                        size="sm"
                        style={styles.headerDescription}
                    >
                        드래그 앤 드롭으로 메뉴 순서를 변경할 수 있습니다
                    </Text>
                </Stack>

                <Button
                    leftSection={<IconPlus size={18} aria-hidden="true" />}
                    onClick={() => handleOpenModal()}
                    size="md"
                    radius="md"
                    style={styles.addButton}
                    onMouseEnter={(e) => handleAddButtonHover(e, true)}
                    onMouseLeave={(e) => handleAddButtonHover(e, false)}
                    aria-label="새 네비게이션 메뉴 추가"
                >
                    새 메뉴 추가
                </Button>
            </Group>

            {flatNavigations.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="navigation-list">
                        {(provided) => (
                            <Box
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                role="list"
                                aria-label="네비게이션 메뉴 목록"
                            >
                                {flatNavigations.map((item, index) => (
                                    <NavigationItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isExpanded={expandedItems.has(item.id)}
                                        onToggleExpand={handleToggleExpand}
                                        onToggleStatus={handleToggleStatus}
                                        onEdit={handleOpenModal}
                                        onDelete={handleDelete}
                                    />
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <EmptyState />
            )}

            <NavigationForm
                opened={opened}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                editingItem={editingItem}
                parentOptions={parentOptions}
                isLoading={isFormLoading}
            />
        </Box>
    );
};

export default NavigationManagement;