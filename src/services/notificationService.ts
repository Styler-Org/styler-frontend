import apiClient from './api';

export interface Notification {
    _id: string;
    type: 'appointment' | 'staff' | 'review' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    metadata?: {
        appointmentId?: string;
        salonId?: string;
        barberId?: string;
        reviewId?: string;
        staffId?: string;
        paymentId?: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

export interface GetNotificationsParams {
    type?: 'appointment' | 'staff' | 'review' | 'system';
    isRead?: boolean;
    salonId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetNotificationsResponse {
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
}

class NotificationService {
    /**
     * Get all notifications for the current user
     */
    async getNotifications(params?: GetNotificationsParams): Promise<GetNotificationsResponse> {
        const response = await apiClient.get('/notifications', { params });
        return response.data.data;
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<number> {
        const response = await apiClient.get('/notifications/unread-count');
        return response.data.data.count;
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId: string): Promise<Notification> {
        const response = await apiClient.put(`/notifications/${notificationId}/read`);
        return response.data.data;
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<number> {
        const response = await apiClient.put('/notifications/mark-all-read');
        return response.data.data.count;
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId: string): Promise<void> {
        await apiClient.delete(`/notifications/${notificationId}`);
    }
}

export const notificationService = new NotificationService();
