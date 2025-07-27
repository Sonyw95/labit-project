import { useState, useCallback, useMemo } from 'react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { showToast } from "@/components/advanced/Toast.jsx";

// 로그인 모달 관련 로직을 관리하는 커스텀 훅
export const useLoginModal = () => {
    const { dark, velogColors } = useTheme();
    const [loading, setLoading] = useState(false);

    // 폼 검증 함수
    const validateForm = useCallback((formData) => {
        const { email, password } = formData;

        if (!email || !email.trim()) {
            showToast.error("입력 오류", "이메일을 입력해주세요.");
            return false;
        }

        if (!password || !password.trim()) {
            showToast.error("입력 오류", "비밀번호를 입력해주세요.");
            return false;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast.error("입력 오류", "올바른 이메일 형식을 입력해주세요.");
            return false;
        }

        return true;
    }, []);

    // 일반 로그인 처리
    const handleEmailLogin = useCallback(async (formData) => {
        if (!validateForm(formData)) {
            return;
        }

        setLoading(true);

        try {
            // 실제 로그인 API 호출 로직이 들어갈 자리
            showToast.info("로그인 안내", "현재 지원하지 않습니다.\n카카오로그인을 이용해주세요.");
        } catch (error) {
            showToast.error("로그인 실패", "로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, [validateForm]);

    // 모달 리셋 함수
    const resetModal = useCallback(() => {
        setLoading(false);
    }, []);

    return {
        loading,
        handleEmailLogin,
        resetModal,
        velogColors,
        dark,
    };
};

// 로그인 폼 관련 커스텀 훅
export const useLoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // 폼 데이터 업데이트
    const updateFormData = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // 폼 리셋
    const resetForm = useCallback(() => {
        setFormData({
            email: '',
            password: ''
        });
        setShowPassword(false);
    }, []);

    // 입력 변경 핸들러
    const handleInputChange = useCallback((field) => (e) => {
        updateFormData(field, e.target.value);
    }, [updateFormData]);

    return {
        formData,
        showPassword,
        setShowPassword,
        handleInputChange,
        resetForm,
        updateFormData,
    };
};

// 모달 스타일 관련 커스텀 훅
export const useLoginModalStyles = () => {
    const { dark, velogColors } = useTheme();

    // 모달 스타일
    const modalStyles = useMemo(() => ({
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
    }), [velogColors, dark]);

    // 입력 필드 스타일
    const inputStyles = useMemo(() => ({
        input: {
            backgroundColor: velogColors.background,
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
    }), [velogColors]);

    // 버튼 스타일
    const buttonStyles = useMemo(() => ({
        login: {
            backgroundColor: velogColors.primary,
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            border: 'none',
            transition: 'all 0.2s ease',
        },
        kakao: {
            root: {
                backgroundColor: '#FEE500',
                color: '#3C1E1E',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                transition: 'all 0.2s ease',
            }
        }
    }), [velogColors]);

    // 구분선 스타일
    const dividerStyles = useMemo(() => ({
        label: {
            color: velogColors.subText,
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        line: {
            borderColor: velogColors.border,
        }
    }), [velogColors]);

    // 제목 스타일
    const titleStyles = useMemo(() => ({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: velogColors.text,
    }), [velogColors.text]);

    return {
        modalStyles,
        inputStyles,
        buttonStyles,
        dividerStyles,
        titleStyles,
    };
};

// 접근성 관련 커스텀 훅
export const useLoginModalAccessibility = () => {
    // 오버레이 props
    const overlayProps = useMemo(() => ({
        backgroundOpacity: 0.6,
        blur: 4,
    }), []);

    // 접근성 속성들
    const accessibilityProps = useMemo(() => ({
        modal: {
            'aria-labelledby': 'login-modal-title',
            'aria-describedby': 'login-modal-description',
            trapFocus: true,
            closeOnEscape: true,
            closeOnClickOutside: true,
        },
        form: {
            role: 'form',
            'aria-labelledby': 'login-form-title',
        },
        emailInput: {
            'aria-describedby': 'email-help',
            'data-testid': 'email-input',
        },
        passwordInput: {
            'aria-describedby': 'password-help',
            'data-testid': 'password-input',
        },
        loginButton: {
            'aria-label': '이메일로 로그인하기',
            'data-testid': 'login-button',
        },
        kakaoButton: {
            'aria-label': '카카오 계정으로 로그인하기',
            'data-testid': 'kakao-login-button',
        }
    }), []);

    return {
        overlayProps,
        accessibilityProps,
    };
};