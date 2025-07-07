import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {useLocalStorage} from "@mantine/hooks";

const AuthContext = createContext();

// Auth 상태 타입들
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    UPDATE_PROFILE: 'UPDATE_PROFILE',
    RESET_ERROR: 'RESET_ERROR',
};

// 초기 상태
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Auth reducer
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
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
            };
        case AUTH_ACTIONS.RESET_ERROR:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage('user', null);
    const [token, setToken, removeToken] = useLocalStorage('token', null);

    // 초기 로드 시 저장된 사용자 정보 복원
    useEffect(() => {
        if (storedUser && token) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: storedUser,
            });
        }
    }, [storedUser, token]);

    // 로그인
    const login = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            // API 호출 시뮬레이션
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('로그인에 실패했습니다.');
            }

            const data = await response.json();

            // 사용자 정보와 토큰 저장
            setStoredUser(data.user);
            setToken(data.token);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: data.user,
            });

            return { success: true, user: data.user };
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message,
            });
            return { success: false, error: error.message };
        }
    };

    // 로그아웃
    const logout = () => {
        removeStoredUser();
        removeToken();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // 프로필 업데이트
    const updateProfile = (updates) => {
        const updatedUser = { ...state.user, ...updates };
        setStoredUser(updatedUser);
        dispatch({
            type: AUTH_ACTIONS.UPDATE_PROFILE,
            payload: updates,
        });
    };

    // 에러 초기화
    const resetError = () => {
        dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
    };

    const value = {
        ...state,
        login,
        logout,
        updateProfile,
        resetError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};