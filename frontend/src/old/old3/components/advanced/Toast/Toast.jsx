// ========================================
// components/advanced/Toast/Toast.jsx - 2025 트렌드 토스트 컴포넌트
// ========================================
import React, { useEffect, useRef } from 'react';
import {
    Notification,
    Box,
    Group,
    Text,
    ActionIcon,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconInfoCircle,
    IconBell
} from '@tabler/icons-react';

const Toast = ({
                   id,
                   type = 'info',
                   title,
                   message,
                   duration = 5000,
                   onClose,
                   position = 'top-right',
                   showProgress = true,
                   icon: customIcon,
                   action,
                   ...props
               }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const progressRef = useRef(null);
    const timeoutRef = useRef(null);

    // 2025 트렌드: Low Light 색상 적용
    const getToastStyles = () => {
        const baseStyles = {
            borderRadius: '12px',
            border: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: dark
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
        };

        const typeStyles = {
            success: {
                background: dark
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: `1px solid ${dark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
            },
            error: {
                background: dark
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: `1px solid ${dark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            },
            warning: {
                background: dark
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                border: `1px solid ${dark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)'}`,
            },
            info: {
                background: dark
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                border: `1px solid ${dark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
            }
        };

        return { ...baseStyles, ...typeStyles[type] };
    };

    const getIcon = () => {
        if (customIcon) {
            return customIc
        }on;

        const iconProps = { size: 20 };
        const iconMap = {
            success: <IconCheck {...iconProps} style={{ color: '#10b981' }} />,
            error: <IconX {...iconProps} style={{ color: '#ef4444' }} />,
            warning: <IconAlertTriangle {...iconProps} style={{ color: '#f59e0b' }} />,
            info: <IconInfoCircle {...iconProps} style={{ color: '#3b82f6' }} />
        };

        return iconMap[type] || <IconBell {...iconProps} />;
    };

    // 프로그레스 바 애니메이션
    useEffect(() => {
        if (!showProgress || duration <= 0) {
            return;
        }

        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);

            if (progressRef.current) {
                progressRef.current.style.width = `${100 - progress}%`;
            }

            if (progress < 100) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [duration, showProgress]);

    // 자동 닫기
    useEffect(() => {
        if (duration > 0) {
            timeoutRef.current = setTimeout(() => {
                onClose?.(id);
            }, duration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [duration, onClose, id]);

    return (
        <Box
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...getToastStyles()
            }}
            {...props}
        >
            {/* 프로그레스 바 */}
            {showProgress && duration > 0 && (
                <Box
                    ref={progressRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '3px',
                        width: '100%',
                        background: type === 'success' ? '#10b981' :
                            type === 'error' ? '#ef4444' :
                                type === 'warning' ? '#f59e0b' : '#3b82f6',
                        transition: 'width linear',
                        borderRadius: '12px 12px 0 0',
                    }}
                />
            )}

            <Notification
                withCloseButton={false}
                icon={getIcon()}
                style={{
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    padding: '16px 20px'
                }}
            >
                <Group justify="space-between" align="flex-start" gap="md">
                    <Box style={{ flex: 1 }}>
                        {title && (
                            <Text
                                size="sm"
                                fw={600}
                                mb={4}
                                style={{ color: dark ? '#f0f6fc' : '#1e293b' }}
                            >
                                {title}
                            </Text>
                        )}
                        <Text
                            size="sm"
                            style={{
                                color: dark ? '#8b949e' : '#64748b',
                                lineHeight: 1.4
                            }}
                        >
                            {message}
                        </Text>
                    </Box>

                    <Group gap="xs">
                        {action && (
                            <Box style={{ marginTop: 4 }}>
                                {action}
                            </Box>
                        )}
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => onClose?.(id)}
                            style={{
                                color: dark ? '#8b949e' : '#64748b',
                                '&:hover': {
                                    background: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                                }
                            }}
                        >
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Notification>
        </Box>
    );
};

export default Toast;
