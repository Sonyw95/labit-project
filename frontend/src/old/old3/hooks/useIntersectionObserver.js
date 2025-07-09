// ========================================
// hooks/useIntersectionObserver.js - Intersection Observer 훅
// ========================================
import {useEffect, useRef, useState} from "react";

export const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [element, setElement] = useState(null);
    const observerRef = useRef(null);

    const {
        threshold = 0.1,
        root = null,
        rootMargin = '0px',
        freezeOnceVisible = false,
    } = options;

    useEffect(() => {
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isElementIntersecting = entry.isIntersecting;

                if (!freezeOnceVisible || !isIntersecting) {
                    setIsIntersecting(isElementIntersecting);
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);
        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [element, threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

    return [setElement, isIntersecting];
};