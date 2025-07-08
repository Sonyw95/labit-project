// ========================================
// utils/colorHelpers.js - 색상 관련 유틸리티
// ========================================

/**
 * HEX를 RGB로 변환
 * @param {string} hex - HEX 색상 코드
 * @returns {object} RGB 객체
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * RGB를 HEX로 변환
 * @param {number} r - Red 값
 * @param {number} g - Green 값
 * @param {number} b - Blue 값
 * @returns {string} HEX 색상 코드
 */
export const rgbToHex = (r, g, b) => {
    return `#${  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * 색상 밝기 계산 (0-255)
 * @param {string} color - HEX 색상 코드
 * @returns {number} 밝기 값
 */
export const getBrightness = (color) => {
    const rgb = hexToRgb(color);
    if (!rgb) {
        return 0;
    }
    return Math.round(((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000);
};

/**
 * 색상이 어두운지 판단
 * @param {string} color - HEX 색상 코드
 * @returns {boolean} 어두운 색상 여부
 */
export const isDarkColor = (color) => {
    return getBrightness(color) < 128;
};

/**
 * 대비되는 텍스트 색상 반환
 * @param {string} backgroundColor - 배경색 HEX 코드
 * @returns {string} 텍스트 색상 (검정 또는 흰색)
 */
export const getContrastColor = (backgroundColor) => {
    return isDarkColor(backgroundColor) ? '#ffffff' : '#000000';
};

/**
 * 색상에 투명도 추가
 * @param {string} color - HEX 색상 코드
 * @param {number} alpha - 투명도 (0-1)
 * @returns {string} RGBA 색상
 */
export const addAlpha = (color, alpha) => {
    const rgb = hexToRgb(color);
    if (!rgb) {
        return color;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * 색상 밝게/어둡게 조정
 * @param {string} color - HEX 색상 코드
 * @param {number} amount - 조정량 (-100 ~ 100)
 * @returns {string} 조정된 HEX 색상
 */
export const adjustBrightness = (color, amount) => {
    const rgb = hexToRgb(color);
    if (!rgb) {
        return color;
    }

    const adjust = (value) => {
        const adjusted = value + (amount * 255 / 100);
        return Math.max(0, Math.min(255, Math.round(adjusted)));
    };

    return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
};

/**
 * 2025 트렌드 색상 팔레트
 */
export const trendColors = {
    // Low Light 트렌드 (어두운 색상)
    lowLight: {
        primary: '#1a1b23',
        secondary: '#2d2e37',
        accent: '#4a4d5a',
        surface: '#16181f',
        text: '#e4e5e7'
    },
    // Bento Box 트렌드 (부드러운 색상)
    bento: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        surface: '#f8fafc',
        neutral: '#64748b'
    },
    // Bold Gradient 트렌드
    boldGradient: {
        orange: '#ff6b35',
        pink: '#ff006e',
        purple: '#8338ec',
        blue: '#3a86ff',
        cyan: '#06ffa5'
    },
    // Retro 트렌드
    retro: {
        neonGreen: '#39ff14',
        hotPink: '#ff1493',
        electricBlue: '#00bfff',
        neonYellow: '#ffff00',
        darkBase: '#1a1a1a'
    }
};

/**
 * 그라디언트 생성기
 * @param {string} color1 - 시작 색상
 * @param {string} color2 - 끝 색상
 * @param {string} direction - 방향 (선택사항)
 * @returns {string} CSS 그라디언트
 */
export const createGradient = (color1, color2, direction = 'to right') => {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

/**
 * 2025 트렌드 그라디언트 프리셋
 */
export const trendGradients = {
    sunset: createGradient('#ff6b35', '#ff006e', '45deg'),
    ocean: createGradient('#06b6d4', '#3b82f6', '135deg'),
    neon: createGradient('#39ff14', '#00bfff', '90deg'),
    cosmic: createGradient('#8338ec', '#3a86ff', '45deg'),
    fire: createGradient('#ff006e', '#ff6b35', '180deg')
};


