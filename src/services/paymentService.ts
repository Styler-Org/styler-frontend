import api from './api';
import { ApiResponse, Payment, PaymentMethod, PaymentStatus } from '../types';

// ==================== Request Types ====================

export interface InitiatePaymentRequest {
    appointmentId: string;
    method: PaymentMethod;
}

export interface VerifyPaymentRequest {
    orderId: string;
    paymentId: string;
    signature: string;
}

export interface RefundRequest {
    reason: string;
}

export interface PayBillRequest {
    appointmentId: string;
    billAmount: number;
    useWallet: boolean;
}

// ==================== Response Types ====================

export interface InitiatePaymentResponse {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
}

// ==================== Payment Service ====================

class PaymentService {
    /**
     * Initiate payment for appointment
     */
    async initiatePayment(data: InitiatePaymentRequest): Promise<ApiResponse<InitiatePaymentResponse>> {
        const response = await api.post<ApiResponse<InitiatePaymentResponse>>(
            '/payments/initiate',
            data
        );
        return response.data;
    }

    /**
     * Verify payment after Razorpay callback
     */
    async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<ApiResponse<Payment>> {
        const response = await api.post<ApiResponse<Payment>>('/payments/verify', {
            orderId,
            paymentId,
            signature,
        });
        return response.data;
    }

    /**
     * Pay Bill at salon
     */
    async payBill(data: PayBillRequest): Promise<ApiResponse<any>> {
        const response = await api.post<ApiResponse<any>>('/payments/pay-bill', data);
        return response.data;
    }

    /**
     * Get payment history
     */
    async getPaymentHistory(): Promise<ApiResponse<Payment[]>> {
        const response = await api.get<ApiResponse<Payment[]>>('/payments');
        return response.data;
    }

    /**
     * Get payment by ID
     */
    async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
        const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
        return response.data;
    }

    /**
     * Request refund
     */
    async requestRefund(id: string, data: RefundRequest): Promise<ApiResponse<Payment>> {
        const response = await api.post<ApiResponse<Payment>>(`/payments/${id}/refund`, data);
        return response.data;
    }

    /**
     * Get salon payment statistics
     */
    async getSalonPaymentStats(salonId: string): Promise<ApiResponse<any>> {
        const response = await api.get<ApiResponse<any>>(`/payments/salon/${salonId}/statistics`);
        return response.data;
    }
}

export const paymentService = new PaymentService();
export default paymentService;
