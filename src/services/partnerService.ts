import api from './api';

export interface PartnerApplicationPayload {
    ownerName: string;
    businessName: string;
    phone: string;
    email: string;
    city: string;
    category: string;
    numberOfLocations?: string;
}

export interface PartnerApplicationResponse {
    id: string;
    status: string;
}

export const partnerService = {
    async submitApplication(data: PartnerApplicationPayload): Promise<PartnerApplicationResponse> {
        const response = await api.post('/partners/apply', data);
        return response.data.data as PartnerApplicationResponse;
    },
};
