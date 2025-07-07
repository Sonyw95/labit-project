import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification, Portal, Stack, rem } from '@mantine/core';
import { IconCheck, IconX, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const getToastIcon = (type) => {
    switch (type) {
        case 'success': return <IconCheck size={18} />;
        case 'error': return <IconX size={18} />;
        case 'warning': return <IconAlertCircle size={18} />;
        case 'info': return <IconInfoCircle size={18} />;
        default: return null;
    }
};

const getToastColor = (type) => {
    switch (type) {
        case 'success': return 'green';
        case 'error': return 'red';
        case 'warning': return 'yellow';
        case 'info': return 'blue';
        default: return 'blue';
    }
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: 'info',
            duration: 4000,
            ...toast,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast
        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const removeAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const success = useCallback((message, options = {}) => {
        return addToast({ ...options, message, type: 'success' });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ ...options, message, type: 'error' });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ ...options, message, type: 'warning' });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ ...options, message, type: 'info' });
    }, [addToast]);

    const value = {
        addToast,
        removeToast,
        removeAllToasts,
        success,
        error,
        warning,
        info,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Portal>
                <div
                    style={{
                        position: 'fixed',
                        top: rem(20),
                        right: rem(20),
                        zIndex: 10000,
                        width: rem(400),
                        maxWidth: '90vw',
                    }}
                >
                    <Stack gap="xs">
                        {toasts.map((toast) => (
                            <Notification
                                key={toast.id}
                                title={toast.title}
                                color={getToastColor(toast.type)}
                                icon={getToastIcon(toast.type)}
                                onClose={() => removeToast(toast.id)}
                                style={{
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'slideInRight 0.3s ease-out',
                                }}
                            >
                                {toast.message}
                            </Notification>
                        ))}
                    </Stack>
                </div>
            </Portal>
        </ToastContext.Provider>
    );
};