import api from './api';
import { ApiResponse, AuthResponse, User, UserRole } from '../types';

// ==================== Request Types ====================

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface RequestOtpRequest {
    phone: string;
}

export interface VerifyOtpRequest {
    phone: string;
    otp: string;
    name?: string;
    email?: string;
    role?: UserRole;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// ==================== Auth Service ====================

class AuthService {
    /**
     * First-factor login (email/phone + password)
     */
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        return response.data;
    }

    /**
     * Request OTP
     */
    async requestOtp(data: RequestOtpRequest): Promise<ApiResponse<{ phone: string; message: string }>> {
        const response = await api.post<ApiResponse<{ phone: string; message: string }>>('/auth/request-otp', data);
        return response.data;
    }

    /**
     * Verify OTP (Login or Register)
     */
    async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/verify-otp', data);
        return response.data;
    }

    /**
     * Logout user
     */
    async logout(): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/logout');
        return response.data;
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data;
    }



    /**
     * Refresh access token
     */
    async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh-token', data);
        return response.data;
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
        return response.data;
    }

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    }
}

export const authService = new AuthService();
export default authService;
