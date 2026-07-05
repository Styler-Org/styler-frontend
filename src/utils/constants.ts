/**
 * Application constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9168/api/v1';
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_ME: '/auth/me',
    AUTH_CHANGE_PASSWORD: '/auth/change-password',
    AUTH_REFRESH_TOKEN: '/auth/refresh-token',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_RESET_PASSWORD: '/auth/reset-password',

    // Salons
    SALONS_SEARCH: '/salons/search',
    SALONS_NEARBY: '/salons/nearby',
    SALONS_BY_ID: '/salons/:id',
    SALONS_SERVICES: '/salons/:id/services',
    SALONS_MY: '/salons-owner/my-salons',
    SALONS_CREATE: '/salons',
    SALONS_UPDATE: '/salons/:id',
    SALONS_DELETE: '/salons/:id',
    SALONS_ADD_SERVICE: '/salons/:id/services',
    SALONS_UPDATE_SERVICE: '/salons/:id/services/:serviceId',
    SALONS_DELETE_SERVICE: '/salons/:id/services/:serviceId',
    SALONS_UPDATE_HOURS: '/salons/:id/operating-hours',

    // Appointments
    APPOINTMENTS_CHECK: '/appointments/check-availability',
    APPOINTMENTS_CREATE: '/appointments',
    APPOINTMENTS_LIST: '/appointments',
    APPOINTMENTS_UPCOMING: '/appointments/upcoming',
    APPOINTMENTS_BY_ID: '/appointments/:id',
    APPOINTMENTS_UPDATE_STATUS: '/appointments/:id/status',
    APPOINTMENTS_CANCEL: '/appointments/:id/cancel',

    // Payments
    PAYMENTS_INITIATE: '/payments/initiate',
    PAYMENTS_VERIFY: '/payments/verify',
    PAYMENTS_HISTORY: '/payments',
    PAYMENTS_BY_ID: '/payments/:id',
    PAYMENTS_REFUND: '/payments/:id/refund',

    // Barbers
    BARBERS_REGISTER: '/barbers',
    BARBERS_BY_ID: '/barbers/:id',
    BARBERS_UPDATE: '/barbers/:id',
    BARBERS_DOCUMENTS: '/barbers/:id/documents',
    BARBERS_AVAILABILITY: '/barbers/:id/availability',
    BARBERS_SALON: '/barbers/salon/:salonId',

    // Reviews
    REVIEWS_CREATE: '/reviews',
    REVIEWS_MY: '/reviews/my',
    REVIEWS_SALON: '/reviews/salon/:salonId',
    REVIEWS_BARBER: '/reviews/barber/:barberId',
};

// App Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    SALONS: '/salons',
    SALON_DETAILS: '/salons/:id',
    BOOKING: '/booking/:salonId',

    // Customer
    CUSTOMER_DASHBOARD: '/customer/dashboard',
    CUSTOMER_APPOINTMENTS: '/customer/appointments',
    CUSTOMER_APPOINTMENT_DETAILS: '/customer/appointments/:id',

    // Barber
    BARBER_DASHBOARD: '/barber/dashboard',
    BARBER_AVAILABILITY: '/barber/availability',
    BARBER_APPOINTMENTS: '/barber/appointments',
    BARBER_PROFILE: '/barber/profile',

    // Salon Owner
    SALON_OWNER_DASHBOARD: '/salon-owner/dashboard',
    SALON_OWNER_SALONS: '/salon-owner/salons',
    SALON_OWNER_STAFF: '/salon-owner/staff-management',
    SALON_OWNER_SERVICES: '/salon-owner/services',
    SALON_OWNER_ANALYTICS: '/salon-owner/analytics',

    // Admin
    ADMIN_DASHBOARD: '/admin',

    // Payment
    PAYMENT_SUCCESS: '/payment/success',
    PAYMENT_FAILED: '/payment/failed',

    // Other
    UNAUTHORIZED: '/unauthorized',
    PROFILE: '/profile',
};

// User Roles
export const USER_ROLES = {
    SUPER_ADMIN: 'superadmin',
    SALON_OWNER: 'salon_owner',
    BARBER: 'barber',
    CUSTOMER: 'customer',
    RECEPTIONIST: 'receptionist',
    SUPPORT: 'support',
} as const;

// Appointment Status
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
    INITIATED: 'initiated',
    PROCESSING: 'processing',
    SUCCESSFUL: 'successful',
    FAILED: 'failed',
    REFUNDED: 'refunded',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// Time slots
export const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00',
];

// Days of week
export const DAYS_OF_WEEK = [
    'monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday',
];

// Color palette
export const COLORS = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    info: '#1890ff',
};

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'stylerapp_auth_token',
    REFRESH_TOKEN: 'stylerapp_refresh_token',
    USER_DATA: 'stylerapp_user',
    THEME: 'stylerapp_theme',
};
