// components/auth/AuthProvider.jsx
import React, { memo, useEffect, useRef, useCallback } from 'react';
import useAuthStore from '@/stores/authStore';
import { showToast } from '@/components/advanced/Toast.jsx';

// 사용자 활동 감지를 위한 이벤트 목록
const ACTIVITY_EVENTS = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
];

const AuthProvider = memo(({ children }) => {
    const {
        isAuthenticated,
        initialize,
        updateLastActivity,
        checkTokenValidity,
        logout,
        refreshToken,
        lastActivity,
        tokenExpiryTime
    } = useAuthStore();

    // 타이머 참조
    const activityTimerRef = useRef(null);
    const tokenCheckTimerRef = useRef(null);
    const refreshTimerRef = useRef(null);

    // 활동 감지 쓰로틀링
    const lastActivityUpdateRef = useRef(0);
    const ACTIVITY_THROTTLE = 30000; // 30초마다 한 번만 업데이트

    // 사용자 활동 핸들러 (메모이제이션)
    const handleUserActivity = useCallback(() => {
        if (!isAuthenticated) return;

        const now = Date.now();

        // 쓰로틀링: 30초 내에는 업데이트하지 않음
        if (now - lastActivityUpdateRef.current < ACTIVITY_THROTTLE) {
            return;
        }

        lastActivityUpdateRef.current = now;
        updateLastActivity();

        // 자동 로그아웃 타이머 리셋
        resetInactivityTimer();
    }, [isAuthenticated, updateLastActivity]);

    // 비활성 상태 타이머 리셋
    const resetInactivityTimer = useCallback(() => {
        if (activityTimerRef.current) {
            clearTimeout(activityTimerRef.current);
        }

        // 30분 비활성 시 자동 로그아웃
        activityTimerRef.current = setTimeout(() => {
            if (isAuthenticated) {
                logout();
                showToast.warning('자동 로그아웃', '장시간 비활성으로 인해 로그아웃되었습니다.');

                // 홈으로 리다이렉트
                const currentPath = window.location.pathname;
                const publicPaths = ['/', '/home'];

                if (!publicPaths.includes(currentPath)) {
                    window.location.href = '/home';
                }
            }
        }, 30 * 60 * 1000); // 30분
    }, [isAuthenticated, logout]);

    // 토큰 자동 갱신 (만료 5분 전)
    const scheduleTokenRefresh = useCallback(() => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        if (!tokenExpiryTime || !isAuthenticated) return;

        const now = Date.now();
        const timeUntilExpiry = tokenExpiryTime - now;
        const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // 5분 전

        if (refreshTime > 0) {
            refreshTimerRef.current = setTimeout(async () => {
                try {
                    const success = await refreshToken();
                    if (success) {
                        console.log('토큰이 자동으로 갱신되었습니다.');
                        scheduleTokenRefresh(); // 다음 갱신 스케줄링
                    }
                } catch (error) {
                    console.error('자동 토큰 갱신 실패:', error);
                }
            }, refreshTime);
        }
    }, [tokenExpiryTime, isAuthenticated, refreshToken]);

    // 주기적 토큰 유효성 검사 (5분마다)
    const startTokenValidityCheck = useCallback(() => {
        if (tokenCheckTimerRef.current) {
            clearInterval(tokenCheckTimerRef.current);
        }

        if (!isAuthenticated) return;

        tokenCheckTimerRef.current = setInterval(() => {
            if (isAuthenticated && !checkTokenValidity()) {
                console.log('토큰이 만료되었습니다.');
                logout();
                showToast.warning('세션 만료', '세션이 만료되어 로그아웃됩니다.');
            }
        }, 5 * 60 * 1000); // 5분마다
    }, [isAuthenticated, checkTokenValidity, logout]);

    // 앱 초기화
    useEffect(() => {
        let mounted = true;

        const initializeApp = async () => {
            try {
                await initialize();
            } catch (error) {
                console.error('앱 초기화 실패:', error);
            }
        };

        if (mounted) {
            initializeApp();
        }

        return () => {
            mounted = false;
        };
    }, [initialize]);

    // 인증 상태 변화 감지
    useEffect(() => {
        if (isAuthenticated) {
            // 활동 감지 이벤트 리스너 등록
            ACTIVITY_EVENTS.forEach(event => {
                document.addEventListener(event, handleUserActivity, {
                    passive: true,
                    capture: false
                });
            });

            // 타이머 시작
            resetInactivityTimer();
            startTokenValidityCheck();
            scheduleTokenRefresh();

            // 페이지 가시성 변화 감지
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    // 페이지가 다시 보이면 토큰 유효성 즉시 확인
                    if (isAuthenticated && !checkTokenValidity()) {
                        logout();
                        showToast.warning('세션 만료', '세션이 만료되었습니다.');
                    }
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                // 이벤트 리스너 정리
                ACTIVITY_EVENTS.forEach(event => {
                    document.removeEventListener(event, handleUserActivity);
                });

                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        } else {
            // 로그아웃 상태일 때 모든 타이머 정리
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
            }
            if (tokenCheckTimerRef.current) {
                clearInterval(tokenCheckTimerRef.current);
            }
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        }
    }, [
        isAuthenticated,
        handleUserActivity,
        resetInactivityTimer,
        startTokenValidityCheck,
        scheduleTokenRefresh,
        checkTokenValidity,
        logout
    ]);

    // 언마운트 시 정리
    useEffect(() => {
        return () => {
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
            }
            if (tokenCheckTimerRef.current) {
                clearInterval(tokenCheckTimerRef.current);
            }
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []);

    return children;
});

AuthProvider.displayName = 'AuthProvider';

export default AuthProvider;