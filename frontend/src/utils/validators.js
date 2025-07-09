export const validators = {
    // 이메일 유효성 검사
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // 비밀번호 강도 검사
    password: (password) => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const score = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

        return {
            isValid: score >= 3,
            score,
            requirements: {
                minLength,
                hasUpper,
                hasLower,
                hasNumber,
                hasSpecial
            }
        };
    },

    // URL 유효성 검사
    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // 한국 전화번호 유효성 검사
    phoneNumber: (phone) => {
        const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;
        return phoneRegex.test(phone);
    },

    // 필수 필드 검사
    required: (value) => {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value != null;
    }
};
