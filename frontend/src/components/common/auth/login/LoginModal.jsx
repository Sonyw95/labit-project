import React, { useCallback, useMemo, memo } from 'react';
import { Text, Divider, Modal, Stack, Box } from '@mantine/core';
import {useLoginModal, useLoginModalAccessibility, useLoginModalStyles} from "@/hooks/auth/useLoginModal.jsx";
import LoginForm from "@/components/common/auth/login/LoginForm.jsx";
import KakaoLoginButton from "@/components/common/auth/login/KakaoLoginButton.jsx";


const LoginModal = memo(({ opened, onClose }) => {
    const { loading, handleEmailLogin, resetModal, setButtonLoading } = useLoginModal();
    const { modalStyles, titleStyles, dividerStyles } = useLoginModalStyles();
    const { overlayProps, accessibilityProps } = useLoginModalAccessibility();

    // 모달 닫기 핸들러 메모이제이션
    const handleClose = useCallback(() => {
        resetModal();
        onClose();
    }, [resetModal, onClose]);

    // 모달 제목 컴포넌트 메모이제이션
    const modalTitle = useMemo(() => (
        <Text
            size="1.5rem"
            fw={700}
            style={titleStyles}
            id="login-modal-title"
        >
            로그인
        </Text>
    ), [titleStyles]);

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={modalTitle}
            size="md"
            centered
            overlayProps={overlayProps}
            styles={modalStyles}
            {...accessibilityProps.modal}
        >
            <Box id="login-modal-description" style={{ position: 'absolute', left: '-10000px' }}>
                이메일과 비밀번호로 로그인하거나 카카오 계정으로 간편하게 로그인할 수 있습니다.
            </Box>

            <Stack gap="xl" pt="md">
                <LoginForm
                    loading={loading}
                    onSubmit={handleEmailLogin}
                />

                <Divider
                    label="또는"
                    labelPosition="center"
                    styles={dividerStyles}
                    aria-hidden="true"
                />

                <KakaoLoginButton loading={loading} setButtonLoading={setButtonLoading}  />
            </Stack>
        </Modal>
    );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;