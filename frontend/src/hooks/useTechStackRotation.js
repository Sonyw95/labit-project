import { useState, useEffect } from 'react';
import { TECH_STACK } from '../utils/constants';

export const useTechStackRotation = (loading) => {
    const [currentTech, setCurrentTech] = useState(TECH_STACK);

    useEffect(() => {
        if (!loading) {
            const techTimer = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % TECH_STACK.length);
            }, 3000);

            return () => clearInterval(techTimer);
        }
    }, [loading]);

    return currentTech;
};