// ==================== API Response Types ====================

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: ApiError;
}

export interface ApiError {
    code: string;
    message: string;
    statusCode: number;
    details?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    tokens: TokenResponse;
}

// ==================== Enums ====================

export enum UserRole {
    SUPER_ADMIN = 'superadmin',
    SALON_OWNER = 'salon_owner',
    BARBER = 'barber',
    CUSTOMER = 'customer',
    RECEPTIONIST = 'receptionist',
    SUPPORT = 'support',
}

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
}

export enum PaymentStatus {
    INITIATED = 'initiated',
    PROCESSING = 'processing',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum PaymentMethod {
    UPI = 'upi',
    DEBIT_CARD = 'debit_card',
    CREDIT_CARD = 'credit_card',
    WALLET = 'wallet',
}

export enum BarberStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended',
}

export enum ServiceGender {
    MALE = 'male',
    FEMALE = 'female',
    UNISEX = 'unisex',
}

// Interfaces
export interface User {
    _id: string;
    email: string;
    phone?: string;
    name: string;
    role: UserRole;
    permissions?: string[]; // User-specific permissions for RBAC
    profilePicture?: string;
    coverImage?: string;
    addresses?: Address[];
    wallet?: { balance: number };
    penaltyAmount?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Location {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    location: Location;
}

export interface OperatingHours {
    day: string;
    isOpen: boolean;
    slots: {
        start: string;
        end: string;
    }[];
}

export interface Salon {
    _id: string;
    name: string;
    description: string;
    displayName: string;
    businessName: string;
    address: Address;
    phone: string;
    email?: string;
    images: string[];
    rating: number | { average: number; count: number };
    totalReviews: number;
    operatingHours: OperatingHours[];
    specialties?: string[]; // Salon specialties (e.g., "Haircuts", "Coloring", "Styling")
    ownerId: string;
    isActive: boolean;
    isOpen?: boolean; // Current open/closed status based on operating hours
    notificationPreferences?: {
        emailNotifications: boolean;
        smsNotifications: boolean;
    };
    bookingPolicies?: {
        cancellationPolicy?: string;
        advanceBookingDays?: number;
        minAdvanceBookingHours?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    gender: ServiceGender;
    isActive: boolean;
}

export interface BarberAvailabilitySlot {
    startTime: string;
    endTime: string;
}

export interface BarberAvailability {
    day: string;
    slots: BarberAvailabilitySlot[];
}

export interface Barber {
    _id: string;
    userId: string;
    salonId: string;
    specialties: string[];
    experience: number; // in years
    documents: string[];
    status: BarberStatus;
    availability: BarberAvailability[];
    rating: number;
    totalReviews: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    _id: string;
    appointmentNumber: string;
    customerId: string;
    salonId: string;
    salon?: Salon; // Populated salon data when expanded from the API
    barberId?: string;
    serviceIds: string[]; // Array of service IDs (can be populated)
    scheduledAt: string; // ISO datetime string
    duration: number; // Duration in minutes
    location: {
        type: 'salon' | 'home';
        address?: Address;
    };
    pricing: {
        services: number;
        homeServiceFee: number;
        platformFee: number;
        total: number;
    };
    status: AppointmentStatus;
    paymentStatus: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;

    // Convenience properties (derived from scheduledAt and pricing.total)
    scheduledDate?: string;
    scheduledTime?: string;
    totalAmount?: number;
}

export interface Payment {
    _id: string;
    appointmentId: string;
    customerId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    _id: string;
    targetType: 'salon' | 'barber';
    targetId: string;
    customerId: string;
    appointmentId: string;
    rating: number;
    comment: string;
    images?: string[];
    response?: {
        comment: string;
        respondedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Legacy compatibility request types
export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    phone: string;
    password: string;
    name: string;
    role?: UserRole;
}

export interface CheckAvailabilityRequest {
    salonId: string;
    barberId?: string;
    serviceId: string;
    date: string;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface CreateAppointmentRequest {
    salonId: string;
    barberId?: string;
    services: string[];
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
}

export interface CreateReviewRequest {
    targetType: 'salon' | 'barber';
    targetId: string;
    appointmentId: string;
    rating: number;
    comment: string;
    images?: string[];
}

export interface SalonFilters {
    name?: string;
    city?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
}

export interface NearbySalonsRequest {
    lat: number;
    lng: number;
    radius?: number;
    page?: number;
    limit?: number;
}
