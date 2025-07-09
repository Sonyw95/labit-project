import React, { useState, useCallback, memo } from 'react';
import {
    Text,
    Button,
    Divider,
    Modal,
    TextInput,
    PasswordInput,
    Stack,
} from '@mantine/core';
import {useAuth} from "../../contexts/AuthContext.jsx";
import {useTheme} from "../../hooks/useTheme.js";
import {validators} from "../../utils/validators.js";
import {showToast} from "../common/Toast.jsx";
// 카카오톡 아이콘 SVG 컴포넌트
const KakaoIcon = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z"/>
    </svg>
);
// 로그인 모달 컴포넌트
const LoginModal = memo(({ opened, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, loginWithKakao } = useAuth();
    const { dark } = useTheme();

    const handleSubmit = useCallback(async () => {
        if (!validators.email(formData.email)) {
            showToast.error('오류', '올바른 이메일 주소를 입력해주세요.');
            return;
        }

        if (!validators.password(formData.password).isValid) {
            showToast.error('오류', '비밀번호는 8자 이상이어야 합니다.');
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            showToast.error('오류', '비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);

        try {
            const result = await login({
                email: formData.email,
                password: formData.password,
                name: isLogin ? undefined : formData.name
            });

            if (result.success) {
                showToast.success('성공', isLogin ? '로그인되었습니다.' : '회원가입이 완료되었습니다.');
                onClose();
            } else {
                showToast.error('오류', result.error);
            }
        } catch (error) {
            showToast.error('오류', '로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [formData, isLogin, login, onClose]);

    const handleKakaoLogin = useCallback(async () => {
        setLoading(true);
        try {
            const result = await loginWithKakao();
            if (result.success) {
                showToast.success('성공', '카카오 로그인되었습니다.');
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
    }, []);

    const toggleMode = useCallback(() => {
        setIsLogin(!isLogin);
        resetForm();
    }, [isLogin, resetForm]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isLogin ? '로그인' : '회원가입'}
            size="sm"
            centered
        >
            <Stack gap="md">
                {!isLogin && (
                    <TextInput
                        label="이름"
                        placeholder="이름을 입력하세요"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                )}

                <TextInput
                    label="이메일"
                    placeholder="이메일을 입력하세요"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                />

                <PasswordInput
                    label="비밀번호"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    visible={showPassword}
                    onVisibilityChange={setShowPassword}
                    required
                />

                {!isLogin && (
                    <PasswordInput
                        label="비밀번호 확인"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                    />
                )}

                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    fullWidth
                    size="md"
                >
                    {isLogin ? '로그인' : '회원가입'}
                </Button>

                <Divider label="또는" labelPosition="center" />

                <Button
                    variant="outline"
                    leftSection={<KakaoIcon size={16} />}
                    onClick={handleKakaoLogin}
                    loading={loading}
                    fullWidth
                    color="yellow"
                    style={{
                        backgroundColor: '#FEE500',
                        color: '#000000',
                        border: 'none',
                        '&:hover': {
                            backgroundColor: '#FDD835',
                        }
                    }}
                >
                    카카오로 로그인
                </Button>

                <Text size="sm" ta="center">
                    {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
                    <Text
                        component="span"
                        c="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={toggleMode}
                    >
                        {isLogin ? '회원가입' : '로그인'}
                    </Text>
                </Text>
            </Stack>
        </Modal>
    );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;