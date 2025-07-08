// ========================================
// utils/deviceHelpers.js - 디바이스 감지 유틸리티
// ========================================

/**
 * 디바이스 타입 감지
 * @returns {object} 디바이스 정보
 */
export const getDeviceInfo = () => {
    if (typeof window === 'undefined') {
        return { isMobile: false, isTablet: false, isDesktop: true };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;

    return {
        isMobile: width <= 768 || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        isIOS: /ipad|iphone|ipod/.test(userAgent),
        isAndroid: /android/.test(userAgent),
        isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
        isChrome: /chrome/.test(userAgent),
        isFirefox: /firefox/.test(userAgent)
    };
};

/**
 * 터치 디바이스 여부 확인
 * @returns {boolean} 터치 디바이스 여부
 */
export const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * 네트워크 상태 확인
 * @returns {object} 네트워크 정보
 */
export const getNetworkInfo = () => {
    if (typeof navigator === 'undefined' || !navigator.connection) {
        return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
    }

    const connection = navigator.connection;
    return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
    };
};
