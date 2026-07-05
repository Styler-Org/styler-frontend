import { create } from 'zustand';
import adminService, { DashboardStats } from '../services/adminService';

interface AdminState {
    // Dashboard
    stats: DashboardStats | null;
    recentActivity: any[];

    // Users
    users: any[];
    usersTotal: number;

    // Salons
    salons: any[];
    salonsTotal: number;

    // Barbers
    barbers: any[];
    barbersTotal: number;

    // Appointments
    appointments: any[];
    appointmentsTotal: number;

    // Payments
    payments: any[];
    paymentsTotal: number;

    // Reviews
    reviews: any[];
    reviewsTotal: number;

    // Loading & Error states
    loading: boolean;
    error: string | null;

    // Actions
    fetchDashboardStats: () => Promise<void>;
    fetchRecentActivity: (limit?: number) => Promise<void>;
    fetchUsers: (filters?: any) => Promise<void>;
    fetchSalons: (filters?: any) => Promise<void>;
    fetchBarbers: (filters?: any) => Promise<void>;
    fetchAppointments: (filters?: any) => Promise<void>;
    fetchPayments: (filters?: any) => Promise<void>;
    fetchReviews: (filters?: any) => Promise<void>;
    clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    // Initial state
    stats: null,
    recentActivity: [],
    users: [],
    usersTotal: 0,
    salons: [],
    salonsTotal: 0,
    barbers: [],
    barbersTotal: 0,
    appointments: [],
    appointmentsTotal: 0,
    payments: [],
    paymentsTotal: 0,
    reviews: [],
    reviewsTotal: 0,
    loading: false,
    error: null,

    // Dashboard actions
    fetchDashboardStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getDashboardStats();
            if (response.success && response.data) {
                set({ stats: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch dashboard stats', loading: false });
        }
    },

    fetchRecentActivity: async (limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getRecentActivity(limit);
            if (response.success && response.data) {
                set({ recentActivity: response.data, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch recent activity', loading: false });
        }
    },

    // Users actions
    fetchUsers: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getAllUsers(filters);
            if (response.success && response.data) {
                set({
                    users: response.data,
                    usersTotal: response.pagination?.total ?? 0,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch users', loading: false });
        }
    },

    // Salons actions
    fetchSalons: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getAllSalons(filters);
            if (response.success && response.data) {
                set({
                    salons: response.data,
                    salonsTotal: response.pagination?.total ?? 0,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch salons', loading: false });
        }
    },

    // Barbers actions
    fetchBarbers: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getAllBarbers(filters);
            if (response.success && response.data) {
                set({
                    barbers: response.data,
                    barbersTotal: response.pagination?.total ?? 0,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch barbers', loading: false });
        }
    },

    // Appointments actions
    fetchAppointments: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getAllAppointments(filters);
            if (response.success && response.data) {
                set({
                    appointments: response.data,
                    appointmentsTotal: response.pagination?.total ?? 0,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch appointments', loading: false });
        }
    },

    // Payments actions
    fetchPayments: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getAllPayments(filters);
            if (response.success && response.data) {
                set({
                    payments: response.data,
                    paymentsTotal: response.pagination?.total ?? 0,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch payments', loading: false });
        }
    },

    // Reviews actions
    fetchReviews: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await adminService.getAllReviews(filters);
            if (response.success && response.data) {
                set({
                    reviews: response.data,
                    reviewsTotal: response.pagination?.total ?? 0,
                    loading: false
                });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch reviews', loading: false });
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
