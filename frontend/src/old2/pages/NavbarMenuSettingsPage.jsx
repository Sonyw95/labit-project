import React, { useState, useCallback } from 'react';
import {
    Stack,
    Card,
    Title,
    Text,
    Switch,
    Button,
    Group,
    ActionIcon,
    TextInput,
    Select,
    Divider,
    Badge,
    Box,
    Modal,
    ColorInput,
    rem,
} from '@mantine/core';
import {
    IconMenu2,
    IconPlus,
    IconTrash,
    IconEdit,
    IconGripVertical,
    IconHome,
    IconArticle,
    IconTags,
    IconUser,
    IconSettings,
    IconBookmark,
    IconTrendingUp,
} from '@tabler/icons-react';
import {useToggle} from "@/hooks/useToggle.js";
import {useLocalStorage} from "@/hooks/useLocalStorage.js";

const AVAILABLE_ICONS = {
    IconHome: { icon: IconHome, label: '홈' },
    IconArticle: { icon: IconArticle, label: '문서' },
    IconTags: { icon: IconTags, label: '태그' },
    IconUser: { icon: IconUser, label: '사용자' },
    IconSettings: { icon: IconSettings, label: '설정' },
    IconBookmark: { icon: IconBookmark, label: '북마크' },
    IconTrendingUp: { icon: IconTrendingUp, label: '트렌딩' },
};

const NavbarMenuSettings = () => {
    const [menuItems, setMenuItems] = useLocalStorage('navbar-menu-items', [
        { id: '1', icon: 'IconHome', label: '홈', href: '/', active: true, visible: true },
        { id: '2', icon: 'IconArticle', label: '게시글', href: '/posts', badge: '42', visible: true },
        { id: '3', icon: 'IconTags', label: '태그', href: '/tags', visible: true },
        { id: '4', icon: 'IconTrendingUp', label: '인기글', href: '/trending', visible: true },
        { id: '5', icon: 'IconBookmark', label: '북마크', href: '/bookmarks', visible: true },
        { id: '6', icon: 'IconUser', label: '소개', href: '/about', visible: true },
    ]);

    const [isModalOpen, { toggle: toggleModal }] = useToggle(false);
    const [editingItem, setEditingItem] = useState(null);

    // 새 메뉴 아이템 추가/편집
    const [formData, setFormData] = useState({
        icon: 'IconHome',
        label: '',
        href: '',
        badge: '',
        color: '#4c6ef5',
        visible: true,
    });

    const resetForm = useCallback(() => {
        setFormData({
            icon: 'IconHome',
            label: '',
            href: '',
            badge: '',
            color: '#4c6ef5',
            visible: true,
        });
        setEditingItem(null);
    }, []);

    const openModal = useCallback((item = null) => {
        if (item) {
            setFormData({
                icon: item.icon,
                label: item.label,
                href: item.href,
                badge: item.badge || '',
                color: item.color || '#4c6ef5',
                visible: item.visible,
            });
            setEditingItem(item);
        } else {
            resetForm();
        }
        toggleModal();
    }, [resetForm, toggleModal]);

    const closeModal = useCallback(() => {
        toggleModal();
        resetForm();
    }, [toggleModal, resetForm]);

    // 메뉴 아이템 저장
    const saveMenuItem = useCallback(() => {
        if (!formData.label || !formData.href) return;

        if (editingItem) {
            // 편집
            setMenuItems(prev => prev.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData }
                    : item
            ));
        } else {
            // 새로 추가
            const newItem = {
                id: Date.now().toString(),
                ...formData,
            };
            setMenuItems(prev => [...prev, newItem]);
        }

        closeModal();
    }, [formData, editingItem, setMenuItems, closeModal]);

    // 메뉴 아이템 삭제
    const deleteMenuItem = useCallback((id) => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
    }, [setMenuItems]);

    // 메뉴 아이템 표시/숨김 토글
    const toggleMenuItemVisibility = useCallback((id) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id
                ? { ...item, visible: !item.visible }
                : item
        ));
    }, [setMenuItems]);

    // 메뉴 순서 변경 (simplified for demo)
    const moveMenuItem = useCallback((id, direction) => {
        setMenuItems(prev => {
            const items = [...prev];
            const index = items.findIndex(item => item.id === id);
            const newIndex = direction === 'up' ? index - 1 : index + 1;

            if (newIndex >= 0 && newIndex < items.length) {
                [items[index], items[newIndex]] = [items[newIndex], items[index]];
            }

            return items;
        });
    }, [setMenuItems]);

    // 기본값으로 리셋
    const resetToDefaults = useCallback(() => {
        setMenuItems([
            { id: '1', icon: 'IconHome', label: '홈', href: '/', active: true, visible: true },
            { id: '2', icon: 'IconArticle', label: '게시글', href: '/posts', badge: '42', visible: true },
            { id: '3', icon: 'IconTags', label: '태그', href: '/tags', visible: true },
            { id: '4', icon: 'IconTrendingUp', label: '인기글', href: '/trending', visible: true },
            { id: '5', icon: 'IconBookmark', label: '북마크', href: '/bookmarks', visible: true },
            { id: '6', icon: 'IconUser', label: '소개', href: '/about', visible: true },
        ]);
    }, [setMenuItems]);

    return (
        <>
            <Card shadow="sm" radius="lg" padding="lg">
                <Stack gap="md">
                    <Group justify="space-between">
                        <div>
                            <Title order={3} size="h4">
                                <Group gap="xs">
                                    <IconMenu2 size={20} />
                                    네비게이션 메뉴 설정
                                </Group>
                            </Title>
                            <Text size="sm" c="dimmed">
                                사이드바에 표시될 메뉴 항목들을 관리하세요.
                            </Text>
                        </div>
                        <Button leftSection={<IconPlus size={16} />} onClick={() => openModal()}>
                            메뉴 추가
                        </Button>
                    </Group>

                    <Divider />

                    <Stack gap="xs">
                        {menuItems.map((item) => {
                            const IconComponent = AVAILABLE_ICONS[item.icon]?.icon || IconHome;

                            return (
                                <Card key={item.id} padding="sm" radius="md" style={{
                                    backgroundColor: item.visible
                                        ? 'var(--mantine-color-gray-0)'
                                        : 'var(--mantine-color-gray-1)',
                                    opacity: item.visible ? 1 : 0.6,
                                }}>
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <ActionIcon
                                                variant="subtle"
                                                size="sm"
                                                style={{ cursor: 'grab' }}
                                            >
                                                <IconGripVertical size={14} />
                                            </ActionIcon>

                                            <Box style={{
                                                width: rem(32),
                                                height: rem(32),
                                                borderRadius: rem(8),
                                                backgroundColor: item.color || '#4c6ef5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                            }}>
                                                <IconComponent size={16} />
                                            </Box>

                                            <Stack gap={0}>
                                                <Group gap="xs">
                                                    <Text size="sm" fw={500}>{item.label}</Text>
                                                    {item.badge && (
                                                        <Badge size="xs" color="red">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                </Group>
                                                <Text size="xs" c="dimmed">{item.href}</Text>
                                            </Stack>
                                        </Group>

                                        <Group gap="xs">
                                            <Switch
                                                checked={item.visible}
                                                onChange={() => toggleMenuItemVisibility(item.id)}
                                                size="sm"
                                            />
                                            <ActionIcon
                                                variant="subtle"
                                                size="sm"
                                                onClick={() => openModal(item)}
                                            >
                                                <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                size="sm"
                                                onClick={() => deleteMenuItem(item.id)}
                                            >
                                                <IconTrash size={14} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                </Card>
                            );
                        })}
                    </Stack>

                    <Divider />

                    <Group justify="flex-end">
                        <Button variant="light" onClick={resetToDefaults}>
                            기본값으로 리셋
                        </Button>
                    </Group>
                </Stack>
            </Card>

            {/* 메뉴 아이템 추가/편집 모달 */}
            <Modal
                opened={isModalOpen}
                onClose={closeModal}
                title={editingItem ? '메뉴 편집' : '새 메뉴 추가'}
                size="md"
                radius="lg"
            >
                <Stack gap="md">
                    <Select
                        label="아이콘"
                        placeholder="아이콘을 선택하세요"
                        value={formData.icon}
                        onChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                        data={Object.entries(AVAILABLE_ICONS).map(([key, { label }]) => ({
                            value: key,
                            label: label,
                        }))}
                    />

                    <TextInput
                        label="메뉴 이름"
                        placeholder="메뉴 이름을 입력하세요"
                        value={formData.label}
                        onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                        required
                    />

                    <TextInput
                        label="링크 경로"
                        placeholder="/example"
                        value={formData.href}
                        onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                        required
                    />

                    <TextInput
                        label="배지 텍스트 (선택사항)"
                        placeholder="New"
                        value={formData.badge}
                        onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                    />

                    <ColorInput
                        label="아이콘 색상"
                        value={formData.color}
                        onChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                    />

                    <Switch
                        label="메뉴에 표시"
                        checked={formData.visible}
                        onChange={(e) => setFormData(prev => ({ ...prev, visible: e.currentTarget.checked }))}
                    />

                    <Group justify="flex-end" gap="sm">
                        <Button variant="light" onClick={closeModal}>
                            취소
                        </Button>
                        <Button onClick={saveMenuItem}>
                            {editingItem ? '수정' : '추가'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
};

export default NavbarMenuSettings;