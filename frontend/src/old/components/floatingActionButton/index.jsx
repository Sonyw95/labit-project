import {Box, rem} from "@mantine/core";

export const FloatingActionButton = ({
                                         icon,
                                         onClick,
                                         position = 'bottom-right',
                                         size = 'md',
                                         color = '#3b82f6',
                                         tooltip,
                                         visible = true,
                                     }) => {
    const getPositionStyles = () => {
        const baseStyles = { position: 'fixed', zIndex: 1000 };

        switch (position) {
            case 'bottom-right':
                return { ...baseStyles, bottom: rem(24), right: rem(24) };
            case 'bottom-left':
                return { ...baseStyles, bottom: rem(24), left: rem(24) };
            case 'top-right':
                return { ...baseStyles, top: rem(24), right: rem(24) };
            case 'top-left':
                return { ...baseStyles, top: rem(24), left: rem(24) };
            default:
                return { ...baseStyles, bottom: rem(24), right: rem(24) };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { width: rem(48), height: rem(48) };
            case 'lg':
                return { width: rem(72), height: rem(72) };
            default:
                return { width: rem(56), height: rem(56) };
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <Box
            onClick={onClick}
            title={tooltip}
            style={{
                ...getPositionStyles(),
                ...getSizeStyles(),
                background: color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -2px rgba(0, 0, 0, 0.15)',
                },
                '&:active': {
                    transform: 'scale(0.95)',
                }
            }}
        >
            {icon}
        </Box>
    );
};
