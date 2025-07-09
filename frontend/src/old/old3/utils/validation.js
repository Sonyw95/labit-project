// ========================================
// utils/validation.js - 유효성 검사 유틸리티
// ========================================

/**
 * 이메일 유효성 검사
 * @param {string} email - 이메일 주소
 * @returns {boolean} 유효성 여부
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 비밀번호 강도 검사
 * @param {string} password - 비밀번호
 * @returns {object} 강도 정보
 */
export const validatePassword = (password) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;

    let strength = 'weak';
    if (score >= 4) {strength = 'strong';}
    else if (score >= 3) {
        strength = 'medium';
    }

    return {
        ...checks,
        score,
        strength,
        isValid: score >= 3
    };
};

/**
 * 한국 전화번호 유효성 검사
 * @param {string} phone - 전화번호
 * @returns {boolean} 유효성 여부
 */
export const isValidKoreanPhone = (phone) => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return phoneRegex.test(phone);
};

/**
 * URL 유효성 검사
 * @param {string} url - URL
 * @returns {boolean} 유효성 여부
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};