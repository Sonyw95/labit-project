import useAuthStore from "../stores/authStore.js";

/**
 * JWT 토큰 디코딩
 */
export const decodeJwtToken = (token) => {
    if (!token) {
        return null;
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${  (`00${  c.charCodeAt(0).toString(16)}`).slice(-2)}`)
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        return null;
    }
};

/**
 * JWT 토큰 만료 확인
 */
export const isTokenExpired = (token) => {
    const decodedToken = decodeJwtToken(token);
    if (!decodedToken || !decodedToken.exp) {
        return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

/**
 * 토큰 만료 시간까지 남은 시간 (초)
 */
export const getTokenTimeRemaining = (token) => {
    const decodedToken = decodeJwtToken(token);
    if (!decodedToken || !decodedToken.exp) {
        return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decodedToken.exp - currentTime);
};

/**
 * 자동 로그아웃 타이머 설정
 */
export const setupAutoLogout = () => {
    const { accessToken, logout } = useAuthStore.getState();

    if (!accessToken) {
        return null;
    }

    const timeRemaining = getTokenTimeRemaining(accessToken);

    if (timeRemaining <= 0) {
        logout();
        return null;
    }

    // 토큰 만료 30초 전에 로그아웃
    const logoutTime = Math.max(0, (timeRemaining - 30) * 1000);

    return setTimeout(() => {
        logout();
        // 사용자에게 세션 만료 알림
        console.log('세션이 만료되어 로그아웃되었습니다.');
    }, logoutTime);
};

/**
 * 권한 확인 유틸리티
 */
export const checkUserPermission = (requiredRole) => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
        return false;
    }

    const roles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    const userRoleIndex = roles.indexOf(user.role);
    const requiredRoleIndex = roles.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
};