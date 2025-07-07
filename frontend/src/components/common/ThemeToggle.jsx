import React from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

const ThemeToggle = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <ActionIcon
            variant="light"
            size="lg"
            radius="md"
            onClick={toggleColorScheme}
            style={{
                background: dark ? '#21262d' : '#f3f4f6',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                    background: dark ? '#30363d' : '#e5e7eb',
                }
            }}
        >
            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>
    );
};
export default ThemeToggle;