import api from './api';
import { ApiResponse, PaginatedResponse } from '../types';

// ==================== Request/Response Types ====================

/**
 * Every /admin/* list endpoint (admin.controller.ts on the backend) replies
 * with `pagination` as a sibling of `data`, not nested inside it — i.e.
 * `{success, data: T[], pagination: {...}}`, NOT `ApiResponse<PaginatedResponse<T>>`
 * (which would imply `data: {data: T[], pagination: {...}}`). Use this type
 * for admin list responses so callers access `res.data` (the array) and
 * `res.pagination.total`, not `res.data.data`/`res.data.pagination.total`.
 */
export type AdminListResponse<T> = ApiResponse<T[]> & { pagination?: PaginatedResponse<T>['pagination'] };

export interface DashboardStats {
    overview: {
        totalUsers: number;
        totalSalons: number;
        totalBarbers: number;
        totalAppointments: number;
        activeAppointments: number;
        totalRevenue: number;
    };
    usersByRole: Record<string, number>;
    appointmentsByStatus: Record<string, number>;
}

export interface GrowthTrendPoint {
    date: string;
    newUsers: number;
    revenue: number;
}

export interface AdminFilters {
    page?: number;
    limit?: number;
    search?: string;
}

export interface UserFilters extends AdminFilters {
    role?: string;
    isActive?: boolean;
}

export interface SalonFilters extends AdminFilters {
    isActive?: boolean;
    city?: string;
}

export interface BarberFilters extends AdminFilters {
    status?: string;
    salonId?: string;
}

export interface AppointmentFilters extends AdminFilters {
    status?: string;
    salonId?: string;
    startDate?: string;
    endDate?: string;
}

export interface PaymentFilters extends AdminFilters {
    status?: string;
    startDate?: string;
    endDate?: string;
}

export interface ReviewFilters extends AdminFilters {
    targetType?: 'salon' | 'barber';
    rating?: number;
}

export interface AuditLogEntry {
    _id: string;
    adminId: string;
    adminName: string;
    adminEmail: string;
    action: string;
    targetType: string;
    targetId: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    createdAt: string;
}

export interface AuditLogFilters extends AdminFilters {
    action?: string;
    targetType?: string;
    adminId?: string;
}

export type PartnerApplicationStatus = 'pending' | 'contacted' | 'approved' | 'rejected';

export interface PartnerApplication {
    _id: string;
    ownerName: string;
    businessName: string;
    phone: string;
    email: string;
    city: string;
    category: string;
    numberOfLocations?: string;
    status: PartnerApplicationStatus;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PartnerApplicationFilters {
    status?: PartnerApplicationStatus;
    page?: number;
    limit?: number;
}

export interface PartnerApplicationList {
    applications: PartnerApplication[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// ==================== Admin Service ====================

class AdminService {
    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
        return response.data;
    }

    /**
     * Get recent activity
     */
    async getRecentActivity(limit: number = 10): Promise<ApiResponse<any[]>> {
        const response = await api.get<ApiResponse<any[]>>(`/admin/dashboard/activity?limit=${limit}`);
        return response.data;
    }

    /**
     * Daily new-user + revenue trend for the dashboard growth chart.
     * Two measures of different scale — render as two separate line charts, never one dual-axis chart.
     */
    async getGrowthTrend(days: number = 14): Promise<ApiResponse<GrowthTrendPoint[]>> {
        const response = await api.get<ApiResponse<GrowthTrendPoint[]>>(`/admin/dashboard/growth?days=${days}`);
        return response.data;
    }

    // ==================== User Management ====================

    /**
     * Get all users
     */
    async getAllUsers(filters: UserFilters = {}): Promise<AdminListResponse<any>> {
        const params = new URLSearchParams();
        if (filters.role) params.append('role', filters.role);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<any>>(`/admin/users?${params.toString()}`);
        return response.data;
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>(`/admin/users/${id}`);
        return response.data;
    }

    /**
     * Update user role
     */
    async updateUserRole(id: string, role: string): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>(`/admin/users/${id}/role`, { role });
        return response.data;
    }

    /**
     * Toggle user status
     */
    async toggleUserStatus(id: string, isActive: boolean): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>(`/admin/users/${id}/status`, { isActive });
        return response.data;
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/admin/users/${id}`);
        return response.data;
    }

    // ==================== Salon Management ====================

    /**
     * Get all salons
     */
    async getAllSalons(filters: SalonFilters = {}): Promise<AdminListResponse<any>> {
        const params = new URLSearchParams();
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.city) params.append('city', filters.city);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<any>>(`/admin/salons?${params.toString()}`);
        return response.data;
    }

    /**
     * Get salon by ID
     */
    async getSalonById(id: string): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>(`/admin/salons/${id}`);
        return response.data;
    }

    /**
     * Suspend salon
     */
    async suspendSalon(id: string, reason?: string): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>(`/admin/salons/${id}/suspend`, { reason });
        return response.data;
    }

    /**
     * Delete salon
     */
    async deleteSalon(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/admin/salons/${id}`);
        return response.data;
    }

    // ==================== Barber Management ====================

    /**
     * Get all barbers
     */
    async getAllBarbers(filters: BarberFilters = {}): Promise<AdminListResponse<any>> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.salonId) params.append('salonId', filters.salonId);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<any>>(`/admin/barbers?${params.toString()}`);
        return response.data;
    }

    /**
     * Approve barber
     */
    async approveBarber(id: string): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>(`/admin/barbers/${id}/approve`);
        return response.data;
    }

    /**
     * Reject barber
     */
    async rejectBarber(id: string, reason?: string): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>(`/admin/barbers/${id}/reject`, { reason });
        return response.data;
    }

    // ==================== Appointment Management ====================

    /**
     * Get all appointments
     */
    async getAllAppointments(filters: AppointmentFilters = {}): Promise<AdminListResponse<any>> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.salonId) params.append('salonId', filters.salonId);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<any>>(`/admin/appointments?${params.toString()}`);
        return response.data;
    }

    /**
     * Cancel appointment
     */
    async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<any>> {
        const response = await api.put<ApiResponse<any>>(`/admin/appointments/${id}/cancel`, { reason });
        return response.data;
    }

    // ==================== Payment Management ====================

    /**
     * Get all payments
     */
    async getAllPayments(filters: PaymentFilters = {}): Promise<AdminListResponse<any>> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<any>>(`/admin/payments?${params.toString()}`);
        return response.data;
    }

    // ==================== Review Management ====================

    /**
     * Get all reviews
     */
    async getAllReviews(filters: ReviewFilters = {}): Promise<AdminListResponse<any>> {
        const params = new URLSearchParams();
        if (filters.targetType) params.append('targetType', filters.targetType);
        if (filters.rating) params.append('rating', filters.rating.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<any>>(`/admin/reviews?${params.toString()}`);
        return response.data;
    }

    /**
     * Delete review
     */
    async deleteReview(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/admin/reviews/${id}`);
        return response.data;
    }

    // ==================== Audit Log ====================

    /**
     * Get paginated audit logs of admin actions
     */
    async getAuditLogs(filters: AuditLogFilters = {}): Promise<AdminListResponse<AuditLogEntry>> {
        const params = new URLSearchParams();
        if (filters.action) params.append('action', filters.action);
        if (filters.targetType) params.append('targetType', filters.targetType);
        if (filters.adminId) params.append('adminId', filters.adminId);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<AdminListResponse<AuditLogEntry>>(`/admin/audit-logs?${params.toString()}`);
        return response.data;
    }

    // ==================== Partner Applications ====================

    /**
     * List partner (business) applications
     */
    async getPartnerApplications(filters: PartnerApplicationFilters = {}): Promise<ApiResponse<PartnerApplicationList>> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PartnerApplicationList>>(`/partners/applications?${params.toString()}`);
        return response.data;
    }

    /**
     * Approve a partner application — promotes the applicant to salon_owner and emails an onboarding link
     */
    async approvePartnerApplication(id: string, adminNotes?: string): Promise<ApiResponse<{ application: PartnerApplication; onboardUrl: string }>> {
        const response = await api.post<ApiResponse<{ application: PartnerApplication; onboardUrl: string }>>(
            `/partners/applications/${id}/approve`, { adminNotes }
        );
        return response.data;
    }

    /**
     * Update a partner application's status (contacted/rejected — not for approving, use approvePartnerApplication)
     */
    async updatePartnerApplicationStatus(id: string, status: 'pending' | 'contacted' | 'rejected', adminNotes?: string): Promise<ApiResponse<PartnerApplication>> {
        const response = await api.put<ApiResponse<PartnerApplication>>(
            `/partners/applications/${id}/status`, { status, adminNotes }
        );
        return response.data;
    }
}

export const adminService = new AdminService();
export default adminService;
