import {useEffect, useRef, useState} from "react";
import {IconAlertTriangle, IconCheck, IconInfoSmall, IconX} from "@tabler/icons-react";
import {ActionIcon, Box, Group, rem, Text} from "@mantine/core";

export const Toast = ({
                          id,
                          type,
                          title,
                          message,
                          duration = 5000,
                          onClose,
                      }) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        setIsVisible(true);

        if (duration > 0) {
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, duration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <IconCheck size={20} />;
            case 'error': return <IconX size={20} />;
            case 'warning': return <IconAlertTriangle size={20} />;
            default: return <IconInfoSmall size={20} />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return { bg: '#10b981', border: '#059669' };
            case 'error': return { bg: '#ef4444', border: '#dc2626' };
            case 'warning': return { bg: '#f59e0b', border: '#d97706' };
            default: return { bg: '#3b82f6', border: '#2563eb' };
        }
    };

    const colors = getColors();

    return (
        <Box
            style={{
                position: 'relative',
                padding: rem(16),
                background: '#ffffff',
                borderRadius: rem(12),
                borderLeft: `4px solid ${colors.bg}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                maxWidth: rem(400),
                overflow: 'hidden',
            }}
        >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                    <Box
                        style={{
                            color: colors.bg,
                            marginTop: rem(2),
                        }}
                    >
                        {getIcon()}
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text
                            size="sm"
                            fw={600}
                            style={{
                                color: '#1f2937',
                                marginBottom: message ? rem(4) : 0,
                            }}
                        >
                            {title}
                        </Text>
                        {message && (
                            <Text size="sm" style={{ color: '#6b7280' }}>
                                {message}
                            </Text>
                        )}
                    </Box>
                </Group>
                <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={handleClose}
                    style={{
                        color: '#9ca3af',
                        '&:hover': {
                            color: '#374151',
                            background: '#f3f4f6',
                        }
                    }}
                >
                    <IconX size={16} />
                </ActionIcon>
            </Group>

            {/* Progress bar */}
            {duration > 0 && (
                <Box
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: rem(3),
                        background: colors.bg,
                        borderRadius: `0 0 ${rem(12)} 0`,
                        animation: `shrink ${duration}ms linear forwards`,
                    }}
                />
            )}

            <style>
                {`
                    @keyframes shrink {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                `}
            </style>
        </Box>
    );
};
