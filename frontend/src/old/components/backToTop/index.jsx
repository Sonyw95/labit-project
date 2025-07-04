import {useEffect, useState} from "react";
import {FloatingActionButton} from "@/components/floatingActionButton/index.jsx";

export const BackToTop  = ({
                                                        threshold = 300,
                                                        smooth = true,
                                                        icon,
                                                    }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > threshold);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        if (smooth) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            window.scrollTo(0, 0);
        }
    };

    return (
        <FloatingActionButton
            icon={icon || '↑'}
            onClick={scrollToTop}
            visible={isVisible}
            tooltip="맨 위로"
            position="bottom-right"
        />
    );
};