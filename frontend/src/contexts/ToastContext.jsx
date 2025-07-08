
// ========================================
// contexts/ToastContext.jsx - 토스트 컨텍스트
// ========================================
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Portal, Stack, Box } from '@mantine/core';
import Toast from '../components/advanced/Toast/Toast';
import {useMountedState} from "@/hooks/useMountedState.js";

const ToastContext = createContext();

// 액션 타입
const TOAST_ACTIONS = {
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
    CLEAR_ALL: 'CLEAR_ALL',
};

// 초기 상태
const initialState = {
    toasts: [],
};

// 토스트 리듀서
const toastReducer = (state, action) => {
    switch (action.type) {
        case TOAST_ACTIONS.ADD_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, action.payload],
            };

        case TOAST_ACTIONS.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== action.payload),
            };

        case TOAST_ACTIONS.CLEAR_ALL:
            return {
                ...state,
                toasts: [],
            };

        default:
            return state;
    }
};

// 포지션별 스타일
const getPositionStyles = (position) => {
    const styles = {
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none',
    };

    switch (position) {
        case 'top-left':
            return { ...styles, top: '20px', left: '20px' };
        case 'top-center':
            return { ...styles, top: '20px', left: '50%', transform: 'translateX(-50%)' };
        case 'top-right':
            return { ...styles, top: '20px', right: '20px' };
        case 'bottom-left':
            return { ...styles, bottom: '20px', left: '20px' };
        case 'bottom-center':
            return { ...styles, bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
        case 'bottom-right':
            return { ...styles, bottom: '20px', right: '20px' };
        default:
            return { ...styles, top: '20px', right: '20px' };
    }
};

// ToastProvider 컴포넌트
export const ToastProvider = ({ children, maxToasts = 5 }) => {
    console.log('ToastProvider Render');
    const [state, dispatch] = useReducer(toastReducer, initialState);
    const isMounted = useMountedState();

    // 토스트 추가
    const addToast = useCallback((toast) => {
        if (!isMounted()) {
            return;
        }

        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = {
            id,
            position: 'top-right',
            duration: 5000,
            ...toast,
        };

        dispatch({ type: TOAST_ACTIONS.ADD_TOAST, payload: newToast });

        // 최대 개수 초과 시 오래된 토스트 제거
        if (state.toasts.length >= maxToasts) {
            setTimeout(() => {
                if (isMounted()) {
                    dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: state.toasts[0].id });
                }
            }, 100);
        }

        return id;
    }, [state.toasts, maxToasts, isMounted]);

    // 토스트 제거
    const removeToast = useCallback((id) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id });
    }, [isMounted]);

    // 모든 토스트 제거
    const clearAll = useCallback(() => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: TOAST_ACTIONS.CLEAR_ALL });
    }, [isMounted]);

    // 편의 함수들
    const success = useCallback((message, options = {}) => {
        return addToast({ type: 'success', message, ...options });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ type: 'error', message, ...options });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ type: 'warning', message, ...options });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ type: 'info', message, ...options });
    }, [addToast]);

    // 포지션별 토스트 그룹화
    const toastsByPosition = state.toasts.reduce((acc, toast) => {
        const position = toast.position || 'top-right';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(toast);
        return acc;
    }, {});

    const value = {
        toasts: state.toasts,
        addToast,
        removeToast,
        clearAll,
        success,
        error,
        warning,
        info,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* 토스트 렌더링 */}
            <Portal>
                {Object.entries(toastsByPosition).map(([position, toasts]) => (
                    <Box key={position} style={getPositionStyles(position)}>
                        <Stack gap="sm" style={{ pointerEvents: 'auto' }}>
                            {toasts.map((toast) => (
                                <Toast
                                    key={toast.id}
                                    {...toast}
                                    onClose={removeToast}
                                />
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Portal>
        </ToastContext.Provider>
    );
};

// useToast 훅
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
