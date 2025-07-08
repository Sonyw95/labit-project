// ========================================
// hooks/useToggle.js - 토글 상태 훅
// ========================================
import {useCallback, useState} from "react";

export const useToggle = (defaultValue = false) => {
    const [value, setValue] = useState(defaultValue);

    const toggle = useCallback((newValue) => {
        setValue(currentValue =>
            typeof newValue === 'boolean' ? newValue : !currentValue
        );
    }, []);

    return [value, toggle];
};
