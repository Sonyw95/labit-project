// ========================================
// hooks/useCounter.js - 카운터 훅 (메모화된 액션들)
// ========================================
import {useCallback, useState} from "react";

export const useCounter = (initialValue = 0, step = 1) => {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount(prevCount => prevCount + step);
    }, [step]);

    const decrement = useCallback(() => {
        setCount(prevCount => prevCount - step);
    }, [step]);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    const set = useCallback((value) => {
        setCount(value);
    }, []);

    return {
        count,
        increment,
        decrement,
        reset,
        set,
    };
};