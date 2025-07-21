// ============================================================================
// src/hooks/useTokenExpiration.js - 토큰 만료 관리 훅
// ============================================================================


import {useEffect} from "react";
import useAuthStore from "../stores/authStore.js";
import {isTokenExpired, setupAutoLogout} from "../utils/authUtils.js";
import {showToast} from "../components/advanced/Toast.jsx";

export const useTokenExpiration = () => {
    const { accessToken, logout, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            return;
        }

        // 토큰이 이미 만료된 경우 즉시 로그아웃
        if (isTokenExpired(accessToken)) {
            logout();
            showToast.error( '세션 만료','로그인 세션이 만료되었습니다. 다시 로그인해주세요.' );
            return;
        }
        // 자동 로그아웃 타이머 설정
        const timeoutId = setupAutoLogout();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [accessToken, isAuthenticated, logout]);
};