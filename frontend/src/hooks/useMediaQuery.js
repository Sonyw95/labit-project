// useMediaQuery - 반응형 처리
import {useEffect, useState} from "react";

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [query]);

    return matches;
};
