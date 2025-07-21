import {useCallback, useEffect, useState} from "react";
import {ActionIcon, rem, Transition} from "@mantine/core";
import {IconArrowUp} from "@tabler/icons-react";
import {useTheme} from "@/contexts/ThemeContext.jsx";

export const ScrollToTop = ({ threshold = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsVisible(scrollTop > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <Transition mounted={isVisible} transition="slide-up" duration={200}>
            {(styles) => (
                <ActionIcon
                    style={{
                        ...styles,
                        position: 'fixed',
                        bottom: rem(24),
                        right: rem(24),
                        zIndex: 1000,
                        backgroundColor: theme.colors.primary,
                        color: 'white',
                        width: rem(48),
                        height: rem(48),
                        borderRadius: '50%',
                        boxShadow: theme.shadows.lg,
                        '&:hover': {
                            backgroundColor: `${theme.colors.primary  }dd`,
                        }
                    }}
                    onClick={scrollToTop}
                    size="xl"
                >
                    <IconArrowUp size={24} />
                </ActionIcon>
            )}
        </Transition>
    );
};