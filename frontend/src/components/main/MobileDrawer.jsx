import React, { useState } from 'react';
import {
    Drawer,
    Stack,
    Group,
    Text,
    Box,
    UnstyledButton,
    Avatar,
    Button,
    Divider,
    Switch,
    ScrollArea,
    Collapse,
    rem,
} from '@mantine/core';
import {
    IconHome,
    IconTrendingUp,
    IconClock,
    IconCalendarWeek,
    IconSearch,
    IconEdit,
    IconMoon,
    IconSun,
    IconChevronDown,
    IconServer,
    IconDeviceHeartMonitor,
    IconCoffee,
    IconLeaf,
    IconDatabase,
    IconCircle,
    IconComponents,
    IconBrush,
    IconLayersIntersect,
    IconUser,
    IconLogin
} from '@tabler/icons-react';
import useAuthStore from '../../stores/authStore.js';
import { showToast } from '@/components/advanced/Toast.jsx';
import {useTheme} from "../../contexts/ThemeContext.jsx";

const MobileDrawer = ({ opened, onClose, toggleColorScheme, logo = "/upload/images/logo.png" }) => {
    const { dark } = useTheme();
    const { isAuthenticated, user } = useAuthStore();
    const [openCategories, setOpenCategories] = useState(new Set([2, 3])); // Backend, Frontend 기본 열림

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
    };

    // 카테고리 데이터 (실제로는 props나 store에서 가져올 수 있음)
    const categories = [
        {
            id: 2,
            label: 'Backend',
            icon: IconServer,
            children: [
                { id: 4, label: 'Java', href: '/posts/java', icon: IconCoffee },
                { id: 5, label: 'Spring Boot', href: '/posts/spring-boot', icon: IconLeaf },
                {
                    id: 6,
                    label: 'Database',
                    icon: IconDatabase,
                    children: [
                        {
                            id: 10,
                            label: 'Oracle',
                            href: '/posts/oracle',
                            icon: IconCircle,
                            children: [
                                { id: 12, label: 'Mantine', href: '/posts/mantine', icon: IconComponents },
                                { id: 13, label: 'Tailwind CSS', href: '/posts/tailwind', icon: IconBrush }
                            ]
                        },
                        { id: 11, label: 'JPA/Hibernate', href: '/posts/jpa', icon: IconLayersIntersect }
                    ]
                }
            ]
        },
        {
            id: 3,
            label: 'Frontend',
            icon: IconDeviceHeartMonitor,
            children: [
                { id: 7, label: 'React', href: '/posts/react', icon: IconComponents },
                { id: 8, label: 'JavaScript', href: '/posts/javascript', icon: IconBrush },
                { id: 9, label: 'CSS', href: '/posts/css', icon: IconCircle }
            ]
        }
    ];

    const toggleCategory = (categoryId) => {
        setOpenCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const handleNavigation = (href) => {
        if (href) {
            window.location.href = href;
            onClose();
        }
    };

    const handleMainNavigation = (path) => {
        window.location.href = path;
        onClose();
    };

    const CategoryItem = ({ category, level = 0 }) => {
        const Icon = category.icon;
        const hasChildren = category.children && category.children.length > 0;
        const isClickable = category.href;
        const isOpen = openCategories.has(category.id);

        const handleClick = () => {
            if (hasChildren && !isClickable) {
                toggleCategory(category.id);
            } else if (isClickable) {
                handleNavigation(category.href);
            }
        };

        return (
            <Box>
                <UnstyledButton
                    onClick={handleClick}
                    style={{
                        width: '100%',
                        padding: `${rem(12)} ${rem(16)}`,
                        paddingLeft: rem(16 + level * 20),
                        display: 'flex',
                        alignItems: 'center',
                        gap: rem(12),
                        borderRadius: rem(8),
                        transition: 'all 0.15s ease',
                        backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = velogColors.hover;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <Box style={{ color: level === 0 ? velogColors.primary : velogColors.subText }}>
                        <Icon size={level === 0 ? 20 : 18} />
                    </Box>

                    <Text
                        size={level === 0 ? "md" : "sm"}
                        fw={level === 0 ? 600 : 400}
                        style={{
                            color: velogColors.text,
                            flex: 1
                        }}
                    >
                        {category.label}
                    </Text>

                    {hasChildren && (
                        <Box style={{ color: velogColors.subText }}>
                            <IconChevronDown
                                size={16}
                                style={{
                                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </Box>
                    )}

                    {isClickable && (
                        <Box
                            style={{
                                width: rem(6),
                                height: rem(6),
                                borderRadius: '50%',
                                backgroundColor: velogColors.primary,
                                opacity: 0.7,
                            }}
                        />
                    )}
                </UnstyledButton>

                {hasChildren && (
                    <Collapse in={isOpen} transitionDuration={200}>
                        <Box mt="xs">
                            {category.children.map((child) => (
                                <CategoryItem key={child.id} category={child} level={level + 1} />
                            ))}
                        </Box>
                    </Collapse>
                )}
            </Box>
        );
    };

    const MenuButton = ({ icon: Icon, label, onClick, variant = 'default' }) => (
        <UnstyledButton
            onClick={onClick}
            style={{
                width: '100%',
                padding: `${rem(14)} ${rem(16)}`,
                display: 'flex',
                alignItems: 'center',
                gap: rem(14),
                borderRadius: rem(8),
                backgroundColor: variant === 'primary' ? velogColors.primary : 'transparent',
                color: variant === 'primary' ? 'white' : velogColors.text,
                transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
                if (variant !== 'primary') {
                    e.currentTarget.style.backgroundColor = velogColors.hover;
                }
            }}
            onMouseLeave={(e) => {
                if (variant !== 'primary') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
        >
            <Icon size={20} />
            <Text size="md" fw={variant === 'primary' ? 600 : 500}>
                {label}
            </Text>
        </UnstyledButton>
    );

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="left"
            size="lg"
            styles={{
                content: {
                    backgroundColor: velogColors.background,
                },
                header: {
                    backgroundColor: velogColors.background,
                    borderBottom: `1px solid ${velogColors.border}`,
                    padding: rem(20),
                },
                body: {
                    padding: 0,
                }
            }}
            title={
                <Group gap="sm" align="center">
                    <Avatar
                        src={logo}
                        size="md"
                        radius="lg"
                        style={{
                            backgroundColor: velogColors.primary,
                            border: `1px solid ${velogColors.border}`,
                            transition: 'all 0.2s ease',
                        }}
                    />
                    <Text
                        size="lg"
                        fw={600}
                        style={{
                            color: velogColors.text,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            letterSpacing: '-0.01em'
                        }}
                    >
                        LABit
                    </Text>
                </Group>
            }
        >
            <ScrollArea h="100%" type="never">
                <Stack gap="0" p="md">
                    {/* 사용자 정보 또는 로그인 */}
                    <Box mb="lg">
                        {isAuthenticated ? (
                            <Group
                                p="md"
                                style={{
                                    backgroundColor: velogColors.hover,
                                    borderRadius: rem(12),
                                    border: `1px solid ${velogColors.border}`
                                }}
                            >
                                <Avatar
                                    size="md"
                                    radius="xl"
                                    style={{ backgroundColor: velogColors.primary }}
                                >
                                    <IconUser size={20} />
                                </Avatar>
                                <Box style={{ flex: 1 }}>
                                    <Text size="md" fw={600} c={velogColors.text}>
                                        {user?.username || '사용자'}
                                    </Text>
                                    <Text size="sm" c={velogColors.subText}>
                                        개발자
                                    </Text>
                                </Box>
                            </Group>
                        ) : (
                            <Button
                                variant="outline"
                                size="md"
                                fullWidth
                                leftSection={<IconLogin size={18} />}
                                onClick={() => {
                                    showToast.info('로그인', '로그인 페이지로 이동합니다.');
                                    onClose();
                                }}
                                styles={{
                                    root: {
                                        backgroundColor: velogColors.primary,
                                        borderColor: velogColors.border,
                                        color: velogColors.background,
                                        '&:hover': {
                                            backgroundColor: velogColors.hover,
                                        }
                                    }
                                }}
                            >
                                로그인
                            </Button>
                        )}
                    </Box>

                    {/* 메인 네비게이션 */}
                    <Stack gap="xs" mb="lg">
                        <MenuButton
                            icon={IconHome}
                            label="홈"
                            onClick={() => handleMainNavigation('/')}
                        />
                        <MenuButton
                            icon={IconTrendingUp}
                            label="트렌딩"
                            onClick={() => handleMainNavigation('/trending')}
                        />
                        <MenuButton
                            icon={IconClock}
                            label="최신"
                            onClick={() => handleMainNavigation('/latest')}
                        />
                        <MenuButton
                            icon={IconCalendarWeek}
                            label="이번 주"
                            onClick={() => handleMainNavigation('/week')}
                        />
                        <MenuButton
                            icon={IconSearch}
                            label="검색"
                            onClick={() => {
                                showToast.info('검색', '검색 기능을 준비 중입니다.');
                                onClose();
                            }}
                        />
                    </Stack>

                    <Divider color={velogColors.border} mb="lg" />

                    {/* 카테고리 */}
                    <Box mb="lg">
                        <Text
                            size="sm"
                            fw={600}
                            c={velogColors.subText}
                            mb="md"
                            px="md"
                        >
                            카테고리
                        </Text>
                        <Stack gap="xs">
                            {categories.map((category) => (
                                <CategoryItem key={category.id} category={category} />
                            ))}
                        </Stack>
                    </Box>

                    <Divider color={velogColors.border} mb="lg" />

                    {/* 설정 */}
                    <Box mb="lg">
                        <Group justify="space-between" p="md">
                            <Group gap="md">
                                {dark ? <IconMoon size={20} /> : <IconSun size={20} />}
                                <Text size="md" fw={500} c={velogColors.text}>
                                    다크 모드
                                </Text>
                            </Group>
                            <Switch
                                checked={dark}
                                onChange={toggleColorScheme}
                                size="md"
                                styles={{
                                    track: {
                                        backgroundColor: dark
                                            ? velogColors.primary
                                            : velogColors.border,
                                    }
                                }}
                            />
                        </Group>
                    </Box>

                    {/* 새 글 작성 (로그인한 경우만) */}
                    {isAuthenticated && (
                        <Box mt="auto" pt="lg">
                            <MenuButton
                                icon={IconEdit}
                                label="새 글 작성"
                                variant="primary"
                                onClick={() => {
                                    showToast.info('글 작성', '글 작성 페이지로 이동합니다.');
                                    onClose();
                                }}
                            />
                        </Box>
                    )}
                </Stack>
            </ScrollArea>
        </Drawer>
    );
};

export default MobileDrawer;