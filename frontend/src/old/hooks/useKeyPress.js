import {useEffect} from "react";

export const useKeyPress = (targetKey, handler) => {
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === targetKey) {
                handler();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [targetKey, handler]);
};