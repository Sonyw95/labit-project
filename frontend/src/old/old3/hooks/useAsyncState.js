// ========================================
// hooks/useAsyncState.js - 비동기 상태 관리 훅
// ========================================
import {useCallback, useState} from "react";
import {useMountedState} from "@/hooks/useMountedState.js";

export const useAsyncState = (initialState) => {
    const [state, setState] = useState(initialState);
    const isMounted = useMountedState();

    const setAsyncState = useCallback((newState) => {
        if (isMounted()) {
            setState(newState);
        }
    }, [isMounted]);

    return [state, setAsyncState];
};