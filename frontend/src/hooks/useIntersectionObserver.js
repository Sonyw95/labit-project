import {useEffect, useMemo, useState} from "react";

export const useIntersectionObserver = (options = {}) => {
    const [entry, setEntry] = useState(null);
    const [node, setNode] = useState(null);

    const observer = useMemo(() => {
        if (typeof window === 'undefined') {
            return null;
        }
        return new IntersectionObserver(([entry]) => setEntry(entry), options);
    }, [options]);

    useEffect(() => {
        if (!observer || !node) {
            return;
        }
        observer.observe(node);
        return () => observer.disconnect();
    }, [observer, node]);

    return [setNode, entry];
};