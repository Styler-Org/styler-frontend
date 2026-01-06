import api from './api';
import { ApiResponse, PaginatedResponse, Appointment, AppointmentStatus } from '../types';

// ==================== Request Types ====================

export interface CheckAvailabilityRequest {
    salonId: string;
    barberId?: string;
    serviceId: string;
    date: string; // YYYY-MM-DD
}

export interface CreateAppointmentRequest {
    salonId: string;
    barberId?: string;
    serviceIds: string[]; // Changed from 'services' to match backend
    scheduledAt: string; // Changed to single ISO datetime string
    locationType: 'salon' | 'home'; // Added required field
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        latitude?: number;
        longitude?: number;
    };
    notes?: string;
}

export interface AppointmentFilters {
    status?: AppointmentStatus;
    date?: string;
    page?: number;
    limit?: number;
}

export interface UpdateStatusRequest {
    status: AppointmentStatus;
    notes?: string;
}

// ==================== Response Types ====================

export interface AvailabilityResponse {
    availableSlots: Array<{
        startTime: string;
        endTime: string;
    }>;
}

// ==================== Appointment Service ====================

class AppointmentService {
    /**
     * Check availability for appointment
     */
    async checkAvailability(data: CheckAvailabilityRequest): Promise<ApiResponse<AvailabilityResponse>> {
        const response = await api.post<ApiResponse<AvailabilityResponse>>(
            '/appointments/check-availability',
            data
        );
        return response.data;
    }

    /**
     * Create new appointment
     */
    async createAppointment(data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> {
        const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
        return response.data;
    }

    /**
     * Get my appointments (customer)
     */
    async getMyAppointments(filters: AppointmentFilters = {}): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Appointment>>>(
            `/appointments?${params.toString()}`
        );
        return response.data;
    }

    /**
     * Get upcoming appointments
     */
    async getUpcomingAppointments(): Promise<ApiResponse<Appointment[]>> {
        const response = await api.get<ApiResponse<Appointment[]>>('/appointments/upcoming');
        return response.data;
    }

    /**
     * Get appointment by ID
     */
    async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
        const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
        return response.data;
    }

    /**
     * Update appointment status
     */
    async updateStatus(id: string, data: UpdateStatusRequest): Promise<ApiResponse<Appointment>> {
        const response = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, data);
        return response.data;
    }

    /**
     * Cancel appointment
     */
    async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<Appointment>> {
        const response = await api.post<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, {
            reason,
        });
        return response.data;
    }

    /**
     * Get barber appointments
     */
    async getBarberAppointments(filters: AppointmentFilters = {}): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Appointment>>>(
            `/appointments/barber?${params.toString()}`
        );
        return response.data;
    }

    /**
     * Get salon appointments (for salon owner)
     */
    async getSalonAppointments(salonId: string, filters: AppointmentFilters = {}): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.date) params.append('date', filters.date);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Appointment>>>(
            `/appointments/salon/${salonId}?${params.toString()}`
        );
        return response.data;
    }

    /**
     * Get salon appointment statistics (for salon owner)
     */
    async getSalonStatistics(salonId: string): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>(`/appointments/salon/${salonId}/statistics`);
        return response.data;
    }
}

export const appointmentService = new AppointmentService();
export default appointmentService;
