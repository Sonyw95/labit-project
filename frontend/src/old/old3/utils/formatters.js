
// ========================================
// utils/formatters.js - 포맷팅 유틸리티
// ========================================

/**
 * 숫자 포맷팅 (천단위 구분자)
 * @param {number} num - 포맷할 숫자
 * @param {string} locale - 로케일 (기본: ko-KR)
 * @returns {string} 포맷된 숫자
 */
export const formatNumber = (num, locale = 'ko-KR') => {
    if (typeof num !== 'number') {
        return '0';
    }
    return new Intl.NumberFormat(locale).format(num);
};

/**
 * 통화 포맷팅
 * @param {number} amount - 금액
 * @param {string} currency - 통화 코드 (기본: KRW)
 * @param {string} locale - 로케일 (기본: ko-KR)
 * @returns {string} 포맷된 통화
 */
export const formatCurrency = (amount, currency = 'KRW', locale = 'ko-KR') => {
    if (typeof amount !== 'number') {
        return '₩0';
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * 날짜 포맷팅
 * @param {Date|string} date - 날짜
 * @param {object} options - 포맷 옵션
 * @returns {string} 포맷된 날짜
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...options
    };

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(dateObj);
};

/**
 * 상대 시간 포맷팅 (몇 분 전, 몇 시간 전 등)
 * @param {Date|string} date - 날짜
 * @returns {string} 상대 시간
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diff = now - targetDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return `${years}년 전`;
    }
    if (months > 0) {
        return `${months}개월 전`;
    }
    if (weeks > 0) {
        return `${weeks}주 전`;
    }
    if (days > 0) {
        return `${days}일 전`;
    }
    if (hours > 0) {
        return `${hours}시간 전`;
    }
    if (minutes > 0) {
        return `${minutes}분 전`;
    }
    return '방금 전';
};

/**
 * 파일 크기 포맷팅
 * @param {number} bytes - 바이트 크기
 * @param {number} decimals - 소수점 자릿수
 * @returns {string} 포맷된 파일 크기
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) {
        return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k**i).toFixed(dm))  } ${  sizes[i]}`;
};

/**
 * 전화번호 포맷팅
 * @param {string} phoneNumber - 전화번호
 * @returns {string} 포맷된 전화번호
 */
export const formatPhoneNumber = (phoneNumber) => {
    const cleaned = (`${  phoneNumber}`).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }

    return phoneNumber;
};

/**
 * 퍼센트 포맷팅
 * @param {number} value - 값 (0-1 또는 0-100)
 * @param {number} decimals - 소수점 자릿수
 * @param {boolean} isDecimal - 입력값이 소수인지 여부
 * @returns {string} 포맷된 퍼센트
 */
export const formatPercentage = (value, decimals = 1, isDecimal = true) => {
    const percentage = isDecimal ? value * 100 : value;
    return `${percentage.toFixed(decimals)}%`;
};

/**
 * 텍스트 자르기 (말줄임표)
 * @param {string} text - 원본 텍스트
 * @param {number} maxLength - 최대 길이
 * @param {string} suffix - 접미사 (기본: ...)
 * @returns {string} 자른 텍스트
 */
export const truncateText = (text, maxLength, suffix = '...') => {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + suffix;
};

/**
 * URL 슬러그 생성
 * @param {string} text - 원본 텍스트
 * @returns {string} URL 슬러그
 */
export const createSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 특수문자 제거
        .replace(/[\s_-]+/g, '-') // 공백을 하이픈으로
        .replace(/^-+|-+$/g, ''); // 시작/끝 하이픈 제거
};