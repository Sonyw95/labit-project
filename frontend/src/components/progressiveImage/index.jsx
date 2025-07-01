import {useEffect, useRef, useState} from "react";
import {Box} from "@mantine/core";

export const ProgressiveImage = ({
                                     src,
                                     placeholder,
                                     alt,
                                     width,
                                     height,
                                     className,
                                     style,
                                 }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setLoaded(true);
        img.onerror = () => setError(true);
        img.src = src;
    }, [src]);

    return (
        <Box
            style={{
                position: 'relative',
                width,
                height,
                overflow: 'hidden',
                ...style,
            }}
            className={className}
        >
            {/* Placeholder/Loading state */}
            {!loaded && !error && (
                <Box
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: placeholder || 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                    }}
                />
            )}

            {/* Error state */}
            {error && (
                <Box
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f3f4f6',
                        color: '#9ca3af',
                    }}
                >
                    <Text size="sm">이미지를 불러올 수 없습니다</Text>
                </Box>
            )}

            {/* Main image */}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            />

            <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}
            </style>
        </Box>
    );
};