import { memo, useState, useMemo, useCallback } from "react";
import { Button } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import LoginModal from "./LoginModal.jsx";
import { useTheme } from "@/contexts/ThemeContext.jsx";

const UserLogin = memo(() => {
    const [settingsOpened, setSettingsOpened] = useState(false);
    const { themeColors } = useTheme();

    // 버튼 스타일 메모이제이션으로 리렌더링 최적화
    const buttonStyles = useMemo(() => ({
        backgroundColor: themeColors.primary,
        border: 'none',
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'all 0.2s ease',
    }), [themeColors.primary]);

    // 호버 스타일을 별도로 관리 (CSS-in-JS 한계로 인한 대안)
    const hoverColor = useMemo(() => '#0CA678', []);

    // 이벤트 핸들러 메모이제이션으로 리렌더링 방지
    const handleLoginClick = useCallback(() => {
        setSettingsOpened(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setSettingsOpened(false);
    }, []);

    // 마우스 이벤트 핸들러 메모이제이션
    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
        e.currentTarget.style.transform = 'translateY(-1px)';
    }, [hoverColor]);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = themeColors.primary;
        e.currentTarget.style.transform = 'translateY(0)';
    }, [themeColors.primary]);

    return (
        <>
            <Button
                variant="filled"
                size="sm"
                radius="xl"
                leftSection={<IconLogin size={16} aria-hidden="true" />}
                onClick={handleLoginClick}
                style={buttonStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="사용자 로그인 모달 열기"
                role="button"
                tabIndex={0}
            >
                로그인
            </Button>

            <LoginModal
                opened={settingsOpened}
                onClose={handleModalClose}
            />
        </>
    );
});

UserLogin.displayName = 'UserLogin';

export default UserLogin;