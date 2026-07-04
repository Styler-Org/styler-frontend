import api from './api';
import { ApiResponse, Barber, BarberStatus } from '../types';

// ==================== Request Types ====================

export interface RegisterBarberRequest {
    salonId: string;
    displayName: string;
    experience: number;
    specializations: string[];
    bio?: string;
    certifications?: string[];
}

export interface UpdateAvailabilityRequest {
    availability: Array<{
        day: string;
        isAvailable: boolean;
        timeSlots: Array<{
            start: string;
            end: string;
        }>;
    }>;
}

export interface UploadDocumentsRequest {
    file: File;
    type: string;
}

// ==================== Barber Service ====================

class BarberService {
    /**
     * Register as barber
     */
    async registerAsBarber(data: RegisterBarberRequest): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>('/barbers', data);
        return response.data;
    }

    /**
     * Get barber profile
     */
    async getBarberProfile(id: string): Promise<ApiResponse<Barber>> {
        const response = await api.get<ApiResponse<Barber>>(`/barbers/${id}`);
        return response.data;
    }

    /**
     * Update barber profile
     */
    async updateBarberProfile(id: string, data: Partial<RegisterBarberRequest>): Promise<ApiResponse<Barber>> {
        const response = await api.put<ApiResponse<Barber>>(`/barbers/${id}`, data);
        return response.data;
    }

    /**
     * Upload a verification document (backend expects multipart: a single file + a `type` field)
     */
    async uploadDocuments(id: string, data: UploadDocumentsRequest): Promise<ApiResponse<Barber>> {
        const formData = new FormData();
        formData.append('document', data.file);
        formData.append('type', data.type);
        const response = await api.post<ApiResponse<Barber>>(`/barbers/${id}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    /**
     * Update barber availability
     */
    async updateAvailability(barberId: string, data: UpdateAvailabilityRequest): Promise<ApiResponse<Barber>> {
        const response = await api.put<ApiResponse<Barber>>(`/barbers/${barberId}/availability`, data);
        return response.data;
    }

    /**
     * Get salon barbers (public)
     */
    async getSalonBarbers(salonId: string): Promise<ApiResponse<Barber[]>> {
        const response = await api.get<ApiResponse<Barber[]>>(`/barbers/salon/${salonId}`);
        return response.data;
    }

    /**
     * Get pending barber approvals (salon owner)
     */
    async getPendingBarbers(salonId: string): Promise<ApiResponse<Barber[]>> {
        const response = await api.get<ApiResponse<Barber[]>>(`/barbers/salon/${salonId}/pending`);
        return response.data;
    }

    /**
     * Approve barber (salon owner)
     */
    async approveBarber(id: string): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>(`/barbers/${id}/approve`);
        return response.data;
    }

    /**
     * Reject barber (salon owner)
     */
    async rejectBarber(id: string, reason: string): Promise<ApiResponse<Barber>> {
        const response = await api.post<ApiResponse<Barber>>(`/barbers/${id}/reject`, { reason });
        return response.data;
    }
}

export const barberService = new BarberService();
export default barberService;
