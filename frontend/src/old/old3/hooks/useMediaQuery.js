// ========================================
// hooks/useMediaQuery.js - 미디어 쿼리 훅 (반응형)
// ========================================
import {useEffect, useRef, useState} from "react";

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    const mediaQueryRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        mediaQueryRef.current = window.matchMedia(query);
        setMatches(mediaQueryRef.current.matches);

        const handler = (event) => setMatches(event.matches);

        mediaQueryRef.current.addEventListener('change', handler);

        return () => {
            if (mediaQueryRef.current) {
                mediaQueryRef.current.removeEventListener('change', handler);
            }
        };
    }, [query]);

    return matches;
};
// 편의 함수들
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');