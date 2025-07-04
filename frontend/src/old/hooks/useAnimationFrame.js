import {useCallback, useEffect, useRef} from "react";

export const useAnimationFrame = (callback) => {
    const requestRef = useRef();
    const previousTimeRef = useRef();

    const animate = useCallback((time) => {
        if (previousTimeRef.current !== undefined) {
            callback(time - previousTimeRef.current);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }, [callback]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [animate]);
};