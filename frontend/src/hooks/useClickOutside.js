// ========================================
// hooks/useClickOutside.js - 외부 클릭 감지 훅
// ========================================
import {useEffect, useRef} from "react";

export const useClickOutside = (callback) => {
    const ref = useRef();
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callbackRef.current(event);
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('touchstart', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('touchstart', handleClick);
        };
    }, []);

    return ref;
};
