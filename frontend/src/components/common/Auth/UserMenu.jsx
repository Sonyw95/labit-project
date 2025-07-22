import {memo, useState} from 'react';
import {
    Menu,
    Avatar,
    Text,
    Group,
    ActionIcon,
    Modal,
    Badge, UnstyledButton, Stack, Box, Indicator, LoadingOverlay,
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconChevronDown,
    IconShield, IconBell,
} from '@tabler/icons-react';
import {useLogout, useUserInfo} from "@/hooks/api/useApi.js";
import UserSettings from "./UserSettings.jsx";
import {NavLink} from "react-router-dom";


const getRoleBadgeColor = (role) => {
    switch (role) {
        case 'SUPER_ADMIN': return 'red';
        case 'ADMIN': return 'orange';
        default: return 'blue';
    }
};

const getRoleLabel = (role) => {
    switch (role) {
        case 'SUPER_ADMIN':
        case 'ADMIN': return '주인장';
        default: return '일반사용자';
    }
};

const UserMenu = memo(( () => {
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { data: user, isLoading } = useUserInfo();
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (isLoading) {
        return <Avatar size="sm" />;
    }

    return (
        <Menu
            width={280}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <LoadingOverlay visible={logoutMutation.isPending} loaderProps={{ children: 'Loading...' }} />
            <Menu.Target>
                <UnstyledButton
                    style={{
                        padding: 'var(--mantine-spacing-xs)',
                        borderRadius: 'var(--mantine-radius-sm)',
                        transition: 'background-color 150ms ease',
                        border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
                        e.currentTarget.style.borderColor = 'var(--mantine-color-gray-2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <Group gap="sm">
                        <Indicator
                            inline
                            size={12}
                            offset={7}
                            position="bottom-end"
                            color={user.isOnline ? "green" : "gray"}
                            withBorder
                        >
                            <Avatar
                                src={user.profileImage}
                                alt={user.nickname}
                                radius="xl"
                                size="md"
                            />
                        </Indicator>

                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text size="sm" fw={600} truncate>
                                {user.nickname}
                            </Text>
                            <Text size="xs" c="dimmed" truncate>
                                {getRoleLabel(user.role)}
                            </Text>
                        </Box>

                        {user.notifications > 0 && (
                            <Badge size="sm" variant="filled" color="red" circle>
                                {user.notifications}
                            </Badge>
                        )}

                        <IconChevronDown
                            size={16}
                            style={{
                                transform: userMenuOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 200ms ease',
                            }}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <UserDropdownContent user={user} handleLogout={handleLogout}  />
            </Menu.Dropdown>
        </Menu>
    );
}))

const UserDropdownContent = memo(({ user, handleLogout }) => {

    return (
        <Stack gap="xs">
            {/* 사용자 정보 헤더 */}
            <Group p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                <Avatar src={user.profileImage} size="lg" radius="md" />
                <Box style={{ flex: 1 }}>
                    <Text fw={600} size="sm">
                        {user.nickname}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {user.email}
                    </Text>
                    <Badge size="xs" color={getRoleBadgeColor(user.role)} variant="light" mt="xs">
                        {getRoleLabel(user.role)}
                    </Badge>
                </Box>
            </Group>

            {/* 메뉴 아이템들 */}
            <Menu.Item
                leftSection={<IconUser size={16} />}
                component={NavLink}
                to="/setting/user"
            >
                <Text size="sm" fw={500}>프로필 설정</Text>
                <Text size="xs" c="dimmed">계정 정보 및 개인정보 관리</Text>
            </Menu.Item>

            <Menu.Item leftSection={<IconBell    size={16} />}>
                <Group justify="space-between" w="100%">
                    <div>
                        <Text size="sm" fw={500}>알림</Text>
                        <Text size="xs" c="dimmed">알림 설정 관리</Text>
                    </div>
                    {user.notifications > 0 && (
                        <Badge size="sm" color="red">
                            {user.notifications}
                        </Badge>
                    )}
                </Group>
            </Menu.Item>

            {/*<Menu.Item leftSection={<IconPalette size={16} />}>*/}
            {/*    <Group justify="space-between" w="100%">*/}
            {/*        <div>*/}
            {/*            <Text size="sm" fw={500}>다크 모드</Text>*/}
            {/*            <Text size="xs" c="dimmed">테마 설정</Text>*/}
            {/*        </div>*/}
            {/*        <Switch*/}
            {/*            size="sm"*/}
            {/*            checked={darkMode}*/}
            {/*            onChange={(event) => setDarkMode(event.currentTarget.checked)}*/}
            {/*            onLabel={<IconMoon size={12} />}*/}
            {/*            offLabel={<IconSun size={12} />}*/}
            {/*        />*/}
            {/*    </Group>*/}
            {/*</Menu.Item>*/}

            <Menu.Divider />

            <Menu.Item leftSection={<IconShield size={16} />}>
                <Text size="sm" fw={500}>보안 설정</Text>
                <Text size="xs" c="dimmed">비밀번호 및 2FA 설정</Text>
            </Menu.Item>


            <Menu.Divider />

            <Menu.Item
                leftSection={<IconLogout size={16} />}
                color="red"
                onClick={handleLogout}
            >
                <Text size="sm" fw={500}>로그아웃</Text>
            </Menu.Item>
        </Stack>
    );
})


export default UserMenu;