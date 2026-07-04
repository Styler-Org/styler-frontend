import api from './api';
import { ApiResponse } from '../types';

export type InsightsRange = '7d' | '30d' | '90d';

export interface ChangeMetric {
    value: number;
    changePercent: number;
}

export interface SalonOverview {
    revenue: ChangeMetric;
    bookings: ChangeMetric;
    avgTicket: ChangeMetric;
    revenueSeries: { date: string; value: number }[];
    bookingsByStatus: { status: string; count: number }[];
    topServices: { name: string; count: number; percentage: number }[];
    peakHours: { hour: number; count: number }[];
}

class InsightsService {
    async getSalonOverview(salonId: string, range: InsightsRange = '30d'): Promise<ApiResponse<SalonOverview>> {
        const response = await api.get<ApiResponse<SalonOverview>>(`/insights/salon/${salonId}/overview`, {
            params: { range },
        });
        return response.data;
    }
}

export const insightsService = new InsightsService();
export default insightsService;
