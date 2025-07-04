import {
    ActionIcon,
    AppShell,
    Burger,
    Group,
    Text,
    ThemeIcon,
} from "@mantine/core";
import {
    IconMoon,
    IconSun,
} from "@tabler/icons-react";
import React from "react";
import Logo from "@/components/Logo.jsx";
import UserDropdown from "@/components/section/DropDown.jsx";

const Header = ( props ) =>{
    const{ dark, opened, toggleColorScheme, setOpened} = props;

    return (
        <>
            {/* Header */}
            <AppShell.Header style={{
                background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 헤더
                borderBottom: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
            }}>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened(!opened)}
                            hiddenFrom="lg"
                            size="sm"
                        />
                        <Group gap="xs">
                            <ThemeIcon
                                size="lg"
                                radius="md"
                                style={{
                                    background: '#4c6ef5',
                                    boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                }}
                            >
                                <Logo
                                    isLogo
                                    radius="xl"
                                    size="sm"
                                    dark={dark}
                                    href="/home"
                                />
                            </ThemeIcon>
                            <div>
                                <Text
                                    size="lg"
                                    fw={700}
                                    style={{
                                        color: dark ? '#ffffff' : '#1e293b',
                                    }}
                                >
                                    LABit
                                </Text>
                                <Text size="xs" c="dimmed">
                                    기술과 성장의 기록
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    <Group gap="xs">
                        {/*<ActionIcon*/}
                        {/*    variant="subtle"*/}
                        {/*    size="lg"*/}
                        {/*    radius="md"*/}
                        {/*    style={{*/}
                        {/*        transition: 'all 0.3s ease',*/}
                        {/*        '&:hover': {*/}
                        {/*            background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <IconSearch size={18} />*/}
                        {/*</ActionIcon>*/}
                        {/*<ActionIcon*/}
                        {/*    variant="subtle"*/}
                        {/*    size="lg"*/}
                        {/*    radius="md"*/}
                        {/*    style={{*/}
                        {/*        transition: 'all 0.3s ease',*/}
                        {/*        '&:hover': {*/}
                        {/*            background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <IconBell size={18} />*/}
                        {/*</ActionIcon>*/}
                        <ActionIcon
                            variant="light"
                            size="lg"
                            radius="md"
                            onClick={toggleColorScheme}
                            style={{
                                background: dark ? '#21262d' : '#f3f4f6',  // 어두운 배경
                                border: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: dark ? '#30363d' : '#e5e7eb',  // 어두운 호버 색상
                                }
                            }}
                        >
                            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                        </ActionIcon>
                        <UserDropdown dark={dark} />
                    </Group>
                </Group>
            </AppShell.Header>


        </>
    )
}

export default Header;