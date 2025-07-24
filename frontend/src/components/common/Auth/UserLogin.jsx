import {memo, useState} from "react";
import {Button} from "@mantine/core";
import {IconLogin} from "@tabler/icons-react";
import LoginModal from "./LoginModal.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const UserLogin = memo(() => {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const { dark } = useTheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
    };

    return (
        <>
            <Button
                variant="filled"
                size="sm"
                radius="xl"
                leftSection={<IconLogin size={16} />}
                onClick={() => setSettingsOpened(true)}
                style={{
                    backgroundColor: velogColors.primary,
                    border: 'none',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: '#0CA678',
                        transform: 'translateY(-1px)',
                    }
                }}
            >
                로그인
            </Button>

            <LoginModal
                opened={settingsOpened}
                onClose={() => setSettingsOpened(false)}
            />
        </>
    );
});

export default UserLogin;