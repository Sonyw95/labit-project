import {alpha} from "@mantine/core";

// eslint-disable-next-line react-refresh/only-export-components
export const backgroundBlur =(props) => {
    const blur = 6;
    const alphaPoint = props?.alpha || 0.3;
    const color = props.color;
    return{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, alphaPoint),
    }
}

export const IconBrandKakao = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z"/>
    </svg>
)



// Color Helper Functions
export const colorHelpers = {
    // HEX를 RGB로 변환
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // RGB를 HEX로 변환
    rgbToHex: (r, g, b) => {
        return `#${  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },

    // 색상 밝기 계산
    getBrightness: (hex) => {
        const rgb = colorHelpers.hexToRgb(hex);
        if (!rgb) {
            return 0;
        }
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },

    // 텍스트 색상 결정 (밝은 배경에는 어두운 텍스트, 어두운 배경에는 밝은 텍스트)
    getContrastColor: (hex) => {
        const brightness = colorHelpers.getBrightness(hex);
        return brightness > 128 ? '#000000' : '#ffffff';
    },

    // 색상에 투명도 적용
    addAlpha: (hex, alpha) => {
        const rgb = colorHelpers.hexToRgb(hex);
        if (!rgb) {
            return hex;
        }
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    },

    // 색상 밝게/어둡게 조정
    adjustBrightness: (hex, percent) => {
        const rgb = colorHelpers.hexToRgb(hex);
        if (!rgb) {
            return hex;
        }

        const adjust = (color) => {
            const adjusted = Math.round(color * (100 + percent) / 100);
            return Math.max(0, Math.min(255, adjusted));
        };

        return colorHelpers.rgbToHex(
            adjust(rgb.r),
            adjust(rgb.g),
            adjust(rgb.b)
        );
    },

    // 테마 색상 팔레트 생성
    generatePalette: (baseColor) => {
        return {
            50: colorHelpers.adjustBrightness(baseColor, 80),
            100: colorHelpers.adjustBrightness(baseColor, 60),
            200: colorHelpers.adjustBrightness(baseColor, 40),
            300: colorHelpers.adjustBrightness(baseColor, 20),
            400: colorHelpers.adjustBrightness(baseColor, 10),
            500: baseColor,
            600: colorHelpers.adjustBrightness(baseColor, -10),
            700: colorHelpers.adjustBrightness(baseColor, -20),
            800: colorHelpers.adjustBrightness(baseColor, -30),
            900: colorHelpers.adjustBrightness(baseColor, -40),
        };
    }
};

// Format Helper Functions
export const formatHelpers = {
    // 숫자 포맷팅 (1000 -> 1K, 1000000 -> 1M)
    formatNumber: (num) => {
        if (num < 1000) {
            return num.toString();
        }
        if (num < 1000000) {
            return `${(num / 1000).toFixed(1)  }K`;
        }
        if (num < 1000000000) {
            return `${(num / 1000000).toFixed(1)  }M`;
        }
        return `${(num / 1000000000).toFixed(1)  }B`;
    },

    // 날짜 포맷팅
    formatDate: (date, format = 'YYYY-MM-DD') => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        const formats = {
            'YYYY-MM-DD': `${year}-${month}-${day}`,
            'MM/DD/YYYY': `${month}/${day}/${year}`,
            'DD.MM.YYYY': `${day}.${month}.${year}`,
            'YYYY년 MM월 DD일': `${year}년 ${month}월 ${day}일`,
            'HH:mm': `${hours}:${minutes}`,
            'YYYY-MM-DD HH:mm': `${year}-${month}-${day} ${hours}:${minutes}`
        };

        return formats[format] || formats['YYYY-MM-DD'];
    },

    // 상대적 시간 표시 (1분 전, 1시간 전 등)
    formatRelativeTime: (date) => {
        const now = new Date();
        const target = new Date(date);
        const diffInSeconds = Math.floor((now - target) / 1000);

        if (diffInSeconds < 60) {
            return '방금 전';
        }
        if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}분 전`;
        }
        if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        }
        if (diffInSeconds < 2592000) {
            return `${Math.floor(diffInSeconds / 86400)}일 전`;
        }
        if (diffInSeconds < 31536000) {
            return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
        }
        return `${Math.floor(diffInSeconds / 31536000)}년 전`;
    },

    // 파일 크기 포맷팅
    formatFileSize: (bytes) => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / k**i).toFixed(2))  } ${  sizes[i]}`;
    },

    // 통화 포맷팅
    formatCurrency: (amount, currency = 'KRW', locale = 'ko-KR') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(amount);
    },

    // 퍼센트 포맷팅
    formatPercent: (value, decimals = 1) => {
        return `${(value * 100).toFixed(decimals)  }%`;
    },

    // 전화번호 포맷팅
    formatPhoneNumber: (phoneNumber) => {
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        return phoneNumber;
    }
};

// String Helper Functions
export const stringHelpers = {
    // 문자열 자르기 (말줄임표 추가)
    truncate: (str, length = 100, suffix = '...') => {
        if (str.length <= length) {
            return str;
        }
        return str.substring(0, length).trim() + suffix;
    },

    // 카멜케이스로 변환
    toCamelCase: (str) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    },

    // 케밥케이스로 변환
    toKebabCase: (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },

    // 스네이크케이스로 변환
    toSnakeCase: (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    },

    // 첫 글자 대문자
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // 각 단어의 첫 글자 대문자
    titleCase: (str) => {
        return str.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    // HTML 태그 제거
    stripHtml: (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    },

    // 이메일 유효성 검사
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // URL 유효성 검사
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // 랜덤 문자열 생성
    generateRandomString: (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Array Helper Functions
export const arrayHelpers = {
    // 배열에서 중복 제거
    unique: (arr) => [...new Set(arr)],

    // 객체 배열에서 특정 키로 중복 제거
    uniqueBy: (arr, key) => {
        const seen = new Set();
        return arr.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    },

    // 배열을 청크로 나누기
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },

    // 배열 섞기
    shuffle: (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // 객체 배열 정렬
    sortBy: (arr, key, order = 'asc') => {
        return [...arr].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (order === 'desc') {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
    },

    // 객체 배열에서 특정 키로 그룹화
    groupBy: (arr, key) => {
        return arr.reduce((groups, item) => {
            const value = item[key];
            groups[value] = groups[value] || [];
            groups[value].push(item);
            return groups;
        }, {});
    }
};

// Object Helper Functions
export const objectHelpers = {
    // 깊은 복사
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') {return obj;}
        if (obj instanceof Date) {return new Date(obj.getTime());}
        if (obj instanceof Array) {return obj.map(item => objectHelpers.deepClone(item));}
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (Object.hasOwn(obj, key)) {
                    clonedObj[key] = objectHelpers.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    // 객체 병합 (깊은 병합)
    deepMerge: (target, source) => {
        const result = { ...target };
        for (const key in source) {
            if (Object.hasOwn(source, key)) {
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                    result[key] = objectHelpers.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    },

    // 중첩된 객체에서 값 가져오기
    get: (obj, path, defaultValue) => {
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            if (result === null || result === undefined) {
                return defaultValue;
            }
            result = result[key];
        }
        return result !== undefined ? result : defaultValue;
    },

    // 중첩된 객체에 값 설정
    set: (obj, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;

        for (const key of keys) {
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        current[lastKey] = value;
        return obj;
    },

    // 빈 값 제거
    removeEmpty: (obj) => {
        const cleaned = {};
        for (const key in obj) {
            if (Object.hasOwn(obj, key)) {
                const value = obj[key];
                if (value !== null && value !== undefined && value !== '') {
                    if (typeof value === 'object' && !Array.isArray(value)) {
                        const cleanedNested = objectHelpers.removeEmpty(value);
                        if (Object.keys(cleanedNested).length > 0) {
                            cleaned[key] = cleanedNested;
                        }
                    } else {
                        cleaned[key] = value;
                    }
                }
            }
        }
        return cleaned;
    }
};

// Browser Helper Functions
export const browserHelpers = {
    // 클립보드에 복사
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // 폴백: 구형 브라우저 지원
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.error(err)
            return true;
        }
    },

    // 파일 다운로드
    downloadFile: (data, filename, type = 'text/plain') => {
        const blob = new Blob([data], { type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    // 스크롤 위치
    getScrollPosition: () => ({
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop,
    }),

    // 부드러운 스크롤
    smoothScrollTo: (element, duration = 500) => {
        const start = window.pageYOffset;
        const target = element.offsetTop;
        const distance = target - start;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) {startTime = currentTime;}
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {requestAnimationFrame(animation);}
        };

        const easeInOutQuad = (t, b, c, d) => {
            // eslint-disable-next-line no-param-reassign
            t /= d / 2;
            if (t < 1) {return c / 2 * t * t + b;}
            // eslint-disable-next-line no-param-reassign
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    },

    // 디바이스 정보
    getDeviceInfo: () => ({
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        browser: (() => {
            const userAgent = navigator.userAgent;
            if (userAgent.includes('Chrome')) {
                return 'Chrome';
            }
            if (userAgent.includes('Firefox')) {
                return 'Firefox';
            }
            if (userAgent.includes('Safari')) {
                return 'Safari';
            }
            if (userAgent.includes('Edge')) {
                return 'Edge';
            }
            return 'Unknown';
        })(),
    })
};