export const getDeviceType = () => {
    if (typeof window === 'undefined') {
        return 'desktop';
    }

    const width = window.innerWidth;
    if (width < 768) {
        return 'mobile';
    }
    if (width < 1024) {
        return 'tablet';
    }
    return 'desktop';
};

export const isMobile = () => getDeviceType() === 'mobile';
export const isTablet = () => getDeviceType() === 'tablet';
export const isDesktop = () => getDeviceType() === 'desktop';