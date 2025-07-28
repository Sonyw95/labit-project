// hooks/auth/useAuth.js
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { showToast } from '@/components/advanced/Toast.jsx';

/**
 * 인증 관련 기본 훅
 */
export const useAuth = () => {
    const navigate = useNavigate();
    const store = useAuthStore();

    return useMemo(() => ({
        // 상태
        ...store,

        // 로그인 처리
        handleLogin: async (token, user = null) => {
            try {
                store.login(token, user);
                showToast.success('로그인 성공', '환영합니다!');

                // 이전 페이지로 돌아가기 또는 홈으로
                const location = useLocation();
                const from = location.state?.from?.pathname || '/home';
                navigate(from, { replace: true });
            } catch (error) {
                console.error('로그인 처리 실패:', error);
                showToast.error('로그인 실패', '로그인 처리 중 오류가 발생했습니다.');
            }
        },

        // 로그아웃 처리
        handleLogout: async () => {
            try {
                store.logout();
                showToast.info('로그아웃', '성공적으로 로그아웃되었습니다.');
                navigate('/home', { replace: true });
            } catch (error) {
                console.error('로그아웃 처리 실패:', error);
                // 로그아웃은 실패해도 진행
                navigate('/home', { replace: true });
            }
        }
    }), [store, navigate]);
};

/**
 * 권한 확인 훅
 */
export const usePermissions = () => {
    const { user, isAuthenticated } = useAuthStore();

    return useMemo(() => ({
        // 로그인 여부
        isLoggedIn: isAuthenticated && !!user,

        // 관리자 여부
        isAdmin: isAuthenticated && user?.role && ['ADMIN', 'SUPER_ADMIN'].includes(user.role),

        // 슈퍼 관리자 여부
        isSuperAdmin: isAuthenticated && user?.role === 'SUPER_ADMIN',

        // 특정 권한 확인
        hasRole: (role) => isAuthenticated && user?.role === role,

        // 복수 권한 확인
        hasAnyRole: (roles) => isAuthenticated && user?.role && roles.includes(user.role),

        // 권한 기반 컴포넌트 렌더링
        canAccess: (requiredRoles = []) => {
            if (requiredRoles.length === 0) return true;
            return isAuthenticated && user?.role && requiredRoles.includes(user.role);
        }
    }), [user, isAuthenticated]);
};

/**
 * 토큰 관리 훅
 */
export const useTokenManager = () => {
    const {
        accessToken,
        tokenExpiryTime,
        checkTokenValidity,
        refreshToken,
        lastActivity
    } = useAuthStore();

    return useMemo(() => ({
        // 토큰 정보
        token: accessToken,
        expiryTime: tokenExpiryTime,
        lastActivity,

        // 토큰 상태 확인
        isTokenValid: checkTokenValidity(),
        isTokenExpiring: (() => {
            if (!tokenExpiryTime) return false;
            const timeLeft = tokenExpiryTime - Date.now();
            return timeLeft < (10 * 60 * 1000); // 10분 미만 남음
        })(),

        // 토큰 갱신
        refresh: refreshToken,

        // 남은 시간 (분 단위)
        timeUntilExpiry: (() => {
            if (!tokenExpiryTime) return 0;
            const timeLeft = tokenExpiryTime - Date.now();
            return Math.floor(timeLeft / (60 * 1000));
        })()
    }), [accessToken, tokenExpiryTime, checkTokenValidity, refreshToken, lastActivity]);
};

/**
 * 프로필 관리 훅
 */
export const useProfile = () => {
    const { user, setUser, isAuthenticated } = useAuthStore();

    return useMemo(() => ({
        // 사용자 정보
        profile: user,
        isLoaded: isAuthenticated && !!user,

        // 프로필 업데이트
        updateProfile: (newProfile) => {
            if (isAuthenticated) {
                setUser({ ...user, ...newProfile });
            }
        },

        // 아바타 URL
        avatarUrl: user?.profileImage || null,

        // 표시 이름
        displayName: user?.nickname || '사용자',

        // 이메일
        email: user?.email || '',

        // 역할 표시
        roleDisplay: (() => {
            switch (user?.role) {
                case 'SUPER_ADMIN': return '최고 관리자';
                case 'ADMIN': return '관리자';
                default: return '일반 사용자';
            }
        })()
    }), [user, setUser, isAuthenticated]);
};

/**
 * 리다이렉트 관리 훅
 */
export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();

    return useMemo(() => ({
        // 로그인 필요 시 리다이렉트
        requireAuth: (message = '로그인이 필요합니다.') => {
            if (!isAuthenticated) {
                showToast.warning('로그인 필요', message);
                navigate('/home', {
                    state: { from: location },
                    replace: true
                });
                return false;
            }
            return true;
        },

        // 권한 필요 시 리다이렉트
        requireRole: (requiredRoles, message = '접근 권한이 없습니다.') => {
            const { user } = useAuthStore.getState();

            if (!isAuthenticated || !user?.role || !requiredRoles.includes(user.role)) {
                showToast.error('권한 없음', message);
                navigate('/home', { replace: true });
                return false;
            }
            return true;
        },

        // 안전한 네비게이션
        safeNavigate: (to, options = {}) => {
            try {
                navigate(to, options);
            } catch (error) {
                console.error('네비게이션 오류:', error);
                navigate('/home', { replace: true });
            }
        }
    }), [navigate, location, isAuthenticated]);
};