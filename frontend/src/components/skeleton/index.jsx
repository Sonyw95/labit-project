import {Box, rem} from "@mantine/core";

export const Skeleton = ({
                             width = '100%',
                             height = rem(20),
                             radius = rem(4),
                             variant = 'rectangle',
                             lines = 1,
                             animate = true,
                         }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'circle':
                return {
                    borderRadius: '50%',
                    width: height,
                };
            case 'text':
                return {
                    borderRadius: rem(4),
                    height: rem(16),
                };
            default:
                return {
                    borderRadius: radius,
                };
        }
    };

    const SkeletonElement = () => (
        <Box
            style={{
                width,
                height,
                background: animate
                    ? 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
                    : '#f0f0f0',
                backgroundSize: animate ? '200% 100%' : 'auto',
                animation: animate ? 'shimmer 1.5s infinite' : 'none',
                ...getVariantStyles(),
            }}
        />
    );

    if (variant === 'text' && lines > 1) {
        return (
            <Box>
                {Array.from({ length: lines }).map((_, index) => (
                    <Box key={index} style={{ marginBottom: index === lines - 1 ? 0 : rem(8) }}>
                        <SkeletonElement />
                    </Box>
                ))}
            </Box>
        );
    }

    return <SkeletonElement />;
};