// ========================================
// hooks/useDebounce.js - 디바운스 훅 (리렌더링 방지)
// ========================================
import { useState, useEffect, useRef, useCallback } from 'react';

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeoutRef = useRef(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, delay]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedValue;
};

// 디바운스된 콜백 함수 (더 유연한 사용)
export const useDebouncedCallback = (callback, delay) => {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);

    // 콜백 참조 업데이트
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    );

    // 강제 실행 함수
    const flush = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            callbackRef.current();
        }
    }, []);

    // 취소 함수
    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { debouncedCallback, flush, cancel };
};