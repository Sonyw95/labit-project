import {useEffect, useState} from "react";

export const useAsyncState = ( asyncFn, deps = [] ) => {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;

        setState(prev => ({ ...prev, loading: true, error: null }));

        asyncFn()
            .then(data => {
                if (!cancelled) {
                    setState({ data, loading: false, error: null });
                }
            })
            .catch(error => {
                if (!cancelled) {
                    setState({ data: null, loading: false, error });
                }
            });

        return () => {
            cancelled = true;
        };
    }, deps);

    return state;
};