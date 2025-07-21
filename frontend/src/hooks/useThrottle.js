import {useCallback} from "react";

export const useThrottle = (callback, delay) => {
    // eslint-disable-next-line no-undef
    const lastRun = useRef(Date.now());

    return useCallback((...args) => {
        if (Date.now() - lastRun.current >= delay) {
            callback(...args);
            lastRun.current = Date.now();
        }
    }, [callback, delay]);
};
