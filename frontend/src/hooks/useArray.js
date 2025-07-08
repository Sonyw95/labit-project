// ========================================
// hooks/useArray.js - 배열 조작 훅
// ========================================
import {useCallback, useState} from "react";

export const useArray = (initialArray = []) => {
    const [array, setArray] = useState(initialArray);

    const push = useCallback((element) => {
        setArray(arr => [...arr, element]);
    }, []);

    const remove = useCallback((index) => {
        setArray(arr => arr.filter((_, i) => i !== index));
    }, []);

    const update = useCallback((index, element) => {
        setArray(arr => arr.map((item, i) => i === index ? element : item));
    }, []);

    const clear = useCallback(() => {
        setArray([]);
    }, []);

    const filter = useCallback((callback) => {
        setArray(arr => arr.filter(callback));
    }, []);

    const sort = useCallback((compareFunction) => {
        setArray(arr => [...arr].sort(compareFunction));
    }, []);

    return {
        array,
        set: setArray,
        push,
        remove,
        update,
        clear,
        filter,
        sort,
    };
};