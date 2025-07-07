import { useState, useEffect } from 'react';

export const useLoadingProgress = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prevProgress + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(timer);
    }, []);

    return { loading, progress };
};