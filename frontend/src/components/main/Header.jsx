import React, {memo, useCallback} from "react";
import {ActionIcon, AppShell, Burger, Group} from "@mantine/core";
import {IconBell, IconMoon, IconSearch, IconSun} from "@tabler/icons-react";
import {backgroundBlur} from "@/utils/helpers.jsx";
import {showToast} from "@/components/advanced/Toast.jsx";

const Header = memo(({
                         isDark, navOpened, setNavOpened, toggleColorScheme
                     }) => {
    const handleNotification = useCallback(() => {
        showToast.info('알림', '같은 레벨 내에서만 이동 asd .')
    }, [showToast]);
    return (
        <AppShell.Header
            ml={{lg: 'var(--app-shell-navbar-width, 280px)'}}
            style={{
                background: isDark ? '#161b22' : '#ffffff',
                borderBottom: `1px solid ${isDark ? '#21262d' : '#e5e7eb'}`,
                ...backgroundBlur({ color:isDark ? '#161b22' : '#ffffff', alpha: 0.7})
            }}>

            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Burger
                        opened={navOpened}
                        onClick={() => setNavOpened(!navOpened)}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    {/*<Group gap="xs">*/}
                    {/*    <ThemeIcon*/}
                    {/*        size="lg"*/}
                    {/*        radius="md"*/}
                    {/*        style={{*/}
                    {/*            background: '#4c6ef5',*/}
                    {/*            boxShadow: 'none',*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <IconCode size={18} />*/}
                    {/*    </ThemeIcon>*/}
                    {/*    <div>*/}
                    {/*        <Text*/}
                    {/*            size="lg"*/}
                    {/*            fw={700}*/}
                    {/*            style={{*/}
                    {/*                color: isDark ? '#ffffff' : '#1e293b',*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            LABit*/}
                    {/*        </Text>*/}
                    {/*        <Text size="xs" c="dimmed">*/}
                    {/*            기술과 성장의 기록*/}
                    {/*        </Text>*/}
                    {/*    </div>*/}
                    {/*</Group>*/}
                </Group>

                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="md"
                        onClick={ () => showToast.info('알림', '같은 레벨 내에서만 이동 가능합니다.') }
                        style={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: isDark ? '#21262d' : '#f3f4f6',
                            }
                        }}
                    >
                        <IconSearch size={18} />
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        radius="md"
                        onClick={handleNotification}
                        style={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: isDark ? '#21262d' : '#f3f4f6',
                            }
                        }}
                    >
                        <IconBell size={18} />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        size="lg"
                        radius="md"
                        onClick={toggleColorScheme}
                        style={{
                            background: isDark ? '#21262d' : '#f3f4f6',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: isDark ? '#30363d' : '#e5e7eb',
                            }
                        }}
                    >
                        {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
                    </ActionIcon>
                </Group>
            </Group>
        </AppShell.Header>
    )
})

export default Header;