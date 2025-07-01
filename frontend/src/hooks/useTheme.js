import {useMediaQuery} from "@mantine/hooks";

export const useTheme = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    return {
        isMobile,
        isTablet,
        isDesktop: !isTablet,
        prefersReducedMotion,
        breakpoints: {
            xs: useMediaQuery('(max-width: 576px)'),
            sm: useMediaQuery('(max-width: 768px)'),
            md: useMediaQuery('(max-width: 992px)'),
            lg: useMediaQuery('(max-width: 1200px)'),
            xl: useMediaQuery('(min-width: 1201px)'),
        }
    };
};