import { useMemo } from 'react';
import { useColorSchemeValue } from '../contexts/OptimizedColorSchemeContext';

// 필요한 값만 선택적으로 구독
export const useSelectiveColorScheme = (selector) => {
    const colorSchemeValue = useColorSchemeValue();

    return useMemo(() => {
        return selector ? selector(colorSchemeValue) : colorSchemeValue;
    }, [colorSchemeValue, selector]);
};
