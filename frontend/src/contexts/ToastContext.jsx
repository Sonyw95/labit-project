import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { notifications } from '@mantine/notifications';

const ToastContext = createContext(undefined);
const getToastColor = (type) => {
    switch (type) {
        case 'success': return 'green';
        case 'error': return 'red';
        case 'warning': return 'yellow';
        case 'info': return 'blue';
        default: return 'blue';
    }
};
const toastReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [...state.toasts, action.payload]
            };
        case 'REMOVE_TOAST':
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== action.payload)
            };
        case 'CLEAR_ALL':
            return {
                ...state,
                toasts: []
            };
        default:
            return state;
    }
};

const initialState = {
    toasts: []
};

export const ToastProvider = ({ children }) => {
    const [state, dispatch] = useReducer(toastReducer, initialState);

    const showToast = useCallback(({
                                       type = 'info',
                                       title,
                                       message,
                                       autoClose = 4000,
                                       withCloseButton = true,
                                       ...options
                                   }) => {
        const id = Math.random().toString(36).substr(2, 9);

        const toast = {
            id,
            type,
            title,
            message,
            autoClose,
            withCloseButton,
            ...options
        };

        dispatch({ type: 'ADD_TOAST', payload: toast });

        // Mantine notifications 사용
        notifications.show({
            id,
            title,
            message,
            color: getToastColor(type),
            autoClose,
            withCloseButton,
            ...options
        });

        return id;
    }, []);

    const hideToast = useCallback((id) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
        notifications.hide(id);
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: 'CLEAR_ALL' });
        notifications.cleanQueue();
        notifications.clean();
    }, []);

    const success = useCallback((title, message, options = {}) => {
        return showToast({ type: 'success', title, message, ...options });
    }, [showToast]);

    const error = useCallback((title, message, options = {}) => {
        return showToast({ type: 'error', title, message, ...options });
    }, [showToast]);

    const warning = useCallback((title, message, options = {}) => {
        return showToast({ type: 'warning', title, message, ...options });
    }, [showToast]);

    const info = useCallback((title, message, options = {}) => {
        return showToast({ type: 'info', title, message, ...options });
    }, [showToast]);

    const value = {
        ...state,
        showToast,
        hideToast,
        clearAll,
        success,
        error,
        warning,
        info
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};