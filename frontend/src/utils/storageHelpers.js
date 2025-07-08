// ========================================
// utils/storageHelpers.js - 스토리지 관련 유틸리티
// ========================================

/**
 * 안전한 로컬스토리지 접근
 */
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            if (typeof window === 'undefined') {
                return defaultValue;
            }
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Storage get error for key "${key}":`, error);
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            if (typeof window === 'undefined') {
                return false;
            }
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Storage set error for key "${key}":`, error);
            return false;
        }
    },

    remove: (key) => {
        try {
            if (typeof window === 'undefined') {
                return false;
            }
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Storage remove error for key "${key}":`, error);
            return false;
        }
    },

    clear: () => {
        try {
            if (typeof window === 'undefined') {
                return false;
            }
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Storage clear error:', error);
            return false;
        }
    }
};