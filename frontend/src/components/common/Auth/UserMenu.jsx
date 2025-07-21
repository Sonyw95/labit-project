import {memo, useState} from 'react';
import {
    Menu,
    Avatar,
    Text,
    Group,
    ActionIcon,
    Modal,
    Badge,
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconChevronDown,
    IconShield,
} from '@tabler/icons-react';
import {useLogout, useUserInfo} from "../../../hooks/api/useApi.js";
import UserSettings from "./UserSettings.jsx";


const UserMenu = memo(( () => {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const { data: user, isLoading } = useUserInfo();
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (isLoading) {
        return <Avatar size="sm" loading />;
    }

    if (!user) {
        return null;
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'red';
            case 'ADMIN': return 'orange';
            default: return 'blue';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return '슈퍼관리자';
            case 'ADMIN': return '관리자';
            default: return '일반사용자';
        }
    };

    return (
        <>
            <Menu shadow="md" width={280} position="bottom-end">
                <Menu.Target>
                    <ActionIcon variant="subtle" size="lg">
                        <Group spacing="xs">
                            <Avatar
                                src={user.profileImage}
                                alt={user.nickname}
                                size="sm"
                            />
                            <IconChevronDown size={14} />
                        </Group>
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>
                        <Group>
                            <Avatar
                                src={user.profileImage}
                                alt={user.nickname}
                                size="md"
                            />
                            <div>
                                <Text size="sm" fw={500}>
                                    {user.nickname}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {user.email}
                                </Text>
                            </div>
                        </Group>
                    </Menu.Label>

                    <Menu.Label>
                        <Badge
                            color={getRoleBadgeColor(user.role)}
                            variant="light"
                            size="sm"
                            leftSection={<IconShield size={12} />}
                        >
                            {getRoleLabel(user.role)}
                        </Badge>
                    </Menu.Label>

                    <Menu.Divider />

                    <Menu.Item
                        leftSection={<IconUser size={16} />}
                        onClick={() => setSettingsOpened(true)}
                    >
                        프로필 설정
                    </Menu.Item>

                    <Menu.Item
                        leftSection={<IconSettings size={16} />}
                    >
                        환경설정
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item
                        leftSection={<IconLogout size={16} />}
                        color="red"
                        onClick={handleLogout}
                        disabled={logoutMutation.isLoading}
                    >
                        로그아웃
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            {/* 사용자 설정 모달 */}
            <Modal
                opened={settingsOpened}
                onClose={() => setSettingsOpened(false)}
                title="사용자 설정"
                size="md"
            >
                <UserSettings
                    user={user}
                    onClose={() => setSettingsOpened(false)}
                />
            </Modal>
        </>
    );
}))

export default UserMenu;