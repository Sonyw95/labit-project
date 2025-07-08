import React, {memo} from 'react';
import {ActionIcon, useComputedColorScheme, useMantineColorScheme} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

const ThemeToggle = memo(() => {
    console.log('ThemeToggle Render');
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {
        getInitialValueInEffect: true
    });
    const isDark = computedColorScheme === 'dark';

    // 스타일을 useMemo로 메모이제이션
    return (
        <ActionIcon
            variant="light"
            size="lg"
            radius="md"
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
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
    );
});
ThemeToggle.displayName = 'ColorSchemeToggle'
export default ThemeToggle;
//
// import { memo } from 'react';
// import { ActionIcon, useMantineColorScheme } from '@mantine/core';
// import { IconSun, IconMoon } from '@tabler/icons-react';
//
// const ColorSchemeToggle = memo(() => {
//     const { colorScheme, toggleColorScheme } = useMantineColorScheme();
//
//     return (
//         <ActionIcon
//             onClick={() => toggleColorScheme()}
//             variant="default"
//             size="xl"
//             aria-label="Toggle color scheme"
//         >
//             {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
//         </ActionIcon>
//     );
// });
//
// ColorSchemeToggle.displayName = 'ColorSchemeToggle';
// export default ColorSchemeToggle;