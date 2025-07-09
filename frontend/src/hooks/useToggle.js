// hooks/useToggle.js
import { useState, useCallback } from 'react';

export const useToggle = (defaultValue) => {
    const [value, setValue] = useState(!!defaultValue);

    const toggle = useCallback(() => setValue(x => !x), []);

    return [value, toggle];
};