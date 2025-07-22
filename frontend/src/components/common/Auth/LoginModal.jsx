
import React, {useState, useCallback, memo, useEffect} from 'react';
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
import {useTheme} from "../../../contexts/ThemeContext.jsx";
import {IconBrandKakao} from "../../../utils/helpers.jsx";
import {useKakaoAuthPath, useKakaoLogin} from "../../../hooks/api/useApi.js";

function LoginModal ({ opened, onClose }) {
    const {data} = useKakaoAuthPath();
    const kakaoLoginMutation = useKakaoLogin();

    const handleKakaoLogin = () => {
        window.location.href = `${data}&state${Math.random().toString(36).substring(2, 15)}`;
    }


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { dark } = useTheme();

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
                <Text size="xl" fw={600} c={dark ? 'white' : 'dark'}>
                    로그인
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
                        로그인
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
                        카카오로 로그인
                    </Button>

                    {/*<Text size="sm" ta="center" c={dark ? 'gray.4' : 'gray.6'}>*/}
                    {/*    계정이 없으신가요?{' '}*/}
                    {/*    <Text*/}
                    {/*        component="span"*/}
                    {/*        c="blue"*/}
                    {/*        fw={600}*/}
                    {/*        style={{*/}
                    {/*            cursor: 'pointer',*/}
                    {/*            textDecoration: 'underline',*/}
                    {/*            textUnderlineOffset: '2px'*/}
                    {/*        }}*/}
                    {/*        onClick={onSwitchToSignup}*/}
                    {/*    >*/}
                    {/*        회원가입*/}
                    {/*    </Text>*/}
                    {/*</Text>*/}
                </Stack>
            </Box>
        </Modal>
    );
};
export default LoginModal;