import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
    baseURL: (import.meta as any).env.VITE_API_BASE_URL!,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - Attach access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Skip interceptor for login and register routes
        if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to refresh the token
                const response = await axios.post(
                    `${(import.meta as any).env.VITE_API_BASE_URL!}/auth/refresh-token`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                // Update tokens in store
                useAuthStore.getState().setTokens(accessToken, newRefreshToken);

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

export default api;
