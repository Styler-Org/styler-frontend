import api from './api';
import { ApiResponse, PaginatedResponse, Salon, Service } from '../types';

// ==================== Request Types ====================

export interface SalonSearchFilters {
    name?: string;
    city?: string;
    serviceType?: string;
    sortBy?: 'rating' | 'reviews' | 'name' | 'nearest';
    page?: number;
    limit?: number;
}

export interface NearbySalonFilters {
    lat: number;
    lng: number;
    radius?: number; // in km
    page?: number;
    limit?: number;
}

export interface CreateSalonRequest {
    name: string;
    description: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        location: {
            type: 'Point';
            coordinates: [number, number]; // [longitude, latitude]
        };
    };
    images?: string[];
    operatingHours?: Array<{
        day: string;
        openTime: string;
        closeTime: string;
        isOpen: boolean;
    }>;
}

export interface UpdateSalonRequest {
    businessName?: string;
    displayName?: string;
    description?: string;
    phone?: string;
    email?: string;
    images?: string[];
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        location: {
            type: 'Point';
            coordinates: [number, number];
        };
    };
    amenities?: string[];
    operatingHours?: Array<{
        day: string;
        isOpen: boolean;
        slots: {
            start: string;
            end: string;
        }[];
    }>;
    services?: Array<{
        name: string;
        description: string;
        category: string;
        price: number;
        duration: number;
        gender: 'male' | 'female' | 'unisex';
        isActive: boolean;
    }>;
    isActive?: boolean;
    notificationPreferences?: {
        emailNotifications: boolean;
        smsNotifications: boolean;
    };
    bookingPolicies?: {
        cancellationPolicy?: string;
        advanceBookingDays?: number;
        minAdvanceBookingHours?: number;
    };
}

// ==================== Salon Service ====================

class SalonService {
    /**
     * Search salons with filters
     */
    async searchSalons(filters: SalonSearchFilters = {}): Promise<ApiResponse<PaginatedResponse<Salon>>> {
        const params = new URLSearchParams();

        if (filters.name) params.append('name', filters.name);
        if (filters.city) params.append('city', filters.city);
        if (filters.serviceType) params.append('serviceType', filters.serviceType);
        if (filters.sortBy) params.append('sort', filters.sortBy);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Salon>>>(
            `/salons/search?${params.toString()}`
        );
        return response.data;
    }

    /**
     * Find nearby salons based on location
     */
    async getNearbySalons(filters: NearbySalonFilters): Promise<ApiResponse<PaginatedResponse<Salon>>> {
        const params = new URLSearchParams({
            lat: filters.lat.toString(),
            lng: filters.lng.toString(),
        });

        if (filters.radius) params.append('radius', filters.radius.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<ApiResponse<PaginatedResponse<Salon>>>(
            `/salons/nearby?${params.toString()}`
        );
        return response.data;
    }

    /**
     * Get salon by ID
     */
    async getSalonById(id: string): Promise<ApiResponse<Salon>> {
        const response = await api.get<ApiResponse<Salon>>(`/salons/${id}`);
        return response.data;
    }

    /**
     * Get salon services
     */
    async getSalonServices(salonId: string): Promise<ApiResponse<Service[]>> {
        const response = await api.get<ApiResponse<Service[]>>(`/salons/${salonId}/services`);
        return response.data;
    }

    /**
     * Get my salons (for salon owners)
     */
    async getMySalons(): Promise<ApiResponse<Salon[]>> {
        const response = await api.get<ApiResponse<Salon[]>>('/salons/my');
        return response.data;
    }

    /**
     * Create new salon (salon owner)
     */
    async createSalon(data: CreateSalonRequest): Promise<ApiResponse<Salon>> {
        const response = await api.post<ApiResponse<Salon>>('/salons', data);
        return response.data;
    }

    /**
     * Update salon (salon owner)
     */
    async updateSalon(id: string, data: UpdateSalonRequest): Promise<ApiResponse<Salon>> {
        const response = await api.put<ApiResponse<Salon>>(`/salons/${id}`, data);
        return response.data;
    }

    /**
     * Delete salon (salon owner)
     */
    async deleteSalon(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/salons/${id}`);
        return response.data;
    }

    /**
     * Get salon owner statistics
     */
    async getOwnerStats(): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>('/salons/stats/owner');
        return response.data;
    }

    /**
     * Get salon analytics
     */
    async getAnalytics(): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>('/salons/analytics');
        return response.data;
    }

    /**
     * Add service to salon
     */
    async addService(salonId: string, serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
        const response = await api.post<ApiResponse<Service>>(`/salons/${salonId}/services`, serviceData);
        return response.data;
    }

    /**
     * Update service
     */
    async updateService(salonId: string, serviceId: string, serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
        const response = await api.put<ApiResponse<Service>>(`/salons/${salonId}/services/${serviceId}`, serviceData);
        return response.data;
    }

    /**
     * Remove service from salon
     */
    async removeService(salonId: string, serviceId: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/salons/${salonId}/services/${serviceId}`);
        return response.data;
    }

    /**
     * Update operating hours
     */
    async updateOperatingHours(salonId: string, operatingHours: any[]): Promise<ApiResponse<Salon>> {
        const response = await api.put<ApiResponse<Salon>>(`/salons/${salonId}/operating-hours`, { operatingHours });
        return response.data;
    }

    /**
     * Upload salon images (max 3)
     */
    async uploadSalonImages(files: File[]): Promise<ApiResponse<{ images: string[] }>> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post<ApiResponse<{ images: string[] }>>(
            '/salons/upload-images',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }
}

export const salonService = new SalonService();
export default salonService;
