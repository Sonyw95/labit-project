import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    Box,
    Group,
    Text,
    ActionIcon,
    Stack,
    ThemeIcon,
    Progress,
    useMantineColorScheme,
    Portal,
    Transition,
} from '@mantine/core';
import {
    IconX,
    IconCheck,
    IconAlertTriangle,
    IconInfoCircle,
    IconAlertCircle,
} from '@tabler/icons-react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: 'info',
            duration: 5000,
            ...toast,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove toast
        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const removeAllToasts = () => {
        setToasts([]);
    };

    // Convenience methods
    const success = (message, options = {}) => {
        return addToast({ ...options, message, type: 'success' });
    };

    const error = (message, options = {}) => {
        return addToast({ ...options, message, type: 'error' });
    };

    const warning = (message, options = {}) => {
        return addToast({ ...options, message, type: 'warning' });
    };

    const info = (message, options = {}) => {
        return addToast({ ...options, message, type: 'info' });
    };

    const loading = (message, options = {}) => {
        return addToast({ ...options, message, type: 'loading', duration: 0 });
    };

    const promise = async (promiseOrFunction, options = {}) => {
        const {
            loading: loadingMessage = '처리 중...',
            success: successMessage = '완료되었습니다.',
            error: errorMessage = '오류가 발생했습니다.',
        } = options;

        const toastId = loading(loadingMessage);

        try {
            const result = typeof promiseOrFunction === 'function'
                ? await promiseOrFunction()
                : await promiseOrFunction;

            removeToast(toastId);
            success(successMessage);
            return result;
        } catch (err) {
            removeToast(toastId);
            error(errorMessage);
            throw err;
        }
    };

    return (
        <ToastContext.Provider
            value={{
                toasts,
                addToast,
                removeToast,
                removeAllToasts,
                success,
                error,
                warning,
                info,
                loading,
                promise,
            }}
        >
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const [progress, setProgress] = useState(100);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show animation
        setIsVisible(true);

        // Progress bar animation
        if (toast.duration > 0) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev - (100 / (toast.duration / 100));
                    if (newProgress <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return newProgress;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [toast.duration]);

    const getIcon = () => {
        const iconProps = { size: 18 };

        switch (toast.type) {
            case 'success':
                return <IconCheck {...iconProps} />;
            case 'error':
                return <IconAlertCircle {...iconProps} />;
            case 'warning':
                return <IconAlertTriangle {...iconProps} />;
            case 'loading':
                return <Box style={{
                    width: 18,
                    height: 18,
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />;
            default:
                return <IconInfoCircle {...iconProps} />;
        }
    };

    const getColor = () => {
        switch (toast.type) {
            case 'success':
                return '#10b981';
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'loading':
                return '#3b82f6';
            default:
                return '#6366f1';
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 200);
    };

    return (
        <Transition
            mounted={isVisible}
            transition="slide-left"
            duration={200}
            timingFunction="ease"
        >
            {(styles) => (
                <Box
                    style={{
                        ...styles,
                        position: 'relative',
                        background: dark ? '#161b22' : '#ffffff',
                        border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                        borderRadius: 8,
                        padding: 16,
                        minWidth: 320,
                        maxWidth: 500,
                        boxShadow: dark
                            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                            : '0 4px 12px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <Group gap="sm" align="flex-start">
                        <ThemeIcon
                            size="lg"
                            radius="md"
                            style={{
                                background: getColor(),
                                color: 'white',
                                border: 'none',
                            }}
                        >
                            {getIcon()}
                        </ThemeIcon>

                        <Box style={{ flex: 1 }}>
                            {toast.title && (
                                <Text size="sm" fw={600} mb="xs">
                                    {toast.title}
                                </Text>
                            )}
                            <Text size="sm" style={{ lineHeight: 1.4 }}>
                                {toast.message}
                            </Text>
                            {toast.action && (
                                <Box mt="xs">
                                    {toast.action}
                                </Box>
                            )}
                        </Box>

                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={handleClose}
                            style={{
                                color: dark ? '#8b949e' : '#6b7280',
                            }}
                        >
                            <IconX size={14} />
                        </ActionIcon>
                    </Group>

                    {/* Progress bar */}
                    {toast.duration > 0 && (
                        <Progress
                            value={progress}
                            size="xs"
                            color={getColor()}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                borderRadius: 0,
                            }}
                        />
                    )}
                </Box>
            )}
        </Transition>
    );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <Portal>
            <Box
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    pointerEvents: 'none',
                }}
            >
                <Stack gap="sm">
                    {toasts.map((toast) => (
                        <Box key={toast.id} style={{ pointerEvents: 'auto' }}>
                            <Toast toast={toast} onRemove={removeToast} />
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Portal>
    );
};

// Export individual components for advanced usage
export { Toast, ToastContainer };