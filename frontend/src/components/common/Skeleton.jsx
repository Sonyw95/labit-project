
// Skeleton 컴포넌트
import {Skeleton, Stack} from '@mantine/core';
import {memo} from "react";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const SkeletonLoader = memo(({
                                 type = 'text',
                                 count = 1,
                                 height,
                                 width,
                                 radius = 'sm',
                                 animate = true,
                                 ...props
                             }) => {
    const { isDark } = useTheme();

    const getSkeletonConfig = () => {
        switch (type) {
            case 'avatar':
                return { height: 40, width: 40, radius: '50%' };
            case 'title':
                return { height: 24, width: '60%' };
            case 'paragraph':
                return { height: 16, width: '100%' };
            case 'image':
                return { height: 200, width: '100%' };
            case 'card':
                return { height: 300, width: '100%' };
            default:
                return { height: height || 16, width: width || '100%' };
        }
    };

    const config = getSkeletonConfig();

    return (
        <Stack gap="xs" {...props}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                    key={index}
                    height={config.height}
                    width={config.width}
                    radius={config.radius || radius}
                    animate={animate}
                />
            ))}
        </Stack>
    );
});

export default SkeletonLoader;