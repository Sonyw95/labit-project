import {memo, useCallback, useState} from "react";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {showToast} from "../common/Toast.jsx";
import UserDropdown from "./UserDropdown.jsx";
import UserSettingsModal from "./UserSettingsModal.jsx";
import {Button, Group} from "@mantine/core";
import {IconLogin, IconUserPlus} from "@tabler/icons-react";
import LoginModal from "./LoginModal.jsx";

const UserInfo = memo(() => {
    const [loginModalOpened, setLoginModalOpened] = useState(false);
    const [settingsModalOpened, setSettingsModalOpened] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = useCallback(async () => {
        await logout();
        showToast.success('로그아웃', '성공적으로 로그아웃되었습니다.');
    }, [logout]);

    const handleOpenSettings = useCallback(() => {
        setSettingsModalOpened(true);
    }, []);

    if (isAuthenticated && user) {
        return (
            <>
                <UserDropdown
                    user={user}
                    onLogout={handleLogout}
                    onOpenSettings={handleOpenSettings}
                />

                <UserSettingsModal
                    opened={settingsModalOpened}
                    onClose={() => setSettingsModalOpened(false)}
                    user={user}
                />
            </>
        );
    }

    return (
        <>
            <Group gap="xs">
                <Button
                    variant="outline"
                    size="sm"
                    leftSection={<IconLogin size={14} />}
                    onClick={() => setLoginModalOpened(true)}
                >
                    로그인
                </Button>

                <Button
                    size="sm"
                    leftSection={<IconUserPlus size={14} />}
                    onClick={() => setLoginModalOpened(true)}
                >
                    회원가입
                </Button>
            </Group>

            <LoginModal
                opened={loginModalOpened}
                onClose={() => setLoginModalOpened(false)}
            />
        </>
    );
});

UserInfo.displayName = 'UserInfo';

export default UserInfo;