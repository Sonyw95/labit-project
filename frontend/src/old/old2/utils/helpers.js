// BackgroundBlur 유틸리티 함수
import {alpha} from "@mantine/core";

export function BackgroundBlur(props) {
    const blur = 6;
    const alphaPoint = props?.alpha || 0.3;
    const color = props.color;
    return{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, alphaPoint),
    }
}
// 태그 색상 매핑 함수
export const getTagColor = (color) => {
    const colorMap = {
        blue: '#3b82f6',
        green: '#10b981',
        orange: '#f59e0b',
        indigo: '#6366f1',
        yellow: '#eab308'
    };
    return colorMap[color] || '#6b7280';
};

// 기술 스택 설정 함수
export const getTechConfig = (techName, isActive = false) => {
    const configs = {
        Java: {
            icon: '☕',
            color: isActive ? '#f59e0b' : '#6b7280'
        },
        Spring: {
            icon: '🍃',
            color: isActive ? '#10b981' : '#6b7280'
        },
        React: {
            icon: '⚛️',
            color: isActive ? '#3b82f6' : '#6b7280'
        }
    };
    return configs[techName] || { icon: '💻', color: '#6b7280' };
};


export const ColorHelper = {
    // 헥스 색상을 RGB로 변환
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // RGB를 헥스로 변환
    rgbToHex: (r, g, b) => {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    },

    // 색상에 알파값 추가
    addAlpha: (color, alpha) => {
        const rgb = ColorHelper.hexToRgb(color);
        return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : color;
    },

    // 색상 밝게/어둡게 조정
    adjustBrightness: (color, amount) => {
        const rgb = ColorHelper.hexToRgb(color);
        if (!rgb) return color;

        const adjust = (value) => Math.max(0, Math.min(255, value + amount));

        return ColorHelper.rgbToHex(
            adjust(rgb.r),
            adjust(rgb.g),
            adjust(rgb.b)
        );
    },

    // 그라디언트 생성
    createGradient: (color1, color2, direction = 'to right') => {
        return `linear-gradient(${direction}, ${color1}, ${color2})`;
    },

    // 2025 트렌드 색상 팔레트
    palette: {
        primary: '#4c6ef5',
        secondary: '#10b981',
        accent: '#f59e0b',
        success: '#22c55e',
        warning: '#f97316',
        error: '#ef4444',
        info: '#3b82f6',
        dark: '#1e293b',
        light: '#f8fafc',
        purple: '#8b5cf6',
        pink: '#ec4899',
        cyan: '#06b6d4',
        emerald: '#059669',
        rose: '#f43f5e',
        amber: '#d97706',
    },

    // 다크 테마 색상
    darkTheme: {
        background: '#0d1117',
        surface: '#161b22',
        surfaceVariant: '#21262d',
        border: '#30363d',
        text: '#f0f6fc',
        textSecondary: '#8b949e',
        hover: '#21262d',
    }
};

export const Formatter = {
    // 숫자 포맷팅
    number: (value, options = {}) => {
        const defaultOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            ...options
        };
        return new Intl.NumberFormat('ko-KR', defaultOptions).format(value);
    },

    // 통화 포맷팅
    currency: (value, currency = 'KRW') => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: currency,
        }).format(value);
    },

    // 날짜 포맷팅
    date: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        };
        return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(new Date(date));
    },

    // 상대 시간 포맷팅
    relativeTime: (date) => {
        const now = new Date();
        const targetDate = new Date(date);
        const diffInSeconds = Math.floor((now - targetDate) / 1000);

        if (diffInSeconds < 60) return '방금 전';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

        return Formatter.date(date);
    },

    // 파일 크기 포맷팅
    fileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 텍스트 자르기
    truncate: (text, length = 100, suffix = '...') => {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },

    // 슬러그 생성
    slug: (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9ㄱ-힣]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    },

    // 읽기 시간 계산
    readingTime: (text, wordsPerMinute = 200) => {
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes}분 읽기`;
    }
};

export const Validation = {
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    password: (password) => {
        // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    },

    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    phone: (phone) => {
        const re = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
        return re.test(phone);
    },

    required: (value) => {
        return value !== null && value !== undefined && value !== '';
    },

    minLength: (value, min) => {
        return value && value.length >= min;
    },

    maxLength: (value, max) => {
        return value && value.length <= max;
    }
};
