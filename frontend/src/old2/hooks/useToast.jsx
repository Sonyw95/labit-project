import {useMantineColorScheme} from "@mantine/core";
import {useCallback, useMemo} from "react";
import {IconAlertTriangle, IconCheck, IconInfoCircle, IconSparkles, IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";

export default function useToast() {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    // Re-rendering 방지를 위한 useCallback 사용
    const showToast = useCallback((options) => {
        const {
            title,
            message,
            type = 'info',
            duration = 4000,
            position = 'top-right',
            withCloseButton = true,
            action,
        } = options;

        // 타입별 아이콘과 색상 설정 (2025 트렌드: 의미있는 색상 사용)
        const getToastConfig = (toastType) => {
            const configs = {
                success: {
                    icon: <IconCheck size={20} />,
                    color: 'success.6',
                    bg: isDark ? '#065f46' : '#dcfce7',
                    borderColor: isDark ? '#047857' : '#22c55e',
                },
                error: {
                    icon: <IconX size={20} />,
                    color: 'error.6',
                    bg: isDark ? '#7f1d1d' : '#fecaca',
                    borderColor: isDark ? '#b91c1c' : '#dc2626',
                },
                warning: {
                    icon: <IconAlertTriangle size={20} />,
                    color: 'warning.6',
                    bg: isDark ? '#92400e' : '#fde68a',
                    borderColor: isDark ? '#d97706' : '#f59e0b',
                },
                info: {
                    icon: <IconInfoCircle size={20} />,
                    color: 'brand.6',
                    bg: isDark ? '#0c4a6e' : '#bae6fd',
                    borderColor: isDark ? '#0284c7' : '#0ea5e9',
                },
                loading: {
                    icon: <IconSparkles size={20} />,
                    color: 'grape.6',
                    bg: isDark ? '#581c87' : '#e9d5ff',
                    borderColor: isDark ? '#7c3aed' : '#a855f7',
                },
            };
            return configs[toastType];
        };

        const config = getToastConfig(type);

        notifications.show({
            id: `toast-${Date.now()}`,
            title,
            message,
            icon: config.icon,
            color: config.color,
            autoClose: duration,
            withCloseButton,
            position,
            radius: 'lg',
            style: {
                // 2025 트렌드: 플랫 디자인과 미니멀리즘
                background: config.bg,
                border: `1px solid ${config.borderColor}`,
                boxShadow: isDark
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateZ(0)', // GPU 가속
            },
            classNames: {
                root: 'toast-modern',
                title: 'toast-title',
                description: 'toast-description',
                icon: 'toast-icon',
                closeButton: 'toast-close',
            },
        });
    }, [isDark]);

    // 편의 메서드들 (Re-rendering 방지)
    const success = useCallback((message, options = {}) => {
        showToast({ ...options, message, type: 'success' });
    }, [showToast]);

    const error = useCallback((message, options = {}) => {
        showToast({ ...options, message, type: 'error' });
    }, [showToast]);

    const warning = useCallback((message, options = {}) => {
        showToast({ ...options, message, type: 'warning' });
    }, [showToast]);

    const info = useCallback((message, options = {}) => {
        showToast({ ...options, message, type: 'info' });
    }, [showToast]);

    const loading = useCallback((message, options = {}) => {
        showToast({ ...options, message, type: 'loading', duration: false });
    }, [showToast]);

    const clear = useCallback(() => {
        notifications.clean();
    }, []);

    return useMemo(() => ({
        show: showToast,
        success,
        error,
        warning,
        info,
        loading,
        clear,
    }), [showToast, success, error, warning, info, loading, clear]);
};