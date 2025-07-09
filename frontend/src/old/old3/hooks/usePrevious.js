// ========================================
// hooks/usePrevious.js - 이전 값 추적 훅
// ========================================
import {useEffect, useRef} from "react";

export const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};