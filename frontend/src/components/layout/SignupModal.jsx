import React, { useState, useCallback, memo } from 'react';
import {
    Text,
    Button,
    Divider,
    Modal,
    TextInput,
    PasswordInput,
    Stack,
    Box,
    Progress,
} from '@mantine/core';
import { useAuth } from "../../contexts/AuthContext.jsx";
import { showToast } from "../common/Toast.jsx";
import { IconMail, IconLock, IconUser } from "@tabler/icons-react";
import {useTheme} from "@/hooks/useTheme.js";
import {validators} from "@/utils/validators.js";
import IconBrandKakao from "@/utils/IconBrandKakao.jsx";

const SignupModal = memo(({ opened, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login, loginWithKakao } = useAuth();
    const { dark } = useTheme();

    const getPasswordStrength = useCallback((password) => {
        if (!password) {
            return 0;
        }
        let strength = 0;
        if (password.length >= 8) {
            strength += 25;
        }
        if (/[a-z]/.test(password)) {
            strength += 25;
        }
        if (/[A-Z]/.test(password)) {
            strength += 25;
        }
        if (/[0-9]/.test(password)) {
            strength += 25;
        }
        return strength;
    }, []);

    const getPasswordStrengthColor = useCallback((strength) => {
        if (strength < 50) {
            return 'red';
        }
        if (strength < 75) {
            return 'yellow';
        }
        return 'green';
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault();

        if (!formData.name.trim()) {
            showToast.error('오류', '이름을 입력해주세요.');
            return;
        }

        if (!validators.email(formData.email)) {
            showToast.error('오류', '올바른 이메일 주소를 입력해주세요.');
            return;
        }

        if (!validators.password(formData.password).isValid) {
            showToast.error('오류', '비밀번호는 8자 이상이어야 합니다.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showToast.error('오류', '비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);

        try {
            const result = await login({
                email: formData.email,
                password: formData.password,
                name: formData.name
            });

            if (result.success) {
                showToast.success('성공', '회원가입이 완료되었습니다.');
                resetForm();
                onClose();
            } else {
                showToast.error('오류', result.error);
            }
        } catch (error) {
            showToast.error('오류', '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [formData, login, onClose]);

    const handleKakaoLogin = useCallback(async () => {
        setLoading(true);
        try {
            const result = await loginWithKakao();
            if (result.success) {
                showToast.success('성공', '카카오 로그인되었습니다.');
                resetForm();
                onClose();
            } else {
                showToast.error('오류', result.error);
            }
        } catch (error) {
            showToast.error('오류', '카카오 로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [loginWithKakao, onClose]);

    const resetForm = useCallback(() => {
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    const handleInputChange = useCallback((field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordStrengthColor = getPasswordStrengthColor(passwordStrength);

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Text size="xl" fw={600} c={dark ? 'white' : 'dark'}>
                    회원가입
                </Text>
            }
            size="sm"
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            styles={(theme) => ({
                content: {
                    background: dark
                        ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: theme.radius.lg,
                    border: `1px solid ${dark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)'}`,
                    boxShadow: dark
                        ? '0 25px 50px rgba(0, 0, 0, 0.5)'
                        : '0 25px 50px rgba(0, 0, 0, 0.15)',
                },
                header: {
                    backgroundColor: 'transparent',
                    borderBottom: 'none',
                    paddingBottom: 0,
                }
            })}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <Stack gap="lg" pt="md">
                    <TextInput
                        label="이름"
                        placeholder="이름을 입력하세요"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        leftSection={<IconUser size={16} />}
                        required
                        styles={(theme) => ({
                            input: {
                                backgroundColor: dark
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${dark
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'rgba(0, 0, 0, 0.1)'}`,
                                borderRadius: theme.radius.md,
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                    borderColor: theme.colors.blue[6],
                                    boxShadow: `0 0 0 2px ${theme.colors.blue[2]}`,
                                }
                            },
                            label: {
                                color: dark
                                    ? theme.colors.gray[3]
                                    : theme.colors.gray[7],
                                fontWeight: 500,
                            }
                        })}
                    />

                    <TextInput
                        label="이메일"
                        placeholder="이메일을 입력하세요"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        leftSection={<IconMail size={16} />}
                        required
                        styles={(theme) => ({
                            input: {
                                backgroundColor: dark
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${dark
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'rgba(0, 0, 0, 0.1)'}`,
                                borderRadius: theme.radius.md,
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                    borderColor: theme.colors.blue[6],
                                    boxShadow: `0 0 0 2px ${theme.colors.blue[2]}`,
                                }
                            },
                            label: {
                                color: dark
                                    ? theme.colors.gray[3]
                                    : theme.colors.gray[7],
                                fontWeight: 500,
                            }
                        })}
                    />

                    <Box>
                        <PasswordInput
                            label="비밀번호"
                            placeholder="비밀번호를 입력하세요"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            leftSection={<IconLock size={16} />}
                            visible={showPassword}
                            onVisibilityChange={setShowPassword}
                            required
                            styles={(theme) => ({
                                input: {
                                    backgroundColor: dark
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                    border: `1px solid ${dark
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.1)'}`,
                                    borderRadius: theme.radius.md,
                                    transition: 'all 0.2s ease',
                                    '&:focus': {
                                        borderColor: theme.colors.blue[6],
                                        boxShadow: `0 0 0 2px ${theme.colors.blue[2]}`,
                                    }
                                },
                                label: {
                                    color: dark
                                        ? theme.colors.gray[3]
                                        : theme.colors.gray[7],
                                    fontWeight: 500,
                                }
                            })}
                        />

                        {formData.password && (
                            <Box mt="xs">
                                <Progress
                                    value={passwordStrength}
                                    color={passwordStrengthColor}
                                    size="sm"
                                    radius="xl"
                                    styles={(theme) => ({
                                        root: {
                                            backgroundColor: dark
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(0, 0, 0, 0.1)',
                                        }
                                    })}
                                />
                                <Text size="xs" c={passwordStrengthColor} mt={4}>
                                    {passwordStrength < 50 && '약함'}
                                    {passwordStrength >= 50 && passwordStrength < 75 && '보통'}
                                    {passwordStrength >= 75 && '강함'}
                                </Text>
                            </Box>
                        )}
                    </Box>

                    <PasswordInput
                        label="비밀번호 확인"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        leftSection={<IconLock size={16} />}
                        visible={showConfirmPassword}
                        onVisibilityChange={setShowConfirmPassword}
                        required
                        error={
                            formData.confirmPassword &&
                            formData.password !== formData.confirmPassword
                                ? '비밀번호가 일치하지 않습니다'
                                : null
                        }
                        styles={(theme) => ({
                            input: {
                                backgroundColor: dark
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${dark
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'rgba(0, 0, 0, 0.1)'}`,
                                borderRadius: theme.radius.md,
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                    borderColor: theme.colors.blue[6],
                                    boxShadow: `0 0 0 2px ${theme.colors.blue[2]}`,
                                }
                            },
                            label: {
                                color: dark
                                    ? theme.colors.gray[3]
                                    : theme.colors.gray[7],
                                fontWeight: 500,
                            }
                        })}
                    />

                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        loading={loading}
                        fullWidth
                        size="md"
                        styles={(theme) => ({
                            root: {
                                border: 'none',
                                borderRadius: theme.radius.md,
                                fontSize: 16,
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4499 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                }
                            }
                        })}
                    >
                        회원가입
                    </Button>

                    <Divider
                        label="또는"
                        labelPosition="center"
                        styles={(theme) => ({
                            label: {
                                color: dark
                                    ? theme.colors.gray[5]
                                    : theme.colors.gray[6],
                                fontWeight: 500,
                            }
                        })}
                    />

                    <Button
                        variant="outline"
                        leftSection={<IconBrandKakao size={18} />}
                        onClick={handleKakaoLogin}
                        loading={loading}
                        fullWidth
                        size="md"
                        styles={(theme) => ({
                            root: {
                                backgroundColor: '#FEE500',
                                color: '#3C1E1E',
                                border: '1px solid #FEE500',
                                borderRadius: theme.radius.md,
                                fontSize: 16,
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#FDD835',
                                    borderColor: '#FDD835',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 25px rgba(254, 229, 0, 0.3)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                }
                            }
                        })}
                    >
                        카카오로 회원가입
                    </Button>

                    <Text size="sm" ta="center" c={dark ? 'gray.4' : 'gray.6'}>
                        이미 계정이 있으신가요?{' '}
                        <Text
                            component="span"
                            c="blue"
                            fw={600}
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textUnderlineOffset: '2px'
                            }}
                            onClick={onSwitchToLogin}
                        >
                            로그인
                        </Text>
                    </Text>
                </Stack>
            </Box>
        </Modal>
    );
});

SignupModal.displayName = 'SignupModal';

export default SignupModal;