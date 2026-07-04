import api from './api';

export interface OnboardTokenData {
    applicationId: string;
    userId: string;
    phone: string;
    email: string;
    ownerName: string;
    businessName: string;
    city: string;
    category: string;
}

export interface CreateSalonPayload {
    businessName: string;
    displayName: string;
    businessType: 'salon' | 'spa' | 'dermatology';
    description: string;
    phone: string;
    email: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        latitude: number;
        longitude: number;
    };
}

export interface ServicePayload {
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    gender: 'male' | 'female' | 'unisex';
    isActive: boolean;
}

export interface OperatingHoursPayload {
    day: string;
    isOpen: boolean;
    slots: { start: string; end: string }[];
}

export const onboardService = {
    async validateToken(token: string): Promise<OnboardTokenData> {
        const res = await api.get(`/partners/validate-onboard-token?token=${encodeURIComponent(token)}`);
        return res.data.data as OnboardTokenData;
    },

    async createSalon(payload: CreateSalonPayload): Promise<{ id: string; [key: string]: any }> {
        const res = await api.post('/salons', payload);
        return res.data.data;
    },

    async addServices(salonId: string, services: ServicePayload[]): Promise<void> {
        await Promise.all(
            services.map(s => api.post(`/salons/${salonId}/services`, s))
        );
    },

    async setOperatingHours(salonId: string, hours: OperatingHoursPayload[]): Promise<void> {
        await api.put(`/salons/${salonId}/operating-hours`, { operatingHours: hours });
    },

    async consumeToken(token: string): Promise<void> {
        await api.post('/partners/consume-onboard-token', { token });
    },
};
