import {useEffect, useRef, useState} from "react";
import {throttle} from "@/utils/performance.js";

export const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState(null);
    const [scrollY, setScrollY] = useState(0);
    const prevScrollY = useRef(0);

    useEffect(() => {
        const updateScrollDirection = throttle(() => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > prevScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < prevScrollY.current) {
                setScrollDirection('up');
            }

            setScrollY(currentScrollY);
            prevScrollY.current = currentScrollY;
        }, 100);

        window.addEventListener('scroll', updateScrollDirection);

        return () => window.removeEventListener('scroll', updateScrollDirection);
    }, []);

    return { scrollDirection, scrollY };
};