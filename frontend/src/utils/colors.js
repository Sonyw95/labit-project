// Color utility functions
export const colors = {
    // Convert hex to RGB
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // Convert RGB to hex
    rgbToHex: (r, g, b) => {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    },

    // Convert hex to HSL
    hexToHsl: (hex) => {
        const rgb = colors.hexToRgb(hex);
        if (!rgb) return null;
        return colors.rgbToHsl(rgb.r, rgb.g, rgb.b);
    },

    // Convert RGB to HSL
    rgbToHsl: (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: h = 0;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    // Convert HSL to RGB
    hslToRgb: (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },

    // Lighten a color
    lighten: (color, amount) => {
        const hsl = colors.hexToHsl(color);
        if (!hsl) return color;

        hsl.l = Math.min(100, hsl.l + amount);
        const rgb = colors.hslToRgb(hsl.h, hsl.s, hsl.l);
        return colors.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Darken a color
    darken: (color, amount) => {
        const hsl = colors.hexToHsl(color);
        if (!hsl) return color;

        hsl.l = Math.max(0, hsl.l - amount);
        const rgb = colors.hslToRgb(hsl.h, hsl.s, hsl.l);
        return colors.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Adjust saturation
    saturate: (color, amount) => {
        const hsl = colors.hexToHsl(color);
        if (!hsl) return color;

        hsl.s = Math.min(100, hsl.s + amount);
        const rgb = colors.hslToRgb(hsl.h, hsl.s, hsl.l);
        return colors.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    desaturate: (color, amount) => {
        const hsl = colors.hexToHsl(color);
        if (!hsl) return color;

        hsl.s = Math.max(0, hsl.s - amount);
        const rgb = colors.hslToRgb(hsl.h, hsl.s, hsl.l);
        return colors.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Adjust hue
    adjustHue: (color, amount) => {
        const hsl = colors.hexToHsl(color);
        if (!hsl) return color;

        hsl.h = (hsl.h + amount) % 360;
        if (hsl.h < 0) hsl.h += 360;

        const rgb = colors.hslToRgb(hsl.h, hsl.s, hsl.l);
        return colors.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    // Get complementary color
    complement: (color) => {
        return colors.adjustHue(color, 180);
    },

    // Generate color palette
    generatePalette: (baseColor, count = 5) => {
        const palette = [];
        const hsl = colors.hexToHsl(baseColor);
        if (!hsl) return [baseColor];

        for (let i = 0; i < count; i++) {
            const lightness = 20 + (60 / (count - 1)) * i;
            const rgb = colors.hslToRgb(hsl.h, hsl.s, lightness);
            palette.push(colors.rgbToHex(rgb.r, rgb.g, rgb.b));
        }

        return palette;
    },

    // Generate triadic colors
    triadic: (color) => {
        return [
            color,
            colors.adjustHue(color, 120),
            colors.adjustHue(color, 240)
        ];
    },

    // Generate analogous colors
    analogous: (color, count = 5) => {
        const colors_array = [];
        const step = 30;
        const start = -(count - 1) * step / 2;

        for (let i = 0; i < count; i++) {
            colors_array.push(colors.adjustHue(color, start + i * step));
        }

        return colors_array;
    },

    // Get contrast ratio
    getContrastRatio: (color1, color2) => {
        const getLuminance = (color) => {
            const rgb = colors.hexToRgb(color);
            if (!rgb) return 0;

            const rsRGB = rgb.r / 255;
            const gsRGB = rgb.g / 255;
            const bsRGB = rgb.b / 255;

            const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
            const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
            const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);

        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);

        return (brightest + 0.05) / (darkest + 0.05);
    },

    // Check if color is accessible
    isAccessible: (color1, color2, level = 'AA') => {
        const ratio = colors.getContrastRatio(color1, color2);
        const requirements = {
            'AA': 4.5,
            'AAA': 7,
            'AA_LARGE': 3,
            'AAA_LARGE': 4.5
        };
        return ratio >= requirements[level];
    },

    // Create alpha variant
    alpha: (color, alpha) => {
        const rgb = colors.hexToRgb(color);
        if (!rgb) return color;
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    },

    // Mix two colors
    mix: (color1, color2, weight = 0.5) => {
        const rgb1 = colors.hexToRgb(color1);
        const rgb2 = colors.hexToRgb(color2);

        if (!rgb1 || !rgb2) return color1;

        const w1 = weight;
        const w2 = 1 - weight;

        const r = Math.round(rgb1.r * w1 + rgb2.r * w2);
        const g = Math.round(rgb1.g * w1 + rgb2.g * w2);
        const b = Math.round(rgb1.b * w1 + rgb2.b * w2);

        return colors.rgbToHex(r, g, b);
    },

    // Random color generator
    random: () => {
        return colors.rgbToHex(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
    },

    // Generate gradient
    gradient: (color1, color2, steps = 10) => {
        const gradient = [];
        for (let i = 0; i < steps; i++) {
            const weight = i / (steps - 1);
            gradient.push(colors.mix(color1, color2, 1 - weight));
        }
        return gradient;
    }
};