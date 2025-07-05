import { useState, useEffect, useRef } from 'react';

export const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const elementRef = useRef(null);

    const {
        threshold = 0,
        root = null,
        rootMargin = '0%',
        freezeOnceVisible = false,
    } = options;

    useEffect(() => {
        const element = elementRef.current;

        if (!element || typeof window.IntersectionObserver === 'undefined') {
            return;
        }

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(([entry]) => {
            const isElementIntersecting = entry.isIntersecting;

            if (!hasIntersected && isElementIntersecting) {
                setHasIntersected(true);
            }

            if (!freezeOnceVisible || !hasIntersected) {
                setIsIntersecting(isElementIntersecting);
            }
        }, observerParams);

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, root, rootMargin, freezeOnceVisible, hasIntersected]);

    return {
        elementRef,
        isIntersecting,
        hasIntersected,
    };
};

// Hook for multiple elements
export const useIntersectionObserverMultiple = (options = {}) => {
    const [entries, setEntries] = useState(new Map());
    const observerRef = useRef(null);
    const elementsRef = useRef(new Set());

    const { threshold = 0, root = null, rootMargin = '0%' } = options;

    useEffect(() => {
        if (typeof window.IntersectionObserver === 'undefined') {
            return;
        }

        const observerParams = { threshold, root, rootMargin };

        observerRef.current = new IntersectionObserver((entries) => {
            setEntries(prev => {
                const newEntries = new Map(prev);
                entries.forEach(entry => {
                    newEntries.set(entry.target, {
                        isIntersecting: entry.isIntersecting,
                        intersectionRatio: entry.intersectionRatio,
                        boundingClientRect: entry.boundingClientRect,
                    });
                });
                return newEntries;
            });
        }, observerParams);

        // Observe all existing elements
        elementsRef.current.forEach(element => {
            if (observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [threshold, root, rootMargin]);

    const observe = (element) => {
        if (element && observerRef.current) {
            elementsRef.current.add(element);
            observerRef.current.observe(element);
        }
    };

    const unobserve = (element) => {
        if (element && observerRef.current) {
            elementsRef.current.delete(element);
            observerRef.current.unobserve(element);
            setEntries(prev => {
                const newEntries = new Map(prev);
                newEntries.delete(element);
                return newEntries;
            });
        }
    };

    return { entries, observe, unobserve };
};