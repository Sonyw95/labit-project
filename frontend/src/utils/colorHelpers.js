export const colorHelpers = {
    // 색상 밝기 계산
    getBrightness: (hex) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
    },

    // 색상이 어두운지 확인
    isDark: (hex) => colorHelpers.getBrightness(hex) < 128,

    // 색상 투명도 조절
    withOpacity: (color, opacity) => {
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
            return `#${hex}${alpha}`;
        }
        return color;
    },

    // RGB to HEX 변환
    rgbToHex: (r, g, b) => {
        return `#${[r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? `0${  hex}` : hex;
        }).join('')}`;
    },

    // HEX to RGB 변환
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // 색상 라이트닝
    lighten: (hex, percent) => {
        const rgb = colorHelpers.hexToRgb(hex);
        if (!rgb) {
            return hex;
        }
        const factor = 1 + percent / 100;
        return colorHelpers.rgbToHex(
            Math.min(255, Math.round(rgb.r * factor)),
            Math.min(255, Math.round(rgb.g * factor)),
            Math.min(255, Math.round(rgb.b * factor))
        );
    },

    // 색상 다크닝
    darken: (hex, percent) => {
        const rgb = colorHelpers.hexToRgb(hex);
        if (!rgb) {
            return hex;
        }

        const factor = 1 - percent / 100;
        return colorHelpers.rgbToHex(
            Math.max(0, Math.round(rgb.r * factor)),
            Math.max(0, Math.round(rgb.g * factor)),
            Math.max(0, Math.round(rgb.b * factor))
        );
    }
};
export const getToastColor = (type) => {
    switch (type) {
        case 'success': return 'green';
        case 'error': return 'red';
        case 'warning': return 'yellow';
        case 'info': return 'blue';
        default: return 'blue';
    }
};
