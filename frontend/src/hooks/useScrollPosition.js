import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('up');

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScrollPosition = () => {
            const scrollY = window.pageYOffset;
            const direction = scrollY > lastScrollY ? 'down' : 'up';

            if (direction !== scrollDirection &&
                (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
                setScrollDirection(direction);
            }

            setScrollPosition(scrollY);
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };

        const throttledUpdate = throttle(updateScrollPosition, 100);
        window.addEventListener('scroll', throttledUpdate);

        return () => window.removeEventListener('scroll', throttledUpdate);
    }, [scrollDirection]);

    return { scrollPosition, scrollDirection };
};