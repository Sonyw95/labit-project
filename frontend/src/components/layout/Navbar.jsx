// import React, {memo} from 'react';
// import {
//     AppShell,
//     Group,
//     Text,
//     ScrollArea,
//     Badge,
//     ActionIcon,
//     Stack, Box, Alert,
// } from '@mantine/core';
// import {
//     IconAlertCircle,
//     IconBrandGithub,
//     IconBrandLinkedin,
//     IconSettings,
// } from '@tabler/icons-react';
// import Logo from '../common/Logo';
// import {NavLink} from "react-router-dom";
// import TagItem from "@/components/layout/TagItem.jsx";
// import NavigationItem from "@/components/layout/NavigationItem.jsx";
// import {useTheme} from "@/hooks/useTheme.js";
// import NavigationSkeleton from "@/components/NavigationSkeleton.jsx";
//
// const Navbar = memo(({  navigationItems, isLoading, error, popularTags }) => {
//         if( isLoading ){
//             return <NavigationSkeleton count={5}/>;
//         }
//         if( error ){
//             return (
//                 <Alert
//                     icon={<IconAlertCircle size={16}/>}
//                     title={'오류'}
//                     color={'red'}
//                     variant={'warning'}
//                 >
//                     네비게이션을 불러오는데 실패했습니다.
//                 </Alert>
//             );
//         }
//
//         // eslint-disable-next-line react-hooks/rules-of-hooks
//         const { dark } = useTheme();
//         return (
//             <>
//                 <AppShell.Section>
//                     <Group mb="md">
//                         <Logo
//                             radius="xl"
//                             size="lg"
//                             style={{
//                                 border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,
//                                 boxShadow: 'none',
//                             }}
//                             isLogo={false}
//                         />
//                         <Box style={{ flex: 1 }}>
//                             <Text size="sm" fw={600}>
//                                 LABit
//                             </Text>
//                             <Text size="xs" c="dimmed">
//                                 Full Stack Developer
//                             </Text>
//                             <Badge
//                                 size="xs"
//                                 style={{
//                                     background: '#10b981',
//                                     color: 'white',
//                                     marginTop: 4,
//                                 }}
//                             >
//                                 4년 9개월차
//                             </Badge>
//                         </Box>
//                     </Group>
//                 </AppShell.Section>
//
//                 <AppShell.Section grow my="md" component={ScrollArea}>
//                     <NavigationItem navigationItems={navigationItems}/>
//                 </AppShell.Section>
//
//                 <AppShell.Section>
//                     <Text size="xs" fw={600} mb="xs" c="dimmed" tt="uppercase">
//                         인기 태그
//                     </Text>
//                     <Stack gap="xs">
//                         {popularTags.map((tag) => (
//                             <TagItem key={tag.name} tag={tag} />
//                         ))}
//                     </Stack>
//                 </AppShell.Section>
//
//                 <AppShell.Section mt="md">
//                     <Group>
//                         <ActionIcon
//                             component="a"
//                             href="https://github.com"
//                             variant="subtle"
//                             size="lg"
//                             radius="md"
//                             style={{
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     background: dark ? '#21262d' : '#f3f4f6',
//                                 }
//                             }}
//                         >
//                             <IconBrandGithub size={18} />
//                         </ActionIcon>
//                         <ActionIcon
//                             component="a"
//                             href="https://linkedin.com"
//                             variant="subtle"
//                             size="lg"
//                             radius="md"
//                             style={{
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     background: dark ? '#21262d' : '#f3f4f6',
//                                 }
//                             }}
//                         >
//                             <IconBrandLinkedin size={18} />
//                         </ActionIcon>
//                         <ActionIcon
//                             component={NavLink}
//                             to='/settings/blog'
//                             variant="subtle"
//                             size="lg"
//                             radius="md"
//                             style={{
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     background: dark ? '#21262d' : '#f3f4f6',
//                                 }
//                             }}
//                         >
//                             <IconSettings size={18} />
//                         </ActionIcon>
//                     </Group>
//                 </AppShell.Section>
//             </>
//         )
//     }
// )
// export default Navbar;

// src/components/Navbar.jsx
import React, { memo, useCallback, useMemo } from 'react';
import {
    Tree,
    Box,
    Text,
    Group,
    ActionIcon,
    Loader,
    Alert,
    ThemeIcon,
    ScrollArea,
    Stack,
    Button,
} from '@mantine/core';
import {
    IconChevronRight,
    IconChevronDown,
    IconFolder,
    IconFolderOpen,
    IconFile,
    IconAlertCircle,
    IconRefresh,
    IconExpandAll,
    IconCollapseAll,
} from '@tabler/icons-react';
import { useNavbar } from '../hooks/useNavigationQueries';
import useNavigationStore from '../stores/navigationStore';

const NavbarItem = memo(({ item, level = 0 }) => {
    const {
        toggleExpanded,
        setSelectedItem,
        isExpanded,
        isSelected,
    } = useNavigationStore();

    const hasChildren = item.children && item.children.length > 0;
    const itemIsExpanded = isExpanded(item.id);
    const itemIsSelected = isSelected(item.id);

    const handleToggleExpand = useCallback(
        (e) => {
            e.stopPropagation();
            if (hasChildren) {
                toggleExpanded(item.id);
            }
        },
        [hasChildren, item.id, toggleExpanded]
    );

    const handleSelect = useCallback(() => {
        setSelectedItem(item.id);
        if (item.url) {
            // 네비게이션 처리 (React Router 등)
            console.log('Navigate to:', item.url);
        }
    }, [item.id, item.url, setSelectedItem]);

    const iconElement = useMemo(() => {
        if (item.icon) {
            // 커스텀 아이콘이 있는 경우
            return (
                <ThemeIcon size="sm" variant="light" color="blue">
                    <span style={{ fontSize: '12px' }}>{item.icon}</span>
                </ThemeIcon>
            );
        }

        // 기본 아이콘
        if (hasChildren) {
            return (
                <ThemeIcon size="sm" variant="light" color="gray">
                    {itemIsExpanded ? (
                        <IconFolderOpen size={14} />
                    ) : (
                        <IconFolder size={14} />
                    )}
                </ThemeIcon>
            );
        }

        return (
            <ThemeIcon size="sm" variant="light" color="gray">
                <IconFile size={14} />
            </ThemeIcon>
        );
    }, [item.icon, hasChildren, itemIsExpanded]);

    return (
        <Box>
            <Group
                gap="xs"
                style={{
                    paddingLeft: level * 20,
                    paddingRight: 8,
                    paddingTop: 6,
                    paddingBottom: 6,
                    cursor: 'pointer',
                    borderRadius: 4,
                    backgroundColor: itemIsSelected ? 'var(--mantine-color-blue-light)' : 'transparent',
                }}
                onClick={handleSelect}
                onMouseEnter={(e) => {
                    if (!itemIsSelected) {
                        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!itemIsSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }
                }}
            >
                {hasChildren && (
                    <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={handleToggleExpand}
                    >
                        {itemIsExpanded ? (
                            <IconChevronDown size={12} />
                        ) : (
                            <IconChevronRight size={12} />
                        )}
                    </ActionIcon>
                )}

                {!hasChildren && <Box w={20} />}

                {iconElement}

                <Text
                    size="sm"
                    fw={itemIsSelected ? 600 : 400}
                    c={itemIsSelected ? 'blue' : 'dark'}
                    truncate
                >
                    {item.name}
                </Text>
            </Group>

            {hasChildren && itemIsExpanded && (
                <Box>
                    {item.children.map((child) => (
                        <NavbarItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
});

NavbarItem.displayName = 'NavbarItem';

const Navbar = memo(() => {
    const {
        data: navigationData,
        isLoading,
        isError,
        error,
        refetch,
    } = useNavbar();

    const { expandAll, collapseAll, expandedItems } = useNavigationStore();

    const handleExpandAll = useCallback(() => {
        expandAll(navigationData);
    }, [expandAll, navigationData]);

    const handleCollapseAll = useCallback(() => {
        collapseAll();
    }, [collapseAll]);

    const hasExpandedItems = expandedItems.size > 0;

    if (isLoading) {
        return (
            <Box p="md" ta="center">
                <Loader size="sm" />
                <Text size="sm" c="dimmed" mt="xs">
                    네비게이션을 로딩 중입니다...
                </Text>
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="오류 발생"
                color="red"
                variant="light"
                m="md"
            >
                <Text size="sm" mb="xs">
                    네비게이션 데이터를 불러오는 중 오류가 발생했습니다.
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                    {error?.message || '알 수 없는 오류'}
                </Text>
                <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconRefresh size={14} />}
                    onClick={() => refetch()}
                >
                    다시 시도
                </Button>
            </Alert>
        );
    }

    if (!navigationData || navigationData.length === 0) {
        return (
            <Box p="md" ta="center">
                <Text size="sm" c="dimmed">
                    표시할 네비게이션이 없습니다.
                </Text>
            </Box>
        );
    }

    return (
        <Stack gap={0}>
            {/* 컨트롤 버튼들 */}
            <Group gap="xs" p="sm" bg="gray.0">
                <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<IconExpandAll size={14} />}
                    onClick={handleExpandAll}
                    disabled={!navigationData || navigationData.length === 0}
                >
                    모두 펼치기
                </Button>
                <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<IconCollapseAll size={14} />}
                    onClick={handleCollapseAll}
                    disabled={!hasExpandedItems}
                >
                    모두 접기
                </Button>
                <ActionIcon
                    size="sm"
                    variant="subtle"
                    onClick={() => refetch()}
                    title="새로고침"
                >
                    <IconRefresh size={14} />
                </ActionIcon>
            </Group>

            {/* 네비게이션 트리 */}
            <ScrollArea h="calc(100vh - 120px)">
                <Box p="xs">
                    {navigationData.map((item) => (
                        <NavbarItem key={item.id} item={item} level={0} />
                    ))}
                </Box>
            </ScrollArea>
        </Stack>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;