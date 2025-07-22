import React, {memo, useEffect} from 'react';
import {
    AppShell,
    Group,
    Text,
    ScrollArea,
    Badge,
    ActionIcon,
    Stack,
    UnstyledButton,
    rem, Box, LoadingOverlay, Alert, Avatar,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconBrandGithub,
} from '@tabler/icons-react';
import {useNavigationTree} from "@/hooks/api/useApi.js";
import useNavigationStore from "@/stores/navigationStore.js";
import {useLocation, useNavigation} from "react-router-dom";
import NavigationItem from "@/components/main/navigation/NavigationItem.jsx";
import Skeleton from "@/components/common/Skeleton.jsx";

const POPULAR_TAGS = [
    { name: 'React', count: 15, color: 'blue' },
    { name: 'Spring Boot', count: 12, color: 'green' },
    { name: 'Java', count: 18, color: 'orange' },
    { name: 'TypeScript', count: 8, color: 'indigo' },
    { name: 'AWS', count: 6, color: 'yellow' },
];

const NavigationMenu = memo(({ isDark, logo }) => {
    return (
        <AppShell.Navbar p="md" style={{
            background: isDark ? '#161b22' : '#ffffff',
            borderRight: `1px solid ${isDark ? '#21262d' : '#e5e7eb'}`,
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            height: '100vh',
            zIndex: 100
        }}>
            <AppShell.Section>
                <UserProfile isDark={ isDark } logo={logo} />
            </AppShell.Section>

            <ScrollArea component={AppShell.Section}  grow my="md" scrollbars="y">
                <NavigationItems isDark={isDark} />
            </ScrollArea>

            {/*<AppShell.Section>*/}
            {/*    <PopularTags isDark={isDark} />*/}
            {/*</AppShell.Section>*/}

            <AppShell.Section mt="md">
                <SocialLinks isDark={isDark} />
            </AppShell.Section>
        </AppShell.Navbar>
    );
});


const UserProfile = ({isDark, logo}) => (
    <Group mb="md">
        <Avatar
            src={logo}
            radius="xl"
            style={{
                border: `3px solid ${isDark ? '#4c6ef5' : '#339af0'}`,
                boxShadow: 'none',
            }}/>
        <div style={{ flex: 1 }}>
            <Text size="sm" fw={600}>
                LABit
            </Text>
            <Text size="xs" c="dimmed">
                Full Stack Developer
            </Text>
            <Badge
                size="xs"
                style={{
                    background: '#10b981',
                    color: 'white',
                    marginTop: 4,
                }}
            >
                4년 9개월차
            </Badge>
        </div>
    </Group>
);
const NavigationItems = memo(() => {
// React Query로 네비게이션 데이터 가져오기
    const {
        data: navigationTree,
        isLoading,
        error,
        refetch
    } = useNavigationTree();

    // Zustand 스토어
    const {
        activePath,
        expandedMenus,
        selectedMenuId,
        updateNavigationState
    } = useNavigationStore();

    const handleMenuClick = (menuItem) => {
        if (menuItem.href) {
            navigate(menuItem.href);
        }
    };

    const {pathname} = useLocation();
    const navigate = useNavigation();

    // 현재 경로가 변경될 떄 네비게이션 상태를 업데이트 한다.
    useEffect(() => {
        if( navigationTree && pathname !== activePath ){
            updateNavigationState(pathname, navigationTree);
        }
    }, [pathname, navigationTree, activePath, updateNavigationState])

    if (isLoading) {
        return <Skeleton type='card'/>
    }

    if (error) {
        return (
            <Alert
                variant="light"
                color="red"
                title="네비게이션 로드 실패"
                icon={<IconAlertCircle size={16} />}
                withCloseButton
                onClose={() => refetch()}
            >
                네비게이션 메뉴를 불러오는데 실패했습니다. 다시 시도해주세요.
            </Alert>
        );
    }
    // 데이터가 없는 경우
    if (!navigationTree || navigationTree.length === 0) {
        return (
            <Alert variant="light" color="yellow" title="메뉴 없음">
                표시할 네비게이션 메뉴가 없습니다.
            </Alert>
        );
    }

    return (
        <Stack spacing={0}>
            {navigationTree.map((menuItem) => (
                <NavigationItem
                    key={menuItem.id}
                    menuItem={menuItem}
                    isExpanded={expandedMenus.includes(menuItem.id)}
                    isSelected={selectedMenuId === menuItem.id}
                    onMenuClick={handleMenuClick}
                    depth={0}
                />
            ))}
        </Stack>
    );
})
//
// const NavigationItems = ({ isDark }) => (
//     <Stack gap="xs">
//         {NAVIGATION_ITEMS.map((item) => (
//             <NavLink
//                 key={item.href}
//                 href={item.href}
//                 label={item.label}
//                 leftSection={
//                     <item.icon
//                         size={18}
//                         style={{
//                             transition: 'all 0.3s ease',
//                         }}
//                     />
//                 }
//                 rightSection={
//                     item.badge ? (
//                         <Badge size="xs" style={{ background: '#ef4444', color: 'white' }}>
//                             {item.badge}
//                         </Badge>
//                     ) : item.active ? (
//                         <IconSparkles size={14} style={{ color: '#4c6ef5' }} />
//                     ) : null
//                 }
//                 active={item.active}
//                 style={{
//                     borderRadius: rem(8),
//                     padding: rem(12),
//                     marginBottom: rem(4),
//                     background: item.active
//                         ? (isDark ? '#21262d' : '#f3f4f6')
//                         : 'transparent',
//                     border: 'none',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                         background: isDark ? '#21262d' : '#f3f4f6',
//                         transform: 'translateX(4px)',
//                     }
//                 }}
//             />
//         ))}
//     </Stack>
// );

const PopularTags = ({ isDark }) => {
    const getTagColor = (color) => {
        const colors = {
            blue: '#3b82f6',
            green: '#10b981',
            orange: '#f59e0b',
            indigo: '#6366f1',
            yellow: '#eab308'
        };
        return colors[color] || '#6b7280';
    };

    return (
        <>
            <Text size="xs" fw={600} mb="xs" c="dimmed" tt="uppercase">
                인기 태그
            </Text>
            <Stack gap="xs">
                {POPULAR_TAGS.map((tag) => (
                    <UnstyledButton
                        key={tag.name}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: rem(8),
                            borderRadius: rem(6),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: isDark ? '#21262d' : '#f3f4f6',
                            }
                        }}
                    >
                        <Group gap="xs">
                            <Badge size="xs" style={{
                                background: getTagColor(tag.color),
                                color: 'white'
                            }}>
                                {tag.name}
                            </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                            {tag.count}
                        </Text>
                    </UnstyledButton>
                ))}
            </Stack>
        </>
    );
};

const SocialLinks = ({ isDark }) => (
    <Group>
        <SocialLink
            href="https://github.com"
            icon={IconBrandGithub}
            isDark={isDark}
        />
        {/*<SocialLink*/}
        {/*    href="https://linkedin.com"*/}
        {/*    icon={IconBrandLinkedin}*/}
        {/*    isDark={isDark}*/}
        {/*/>*/}
        {/*<SocialLink*/}
        {/*    href="#"*/}
        {/*    icon={IconSettings}*/}
        {/*    isDark={isDark}*/}
        {/*/>*/}
    </Group>
);

const SocialLink = ({ href, icon: Icon, isDark }) => (
    <ActionIcon
        component="a"
        href={href}
        variant="subtle"
        size="lg"
        radius="md"
        style={{
            transition: 'all 0.3s ease',
            '&:hover': {
                background: isDark ? '#21262d' : '#f3f4f6',
            }
        }}
    >
        <Icon size={18} />
    </ActionIcon>
);

export { NavigationMenu };