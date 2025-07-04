import {useEffect, useRef, useState} from "react";

export const useIntersectionObserver = ( options = {} ) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [entry, setEntry] = useState(null);
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) {
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                setEntry(entry);
            },
            options
        );
        observer.observe(element);
        return () => {
            observer.unobserve(element);
        };
    }, [options]);

    return { ref: elementRef, isIntersecting, entry };
};
