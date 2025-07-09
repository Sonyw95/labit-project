export const formatters = {
    // 숫자 포맷팅
    number: (num, options = {}) => {
        const { locale = 'ko-KR', ...formatOptions } = options;
        return new Intl.NumberFormat(locale, formatOptions).format(num);
    },

    // 통화 포맷팅
    currency: (amount, currency = 'KRW', locale = 'ko-KR') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(amount);
    },

    // 날짜 포맷팅
    date: (date, options = {}) => {
        const { locale = 'ko-KR', ...formatOptions } = options;
        return new Intl.DateTimeFormat(locale, formatOptions).format(new Date(date));
    },

    // 상대 시간 포맷팅
    relativeTime: (date, locale = 'ko-KR') => {
        const now = new Date();
        const targetDate = new Date(date);
        const diffInSeconds = Math.floor((now - targetDate) / 1000);

        const intervals = [
            { label: '년', seconds: 31536000 },
            { label: '개월', seconds: 2592000 },
            { label: '일', seconds: 86400 },
            { label: '시간', seconds: 3600 },
            { label: '분', seconds: 60 },
            { label: '초', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count > 0) {
                return `${count}${interval.label} 전`;
            }
        }

        return '방금 전';
    },

    // 파일 크기 포맷팅
    fileSize: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / k**i).toFixed(dm))  } ${  sizes[i]}`;
    },

    // 읽기 시간 계산
    readingTime: (text, wordsPerMinute = 200) => {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes}분`;
    },

    // URL slug 생성
    createSlug: (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // 텍스트 자르기
    truncate: (text, maxLength, suffix = '...') => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength - suffix.length) + suffix;
    },

    // 태그 색상 가져오기
    getTagColor: (tagName) => {
        const colors = {
            javascript: '#f7df1e',
            react: '#61dafb',
            vue: '#4fc08d',
            angular: '#dd0031',
            node: '#339933',
            python: '#3776ab',
            java: '#007396',
            spring: '#6db33f',
            css: '#1572b6',
            html: '#e34f26',
            typescript: '#3178c6',
            aws: '#ff9900',
            docker: '#2496ed',
            kubernetes: '#326ce5'
        };

        const normalizedTag = tagName.toLowerCase().replace(/\s+/g, '');
        return colors[normalizedTag] || '#6b7280';
    }
};