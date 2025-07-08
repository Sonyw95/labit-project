// ========================================
// hooks/useLocalStorage.js - 로컬스토리지 훅 (메모리 누수 방지)
// ========================================
import { useState, useEffect, useCallback, useRef } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const isMountedRef = useRef(false);

    // 초기값 설정 함수 (메모화)
    const getInitialValue = useCallback(() => {
        try {
            if (typeof window === 'undefined') {
                return initialValue;
            }

            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`useLocalStorage error for key "${key}":`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    const [storedValue, setStoredValue] = useState(getInitialValue);

    // 값 설정 함수 (메모화)
    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`useLocalStorage setValue error for key "${key}":`, error);
        }
    }, [key, storedValue]);

    // 값 제거 함수 (메모화)
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`useLocalStorage removeValue error for key "${key}":`, error);
        }
    }, [key, initialValue]);

    // 스토리지 이벤트 리스너 (다른 탭에서의 변경 감지)
    useEffect(() => {
        isMountedRef.current = true;

        const handleStorageChange = (e) => {
            if (e.key === key && isMountedRef.current) {
                try {
                    const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
                    setStoredValue(newValue);
                } catch (error) {
                    console.warn(`useLocalStorage handleStorageChange error:`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            isMountedRef.current = false;
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};
