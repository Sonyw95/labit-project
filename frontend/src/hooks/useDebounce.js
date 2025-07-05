import { useState, useEffect } from 'react';

// Debounce hook - delays updating the value until after wait time
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value (passed in) after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Return a cleanup function that will be called every time ...
        // ... useEffect is re-called. useEffect will only be re-called ...
        // ... if value or delay changes (see the inputs array below).
        // This is how we prevent debouncedValue from changing if value is ...
        // ... changed within the delay period. Timeout gets cleared and restarted.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
};

// Advanced debounce hook with cancel functionality
export const useAdvancedDebounce = (value, delay, options = {}) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isDebouncing, setIsDebouncing] = useState(false);

    const { leading = false, trailing = true, maxWait } = options;

    useEffect(() => {
        let handler;
        let maxHandler;

        const updateValue = () => {
            setDebouncedValue(value);
            setIsDebouncing(false);
        };

        if (leading && !isDebouncing) {
            updateValue();
            setIsDebouncing(true);
        }

        if (trailing) {
            handler = setTimeout(() => {
                updateValue();
            }, delay);
        }

        if (maxWait) {
            maxHandler = setTimeout(() => {
                updateValue();
            }, maxWait);
        }

        return () => {
            if (handler) clearTimeout(handler);
            if (maxHandler) clearTimeout(maxHandler);
        };
    }, [value, delay, leading, trailing, maxWait, isDebouncing]);

    const cancel = () => {
        setDebouncedValue(value);
        setIsDebouncing(false);
    };

    const flush = () => {
        setDebouncedValue(value);
        setIsDebouncing(false);
    };

    return {
        debouncedValue,
        isDebouncing,
        cancel,
        flush
    };
};