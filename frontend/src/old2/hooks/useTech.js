import { useState, useEffect } from 'react';

export const useTech = (loading, techStack) => {
    const [currentTech, setCurrentTech] = useState(techStack);

    useEffect(() => {
        if (!loading) {
            const techTimer = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % techStack.length);
            }, 3000);

            return () => clearInterval(techTimer);
        }
    }, [loading]);

    return currentTech;
};