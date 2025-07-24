import React, {memo, useState} from "react";
import {
    ActionIcon,
    AppShell,
    Burger,
    Group,
    Text,
    Box,
    Menu,
    Modal,
    ScrollArea,
    UnstyledButton,
    Collapse,
    rem
} from "@mantine/core";
import {
    IconMoon,
    IconSearch,
    IconSun,
    IconEdit,
    IconChevronDown,
    IconServer,
    IconDeviceHeartMonitor,
    IconCoffee,
    IconLeaf,
    IconDatabase,
    IconCircle,
    IconComponents,
    IconBrush,
    IconLayersIntersect
} from "@tabler/icons-react";
import {backgroundBlur} from "@/utils/helpers.jsx";
import {showToast} from "@/components/advanced/Toast.jsx";
import useAuthStore from "../../stores/authStore.js";
import UserMenu from "../common/Auth/UserMenu.jsx";
import UserLogin from "../common/Auth/UserLogin.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {NavLink, useNavigate} from "react-router-dom";

const Header = memo(({
                         isDark, navOpened, setNavOpened, toggleColorScheme
                     }) => {
    const { isAuthenticated } = useAuthStore();
    const [categoryModalOpened, setCategoryModalOpened] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openCategories, setOpenCategories] = useState(new Set([2, 3])); // 기본적으로 1레벨은 열어두기
    const { dark } = useTheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#f8f9fa',
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

    const CategorySection = ({ category, level = 0 }) => {
        const Icon = category.icon;
        const hasChildren = category.children && category.children.length > 0;
        const isClickable = category.href;
        const isOpen = openCategories.has(category.id);
        const navigate = useNavigate();

        const handleItemClick = (e) => {
            e.stopPropagation();
            if (hasChildren && !isClickable) {
                // 하위 카테고리가 있고 링크가 없으면 토글
                toggleCategory(category.id);
            } else if (isClickable) {
                // 링크가 있으면 페이지 이동
                navigate(category.href)
                setCategoryModalOpened(false);
            }
        };

        const handleToggleClick = (e) => {
            e.stopPropagation();
            if (hasChildren) {
                toggleCategory(category.id);
            }
        };

        return (
            <Box mb="xs">
                {/* 카테고리 항목 */}
                <UnstyledButton
                    onClick={handleItemClick}
                    style={{
                        width: '100%',
                        padding: `${rem(10)} ${rem(12)}`,
                        paddingLeft: rem(12 + level * 16),
                        borderRadius: rem(6),
                        display: 'flex',
                        alignItems: 'center',
                        gap: rem(10),
                        transition: 'all 0.15s ease',
                        cursor: (hasChildren || isClickable) ? 'pointer' : 'default',
                        backgroundColor: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = velogColors.hover;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    {/* 아이콘 */}
                    <Box
                        style={{
                            color: level === 0 ? velogColors.primary : velogColors.subText,
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: rem(18),
                        }}
                    >
                        <Icon size={level === 0 ? 18 : 16} />
                    </Box>

                    {/* 라벨 */}
                    <Text
                        size={level === 0 ? "md" : "sm"}
                        fw={level === 0 ? 600 : 400}
                        style={{
                            color: velogColors.text,
                            flex: 1,
                        }}
                    >
                        {category.label}
                    </Text>

                    {/* 하위 카테고리가 있으면 화살표 표시 */}
                    {hasChildren && (
                        <Box
                            onClick={handleToggleClick}
                            style={{
                                padding: rem(4),
                                borderRadius: rem(4),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = velogColors.border;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <IconChevronDown
                                size={14}
                                style={{
                                    color: velogColors.subText,
                                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </Box>
                    )}

                    {/* 클릭 가능한 항목 표시 */}
                    {isClickable && (
                        <Box
                            style={{
                                width: rem(6),
                                height: rem(6),
                                borderRadius: '50%',
                                backgroundColor: velogColors.primary,
                                opacity: 0.6,
                            }}
                        />
                    )}
                </UnstyledButton>

                {/* 하위 카테고리 */}
                {hasChildren && (
                    <Collapse in={isOpen} transitionDuration={200}>
                        <Box mt="xs">
                            {category.children.map((child) => (
                                <CategorySection
                                    key={child.id}
                                    category={child}
                                    level={level + 1}
                                />
                            ))}
                        </Box>
                    </Collapse>
                )}
            </Box>
        );
    };

    const openCategoryModal = (categoryType) => {
        setSelectedCategory(categoryType);
        setCategoryModalOpened(true);
    };

    const CategoryButton = ({ category }) => {
        return (
            <Menu
                position="bottom-start"
                offset={8}
                styles={{
                    dropdown: {
                        backgroundColor: velogColors.background,
                        border: `1px solid ${velogColors.border}`,
                        borderRadius: rem(8),
                        padding: rem(8),
                        minWidth: rem(200),
                        boxShadow: dark
                            ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                            : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }
                }}
            >
                <Menu.Target>
                    <UnstyledButton
                        style={{
                            padding: `${rem(6)} ${rem(10)}`,
                            borderRadius: rem(4),
                            color: velogColors.text,
                            fontSize: rem(14),
                            fontWeight: 400,
                            display: 'flex',
                            alignItems: 'center',
                            gap: rem(4),
                            transition: 'all 0.15s ease',
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = velogColors.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Text
                            size="sm"
                            style={{
                                color: velogColors.text,
                                fontWeight: 400
                            }}
                        >
                            {category.label}
                        </Text>
                        <IconChevronDown
                            size={12}
                            style={{
                                color: velogColors.subText,
                                marginTop: rem(1)
                            }}
                        />
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* 전체 카테고리 보기 */}
                    <Menu.Item
                        onClick={() => openCategoryModal(category.label.toLowerCase())}
                        styles={{
                            item: {
                                padding: `${rem(8)} ${rem(12)}`,
                                borderRadius: rem(4),
                                fontSize: rem(13),
                                fontWeight: 500,
                                color: velogColors.primary,
                                '&:hover': {
                                    backgroundColor: `${velogColors.primary}10`,
                                    color: velogColors.primary,
                                }
                            }
                        }}
                    >
                        전체 {category.label} 보기
                    </Menu.Item>

                    {category.children && category.children.length > 0 && (
                        <>
                            <Menu.Divider
                                style={{
                                    borderColor: velogColors.border,
                                    margin: `${rem(6)} 0`
                                }}
                            />
                            {category.children.slice(0, 5).map((child) => (
                                <Menu.Item
                                    key={child.id}
                                    component={NavLink}
                                    to={ child.href && child.href }
                                    disabled={!child.href}
                                    styles={{
                                        item: {
                                            padding: `${rem(6)} ${rem(12)}`,
                                            borderRadius: rem(4),
                                            fontSize: rem(13),
                                            color: velogColors.text,
                                            cursor: child.href ? 'pointer' : 'default',
                                            opacity: child.href ? 1 : 0.6,
                                            '&:hover': {
                                                backgroundColor: child.href ? velogColors.hover : 'transparent',
                                            }
                                        }
                                    }}
                                >
                                    {child.label}
                                </Menu.Item>
                            ))}
                            {category.children.length > 5 && (
                                <Menu.Item
                                    onClick={() => openCategoryModal(category.label.toLowerCase())}
                                    styles={{
                                        item: {
                                            padding: `${rem(6)} ${rem(12)}`,
                                            borderRadius: rem(4),
                                            fontSize: rem(12),
                                            color: velogColors.subText,
                                            fontStyle: 'italic',
                                            '&:hover': {
                                                backgroundColor: velogColors.hover,
                                                color: velogColors.text,
                                            }
                                        }
                                    }}
                                >
                                    +{category.children.length - 5}개 더 보기
                                </Menu.Item>
                            )}
                        </>
                    )}
                </Menu.Dropdown>
            </Menu>
        );
    };

    return (
        <>
            <AppShell.Header
                // ml={{lg: 'var(--app-shell-navbar-width, 280px)'}}
                style={{
                    borderBottom: `1px solid ${velogColors.border}`,
                    // backgroundColor: velogColors.background,
                    ...backgroundBlur({
                        color: velogColors.background,
                        alpha: 1
                    }),
                    height: '64px', // velog 헤더 높이
                }}>

                <Group h="100%" px="xl" justify="space-between">
                    {/* 좌측: 로고/브랜드 + 카테고리 영역 */}
                    <Group gap="md">
                        <Burger
                            opened={navOpened}
                            onClick={() => setNavOpened(!navOpened)}
                            hiddenFrom="lg"
                            size="sm"
                            color={velogColors.text}
                        />

                        {/* velog 스타일 로고 */}
                        <Box
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                            onClick={() => window.location.href = '/'}
                        >
                            <Text
                                size="1.75rem"
                                fw={800}
                                style={{
                                    color: velogColors.text,
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1,
                                }}
                            >
                                LABit
                            </Text>
                        </Box>

                        {/* 카테고리 네비게이션 - 데스크톱에서만 표시 */}
                        <Group gap="xs" visibleFrom="lg">
                            {categories.map((category) => (
                                <CategoryButton key={category.id} category={category} />
                            ))}
                        </Group>
                    </Group>

                    {/* 우측: 액션 버튼들 */}
                    <Group gap="sm" visibleFrom="lg">
                        {/* 검색 버튼 */}
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="xl"
                            onClick={() => showToast.info('알림', '같은 레벨 내에서만 이동 가능합니다.')}
                            style={{
                                color: velogColors.subText,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: velogColors.hover,
                                    color: velogColors.text,
                                }
                            }}
                        >
                            <IconSearch size={20} />
                        </ActionIcon>

                        {/* 다크모드 토글 - 로그인하지 않은 경우에만 표시 */}
                        {!isAuthenticated && (
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                radius="xl"
                                onClick={toggleColorScheme}
                                style={{
                                    color: velogColors.subText,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: velogColors.hover,
                                        color: velogColors.text,
                                    }
                                }}
                            >
                                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
                            </ActionIcon>
                        )}

                        {/* 로그인된 경우 새 글 작성 버튼 */}
                        {isAuthenticated && (
                            <ActionIcon
                                variant="filled"
                                size="lg"
                                radius="xl"
                                onClick={() => showToast.info('글 작성', '글 작성 페이지로 이동합니다.')}
                                style={{
                                    backgroundColor: velogColors.primary,
                                    color: 'white',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#0CA678',
                                    }
                                }}
                            >
                                <IconEdit size={20} />
                            </ActionIcon>
                        )}

                        {/* 로그인된 경우 다크모드 토글 (UserMenu 앞에) */}
                        {isAuthenticated && (
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                radius="xl"
                                onClick={toggleColorScheme}
                                style={{
                                    color: velogColors.subText,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: velogColors.hover,
                                        color: velogColors.text,
                                    }
                                }}
                            >
                                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
                            </ActionIcon>
                        )}

                        {/* 로그인/사용자 메뉴 */}
                        {isAuthenticated ? <UserMenu/> : <UserLogin/>}
                    </Group>
                </Group>
            </AppShell.Header>

            {/* 카테고리 전체보기 모달 */}
            <Modal
                opened={categoryModalOpened}
                onClose={() => setCategoryModalOpened(false)}
                title={
                    <Text
                        fw={600}
                        size="lg"
                        style={{ color: velogColors.text }}
                    >
                        카테고리
                    </Text>
                }
                size="md"
                padding="xl"
                radius="md"
                styles={{
                    content: {
                        backgroundColor: velogColors.background,
                    },
                    header: {
                        backgroundColor: velogColors.background,
                        borderBottom: `1px solid ${velogColors.border}`,
                        paddingBottom: rem(16),
                    },
                    body: {
                        padding: 0,
                        maxHeight: '60vh',
                    }
                }}
            >
                <ScrollArea h={450} type="scroll" scrollbarSize={6}>
                    <Box p="lg">
                        {categories.map((category) => (
                            <CategorySection key={category.id} category={category} />
                        ))}
                    </Box>
                </ScrollArea>
            </Modal>
        </>
    )
})

export default Header;