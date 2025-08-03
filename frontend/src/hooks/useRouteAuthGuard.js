import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { showToast } from '../components/advanced/Toast';

export const useRouteAuthGuard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        isAuthenticated,
        isInitialized,
        isLoading,
        validateStoredTokens,
        logout,
    } = useAuthStore();

    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);
    const lastPathRef = useRef(location.pathname);
    const isInitialRender = useRef(true);

    // 메모이즈된 클린업 함수
    const cleanup = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    // 메모이즈된 토큰 검증 함수
    const performRouteValidation = useCallback(async (pathname, isRefresh = false) => {
        // if (!isMountedRef.current || isLoading || !isInitialized) {
        //     console.log('검증 조건 미충족:', { isLoading, isInitialized });
        //     return;
        // }

        // 새로고침이나 초기 렌더링에서는 보호된 경로가 아니면 검증하지 않음
        const protectedPaths = ['/admin', '/user/settings'];
        const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

        if (!isProtectedRoute) {
            return;
        }

        if (!isAuthenticated) {
            showToast.error('접근 제한', '인증되지 않은 사용자')
            navigate('/home', { replace: true });
            return;
        }

        // 새로고침인 경우 더 관대하게 처리
        if (isRefresh) {
            return;
        }

        cleanup();
        abortControllerRef.current = new AbortController();

        if( isProtectedRoute ){
            try {
                // console.log(`보호된 경로 접근 감지: ${pathname}, 토큰 검증 시작`);

                const isValid = await validateStoredTokens();
                if (!isValid && isMountedRef.current) {
                    logout();
                    showToast.error('인증 실패', '다시 로그인해주세요.');
                    navigate('/home', { replace: true });
                }
            } catch (error) {
                // if (error.name !== 'AbortError' && isMountedRef.current) {
                //     // 서버 오류인 경우 즉시 로그아웃하지 않고 경고만
                //     showToast.error('인증 확인 실패', '네트워크를 확인해주세요.');
                // }else
                if( error ){
                    showToast.error('토큰 만료', '토큰 만료 재로그인');
                    logout();
                    navigate('/home', { replace: true });
                }
            }
        }
    }, [isAuthenticated, isLoading, isInitialized, validateStoredTokens, logout, navigate, cleanup]);

    // 라우트 변경 감지
    useEffect(() => {
        const currentPath = location.pathname;

        // 초기화 완료 후에만 검증 실행
        if (isInitialized) {
            // 경로가 실제로 변경된 경우에만 검증 실행
            if (lastPathRef.current !== currentPath) {
                // console.log(`라우트 변경 감지: ${lastPathRef.current} -> ${currentPath}`);
                lastPathRef.current = currentPath;

                // 초기 렌더링인지 확인
                const isRefresh = isInitialRender.current;
                isInitialRender.current = false;

                // 약간의 지연 후 검증 (UI 블로킹 방지)
                const timeoutId = setTimeout(() => {
                    performRouteValidation(currentPath, isRefresh);
                }, isRefresh ? 500 : 100); // 새로고침시 더 긴 지연

                return () => clearTimeout(timeoutId);
            }
        } else {
            // console.log('아직 초기화되지 않음, 라우트 검증 대기 중');
        }
    }, [location.pathname, isInitialized, performRouteValidation]);

    // 컴포넌트 언마운트 시 클린업
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            cleanup();
        };
    }, [cleanup]);

    return { performRouteValidation };
};