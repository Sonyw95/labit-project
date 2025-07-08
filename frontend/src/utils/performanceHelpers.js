// ========================================
// utils/performanceHelpers.js - 성능 최적화 유틸리티
// ========================================

/**
 * 함수 메모화 (중복 계산 방지)
 * @param {Function} fn - 메모화할 함수
 * @param {Function} getKey - 키 생성 함수 (선택사항)
 * @returns {Function} 메모화된 함수
 */
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
    const cache = new Map();

    return (...args) => {
        const key = getKey(...args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

/**
 * 이미지 지연 로딩
 * @param {string} src - 이미지 소스
 * @param {string} placeholder - 플레이스홀더 이미지
 * @returns {Promise<string>} 로드된 이미지 소스
 */
export const lazyLoadImage = (src, placeholder = '') => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

        // 플레이스홀더 먼저 반환
        if (placeholder) {
            setTimeout(() => {
                img.src = src;
            }, 100);
            resolve(placeholder);
        } else {
            img.src = src;
        }
    });
};

/**
 * RAF를 이용한 디바운스 (스크롤 등에 최적화)
 * @param {Function} callback - 실행할 콜백
 * @returns {Function} 디바운스된 함수
 */
export const rafDebounce = (callback) => {
    let rafId = null;

    return (...args) => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            callback(...args);
        });
    };
};

/**
 * 배치 DOM 업데이트 (리플로우 최소화)
 * @param {Function} callback - DOM 업데이트 함수
 */
export const batchDOMUpdates = (callback) => {
    requestAnimationFrame(() => {
        callback();
    });
};