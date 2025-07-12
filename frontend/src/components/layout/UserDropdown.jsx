import {useTheme} from "@/hooks/useTheme.js";
import {memo} from "react";
import {Avatar, Box, Group, Menu, Text} from "@mantine/core";
import {IconLogout, IconSettings, IconUser} from "@tabler/icons-react";

const UserDropdown = memo(({ user, onLogout, onOpenSettings }) => {

    const { dark } = useTheme();

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <Group style={{ cursor: 'pointer' }} gap="xs">
                    <Avatar
                        src={user?.profileImage}
                        size="md"
                        radius="xl"
                        style={{
                            border: `2px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                        }}
                    >
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {/*<Box style={{ display: { base: 'none', sm: 'block' } }}>*/}
                    {/*    <Text size="sm" fw={500}>*/}
                    {/*        {user?.name}*/}
                    {/*    </Text>*/}
                    {/*    <Text size="xs" c="dimmed">*/}
                    {/*        {user?.email}*/}
                    {/*    </Text>*/}
                    {/*</Box>*/}
                </Group>
            </Menu.Target>

            <Menu.Dropdown
                style={{
                    background: dark ? '#161b22' : '#ffffff',
                    border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                }}
            >
                <Menu.Label>계정</Menu.Label>

                <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={onOpenSettings}
                >
                    프로필 설정
                </Menu.Item>

                {/*<Menu.Item leftSection={<IconSettings size={14} />}>*/}
                {/*    환경 설정*/}
                {/*</Menu.Item>*/}

                <Menu.Divider />

                <Menu.Item
                    leftSection={<IconLogout size={14} />}
                    color="red"
                    onClick={onLogout}
                >
                    로그아웃
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
});

UserDropdown.displayName = 'UserDropdown';

export default UserDropdown;