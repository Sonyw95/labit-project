// 고성능 로딩 컴포넌트
import {Box, LoadingOverlay, Skeleton} from "@mantine/core";
import {memo, useMemo} from "react";

const OptimizedLoading = memo(({ type = 'page' }) => {
    const loadingContent = useMemo(() => {
        switch (type) {
            case 'page':
                return <Skeleton type="card" count={3} />;
            case 'modal':
                return <LoadingOverlay visible overlayBlur={2} />;
            case 'component':
                return <Skeleton type="text" count={2} />;
            default:
                return <Skeleton type="text" count={1} />;
        }
    }, [type]);

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: type === 'page' ? '100vh' : '200px',
                gap: '1rem',
                padding: '2rem',
            }}
        >
            {loadingContent}
        </Box>
    );
});

OptimizedLoading.displayName = 'OptimizedLoading';

export default OptimizedLoading;