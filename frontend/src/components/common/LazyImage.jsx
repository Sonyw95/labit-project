// LazyImage 컴포넌트
import {memo, useCallback, useEffect, useState} from "react";
import {useIntersectionObserver} from "../../hooks/useIntersectionObserver.js";
import {Box} from "@mantine/core";

const LazyImage = memo(({
                            src,
                            alt,
                            placeholder,
                            fallback,
                            onLoad,
                            onError,
                            className,
                            style,
                            ...props
                        }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [inView, setInView] = useState(false);

    const { ref, isIntersecting } = useIntersectionObserver({
        threshold: 0.1,
        triggerOnce: true,
    });

    useEffect(() => {
        if (isIntersecting) {
            setInView(true);
        }
    }, [isIntersecting]);

    const handleLoad = useCallback(() => {
        setLoaded(true);
        onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
        setError(true);
        onError?.();
    }, [onError]);

    const shouldLoad = inView && src && !error;

    return (
        <Box
            ref={ref}
            className={className}
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...style,
            }}
            {...props}
        >
            {/* 플레이스홀더 */}
            {!loaded && !error && placeholder && (
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8f9fa',
                    }}
                >
                    {placeholder}
                </Box>
            )}

            {/* 실제 이미지 */}
            {shouldLoad && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                />
            )}

            {/* 에러 폴백 */}
            {error && fallback && (
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {fallback}
                </Box>
            )}
        </Box>
    );
});

LazyImage.displayName = 'LazyImage';
export default LazyImage;