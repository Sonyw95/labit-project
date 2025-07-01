export const storage = {
    get: (key) => {
        if (typeof window === 'undefined') {
            return null;
        }
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set: (key, value) => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Handle storage errors silently
        }
    },

    remove: (key) => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            localStorage.removeItem(key);
        } catch {
            // Handle storage errors silently
        }
    }
};