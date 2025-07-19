// import React, { useState, useCallback, memo } from 'react';
// import {
//     Text,
//     Button,
//     Divider,
//     Modal,
//     TextInput,
//     PasswordInput,
//     Stack,
// } from '@mantine/core';
// import {useAuth} from "../../contexts/AuthContext.jsx";
// import {showToast} from "../common/Toast.jsx";
// import {validators} from "@/utils/validators.js";
// // 카카오톡 아이콘 SVG 컴포넌트
// const KakaoIcon = ({ size = 20 }) => (
//     <svg
//         width={size}
//         height={size}
//         viewBox="0 0 24 24"
//         fill="currentColor"
//     >
//         <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z"/>
//     </svg>
// );
// // 로그인 모달 컴포넌트
// const LoginModal = memo(({ opened, onClose, isLogin, setMode }) => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         name: '',
//         confirmPassword: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//
//     const { login, loginWithKakao } = useAuth();
//
//     const handleSubmit = useCallback(async () => {
//         if (!validators.email(formData.email)) {
//             showToast.error('오류', '올바른 이메일 주소를 입력해주세요.');
//             return;
//         }
//
//         if (!validators.password(formData.password).isValid) {
//             showToast.error('오류', '비밀번호는 8자 이상이어야 합니다.');
//             return;
//         }
//
//         if (!isLogin && formData.password !== formData.confirmPassword) {
//             showToast.error('오류', '비밀번호가 일치하지 않습니다.');
//             return;
//         }
//
//         setLoading(true);
//
//         try {
//             const result = await login({
//                 email: formData.email,
//                 password: formData.password,
//                 name: isLogin ? undefined : formData.name
//             });
//
//             if (result.success) {
//                 showToast.success('성공', isLogin ? '로그인되었습니다.' : '회원가입이 완료되었습니다.');
//                 onClose();
//             } else {
//                 showToast.error('오류', result.error);
//             }
//         } catch (error) {
//             showToast.error('오류', '로그인 중 오류가 발생했습니다.');
//         } finally {
//             setLoading(false);
//         }
//     }, [formData, isLogin, login, onClose]);
//
//     const handleKakaoLogin = useCallback(async () => {
//         setLoading(true);
//         try {
//             const result = await loginWithKakao();
//             if (result.success) {
//                 showToast.success('성공', '카카오 로그인되었습니다.');
//                 onClose();
//             } else {
//                 showToast.error('오류', result.error);
//             }
//         } catch (error) {
//             showToast.error('오류', '카카오 로그인 중 오류가 발생했습니다.');
//         } finally {
//             setLoading(false);
//         }
//     }, [loginWithKakao, onClose]);
//
//     const resetForm = useCallback(() => {
//         setFormData({
//             email: '',
//             password: '',
//             name: '',
//             confirmPassword: ''
//         });
//     }, []);
//
//     const toggleMode = useCallback(() => {
//         setMode('register');
//         resetForm();
//     }, [isLogin, resetForm]);
//
//     return (
//         <Modal
//             opened={opened}
//             onClose={onClose}
//             title={isLogin ? '로그인' : '회원가입'}
//             size="sm"
//             centered
//         >
//             <Stack gap="md">
//                 {!isLogin && (
//                     <TextInput
//                         label="이름"
//                         placeholder="이름을 입력하세요"
//                         value={formData.name}
//                         onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                         required
//                     />
//                 )}
//
//                 <TextInput
//                     label="이메일"
//                     placeholder="이메일을 입력하세요"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                     required
//                 />
//
//                 <PasswordInput
//                     label="비밀번호"
//                     placeholder="비밀번호를 입력하세요"
//                     value={formData.password}
//                     onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                     visible={showPassword}
//                     onVisibilityChange={setShowPassword}
//                     required
//                 />
//
//                 {!isLogin && (
//                     <PasswordInput
//                         label="비밀번호 확인"
//                         placeholder="비밀번호를 다시 입력하세요"
//                         value={formData.confirmPassword}
//                         onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                         required
//                     />
//                 )}
//
//                 <Button
//                     onClick={handleSubmit}
//                     loading={loading}
//                     fullWidth
//                     size="md"
//                 >
//                     {isLogin ? '로그인' : '회원가입'}
//                 </Button>
//
//                 <Divider label="또는" labelPosition="center" />
//
//                 <Button
//                     variant="outline"
//                     leftSection={<KakaoIcon size={16} />}
//                     onClick={handleKakaoLogin}
//                     loading={loading}
//                     fullWidth
//                     color="yellow"
//                     style={{
//                         backgroundColor: '#FEE500',
//                         color: '#000000',
//                         border: 'none',
//                         '&:hover': {
//                             backgroundColor: '#FDD835',
//                         }
//                     }}
//                 >
//                     카카오로 로그인
//                 </Button>
//
//                 <Text size="sm" ta="center">
//                     {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
//                     <Text
//                         component="span"
//                         c="blue"
//                         style={{ cursor: 'pointer' }}
//                         onClick={toggleMode}
//                     >
//                         {isLogin ? '회원가입' : '로그인'}
//                     </Text>
//                 </Text>
//             </Stack>
//         </Modal>
//     );
// });
//
// LoginModal.displayName = 'LoginModal';
//
// export default LoginModal;

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
} from '@mantine/core';
import { IconMail, IconLock } from "@tabler/icons-react";
import {useTheme} from "@/hooks/useTheme.js";
import {validators} from "@/utils/validators.js";
import {showToast} from "@/components/common/Toast.jsx";
import IconBrandKakao from "@/utils/IconBrandKakao.jsx";
import {useAuth, useKakaoLogin} from "@/hooks/api/useAuth.js";

const LoginModal = memo(({ opened, onClose, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { dark } = useTheme();

    const handleSubmit = useCallback(async (e) => {
        // e?.preventDefault();
        //
        // if (!validators.email(formData.email)) {
        //     showToast.error('오류', '올바른 이메일 주소를 입력해주세요.');
        //     return;
        // }
        //
        // if (!validators.password(formData.password).isValid) {
        //     showToast.error('오류', '비밀번호는 8자 이상이어야 합니다.');
        //     return;
        // }
        //
        // setLoading(true);
        //
        // try {
        //     const result = await login({
        //         email: formData.email,
        //         password: formData.password
        //     });
        //
        //     if (result.success) {
        //         showToast.success('성공', '로그인되었습니다.');
        //         resetForm();
        //         onClose();
        //     } else {
        //         showToast.error('오류', result.error);
        //     }
        // } catch (error) {
        //     showToast.error('오류', '로그인 중 오류가 발생했습니다.');
        // } finally {
        //     setLoading(false);
        // }
    }, [formData, /*login,*/ onClose]);

    const loginWithKakao = useKakaoLogin;
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
            console.log(error)
        } finally {
            setLoading(false);
        }
    }, [loginWithKakao, onClose]);

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

                    <Text size="sm" ta="center" c={dark ? 'gray.4' : 'gray.6'}>
                        계정이 없으신가요?{' '}
                        <Text
                            component="span"
                            c="blue"
                            fw={600}
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                textUnderlineOffset: '2px'
                            }}
                            onClick={onSwitchToSignup}
                        >
                            회원가입
                        </Text>
                    </Text>
                </Stack>
            </Box>
        </Modal>
    );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;