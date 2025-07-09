// ========================================
// utils/arrayHelpers.js - 배열 조작 유틸리티
// ========================================

/**
 * 배열 청크 분할
 * @param {Array} array - 원본 배열
 * @param {number} size - 청크 크기
 * @returns {Array} 분할된 배열
 */
export const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * 배열 셔플 (Fisher-Yates 알고리즘)
 * @param {Array} array - 원본 배열
 * @returns {Array} 셔플된 배열
 */
export const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * 배열 중복 제거 (객체 배열 지원)
 * @param {Array} array - 원본 배열
 * @param {string|Function} key - 비교할 키 또는 함수
 * @returns {Array} 중복 제거된 배열
 */
export const uniqueBy = (array, key) => {
    if (typeof key === 'string') {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    if (typeof key === 'function') {
        const seen = new Set();
        return array.filter(item => {
            const value = key(item);
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    return [...new Set(array)];
};

/**
 * 배열 그룹화
 * @param {Array} array - 원본 배열
 * @param {string|Function} key - 그룹화 기준
 * @returns {Object} 그룹화된 객체
 */
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = typeof key === 'function' ? key(item) : item[key];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {});
};

/**
 * 배열 정렬 (다중 조건)
 * @param {Array} array - 원본 배열
 * @param {Array} sortKeys - 정렬 키 배열 [{key, order}]
 * @returns {Array} 정렬된 배열
 */
export const multiSort = (array, sortKeys) => {
    return [...array].sort((a, b) => {
        for (const { key, order = 'asc' } of sortKeys) {
            const aValue = typeof key === 'function' ? key(a) : a[key];
            const bValue = typeof key === 'function' ? key(b) : b[key];

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });
};