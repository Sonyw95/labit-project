import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import {storage} from "../utils/storage.js";

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // 앱 시작시 토큰 확인
    useEffect(() => {
        const token = storage.local.get('auth_token');
        const user = storage.local.get('user_info');

        if (token && user) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token, user }
            });
        }
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await apiClient.post('/auth/login', credentials);
            const { user, token } = response.data;

            storage.local.set('auth_token', token);
            storage.local.set('user_info', user);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            });

            return { success: true };
        } catch (error) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.message
            });
            return { success: false, error: error.message };
        }
    };
    const getKakaoLoginURL = async () => {
        dispatch({ type: 'LOGIN_START' });
        const response = await apiClient.get('/auth/kakao/url');
        return response.data;
    }
    const lgoinKakaoCode = async (code) => {
        const response = await apiClient.post(`/auth/kakao/login?code=${code}`);
        return response.data;
    }
    const openKakaoLoginPopup = async () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise( async (resolve, reject) => {
            try {
                const kakaoLoginUrl = await getKakaoLoginURL();
                const popup = window.open(
                    kakaoLoginUrl,
                    'kakaoLogin',
                    `width=500,height=700,scrollbars=yes,resizable=yes,left=${
                        window.screen.width / 2 - 250  },top=${
                        window.screen.height / 2 - 350}`
                );

                if (!popup) {
                    reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
                    return;
                }

                // 팝업 모니터링
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        reject(new Error('로그인이 취소되었습니다.'));
                    }
                }, 1000);

                // 메시지 리스너
                const messageListener = (event) => {
                    // 보안을 위해 origin 체크
                    if (event.origin !== window.location.origin) {return;}

                    if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        resolve(event.data.code);
                    } else if (event.data.type === 'KAKAO_LOGIN_ERROR') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error(event.data.error || '카카오 로그인 중 오류가 발생했습니다.'));
                    }
                };

                window.addEventListener('message', messageListener);

                // 타임아웃 설정 (5분)
                setTimeout(() => {
                    if (!popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        popup.close();
                        reject(new Error('로그인 시간이 초과되었습니다.'));
                    }
                }, 300000); // 5분

            } catch (error) {
                reject(error);
            }
        });
    }
    const loginWithKakao = async () => {

        try {
            // 카카오 로그인 처린
            const code = await openKakaoLoginPopup();

            // 인증 코드 로그인 처리
            const response = await lgoinKakaoCode(code);

            storage.local.set('auth_token', response.accessToken);
            storage.local.set('refreshToken', response.refreshToken);
            storage.local.set('user_info', response.user);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: response.user, token: response.accessToken }
            });

            return { success: true };
        } catch (error) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.message
            });
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await apiClient.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            storage.local.remove('auth_token');
            storage.local.remove('user_info');
            dispatch({ type: 'LOGOUT' });
        }
    };

    const updateUser = (userData) => {
        dispatch({ type: 'UPDATE_USER', payload: userData });
        storage.local.set('user_info', { ...state.user, ...userData });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        loginWithKakao,
        logout,
        updateUser,
        clearError
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