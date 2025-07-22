import {memo, useState} from "react";
import {Button, Group} from "@mantine/core";
import {IconLogin} from "@tabler/icons-react";
import LoginModal from "./LoginModal.jsx";


const UserLogin = memo(() => {
    const [settingsOpened, setSettingsOpened] = useState(false);

    return (
        <>
            <Group gap="xs">
                <Button
                    variant="outline"
                    size="sm"
                    leftSection={<IconLogin size={14} />}
                    onClick={() => setSettingsOpened(true)}
                >
                    로그인
                </Button>

                {/*<Button*/}
                {/*    size="sm"*/}
                {/*    leftSection={<IconUserPlus size={14} />}*/}
                {/*    onClick={() => setSignupModalOpened(true)}*/}
                {/*>*/}
                {/*    회원가입*/}
                {/*</Button>*/}
            </Group>

            <LoginModal
                opened={settingsOpened}
                onClose={() => setSettingsOpened(false)}
            />
            {/*<SignupModal*/}
            {/*    opened={signupModalOpened}*/}
            {/*    onClose={handleCloseSignup}*/}
            {/*    onSwitchToLogin={handleSwitchToLogin}*/}
            {/*/>*/}
        </>
    );
});
export default UserLogin;