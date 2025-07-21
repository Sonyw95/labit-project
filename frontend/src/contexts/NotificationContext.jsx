import React, {createContext, useCallback, useContext} from 'react';
import {notifications} from '@mantine/notifications';
import {
    IconAlertTriangle,
    IconBell,
    IconCheck,
    IconHeart,
    IconInfoCircle,
    IconRocket,
    IconSparkles,
    IconX
} from '@tabler/icons-react';
import {ActionIcon, Badge, Box, Group, Progress, rem, Text} from '@mantine/core';

// Enhanced Notification Context
const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// 2025 웹 디자인 트렌드를 반영한 알림 스타일
const getNotificationStyles = (type, isDarkMode = false) => {
    const baseStyles = {
        borderRadius: rem(16),
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: rem(20),
        minHeight: rem(80),
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const typeStyles = {
        success: {
            ...baseStyles,
            backgroundColor: isDarkMode
                ? 'rgba(6, 78, 59, 0.95)'
                : 'rgba(236, 253, 245, 0.95)',
            borderColor: isDarkMode ? '#10b981' : '#059669',
            borderLeftWidth: rem(4),
            borderLeftColor: '#10b981',
        },
        error: {
            ...baseStyles,
            backgroundColor: isDarkMode
                ? 'rgba(69, 10, 10, 0.95)'
                : 'rgba(254, 242, 242, 0.95)',
            borderColor: isDarkMode ? '#ef4444' : '#dc2626',
            borderLeftWidth: rem(4),
            borderLeftColor: '#ef4444',
        },
        warning: {
            ...baseStyles,
            backgroundColor: isDarkMode
                ? 'rgba(69, 26, 3, 0.95)'
                : 'rgba(255, 251, 235, 0.95)',
            borderColor: isDarkMode ? '#f59e0b' : '#d97706',
            borderLeftWidth: rem(4),
            borderLeftColor: '#f59e0b',
        },
        info: {
            ...baseStyles,
            backgroundColor: isDarkMode
                ? 'rgba(30, 58, 138, 0.95)'
                : 'rgba(239, 246, 255, 0.95)',
            borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
            borderLeftWidth: rem(4),
            borderLeftColor: '#3b82f6',
        },
        premium: {
            ...baseStyles,
            background: isDarkMode
                ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.95) 0%, rgba(205, 133, 63, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(254, 215, 170, 0.95) 0%, rgba(251, 191, 36, 0.95) 100%)',
            borderColor: '#f59e0b',
            borderLeftWidth: rem(4),
            borderLeftColor: '#f59e0b',
        },
        celebration: {
            ...baseStyles,
            background: isDarkMode
                ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(147, 51, 234, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(243, 232, 255, 0.95) 0%, rgba(196, 181, 253, 0.95) 100%)',
            borderColor: '#8b5cf6',
            borderLeftWidth: rem(4),
            borderLeftColor: '#8b5cf6',
        }
    };

    return typeStyles[type] || typeStyles.info;
};

// 고급 알림 아이콘 컴포넌트
const NotificationIcon = ({ type, animated = true }) => {
    const iconProps = {
        size: 20,
        style: animated ? { animation: 'iconPulse 2s ease-in-out infinite' } : {}
    };

    const icons = {
        success: <IconCheck {...iconProps} style={{ ...iconProps.style, color: '#10b981' }} />,
        error: <IconX {...iconProps} style={{ ...iconProps.style, color: '#ef4444' }} />,
        warning: <IconAlertTriangle {...iconProps} style={{ ...iconProps.style, color: '#f59e0b' }} />,
        info: <IconInfoCircle {...iconProps} style={{ ...iconProps.style, color: '#3b82f6' }} />,
        premium: <IconSparkles {...iconProps} style={{ ...iconProps.style, color: '#f59e0b' }} />,
        celebration: <IconRocket {...iconProps} style={{ ...iconProps.style, color: '#8b5cf6' }} />,
    };

    return icons[type] || icons.info;
};

// 진행률 표시 컴포넌트
const NotificationProgress = ({ duration, type }) => {
    const [progress, setProgress] = React.useState(100);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - (100 / (duration / 100));
                return newProgress <= 0 ? 0 : newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration]);

    const getProgressColor = () => {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'premium': return '#f59e0b';
            case 'celebration': return '#8b5cf6';
            default: return '#3b82f6';
        }
    };

    return (
        <Progress
            value={progress}
            size="xs"
            radius="xl"
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'transparent',
            }}
            color={getProgressColor}
        />
    );
};

// 커스텀 알림 컴포넌트
const CustomNotificationContent = ({
                                       title,
                                       message,
                                       type = 'info',
                                       showProgress = true,
                                       duration = 5000,
                                       badge,
                                       action,
                                       isDarkMode = false
                                   }) => {
    return (
        <Box style={{ position: 'relative', width: '100%' }}>
            <Group align="flex-start" gap="md" style={{ marginBottom: showProgress ? rem(8) : 0 }}>
                <Box
                    style={{
                        padding: rem(8),
                        borderRadius: rem(12),
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <NotificationIcon type={type} animated />
                </Box>

                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" align="flex-start" mb="xs">
                        <Box style={{ flex: 1 }}>
                            {title && (
                                <Group gap="xs" mb="xs">
                                    <Text
                                        size="sm"
                                        fw={600}
                                        style={{
                                            color: isDarkMode ? '#ffffff' : '#1f2937',
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {title}
                                    </Text>
                                    {badge && (
                                        <Badge
                                            size="xs"
                                            radius="xl"
                                            style={{
                                                background: type === 'premium' ? '#f59e0b' :
                                                    type === 'celebration' ? '#8b5cf6' : '#6b7280',
                                                color: 'white',
                                                textTransform: 'uppercase',
                                                fontSize: rem(10),
                                                fontWeight: 700,
                                            }}
                                        >
                                            {badge}
                                        </Badge>
                                    )}
                                </Group>
                            )}

                            <Text
                                size="sm"
                                style={{
                                    color: isDarkMode ? '#e5e7eb' : '#4b5563',
                                    lineHeight: 1.5,
                                }}
                            >
                                {message}
                            </Text>
                        </Box>
                    </Group>

                    {action && (
                        <Box mt="md">
                            {action}
                        </Box>
                    )}
                </Box>
            </Group>

            {showProgress && (
                <NotificationProgress duration={duration} type={type} />
            )}
        </Box>
    );
};

// Enhanced Notification Provider
export const NotificationProvider = ({ children }) => {
    // 기본 알림 함수들
    const showNotification = useCallback((options) => {
        const {
            type = 'info',
            title,
            message,
            duration = 5000,
            showProgress = true,
            badge,
            action,
            position = 'top-right',
            isDarkMode = false,
            autoClose = duration,
            ...otherOptions
        } = options;

        return notifications.show({
            title: null,
            message: (
                <CustomNotificationContent
                    title={title}
                    message={message}
                    type={type}
                    showProgress={showProgress}
                    duration={duration}
                    badge={badge}
                    action={action}
                    isDarkMode={isDarkMode}
                />
            ),
            autoClose,
            withCloseButton: true,
            position,
            styles: () => getNotificationStyles(type, isDarkMode),
            ...otherOptions,
        });
    }, []);

    // 편의 메소드들
    const success = useCallback((message, options = {}) => {
        return showNotification({
            type: 'success',
            message,
            title: options.title || '성공',
            ...options,
        });
    }, [showNotification]);

    const error = useCallback((message, options = {}) => {
        return showNotification({
            type: 'error',
            message,
            title: options.title || '오류',
            duration: 7000,
            ...options,
        });
    }, [showNotification]);

    const warning = useCallback((message, options = {}) => {
        return showNotification({
            type: 'warning',
            message,
            title: options.title || '주의',
            ...options,
        });
    }, [showNotification]);

    const info = useCallback((message, options = {}) => {
        return showNotification({
            type: 'info',
            message,
            title: options.title || '알림',
            ...options,
        });
    }, [showNotification]);

    // 특별한 알림 타입들
    const premium = useCallback((message, options = {}) => {
        return showNotification({
            type: 'premium',
            message,
            title: options.title || '프리미엄',
            badge: 'PRO',
            duration: 8000,
            ...options,
        });
    }, [showNotification]);

    const celebration = useCallback((message, options = {}) => {
        return showNotification({
            type: 'celebration',
            message,
            title: options.title || '축하합니다!',
            badge: 'NEW',
            duration: 6000,
            ...options,
        });
    }, [showNotification]);

    // 진행률과 함께 표시되는 알림
    const withProgress = useCallback((message, options = {}) => {
        return showNotification({
            message,
            showProgress: true,
            duration: options.duration || 5000,
            ...options,
        });
    }, [showNotification]);

    // 액션 버튼과 함께 표시되는 알림
    const withAction = useCallback((message, actionElement, options = {}) => {
        return showNotification({
            message,
            action: actionElement,
            autoClose: false, // 액션이 있는 경우 자동 닫기 비활성화
            ...options,
        });
    }, [showNotification]);

    // 모든 알림 제거
    const clearAll = useCallback(() => {
        notifications.clean();
    }, []);

    // 특정 알림 제거
    const hide = useCallback((id) => {
        notifications.hide(id);
    }, []);

    const value = {
        show: showNotification,
        success,
        error,
        warning,
        info,
        premium,
        celebration,
        withProgress,
        withAction,
        clearAll,
        hide,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}

            {/* 2025 트렌드 애니메이션 스타일 */}
            <style>
                {`
                    @keyframes iconPulse {
                        0%, 100% { 
                            transform: scale(1); 
                            opacity: 1; 
                        }
                        50% { 
                            transform: scale(1.05); 
                            opacity: 0.8; 
                        }
                    }
                    
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                    
                    /* Mantine 알림 컨테이너 커스터마이징 */
                    .mantine-Notification-root {
                        animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    
                    .mantine-Notification-root[data-state="exiting"] {
                        animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    
                    /* 2025 트렌드 호버 효과 */
                    .mantine-Notification-root:hover {
                        transform: translateY(-2px) scale(1.02);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    /* 글로우 효과 */
                    .mantine-Notification-root[data-type="premium"] {
                        box-shadow: 0 0 30px rgba(245, 158, 11, 0.3) !important;
                    }
                    
                    .mantine-Notification-root[data-type="celebration"] {
                        box-shadow: 0 0 30px rgba(139, 92, 246, 0.3) !important;
                    }
                `}
            </style>
        </NotificationContext.Provider>
    );
};

// 사용 예시 컴포넌트
export const NotificationExamples = () => {
    const notification = useNotification();

    const examples = [
        {
            label: '성공 알림',
            action: () => notification.success('데이터가 성공적으로 저장되었습니다!'),
        },
        {
            label: '오류 알림',
            action: () => notification.error('서버 연결에 실패했습니다. 다시 시도해주세요.'),
        },
        {
            label: '경고 알림',
            action: () => notification.warning('변경사항이 저장되지 않았습니다.'),
        },
        {
            label: '정보 알림',
            action: () => notification.info('새로운 업데이트가 available 합니다.'),
        },
        {
            label: '프리미엄 알림',
            action: () => notification.premium('프리미엄 기능이 활성화되었습니다!'),
        },
        {
            label: '축하 알림',
            action: () => notification.celebration('첫 번째 게시글을 작성하셨네요!'),
        },
        {
            label: '액션 포함 알림',
            action: () => notification.withAction(
                '새로운 댓글이 달렸습니다.',
                <ActionIcon size="sm" variant="light">
                    <IconHeart size={16} />
                </ActionIcon>
            ),
        },
    ];

    return (
        <Group gap="sm" wrap="wrap">
            {examples.map((example) => (
                <ActionIcon
                    key={example.label}
                    variant="light"
                    onClick={example.action}
                    title={example.label}
                >
                    <IconBell size={16} />
                </ActionIcon>
            ))}
        </Group>
    );
};