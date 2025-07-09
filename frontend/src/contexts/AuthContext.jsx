import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
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
            const response = await apiClient.auth.login(credentials);
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

    const loginWithKakao = async () => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await apiClient.auth.kakaoLogin();
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