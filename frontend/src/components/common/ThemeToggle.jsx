import {memo, useMemo} from "react";
import {useTheme} from "../../hooks/useTheme.js";
import {IconMoon, IconSun} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";

const ThemeToggle = memo(() => {
    const { dark,toggleColorScheme } = useTheme();

    // 아이콘만 메모이제이션
    const icon = useMemo(() =>
            dark ? <IconSun size={18} /> : <IconMoon size={18} />,
        [dark]
    );

    // 스타일을 useMemo로 메모이제이션
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
            {icon}
        </ActionIcon>
    );
});
export default ThemeToggle;