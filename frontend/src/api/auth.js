// ============= 인증 관련 타입 및 서비스 =============
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string[]} roles
 */
/**
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */
import {apiClient} from "../lib/apiClient.js";

/**
 * @typedef {Object} LoginResponse
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {User} user
 */


export class AuthService {

    // ========================== 일반적인 로그인 / 로그아웃  ==========================
    static async login(credentials) {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    }
    static async logout() {
        await apiClient.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
    // ========================== 일반적인 로그인 / 로그아웃  ==========================

    // ========================== 카카오 로그인 / 로그아웃  ==========================
    static async loginKakao(credentials) {
        const response = await apiClient.post('/auth/loginKakao', credentials);
        return response.data;
    }

    static async getCurrentUser() {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }

    static async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh', {
            refreshToken
        });
        return response.data.accessToken;
    }
}