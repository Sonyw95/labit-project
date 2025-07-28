import { jwtDecode } from 'jwt-decode';

/**
 * JWT 토큰이 만료되었는지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} - 만료 여부
 */
export const isTokenExpired = (token) => {
    if (!token) {
        return true;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // exp claim이 없으면 만료된 것으로 간주
        if (!decoded.exp) {
            console.warn('JWT 토큰에 exp claim이 없습니다.');
            return true;
        }

        return decoded.exp < currentTime;
    } catch (error) {
        console.error('JWT 토큰 디코딩 오류:', error);
        return true;
    }
};

/**
 * JWT 토큰이 곧 만료될 예정인지 확인 (기본: 5분 전)
 * @param {string} token - JWT 토큰
 * @param {number} minutesBefore - 몇 분 전부터 갱신할지 (기본: 5분)
 * @returns {boolean} - 갱신 필요 여부
 */
export const shouldRefreshToken = (token, minutesBefore = 5) => {
    if (!token) {
        return false;
    }
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - currentTime;

        return timeUntilExpiry < (minutesBefore * 60);
    } catch (error) {
        console.error('JWT 토큰 분석 오류:', error);
        return true; // 오류가 있으면 갱신 시도
    }
};

/**
 * JWT 토큰에서 사용자 정보 추출
 * @param {string} token - JWT 토큰
 * @returns {object|null} - 사용자 정보 또는 null
 */
export const extractUserFromToken = (token) => {
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);

        return {
            id: decoded.userId,
            kakaoId: decoded.sub,
            nickname: decoded.nickname,
            email: decoded.email,
            role: decoded.role,
            profileImage: decoded.profileImage,
            issuedAt: decoded.iat,
            expiresAt: decoded.exp,
        };
    } catch (error) {
        console.error('사용자 정보 추출 오류:', error);
        return null;
    }
};

/**
 * JWT 토큰의 남은 유효 시간 계산 (초 단위)
 * @param {string} token - JWT 토큰
 * @returns {number} - 남은 시간 (초), 만료되었으면 0
 */
export const getTokenRemainingTime = (token) => {
    if (!token) {
        return 0;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const remainingTime = decoded.exp - currentTime;

        return Math.max(0, Math.floor(remainingTime));
    } catch (error) {
        console.error('토큰 남은 시간 계산 오류:', error);
        return 0;
    }
};

/**
 * JWT 토큰의 만료 시간을 Date 객체로 반환
 * @param {string} token - JWT 토큰
 * @returns {Date|null} - 만료 시간 Date 객체 또는 null
 */
export const getTokenExpiryDate = (token) => {
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return new Date(decoded.exp * 1000);
    } catch (error) {
        console.error('토큰 만료 시간 추출 오류:', error);
        return null;
    }
};

/**
 * 사용자의 권한 확인
 * @param {string} token - JWT 토큰
 * @param {string|array} requiredRoles - 필요한 권한 (문자열 또는 배열)
 * @returns {boolean} - 권한 보유 여부
 */
export const hasRequiredRole = (token, requiredRoles) => {
    const user = extractUserFromToken(token);
    if (!user || !user.role) {
        return false;
    }

    if (typeof requiredRoles === 'string') {
        return user.role === requiredRoles;
    }

    if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(user.role);
    }

    return false;
};

/**
 * 사용자가 관리자인지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} - 관리자 여부
 */
export const isAdmin = (token) => {
    return hasRequiredRole(token, ['ADMIN', 'SUPER_ADMIN']);
};

/**
 * JWT 토큰의 기본 유효성 검사 (만료 제외)
 * @param {string} token - JWT 토큰
 * @returns {boolean} - 토큰 형식 유효성
 */
export const isTokenFormatValid = (token) => {
    if (!token || typeof token !== 'string') {
        return false;
    }

    // JWT 토큰은 3개의 부분으로 구성 (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
        return false;
    }

    try {
        // 각 부분이 base64 디코딩 가능한지 확인
        JSON.parse(atob(parts[0])); // header
        JSON.parse(atob(parts[1])); // payload
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 토큰 저장 (localStorage)
 * @param {string} accessToken - Access Token
 * @param {string} refreshToken - Refresh Token (선택사항)
 */
export const storeTokens = (accessToken, refreshToken = null) => {
    try {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    } catch (error) {
        console.error('토큰 저장 오류:', error);
    }
};

/**
 * 토큰 제거 (localStorage)
 */
export const clearTokens = () => {
    try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('토큰 제거 오류:', error);
    }
};

/**
 * 저장된 토큰들 조회
 * @returns {object} - { accessToken, refreshToken }
 */
export const getStoredTokens = () => {
    try {
        return {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken'),
        };
    } catch (error) {
        console.error('저장된 토큰 조회 오류:', error);
        return { accessToken: null, refreshToken: null };
    }
};

/**
 * 토큰 자동 갱신이 필요한지 확인
 * @param {string} accessToken - Access Token
 * @param {string} refreshToken - Refresh Token
 * @returns {boolean} - 자동 갱신 필요 여부
 */
export const needsTokenRefresh = (accessToken, refreshToken) => {
    // Access token이 없으면 갱신 불가
    if (!accessToken || !refreshToken) {
        return false;
    }

    // Refresh token이 만료되었으면 갱신 불가
    if (isTokenExpired(refreshToken)) {
        return false;
    }

    // Access token이 만료되었거나 곧 만료될 예정이면 갱신 필요
    return isTokenExpired(accessToken) || shouldRefreshToken(accessToken);
};

/**
 * 디버그용: 토큰 정보 출력
 * @param {string} token - JWT 토큰
 */
export const debugToken = (token) => {
    if (!token) {
        console.log('토큰이 없습니다.');
        return;
    }

    try {
        const decoded = jwtDecode(token);
        const remainingTime = getTokenRemainingTime(token);
        const expiryDate = getTokenExpiryDate(token);

        console.log('=== JWT 토큰 정보 ===');
        console.log('사용자 ID:', decoded.userId);
        console.log('카카오 ID:', decoded.sub);
        console.log('닉네임:', decoded.nickname);
        console.log('역할:', decoded.role);
        console.log('발급 시간:', new Date(decoded.iat * 1000).toLocaleString());
        console.log('만료 시간:', expiryDate?.toLocaleString());
        console.log('남은 시간:', remainingTime, '초');
        console.log('만료 여부:', isTokenExpired(token));
        console.log('갱신 필요:', shouldRefreshToken(token));
        console.log('==================');
    } catch (error) {
        console.error('토큰 디버그 오류:', error);
    }
};