
// ========================================
// utils/errorHelpers.js - 에러 처리 유틸리티
// ========================================

/**
 * 안전한 비동기 함수 실행
 * @param {Function} asyncFn - 비동기 함수
 * @param {any} fallback - 에러 시 반환할 값
 * @returns {Promise} 결과 또는 에러
 */
export const safeAsync = async (asyncFn, fallback = null) => {
    try {
        return await asyncFn();
    } catch (error) {
        console.error('Async function error:', error);
        return fallback;
    }
};

/**
 * 재시도 로직
 * @param {Function} fn - 실행할 함수
 * @param {number} retries - 재시도 횟수
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Promise} 실행 결과
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retry(fn, retries - 1, delay);
        }
        throw error;
    }
};

/**
 * 에러 분류
 * @param {Error} error - 에러 객체
 * @returns {object} 에러 정보
 */
export const categorizeError = (error) => {
    const isNetworkError = error.name === 'TypeError' && error.message.includes('fetch');
    const isTimeoutError = error.name === 'TimeoutError' || error.message.includes('timeout');
    const isValidationError = error.name === 'ValidationError';

    return {
        type: isNetworkError ? 'network' :
            isTimeoutError ? 'timeout' :
                isValidationError ? 'validation' : 'unknown',
        isRetryable: isNetworkError || isTimeoutError,
        message: error.message,
        stack: error.stack
    };
};