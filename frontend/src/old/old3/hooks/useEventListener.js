// ========================================
// hooks/useEventListener.js - 이벤트 리스너 훅 (메모리 누수 방지)
// ========================================
import {useEffect, useRef} from "react";

export const useEventListener = (eventName, handler, element = null) => {
    const savedHandler = useRef();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const targetElement = element?.current || window;
        if (!targetElement?.addEventListener) return;

        const eventListener = (event) => savedHandler.current(event);
        targetElement.addEventListener(eventName, eventListener);

        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};
