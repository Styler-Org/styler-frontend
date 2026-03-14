import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    logout: () => Promise<void>;
    updateUser: (user: Partial<User>) => void;
    loadProfile: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) =>
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                }),

            setTokens: (accessToken, refreshToken) =>
                set({
                    accessToken,
                    refreshToken,
                }),

            clearAuth: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                }),

            logout: async () => {
                try {
                    const { default: authService } = await import('../services/authService');
                    await authService.logout();
                } catch (error) {
                    console.error('Failed to logout:', error);
                } finally {
                    // Always clear local state, even if the API call fails
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                    });
                }
            },

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),

            loadProfile: async () => {
                try {
                    const { default: authService } = await import('../services/authService');
                    const response = await authService.getProfile();
                    if (response.success && response.data) {
                        set({ user: response.data });
                    }
                } catch (error) {
                    console.error('Failed to load profile:', error);
                }
            },

            refreshUser: async () => {
                try {
                    const { default: authService } = await import('../services/authService');
                    const response = await authService.getProfile();
                    if (response.success && response.data) {
                        set({ user: response.data });
                    }
                } catch (error) {
                    console.error('Failed to refresh user:', error);
                }
            },
        }),
        {
            name: 'styler-auth',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
