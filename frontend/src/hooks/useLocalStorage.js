import {useCallback, useState} from "react";

export const useLocalStorage = (key, initialValue) => {
    // 초기값을 메모이제이션하여 리렌더링 방지
    const [storedValue, setStoredValue] = useState(() => {
        try {
            if (typeof window === 'undefined') {
                return initialValue;
            }
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // setValue 함수를 useCallback으로 메모이제이션
    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
};
