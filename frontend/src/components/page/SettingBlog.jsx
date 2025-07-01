import React, { useState, useRef } from 'react';
import {
    Container,
    Title,
    Text,
    Card,
    Stack,
    Group,
    Switch,
    Select,
    TextInput,
    Textarea,
    Button,
    Badge,
    ActionIcon,
    Box,
    Flex,
    Divider,
    ColorInput,
    NumberInput,
    Tabs,
    Paper,
    ScrollArea,
    ThemeIcon,
    Avatar,
    UnstyledButton,
    Modal,
    rem,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import {
    IconSettings,
    IconPalette,
    IconUser,
    IconBell,
    IconShield,
    IconNavigation,
    IconGripVertical,
    IconEye,
    IconEyeOff,
    IconPlus,
    IconTrash,
    IconEdit,
    IconHome,
    IconArticle,
    IconTags,
    IconTrendingUp,
    IconBookmark,
    IconCode,
    IconMenu2, IconDisc,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

const SettingBlog = () => {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const dark = colorScheme === 'dark';

    // Navigation Management State
    const [navigationItems, setNavigationItems] = useState([
        {
            id: '1',
            icon: IconHome,
            label: '홈',
            href: '/',
            active: true,
            visible: true,
            badge: null,
            order: 1
        },
        {
            id: '2',
            icon: IconArticle,
            label: '게시글',
            href: '/posts',
            active: false,
            visible: true,
            badge: '42',
            order: 2
        },
        {
            id: '3',
            icon: IconTags,
            label: '태그',
            href: '/tags',
            active: false,
            visible: true,
            badge: null,
            order: 3
        },
        {
            id: '4',
            icon: IconTrendingUp,
            label: '인기글',
            href: '/trending',
            active: false,
            visible: true,
            badge: null,
            order: 4
        },
        {
            id: '5',
            icon: IconBookmark,
            label: '북마크',
            href: '/bookmarks',
            active: false,
            visible: true,
            badge: null,
            order: 5
        },
        {
            id: '6',
            icon: IconUser,
            label: '소개',
            href: '/about',
            active: false,
            visible: true,
            badge: null,
            order: 6
        },
    ]);

    const [selectedNavItem, setSelectedNavItem] = useState(navigationItems[0]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [isEditingNav, setIsEditingNav] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [opened, { open, close }] = useDisclosure(false);

    // Settings State
    const [settings, setSettings] = useState({
        // Appearance
        primaryColor: '#4c6ef5',
        borderRadius: 'md',
        fontFamily: 'Inter, sans-serif',
        animations: true,
        compactMode: false,

        // Blog
        blogTitle: 'LABit',
        blogDescription: '기술과 성장의 기록',
        authorName: 'LABit',
        postsPerPage: 10,
        showAuthor: true,
        showDate: true,
        showReadTime: true,
        showViewCount: true,

        // Notifications
        emailNotifications: true,
        pushNotifications: false,
        commentNotifications: true,
        newPostNotifications: true,

        // Privacy
        profileVisibility: 'public',
        showEmail: false,
        analyticsEnabled: true,
        cookiesEnabled: true,
    });

    // Icon options for navigation items
    const iconOptions = [
        { value: 'IconHome', label: '홈', icon: IconHome },
        { value: 'IconArticle', label: '게시글', icon: IconArticle },
        { value: 'IconTags', label: '태그', icon: IconTags },
        { value: 'IconTrendingUp', label: '인기글', icon: IconTrendingUp },
        { value: 'IconBookmark', label: '북마크', icon: IconBookmark },
        { value: 'IconUser', label: '사용자', icon: IconUser },
        { value: 'IconCode', label: '코드', icon: IconCode },
        { value: 'IconSettings', label: '설정', icon: IconSettings },
    ];

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetItem) => {
        e.preventDefault();

        if (!draggedItem || draggedItem.id === targetItem.id) {
            return;
        }

        const newItems = [...navigationItems];
        const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
        const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

        // Remove dragged item and insert at target position
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, removed);

        // Update order values
        newItems.forEach((item, index) => {
            item.order = index + 1;
        });

        setNavigationItems(newItems);
        setDraggedItem(null);
    };

    const handleNavItemClick = (item) => {
        setSelectedNavItem(item);
        setEditForm({
            label: item.label,
            href: item.href,
            badge: item.badge || '',
            visible: item.visible,
            icon: item.icon.name || 'IconHome'
        });
    };

    const handleEditNavItem = () => {
        setIsEditingNav(true);
        setEditForm({
            label: selectedNavItem.label,
            href: selectedNavItem.href,
            badge: selectedNavItem.badge || '',
            visible: selectedNavItem.visible,
            icon: selectedNavItem.icon.name || 'IconHome'
        });
        open();
    };

    const handleSaveNavItem = () => {
        const updatedItems = navigationItems.map(item => {
            if (item.id === selectedNavItem.id) {
                return {
                    ...item,
                    label: editForm.label,
                    href: editForm.href,
                    badge: editForm.badge || null,
                    visible: editForm.visible,
                    icon: iconOptions.find(opt => opt.value === editForm.icon)?.icon || IconHome
                };
            }
            return item;
        });

        setNavigationItems(updatedItems);
        setSelectedNavItem(updatedItems.find(item => item.id === selectedNavItem.id));
        setIsEditingNav(false);
        close();
    };

    const handleAddNavItem = () => {
        const newItem = {
            id: Date.now().toString(),
            icon: IconCode,
            label: '새 메뉴',
            href: '/new',
            active: false,
            visible: true,
            badge: null,
            order: navigationItems.length + 1
        };

        setNavigationItems([...navigationItems, newItem]);
        setSelectedNavItem(newItem);
        setEditForm({
            label: newItem.label,
            href: newItem.href,
            badge: '',
            visible: newItem.visible,
            icon: 'IconCode'
        });
        open();
    };

    const handleDeleteNavItem = () => {
        if (navigationItems.length <= 1) {
            return;
        }

        const updatedItems = navigationItems.filter(item => item.id !== selectedNavItem.id);
        setNavigationItems(updatedItems);
        setSelectedNavItem(updatedItems[0]);
        close();
    };

    const NavigationTreeItem = ({ item, isSelected }) => {
        const IconComponent = item.icon;

        return (
            <UnstyledButton
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item)}
                onClick={() => handleNavItemClick(item)}
                style={{
                    width: '100%',
                    padding: rem(12),
                    borderRadius: rem(8),
                    background: isSelected
                        ? (dark ? '#1a1a1a' : '#f3f4f6')
                        : 'transparent',
                    border: `1px solid ${isSelected
                        ? (dark ? '#2a2a2a' : '#e2e8f0')
                        : 'transparent'}`,
                    cursor: 'grab',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: dark ? '#1a1a1a' : '#f8fafc',
                        transform: 'translateX(4px)',
                    },
                    '&:active': {
                        cursor: 'grabbing',
                    }
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm">
                        <IconGripVertical
                            size={16}
                            style={{ color: dark ? '#666666' : '#94a3b8' }}
                        />
                        <ThemeIcon
                            size="sm"
                            radius="md"
                            variant={isSelected ? 'filled' : 'light'}
                            style={{
                                background: isSelected
                                    ? '#4c6ef5'
                                    : (dark ? '#2a2a2a' : '#f1f5f9'),
                                color: isSelected
                                    ? '#ffffff'
                                    : (dark ? '#ffffff' : '#64748b'),
                            }}
                        >
                            <IconComponent size={16} />
                        </ThemeIcon>
                        <Text
                            size="sm"
                            fw={isSelected ? 600 : 500}
                            style={{ color: dark ? '#ffffff' : '#1e293b' }}
                        >
                            {item.label}
                        </Text>
                    </Group>

                    <Group gap="xs">
                        {item.badge && (
                            <Badge size="xs" color="red">
                                {item.badge}
                            </Badge>
                        )}
                        {item.visible ? (
                            <IconEye size={14} style={{ color: dark ? '#10b981' : '#059669' }} />
                        ) : (
                            <IconEyeOff size={14} style={{ color: dark ? '#666666' : '#94a3b8' }} />
                        )}
                    </Group>
                </Group>
            </UnstyledButton>
        );
    };

    const NavigationEditor = () => {
        const IconComponent = selectedNavItem.icon;

        return (
            <Card
                radius="xl"
                style={{
                    background: dark
                        ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                    height: '100%',
                }}
            >
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between" align="center">
                        <Group gap="sm">
                            <ThemeIcon
                                size="lg"
                                radius="md"
                                style={{
                                    background: '#4c6ef5',
                                    color: 'white',
                                }}
                            >
                                <IconComponent size={20} />
                            </ThemeIcon>
                            <Box>
                                <Text fw={600} style={{ color: dark ? '#ffffff' : '#1e293b' }}>
                                    {selectedNavItem.label}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    메뉴 아이템 정보
                                </Text>
                            </Box>
                        </Group>

                        <Group gap="xs">
                            <ActionIcon
                                variant="light"
                                size="lg"
                                radius="md"
                                onClick={handleEditNavItem}
                                style={{
                                    background: dark ? '#1a1a1a' : '#f1f5f9',
                                    color: dark ? '#ffffff' : '#64748b',
                                }}
                            >
                                <IconEdit size={18} />
                            </ActionIcon>
                            <ActionIcon
                                variant="light"
                                size="lg"
                                radius="md"
                                color="red"
                                onClick={() => {
                                    if (navigationItems.length > 1) {
                                        handleDeleteNavItem();
                                    }
                                }}
                                disabled={navigationItems.length <= 1}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group>
                    </Group>

                    <Divider style={{ borderColor: dark ? '#2a2a2a' : '#e2e8f0' }} />

                    {/* Item Details */}
                    <Stack gap="md">
                        <Box>
                            <Text size="sm" fw={600} mb="xs" style={{ color: dark ? '#ffffff' : '#1e293b' }}>
                                기본 정보
                            </Text>
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">라벨</Text>
                                    <Text size="sm" fw={500}>{selectedNavItem.label}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">경로</Text>
                                    <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                                        {selectedNavItem.href}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">순서</Text>
                                    <Badge size="sm" variant="light">
                                        {selectedNavItem.order}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Box>

                        <Box>
                            <Text size="sm" fw={600} mb="xs" style={{ color: dark ? '#ffffff' : '#1e293b' }}>
                                상태
                            </Text>
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">표시 상태</Text>
                                    <Badge
                                        size="sm"
                                        color={selectedNavItem.visible ? 'green' : 'gray'}
                                    >
                                        {selectedNavItem.visible ? '표시' : '숨김'}
                                    </Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">활성 상태</Text>
                                    <Badge
                                        size="sm"
                                        color={selectedNavItem.active ? 'blue' : 'gray'}
                                    >
                                        {selectedNavItem.active ? '활성' : '비활성'}
                                    </Badge>
                                </Group>
                                {selectedNavItem.badge && (
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">배지</Text>
                                        <Badge size="sm" color="red">
                                            {selectedNavItem.badge}
                                        </Badge>
                                    </Group>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Stack>
            </Card>
        );
    };

    return (
        <Container size="xl" py="xl">
            {/* Header */}
            <Box mb="xl">
                <Group gap="xs" mb="xs">
                    <IconSettings
                        size={24}
                        color={dark ? '#60a5fa' : '#3b82f6'}
                    />
                    <Title
                        order={1}
                        style={{
                            background: dark
                                ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 800,
                            fontSize: rem(32),
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Blog Settings
                    </Title>
                </Group>
                <Text
                    size="lg"
                    c={dark ? 'gray.4' : 'gray.6'}
                    style={{ maxWidth: '600px' }}
                >
                    블로그의 모든 설정을 관리하고 커스터마이징하세요
                </Text>
            </Box>

            {/* Settings Tabs */}
            <Tabs
                defaultValue="navigation"
                radius="xl"
                style={{
                    '& .mantine-Tabs-tab': {
                        borderRadius: rem(12),
                        padding: `${rem(12)} ${rem(20)}`,
                        transition: 'all 0.3s ease',
                    }
                }}
            >
                <Tabs.List
                    style={{
                        background: dark ? '#1a1a1a' : '#f8fafc',
                        borderRadius: rem(16),
                        padding: rem(4),
                        border: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                    }}
                >
                    <Tabs.Tab
                        value="navigation"
                        leftSection={<IconNavigation size={16} />}
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                        }}
                    >
                        내비게이션
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="appearance"
                        leftSection={<IconPalette size={16} />}
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                        }}
                    >
                        디자인
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="blog"
                        leftSection={<IconArticle size={16} />}
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                        }}
                    >
                        블로그
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="notifications"
                        leftSection={<IconBell size={16} />}
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                        }}
                    >
                        알림
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="privacy"
                        leftSection={<IconShield size={16} />}
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                            fontWeight: 600,
                        }}
                    >
                        개인정보
                    </Tabs.Tab>
                </Tabs.List>

                {/* Navigation Management Tab */}
                <Tabs.Panel value="navigation" pt="xl">
                    <Group align="flex-start" gap="xl" wrap="nowrap">
                        {/* Left: Navigation Tree */}
                        <Box style={{ flex: '0 0 350px' }}>
                            <Card
                                radius="xl"
                                style={{
                                    background: dark
                                        ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
                                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                    border: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                                    height: '600px',
                                }}
                            >
                                <Stack gap="md" style={{ height: '100%' }}>
                                    <Group justify="space-between" align="center">
                                        <Group gap="sm">
                                            <IconMenu2 size={20} color={dark ? '#ffffff' : '#1e293b'} />
                                            <Text fw={600} style={{ color: dark ? '#ffffff' : '#1e293b' }}>
                                                내비게이션 메뉴
                                            </Text>
                                        </Group>
                                        <ActionIcon
                                            variant="light"
                                            size="sm"
                                            radius="md"
                                            onClick={handleAddNavItem}
                                            style={{
                                                background: dark ? '#1a1a1a' : '#f1f5f9',
                                                color: dark ? '#ffffff' : '#64748b',
                                            }}
                                        >
                                            <IconPlus size={14} />
                                        </ActionIcon>
                                    </Group>

                                    <Text size="xs" c="dimmed" mb="md">
                                        드래그하여 순서를 변경하세요
                                    </Text>

                                    <ScrollArea style={{ flex: 1 }}>
                                        <Stack gap="xs">
                                            {navigationItems
                                                .sort((a, b) => a.order - b.order)
                                                .map((item) => (
                                                    <NavigationTreeItem
                                                        key={item.id}
                                                        item={item}
                                                        isSelected={selectedNavItem?.id === item.id}
                                                    />
                                                ))}
                                        </Stack>
                                    </ScrollArea>
                                </Stack>
                            </Card>
                        </Box>

                        {/* Right: Navigation Editor */}
                        <Box style={{ flex: 1 }}>
                            <NavigationEditor />
                        </Box>
                    </Group>
                </Tabs.Panel>

                {/* Appearance Tab */}
                <Tabs.Panel value="appearance" pt="xl">
                    <Stack gap="lg">
                        <Card radius="xl" p="lg">
                            <Stack gap="md">
                                <Text fw={600} size="lg">테마 설정</Text>

                                <Group grow>
                                    <ColorInput
                                        label="주요 색상"
                                        value={settings.primaryColor}
                                        onChange={(value) => setSettings(prev => ({ ...prev, primaryColor: value }))}
                                    />
                                    <Select
                                        label="모서리 둥글기"
                                        value={settings.borderRadius}
                                        onChange={(value) => setSettings(prev => ({ ...prev, borderRadius: value }))}
                                        data={[
                                            { value: 'xs', label: '매우 작음' },
                                            { value: 'sm', label: '작음' },
                                            { value: 'md', label: '보통' },
                                            { value: 'lg', label: '큼' },
                                            { value: 'xl', label: '매우 큼' },
                                        ]}
                                    />
                                </Group>

                                <Select
                                    label="폰트 패밀리"
                                    value={settings.fontFamily}
                                    onChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}
                                    data={[
                                        { value: 'Inter, sans-serif', label: 'Inter' },
                                        { value: 'system-ui, sans-serif', label: '시스템 기본' },
                                        { value: '"Noto Sans KR", sans-serif', label: 'Noto Sans KR' },
                                        { value: 'monospace', label: '모노스페이스' },
                                    ]}
                                />

                                <Group justify="space-between">
                                    <Text>애니메이션</Text>
                                    <Switch
                                        checked={settings.animations}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            animations: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>컴팩트 모드</Text>
                                    <Switch
                                        checked={settings.compactMode}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            compactMode: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>
                            </Stack>
                        </Card>
                    </Stack>
                </Tabs.Panel>

                {/* Blog Tab */}
                <Tabs.Panel value="blog" pt="xl">
                    <Stack gap="lg">
                        <Card radius="xl" p="lg">
                            <Stack gap="md">
                                <Text fw={600} size="lg">블로그 기본 정보</Text>

                                <Group grow>
                                    <TextInput
                                        label="블로그 제목"
                                        value={settings.blogTitle}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            blogTitle: event.currentTarget.value
                                        }))}
                                    />
                                    <TextInput
                                        label="작성자 이름"
                                        value={settings.authorName}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            authorName: event.currentTarget.value
                                        }))}
                                    />
                                </Group>

                                <Textarea
                                    label="블로그 설명"
                                    value={settings.blogDescription}
                                    onChange={(event) => setSettings(prev => ({
                                        ...prev,
                                        blogDescription: event.currentTarget.value
                                    }))}
                                />

                                <NumberInput
                                    label="페이지당 포스트 수"
                                    value={settings.postsPerPage}
                                    onChange={(value) => setSettings(prev => ({
                                        ...prev,
                                        postsPerPage: value
                                    }))}
                                    min={1}
                                    max={50}
                                />
                            </Stack>
                        </Card>

                        <Card radius="xl" p="lg">
                            <Stack gap="md">
                                <Text fw={600} size="lg">포스트 표시 설정</Text>

                                <Group justify="space-between">
                                    <Text>작성자 표시</Text>
                                    <Switch
                                        checked={settings.showAuthor}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            showAuthor: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>작성일 표시</Text>
                                    <Switch
                                        checked={settings.showDate}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            showDate: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>읽기 시간 표시</Text>
                                    <Switch
                                        checked={settings.showReadTime}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            showReadTime: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>조회수 표시</Text>
                                    <Switch
                                        checked={settings.showViewCount}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            showViewCount: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>
                            </Stack>
                        </Card>
                    </Stack>
                </Tabs.Panel>

                {/* Notifications Tab */}
                <Tabs.Panel value="notifications" pt="xl">
                    <Card radius="xl" p="lg">
                        <Stack gap="md">
                            <Text fw={600} size="lg">알림 설정</Text>

                            <Group justify="space-between">
                                <Text>이메일 알림</Text>
                                <Switch
                                    checked={settings.emailNotifications}
                                    onChange={(event) => setSettings(prev => ({
                                        ...prev,
                                        emailNotifications: event.currentTarget.checked
                                    }))}
                                />
                            </Group>

                            <Group justify="space-between">
                                <Text>푸시 알림</Text>
                                <Switch
                                    checked={settings.pushNotifications}
                                    onChange={(event) => setSettings(prev => ({
                                        ...prev,
                                        pushNotifications: event.currentTarget.checked
                                    }))}
                                />
                            </Group>

                            <Group justify="space-between">
                                <Text>댓글 알림</Text>
                                <Switch
                                    checked={settings.commentNotifications}
                                    onChange={(event) => setSettings(prev => ({
                                        ...prev,
                                        commentNotifications: event.currentTarget.checked
                                    }))}
                                />
                            </Group>

                            <Group justify="space-between">
                                <Text>새 포스트 알림</Text>
                                <Switch
                                    checked={settings.newPostNotifications}
                                    onChange={(event) => setSettings(prev => ({
                                        ...prev,
                                        newPostNotifications: event.currentTarget.checked
                                    }))}
                                />
                            </Group>
                        </Stack>
                    </Card>
                </Tabs.Panel>

                {/* Privacy Tab */}
                <Tabs.Panel value="privacy" pt="xl">
                    <Stack gap="lg">
                        <Card radius="xl" p="lg">
                            <Stack gap="md">
                                <Text fw={600} size="lg">개인정보 설정</Text>

                                <Select
                                    label="프로필 공개 범위"
                                    value={settings.profileVisibility}
                                    onChange={(value) => setSettings(prev => ({
                                        ...prev,
                                        profileVisibility: value
                                    }))}
                                    data={[
                                        { value: 'public', label: '전체 공개' },
                                        { value: 'registered', label: '회원에게만' },
                                        { value: 'private', label: '비공개' },
                                    ]}
                                />

                                <Group justify="space-between">
                                    <Text>이메일 주소 공개</Text>
                                    <Switch
                                        checked={settings.showEmail}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            showEmail: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>구글 애널리틱스</Text>
                                    <Switch
                                        checked={settings.analyticsEnabled}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            analyticsEnabled: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>

                                <Group justify="space-between">
                                    <Text>쿠키 사용</Text>
                                    <Switch
                                        checked={settings.cookiesEnabled}
                                        onChange={(event) => setSettings(prev => ({
                                            ...prev,
                                            cookiesEnabled: event.currentTarget.checked
                                        }))}
                                    />
                                </Group>
                            </Stack>
                        </Card>
                    </Stack>
                </Tabs.Panel>
            </Tabs>

            {/* Save Button */}
            <Group justify="flex-end" mt="xl">
                <Button
                    size="lg"
                    radius="xl"
                    leftSection={<IconDisc size={18} />}
                    style={{
                        background: dark
                            ? 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        border: 'none',
                        fontWeight: 600,
                        padding: `${rem(12)} ${rem(32)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: dark
                                ? '0 8px 25px rgba(76, 110, 245, 0.3)'
                                : '0 8px 25px rgba(59, 130, 246, 0.3)',
                        }
                    }}
                >
                    설정 저장
                </Button>
            </Group>

            {/* Edit Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap="sm">
                        <IconEdit size={20} />
                        <Text fw={600}>메뉴 아이템 편집</Text>
                    </Group>
                }
                size="md"
                radius="xl"
                styles={{
                    header: {
                        background: dark ? '#0a0a0a' : '#ffffff',
                        borderBottom: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                    },
                    content: {
                        background: dark ? '#0a0a0a' : '#ffffff',
                        border: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                    }
                }}
            >
                <Stack gap="md">
                    <TextInput
                        label="라벨"
                        value={editForm.label || ''}
                        onChange={(event) => setEditForm(prev => ({
                            ...prev,
                            label: event.currentTarget.value
                        }))}
                        placeholder="메뉴 이름을 입력하세요"
                    />

                    <TextInput
                        label="경로"
                        value={editForm.href || ''}
                        onChange={(event) => setEditForm(prev => ({
                            ...prev,
                            href: event.currentTarget.value
                        }))}
                        placeholder="/path"
                    />

                    <Select
                        label="아이콘"
                        value={editForm.icon}
                        onChange={(value) => setEditForm(prev => ({
                            ...prev,
                            icon: value
                        }))}
                        data={iconOptions.map(opt => ({
                            value: opt.value,
                            label: opt.label
                        }))}
                    />

                    <TextInput
                        label="배지 (선택사항)"
                        value={editForm.badge || ''}
                        onChange={(event) => setEditForm(prev => ({
                            ...prev,
                            badge: event.currentTarget.value
                        }))}
                        placeholder="예: 42"
                    />

                    <Group justify="space-between">
                        <Text>메뉴 표시</Text>
                        <Switch
                            checked={editForm.visible}
                            onChange={(event) => setEditForm(prev => ({
                                ...prev,
                                visible: event.currentTarget.checked
                            }))}
                        />
                    </Group>

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={close}>
                            취소
                        </Button>
                        <Button
                            onClick={handleSaveNavItem}
                            leftSection={<IconDisc size={16} />}
                        >
                            저장
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Custom Styles */}
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.05);
                            opacity: 0.8;
                        }
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .mantine-Tabs-tab[data-active] {
                        background: ${dark
                    ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'} !important;
                        border: 1px solid ${dark ? '#3a3a3a' : '#cbd5e1'} !important;
                        color: ${dark ? '#ffffff' : '#1e293b'} !important;
                        box-shadow: ${dark
                    ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                    : '0 4px 15px rgba(0, 0, 0, 0.1)'} !important;
                    }
                    
                    .mantine-Tabs-tab:not([data-active]):hover {
                        background: ${dark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)'} !important;
                        transform: translateY(-1px);
                    }
                    
                    .mantine-Card-root {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    
                    .mantine-Card-root:hover {
                        transform: translateY(-2px);
                        box-shadow: ${dark
                    ? '0 10px 30px rgba(0, 0, 0, 0.4)'
                    : '0 10px 30px rgba(0, 0, 0, 0.15)'} !important;
                    }
                    
                    .mantine-Switch-track[data-checked] {
                        background: linear-gradient(45deg, #4c6ef5, #7c3aed) !important;
                    }
                    
                    .mantine-Button-root:hover {
                        transform: translateY(-1px);
                    }
                `}
            </style>
        </Container>
    );
};

export default SettingBlog;