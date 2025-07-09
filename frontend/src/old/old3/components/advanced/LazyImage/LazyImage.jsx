
// ========================================
// components/advanced/LazyImage/LazyImage.jsx - 지연 로딩 이미지
// ========================================
import React, { useState, useRef, useEffect } from 'react';
import { Box, Image, Skeleton, Center, Text } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { useIntersectionObserver } from '../../hooks';

const LazyImage = ({
                       src,
                       alt = '',
                       placeholder = null,
                       fallback = null,
                       width = '100%',
                       height = 'auto',
                       radius = 'md',
                       threshold = 0.1,
                       rootMargin = '50px',
                       onLoad,
                       onError,
                       className,
                       style,
                       ...props
                   }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageStatus, setImageStatus] = useState('loading'); // loading, loaded, error
    const [setElement, isIntersecting] = useIntersectionObserver({
        threshold,
        rootMargin,
        freezeOnceVisible: true,
    });

    // 이미지 로딩
    useEffect(() => {
        if (isIntersecting && src && !imageSrc) {
            setImageSrc(src);
        }
    }, [isIntersecting, src, imageSrc]);

    const handleImageLoad = (event) => {
        setImageStatus('loaded');
        onLoad?.(event);
    };

    const handleImageError = (event) => {
        setImageStatus('error');
        onError?.(event);
    };

    const renderContent = () => {
        if (imageStatus === 'loaded') {
            return (
                <Image
                    src={imageSrc}
                    alt={alt}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        width,
                        height,
                        objectFit: 'cover',
                    }}
                    radius={radius}
                    {...props}
                />
            );
        }

        if (imageStatus === 'error') {
            return fallback || (
                <Center
                    style={{
                        width,
                        height: height === 'auto' ? '200px' : height,
                        background: 'var(--mantine-color-gray-1)',
                        borderRadius: 'var(--mantine-radius-md)',
                    }}
                >
                    <Box style={{ textAlign: 'center' }}>
                        <IconPhoto size={48} style={{ color: 'var(--mantine-color-gray-5)' }} />
                        <Text size="sm" c="dimmed" mt="xs">
                            이미지를 불러올 수 없습니다
                        </Text>
                    </Box>
                </Center>
            );
        }

        // 로딩 중이거나 아직 교차하지 않음
        if (placeholder) {
            return placeholder;
        }

        return (
            <Skeleton
                width={width}
                height={height === 'auto' ? '200px' : height}
                radius={radius}
            />
        );
    };

    return (
        <Box
            ref={setElement}
            className={className}
            style={style}
        >
            {imageSrc && imageStatus === 'loading' && (
                <img
                    src={imageSrc}
                    alt={alt}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ display: 'none' }}
                />
            )}
            {renderContent()}
        </Box>
    );
};

export default LazyImage;