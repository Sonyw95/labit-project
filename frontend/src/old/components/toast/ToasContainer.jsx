import {Box, rem} from "@mantine/core";
import {Toast} from "@/components/toast/index.jsx";

export const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <Box
            style={{
                position: 'fixed',
                top: rem(20),
                right: rem(20),
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: rem(12),
                pointerEvents: 'none',
            }}
        >
            {toasts.map((toast) => (
                <div key={toast.id} style={{ pointerEvents: 'auto' }}>
                    <Toast {...toast} onClose={onRemove} />
                </div>
            ))}
        </Box>
    );
};
