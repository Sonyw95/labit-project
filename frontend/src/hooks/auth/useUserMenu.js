import { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from "@mantine/hooks";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { useLogout } from "@/hooks/api/useApi.js";
import useAuthStore from "../../stores/authStore.js";

// 사용자 메뉴 상태 관리 훅
export const useUserMenuState = () => {
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);

    // 메뉴 열기 핸들러
    const handleMenuOpen = useCallback(() => {
        setUserMenuOpened(true);
    }, []);

    // 메뉴 닫기 핸들러
    const handleMenuClose = useCallback(() => {
        setUserMenuOpened(false);
    }, []);

    // 설정 열기 핸들러
    const handleOpenSettings = useCallback(() => {
        openSettings();
        setUserMenuOpened(false);
    }, [openSettings]);

    return {
        userMenuOpened,
        settingsOpened,
        handleMenuOpen,
        handleMenuClose,
        handleOpenSettings,
        closeSettings,
    };
};

// 사용자 데이터 관리 훅
export const useUserMenuData = () => {
    const { user, isAdmin, isAuthenticated } = useAuthStore();
    const logoutMutation = useLogout();

    // 로그아웃 핸들러
    const handleLogout = useCallback(() => {
        logoutMutation.mutate();
    }, [logoutMutation]);

    return {
        user,
        isLoading,
        error,
        handleLogout,
        isLogoutLoading: logoutMutation.isPending,
    };
};

// 사용자 메뉴 스타일 관리 훅
export const useUserMenuStyles = () => {
    const { dark, velogColors } = useTheme();

    // 메뉴 드롭다운 스타일
    const dropdownStyles = useMemo(() => ({
        dropdown: {
            backgroundColor: velogColors.background,
            border: `1px solid ${velogColors.border}`,
            borderRadius: '12px',
            boxShadow: dark
                ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                : '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: '0.5rem',
        }
    }), [velogColors, dark]);

    // 사용자 버튼 스타일
    const buttonStyles = useMemo(() => ({
        padding: '8px',
        borderRadius: '20px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
            backgroundColor: velogColors.hover,
        }
    }), [velogColors.hover]);

    // 사용자 정보 헤더 스타일
    const headerStyles = useMemo(() => ({
        backgroundColor: velogColors.hover,
        borderRadius: '8px',
        marginBottom: '0.5rem'
    }), [velogColors.hover]);

    // 메뉴 아이템 스타일
    const menuItemStyles = useMemo(() => ({
        borderRadius: '8px',
        color: velogColors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '&:hover': {
            backgroundColor: velogColors.hover,
        }
    }), [velogColors]);

    // 로그아웃 메뉴 아이템 스타일
    const logoutMenuItemStyles = useMemo(() => ({
        borderRadius: '8px',
        color: '#FF6B6B',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '&:hover': {
            backgroundColor: '#FFE8E8',
        }
    }), []);

    // 구분선 스타일
    const dividerStyles = useMemo(() => ({
        borderColor: velogColors.border
    }), [velogColors.border]);

    return {
        dropdownStyles,
        buttonStyles,
        headerStyles,
        menuItemStyles,
        logoutMenuItemStyles,
        dividerStyles,
        velogColors,
    };
};

// 사용자 역할 관련 유틸리티 훅
export const useUserRoleUtils = () => {
    // 역할별 배지 색상
    const getRoleBadgeColor = useCallback((role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'red';
            case 'ADMIN': return 'orange';
            default: return 'blue';
        }
    }, []);

    // 역할별 라벨
    const getRoleLabel = useCallback((role) => {
        switch (role) {
            case 'SUPER_ADMIN':
            case 'ADMIN': return '주인장';
            default: return '일반사용자';
        }
    }, []);

    // 역할별 권한 확인
    const hasAdminAccess = useCallback((role) => {
        return role === 'SUPER_ADMIN' || role === 'ADMIN';
    }, []);

    return {
        getRoleBadgeColor,
        getRoleLabel,
        hasAdminAccess,
    };
};

// 사용자 메뉴 접근성 관리 훅
export const useUserMenuAccessibility = () => {
    // 메뉴 전환 props
    const transitionProps = useMemo(() => ({
        transition: 'pop-top-right'
    }), []);

    // 메뉴 접근성 속성
    const menuAccessibilityProps = useMemo(() => ({
        closeOnItemClick: false,
        closeOnClickOutside: true,
        closeOnEscape: true,
        trapFocus: true,
        'aria-label': '사용자 메뉴',
    }), []);

    // 키보드 이벤트 핸들러
    const handleKeyDown = useCallback((event, onClose) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, []);

    return {
        transitionProps,
        menuAccessibilityProps,
        handleKeyDown,
    };
};

// 사용자 알림 관리 훅
export const useUserNotifications = (user) => {
    // 알림 개수 포맷팅
    const formatNotificationCount = useCallback((count) => {
        if (count > 99) return '99+';
        return count.toString();
    }, []);

    // 알림 상태 확인
    const hasNotifications = useMemo(() => {
        return user?.notifications > 0;
    }, [user?.notifications]);

    // 알림 배지 스타일
    const notificationBadgeStyles = useMemo(() => ({
        backgroundColor: '#FF6B6B',
    }), []);

    return {
        formatNotificationCount,
        hasNotifications,
        notificationBadgeStyles,
        notificationCount: user?.notifications || 0,
    };
};

// 온라인 상태 관리 훅
export const useOnlineStatus = (user) => {
    const { velogColors } = useTheme();

    // 온라인 상태 확인
    const isOnline = useMemo(() => {
        return user?.isOnline || false;
    }, [user?.isOnline]);

    // 상태 텍스트
    const statusText = useMemo(() => {
        return isOnline ? '온라인' : '오프라인';
    }, [isOnline]);

    // 상태 색상
    const statusColor = useMemo(() => {
        return isOnline ? velogColors.primary : 'gray';
    }, [isOnline, velogColors.primary]);

    return {
        isOnline,
        statusText,
        statusColor,
    };
};