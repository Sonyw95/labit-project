import { useEffect, useRef, useCallback } from 'react';
import useAuthStore from '../stores/authStore';
import { api } from '../api/client';

export const useMemorySafeAuth = () => {
    const { logout, isAuthenticated } = useAuthStore();
    const securityTimeoutRef = useRef(null);
    const eventListenersRef = useRef(new Set());
    const inactivityTimeoutRef = useRef(null);

    // 메모리 안전 이벤트 리스너 관리
    const addEventListenerSafely = useCallback((element, event, handler, options) => {
        element.addEventListener(event, handler, options);
        const cleanup = () => element.removeEventListener(event, handler, options);
        eventListenersRef.current.add(cleanup);
        return cleanup;
    }, []);

    // 비활성 상태 관리
    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        if (isAuthenticated) {
            // 30분 비활성 시 로그아웃
            inactivityTimeoutRef.current = setTimeout(() => {
                logout();
                api.cancelAllRequests();
            }, 30 * 60 * 1000);
        }
    }, [logout, isAuthenticated]);

    // 탭 가시성 변경 처리
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            // 탭이 숨겨질 때 보안 타임아웃 시작 (10분)
            securityTimeoutRef.current = setTimeout(() => {
                logout();
                api.cancelAllRequests();
            }, 10 * 60 * 1000);
        } else {
            // 탭이 보일 때 타임아웃 클리어 및 비활성 타이머 리셋
            if (securityTimeoutRef.current) {
                clearTimeout(securityTimeoutRef.current);
                securityTimeoutRef.current = null;
            }
            resetInactivityTimer();
        }
    }, [logout, resetInactivityTimer]);

    // 스토리지 변경 감지 (다른 탭에서의 로그아웃)
    const handleStorageChange = useCallback((event) => {
        if (event.key === 'auth-storage' && !event.newValue) {
            logout();
            api.cancelAllRequests();
        }
    }, [logout]);

    // 사용자 활동 감지
    const handleUserActivity = useCallback(() => {
        resetInactivityTimer();
    }, [resetInactivityTimer]);

    // beforeunload 이벤트 처리
    const handleBeforeUnload = useCallback(() => {
        api.cancelAllRequests();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        // 이벤트 리스너 등록
        addEventListenerSafely(document, 'visibilitychange', handleVisibilityChange);
        addEventListenerSafely(window, 'storage', handleStorageChange);
        addEventListenerSafely(window, 'beforeunload', handleBeforeUnload);

        // 사용자 활동 감지를 위한 이벤트들
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(event => {
            addEventListenerSafely(document, event, handleUserActivity, { passive: true });
        });

        // 초기 비활성 타이머 설정
        resetInactivityTimer();

        // 클린업 함수
        return () => {
            // 모든 이벤트 리스너 제거
            eventListenersRef.current.forEach(cleanup => cleanup());
            eventListenersRef.current.clear();

            // 모든 타이머 클리어
            if (securityTimeoutRef.current) {
                clearTimeout(securityTimeoutRef.current);
            }
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }

            // 모든 요청 취소
            api.cancelAllRequests();
        };
    }, [
        isAuthenticated,
        handleVisibilityChange,
        handleStorageChange,
        handleUserActivity,
        handleBeforeUnload,
        addEventListenerSafely,
        resetInactivityTimer
    ]);
};