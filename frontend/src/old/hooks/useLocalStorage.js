import {useCallback, useState} from "react";
import {storage} from "@/utils/localStorage.js";

export const useLocalStorages = ( key, initialValue ) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = storage.get(key);
            return item ? item : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            storage.set(key, valueToStore);
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
};
