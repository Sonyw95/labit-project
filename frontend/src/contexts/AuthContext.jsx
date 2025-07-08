// ========================================
// contexts/AuthContext.jsx - 인증 컨텍스트
// ========================================
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {useLocalStorage} from "@/hooks/useLocalStorage.js";
import {useMountedState} from "@/hooks/useMountedState.js";
const AuthContext = createContext(undefined);

// 액션 타입
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    UPDATE_USER: 'UPDATE_USER',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

// 초기 상태
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    refreshToken: null,
};

// 리듀서 (메모리 누수 방지를 위한 불변성 유지)
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                refreshToken: null,
                error: action.payload,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialState,
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children, apiClient }) => {
    console.log('AuthProvider Render')
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [storedAuth, setStoredAuth, removeStoredAuth] = useLocalStorage('auth', null);
    const isMounted = useMountedState();

    // 로그인 함수
    const login = useCallback(async (credentials) => {
        if (!isMounted()) {
            return;
        }

        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await apiClient.auth.login(credentials);

            if (!isMounted()) {
                return;
            }

            const authData = {
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken,
            };

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: authData,
            });

            // 로컬스토리지에 저장
            setStoredAuth(authData);

            return { success: true, data: response };
        } catch (error) {
            if (!isMounted()) {
                return;
            }

            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message,
            });

            return { success: false, error: error.message };
        }
    }, [apiClient.auth, setStoredAuth, isMounted]);

    // 카카오 로그인
    const loginWithKakao = useCallback(async () => {
        if (!isMounted()) {
            return;
        }

        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await apiClient.auth.loginWithKakao();

            if (!isMounted()) {
                return;
            }

            const authData = {
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken,
            };

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: authData,
            });

            setStoredAuth(authData);

            return { success: true, data: response };
        } catch (error) {
            if (!isMounted()) {
                return;
            }

            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message,
            });

            return { success: false, error: error.message };
        }
    }, [apiClient.auth, setStoredAuth, isMounted]);

    // 로그아웃 함수
    const logout = useCallback(async () => {
        if (!isMounted()) {
            return;
        }

        try {
            await apiClient.auth.logout();
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            if (isMounted()) {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
                removeStoredAuth();
            }
        }
    }, [apiClient.auth, removeStoredAuth, isMounted]);

    // 사용자 정보 업데이트
    const updateUser = useCallback((userData) => {
        if (!isMounted()) {
            return;
        }

        dispatch({
            type: AUTH_ACTIONS.UPDATE_USER,
            payload: userData,
        });

        // 로컬스토리지 업데이트
        if (storedAuth) {
            setStoredAuth({
                ...storedAuth,
                user: {
                    ...storedAuth.user,
                    ...userData,
                },
            });
        }
    }, [storedAuth, setStoredAuth, isMounted]);

    // 토큰 갱신
    const refreshTokens = useCallback(async () => {
        if (!state.refreshToken || !isMounted()) return false;

        try {
            const response = await apiClient.auth.refreshToken(state.refreshToken);

            if (!isMounted()) {
                return false;
            }

            const authData = {
                ...state,
                token: response.token,
                refreshToken: response.refreshToken || state.refreshToken,
            };

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: authData,
            });

            setStoredAuth(authData);

            return true;
        } catch (error) {
            if (isMounted()) {
                logout();
            }
            return false;
        }
    }, [state.refreshToken, state, apiClient.auth, setStoredAuth, logout, isMounted]);

    // 에러 클리어
    const clearError = useCallback(() => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }, [isMounted]);

    // 초기 로드 시 저장된 인증 정보 복원
    useEffect(() => {
        if (storedAuth && storedAuth.token && isMounted()) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: storedAuth,
            });
        }
    }, [storedAuth, isMounted]);

    // 토큰 만료 자동 갱신
    useEffect(() => {
        if (!state.token) {
            return;
        }

        const checkTokenExpiry = async () => {
            try {
                const isExpired = await apiClient.auth.isTokenExpired(state.token);
                if (isExpired && isMounted()) {
                    await refreshTokens();
                }
            } catch (error) {
                console.warn('Token expiry check failed:', error);
            }
        };

        const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000); // 5분마다 체크

        return () => clearInterval(interval);
    }, [state.token, refreshTokens, apiClient.auth, isMounted]);

    const value = {
        ...state,
        login,
        loginWithKakao,
        logout,
        updateUser,
        refreshTokens,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 훅
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
