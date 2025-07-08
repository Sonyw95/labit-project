import { useEffect, useRef } from 'react';

export const useRenderOptimization = (componentName, shouldLog = import.meta.env.NODE_ENV === 'development') => {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(Date.now());

    useEffect(() => {
        renderCount.current += 1;
        const now = Date.now();
        const timeSinceLastRender = now - lastRenderTime.current;
        lastRenderTime.current = now;

        if (!shouldLog) {
            console.group(`🔄 ${componentName} Render #${renderCount.current}`);
            console.log(`⏱️ Time since last render: ${timeSinceLastRender}ms`);
            console.log(`📊 Total renders: ${renderCount.current}`);
            console.groupEnd();
        }
    });

    return {
        renderCount: renderCount.current,
        resetCount: () => { renderCount.current = 0; }
    };
};