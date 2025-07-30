import React, { useState, useCallback, useMemo, memo } from 'react';
import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { IconMail, IconLock } from "@tabler/icons-react";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { showToast } from "@/components/advanced/Toast.jsx";

const LoginForm = memo(({ loading, onSubmit }) => {
    const { themeColors } = useTheme();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // 입력 필드 스타일 메모이제이션
    const inputStyles = useMemo(() => ({
        input: {
            backgroundColor: themeColors.background,
            border: `2px solid ${themeColors.border}`,
            borderRadius: '8px',
            color: themeColors.text,
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s ease',
            '&:focus': {
                borderColor: themeColors.primary,
                outline: 'none',
            },
            '&::placeholder': {
                color: themeColors.subText,
            }
        },
        label: {
            color: themeColors.text,
            fontWeight: 600,
            marginBottom: '8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }
    }), [themeColors]);

    // 로그인 버튼 스타일 메모이제이션
    const loginButtonStyle = useMemo(() => ({
        backgroundColor: themeColors.primary,
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        border: 'none',
        transition: 'all 0.2s ease',
    }), [themeColors.primary]);

    // 입력 변경 핸들러 메모이제이션
    const handleInputChange = useCallback((field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    // 폼 제출 핸들러 메모이제이션
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        showToast.info("로그인 안내", "현재 지원하지 않습니다.\n카카오로그인을 이용해주세요.");
        if (onSubmit) {
            onSubmit(formData);
        }
    }, [formData, onSubmit]);

    // 호버 이벤트 핸들러
    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = '#0CA678';
    }, []);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = themeColors.primary;
    }, [themeColors.primary]);

    return (
        <Stack gap="xl" component="form" onSubmit={handleSubmit} role="form" aria-labelledby="login-form-title">
            <TextInput
                label="이메일"
                placeholder="이메일을 입력하세요"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                leftSection={<IconMail size={18} aria-hidden="true" />}
                required
                size="md"
                styles={inputStyles}
                aria-describedby="email-help"
                data-testid="email-input"
            />

            <PasswordInput
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleInputChange('password')}
                leftSection={<IconLock size={18} aria-hidden="true" />}
                visible={showPassword}
                onVisibilityChange={setShowPassword}
                required
                size="md"
                styles={inputStyles}
                aria-describedby="password-help"
                data-testid="password-input"
            />

            <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                style={loginButtonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="이메일로 로그인하기"
                data-testid="login-button"
            >
                로그인
            </Button>
        </Stack>
    );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;