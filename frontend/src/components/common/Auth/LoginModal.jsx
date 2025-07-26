import React, {useState, useCallback, memo} from 'react';
import {
    Text,
    Button,
    Divider,
    Modal,
    TextInput,
    PasswordInput,
    Stack,
    Box,
} from '@mantine/core';
import { IconMail, IconLock } from "@tabler/icons-react";
import {IconBrandKakao} from "@/utils/helpers.jsx";
import {useKakaoAuthPath} from "@/hooks/api/useApi.js";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const LoginModal = memo(({ opened, onClose }) => {
    const {data} = useKakaoAuthPath();
    const [isLoading, setIsLoading] = useState(false);
    const { dark } = useTheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
        inputBg: dark ? '#2B2D31' : '#FFFFFF',
    };

    const handleKakaoLogin = () => {
        // 중복 클릭 방지
        if (isLoading) {
            console.log('이미 로그인 진행 중, 중복 클릭 방지');
            return;
        }
        window.location.href = `${data}&state${Math.random().toString(36).substring(2, 15)}`;

        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = useCallback(async (e) => {
    }, [formData, /*login,*/ onClose]);

    const resetForm = useCallback(() => {
        setFormData({
            email: '',
            password: ''
        });
        setShowPassword(false);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    const handleInputChange = useCallback((field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Text
                    size="1.5rem"
                    fw={700}
                    c={velogColors.text}
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    로그인
                </Text>
            }
            size="md"
            centered
            overlayProps={{
                backgroundOpacity: 0.6,
                blur: 4,
            }}
            styles={{
                content: {
                    backgroundColor: velogColors.background,
                    border: `1px solid ${velogColors.border}`,
                    borderRadius: '16px',
                    boxShadow: dark
                        ? '0 25px 50px rgba(0, 0, 0, 0.5)'
                        : '0 25px 50px rgba(0, 0, 0, 0.15)',
                },
                header: {
                    backgroundColor: 'transparent',
                    borderBottom: 'none',
                    paddingBottom: '0.5rem',
                },
                body: {
                    padding: '2rem',
                },
                close: {
                    color: velogColors.subText,
                    '&:hover': {
                        backgroundColor: velogColors.hover,
                    }
                }
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <Stack gap="xl" pt="md">
                    <TextInput
                        label="이메일"
                        placeholder="이메일을 입력하세요"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        leftSection={<IconMail size={18} />}
                        required
                        size="md"
                        styles={{
                            input: {
                                backgroundColor: velogColors.inputBg,
                                border: `2px solid ${velogColors.border}`,
                                borderRadius: '8px',
                                color: velogColors.text,
                                fontSize: '16px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                    borderColor: velogColors.primary,
                                    outline: 'none',
                                },
                                '&::placeholder': {
                                    color: velogColors.subText,
                                }
                            },
                            label: {
                                color: velogColors.text,
                                fontWeight: 600,
                                marginBottom: '8px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }
                        }}
                    />

                    <PasswordInput
                        label="비밀번호"
                        placeholder="비밀번호를 입력하세요"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        leftSection={<IconLock size={18} />}
                        visible={showPassword}
                        onVisibilityChange={setShowPassword}
                        required
                        size="md"
                        styles={{
                            input: {
                                backgroundColor: velogColors.inputBg,
                                border: `2px solid ${velogColors.border}`,
                                borderRadius: '8px',
                                color: velogColors.text,
                                fontSize: '16px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                transition: 'all 0.2s ease',
                                '&:focus': {
                                    borderColor: velogColors.primary,
                                    outline: 'none',
                                }
                            },
                            label: {
                                color: velogColors.text,
                                fontWeight: 600,
                                marginBottom: '8px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        loading={loading}
                        fullWidth
                        size="lg"
                        style={{
                            backgroundColor: velogColors.primary,
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            border: 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#0CA678',
                            }
                        }}
                        aria-label="로그인버튼"
                    >
                        로그인
                    </Button>

                    <Divider
                        label="또는"
                        labelPosition="center"
                        styles={{
                            label: {
                                color: velogColors.subText,
                                fontWeight: 500,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            },
                            line: {
                                borderColor: velogColors.border,
                            }
                        }}
                    />

                    <Button
                        variant="filled"
                        leftSection={<IconBrandKakao size={20} />}
                        onClick={handleKakaoLogin}
                        loading={loading}
                        fullWidth
                        size="lg"
                        styles={{
                            root: {
                                backgroundColor: '#FEE500',
                                color: '#3C1E1E',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: '#FDD835',
                                },
                            }
                        }}
                        aria-label="카카로 로그인 버튼"
                    >
                        카카오로 로그인
                    </Button>

                    {/*<Text*/}
                    {/*    size="sm"*/}
                    {/*    ta="center"*/}
                    {/*    c={velogColors.subText}*/}
                    {/*    style={{*/}
                    {/*        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',*/}
                    {/*        marginTop: '1rem'*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    LABit.*/}
                    {/*</Text>*/}
                </Stack>
            </Box>
        </Modal>
    );
}) ;

export default LoginModal;