import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

class Api {
    constructor() {
        this.api = instance;
    }
    async get(url, config) {
        return await this.api.get(url, config);
    }

    async post(url, data, config) {
        return await this.api.post(url, data, config);
    }

    async put(url, data, config) {
        return await this.api.put(url, data, config);
    }

    async delete(url, config) {
        return await this.api.delete(url, config);
    }
}

export const api = new Api();