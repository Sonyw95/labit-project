




// Modal 컴포넌트
import { Modal as MantineModal } from '@mantine/core';
import {memo} from "react";
import {useTheme} from "../../hooks/useTheme.js";

const Modal = memo(({
                        children,
                        opened,
                        onClose,
                        title,
                        size = 'md',
                        centered = true,
                        closeOnClickOutside = true,
                        closeOnEscape = true,
                        withCloseButton = true,
                        overlayProps = {},
                        ...props
                    }) => {

    const { dark } = useTheme();

    return (
        <MantineModal
            opened={opened}
            onClose={onClose}
            title={title}
            size={size}
            centered={centered}
            closeOnClickOutside={closeOnClickOutside}
            closeOnEscape={closeOnEscape}
            withCloseButton={withCloseButton}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
                ...overlayProps,
            }}
            styles={{
                content: {
                    background: dark ? '#161b22' : '#ffffff',
                    border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                },
                header: {
                    background: dark ? '#161b22' : '#ffffff',
                    borderBottom: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                },
                title: {
                    color: dark ? '#f0f6fc' : '#1e293b',
                    fontWeight: 600,
                },
            }}
            {...props}
        >
            {children}
        </MantineModal>
    );
});

Modal.displayName = 'Modal';

export default Modal;