import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {useLocalStorage} from "@/hooks/useLocalStorage.js";

// Auth Context
const AuthContext = createContext();

// Auth actions
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    UPDATE_USER: 'UPDATE_USER',
    RESET_ERROR: 'RESET_ERROR',
};

// Initial state
const initialState = {
    user: null,
    token: null,
    refreshToken: null,
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
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialState,
            };

        case AUTH_ACTIONS.REFRESH_TOKEN:
            return {
                ...state,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
            };

        case AUTH_ACTIONS.UPDATE_USER:
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

// Auth Provider
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [storedAuth, setStoredAuth] = useLocalStorage('auth', {});

    useEffect(() => {
        console.log('마운트 LocalStorage 인증')
        if (storedAuth.token && storedAuth.user) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: storedAuth,
            });
        }
    }, [storedAuth]);

    // Save auth to localStorage when state changes
    useEffect(() => {
        console.log(' 상태 변경 인증 ')
        if (state.isAuthenticated) {
            setStoredAuth({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
            });
        }
        else {
            setStoredAuth('auth', {});
        }
    // }, [state.isAuthenticated, state.user, state.token, state.refreshToken, setStoredAuth]);
    }, [state, setStoredAuth]);

    // Login function
    const login = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            // Replace with actual API call
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

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: data,
            });

            return data;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message,
            });
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('회원가입에 실패했습니다.');
            }

            const data = await response.json();

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: data,
            });

            return data;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message,
            });
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Optional: Call logout API
            if (state.token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${state.token}`,
                    },
                });
            }
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    // Refresh token function
    const refreshToken = async () => {
        if (!state.refreshToken) {
            logout();
            return;
        }

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: state.refreshToken,
                }),
            });

            if (!response.ok) {
                throw new Error('토큰 갱신에 실패했습니다.');
            }

            const data = await response.json();

            dispatch({
                type: AUTH_ACTIONS.REFRESH_TOKEN,
                payload: data,
            });

            return data;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            throw error;
        }
    };

    // Update user function
    const updateUser = async (userData) => {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('프로필 업데이트에 실패했습니다.');
            }

            const updatedUser = await response.json();

            dispatch({
                type: AUTH_ACTIONS.UPDATE_USER,
                payload: updatedUser,
            });

            return updatedUser;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    };

    // Change password function
    const changePassword = async (passwordData) => {
        try {
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`,
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                throw new Error('비밀번호 변경에 실패했습니다.');
            }

            return await response.json();
        } catch (error) {
            console.error('Password change failed:', error);
            throw error;
        }
    };

    // Reset error function
    const resetError = () => {
        dispatch({ type: AUTH_ACTIONS.RESET_ERROR });
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return state.user?.roles?.includes(role) || false;
    };

    // Check if user has specific permission
    const hasPermission = (permission) => {
        return state.user?.permissions?.includes(permission) || false;
    };

    // Auto refresh token
    useEffect(() => {
        if (!state.token) return;

        // Check token expiration and refresh if needed
        const checkTokenExpiration = () => {
            try {
                const tokenPayload = JSON.parse(atob(state.token.split('.')[1]));
                const expirationTime = tokenPayload.exp * 1000;
                const currentTime = Date.now();
                const timeUntilExpiration = expirationTime - currentTime;

                // Refresh token 5 minutes before expiration
                if (timeUntilExpiration < 5 * 60 * 1000 && timeUntilExpiration > 0) {
                    refreshToken();
                }
            } catch (error) {
                console.error('Token parsing failed:', error);
                logout();
            }
        };

        const interval = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute

        return () => clearInterval(interval);
    }, [state.token]);

    const value = {
        ...state,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
        changePassword,
        resetError,
        hasRole,
        hasPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Auth hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Higher-order component for protected routes
export const withAuth = (Component, requiredRole = null, requiredPermission = null) => {
    return (props) => {
        const { isAuthenticated, hasRole, hasPermission, user } = useAuth();

        if (!isAuthenticated) {
            return (
                <div>
                    <h2>로그인이 필요합니다</h2>
                    <p>이 페이지에 접근하려면 로그인해주세요.</p>
                </div>
            );
        }

        if (requiredRole && !hasRole(requiredRole)) {
            return (
                <div>
                    <h2>접근 권한이 없습니다</h2>
                    <p>이 페이지에 접근할 권한이 없습니다.</p>
                </div>
            );
        }

        if (requiredPermission && !hasPermission(requiredPermission)) {
            return (
                <div>
                    <h2>권한이 부족합니다</h2>
                    <p>이 기능을 사용할 권한이 없습니다.</p>
                </div>
            );
        }

        return <Component {...props} user={user} />;
    };
};