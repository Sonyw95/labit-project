// Toast 컴포넌트 (Mantine notifications 기반)
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconInfoCircle,
} from '@tabler/icons-react';

export const showToast = {
    success: (title, message, options = {}) => {
        return notifications.show({
            title,
            message,
            color: 'green',
            icon: <IconCheck size={16} />,
            autoClose: 4000,
            withCloseButton: true,
            ...options,
        });
    },

    error: (title, message, options = {}) => {
        return notifications.show({
            title,
            message,
            color: 'red',
            icon: <IconX size={16} />,
            autoClose: 6000,
            withCloseButton: true,
            position: 'top-right',
            ...options,
        });
    },

    warning: (title, message, options = {}) => {
        return notifications.show({
            title,
            message,
            color: 'yellow',
            icon: <IconAlertTriangle size={16} />,
            autoClose: 5000,
            withCloseButton: true,
            ...options,
        });
    },

    info: (title, message, options = {}) => {
        return notifications.show({
            title,
            message,
            color: 'blue',
            icon: <IconInfoCircle size={16} />,
            autoClose: 4000,
            withCloseButton: true,
            ...options,
        });
    },

    loading: (title, message, options = {}) => {
        return notifications.show({
            id: options.id || 'loading',
            title,
            message,
            loading: true,
            autoClose: false,
            withCloseButton: false,
            ...options,
        });
    },

    update: (id, { title, message, type = 'success', ...options }) => {
        const config = {
            success: { color: 'green', icon: <IconCheck size={16} /> },
            error: { color: 'red', icon: <IconX size={16} /> },
            warning: { color: 'yellow', icon: <IconAlertTriangle size={16} /> },
            info: { color: 'blue', icon: <IconInfoCircle size={16} /> },
        };

        return notifications.update({
            id,
            title,
            message,
            loading: false,
            autoClose: 4000,
            withCloseButton: true,
            ...config[type],
            ...options,
        });
    },

    hide: (id) => {
        notifications.hide(id);
    },

    clean: () => {
        notifications.clean();
    },
};
