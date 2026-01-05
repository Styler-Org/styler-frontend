import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RBACProvider } from './context/RBACContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthModal from './components/auth/AuthModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './stores/authStore';
import { UserRole } from './types';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Lookbook from './pages/Lookbook';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';

// Salon Pages
import SalonList from './pages/salons/SalonList';
import SalonDetails from './pages/salons/SalonDetails';

// Booking Pages
import BookingFlow from './pages/booking/BookingFlow';

// Payment Pages
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';

// Customer Pages

import MyAppointments from './pages/customer/MyAppointments';
import AppointmentDetails from './pages/customer/AppointmentDetails';
import Settings from './pages/customer/Settings';

// Barber Pages
import BarberDashboard from './pages/barber/BarberDashboard';
import AvailabilityManagement from './pages/barber/AvailabilityManagement';
import BarberAppointments from './pages/barber/BarberAppointments';
import BarberSchedule from './pages/barber/BarberSchedule';
import BarberProfile from './pages/barber/BarberProfile';

// Salon Owner Pages
import SalonOwnerDashboard from './pages/salon-owner/SalonOwnerDashboard';
import StaffManagement from './pages/salon-owner/StaffManagement';
import Analytics from './pages/salon-owner/Analytics';
import MySalons from './pages/salon-owner/MySalons';
import CreateSalon from './pages/salon-owner/CreateSalon';
import SalonOwnerProfile from './pages/salon-owner/SalonOwnerProfile';
import SalonOwnerSalonDetails from './pages/salon-owner/SalonOwnerSalonDetails';
import ManageServices from './pages/salon-owner/ManageServices';
import EditSalon from './pages/salon-owner/EditSalon';

// Admin Pages
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';

// Lenis smooth scrolling (GSAP removed)

// Layout Component
interface LayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true, showNavbar = true }) => {
    return (
        <div className="app-layout">
            {showNavbar && <Navbar />}
            <main>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};

const RoleBasedLayoutWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuthStore();
    const isProfessional = user?.role === UserRole.BARBER || user?.role === UserRole.SALON_OWNER;

    if (isProfessional) {
        return <DashboardLayout>{children}</DashboardLayout>;
    }

    return <Layout>{children}</Layout>;
};

function AppContent() {

    return (
        <Router>
            <AuthModal />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/lookbook" element={<Layout><Lookbook /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/login" element={<Layout showFooter={false} showNavbar={false}><Login /></Layout>} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/services/:id" element={<Layout><ServiceDetails /></Layout>} />

                {/* Salon Discovery Routes */}
                <Route path="/salons" element={<Layout><SalonList /></Layout>} />
                <Route path="/salons/:id" element={<Layout><SalonDetails /></Layout>} />

                {/* Booking Route */}
                <Route
                    path="/booking/:salonId"
                    element={
                        <ProtectedRoute role={UserRole.CUSTOMER}>
                            <Layout><BookingFlow /></Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Payment Routes */}
                <Route path="/payment/success" element={<Layout><PaymentSuccess /></Layout>} />
                <Route path="/payment/failed" element={<Layout><PaymentFailed /></Layout>} />


                <Route
                    path="/customer/appointments"
                    element={
                        <ProtectedRoute role={UserRole.CUSTOMER}>
                            <Layout><MyAppointments /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customer/appointments/:id"
                    element={
                        <ProtectedRoute role={UserRole.CUSTOMER}>
                            <Layout><AppointmentDetails /></Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Barber Routes */}
                <Route
                    path="/barber/dashboard"
                    element={
                        <ProtectedRoute role={UserRole.BARBER}>
                            <DashboardLayout><BarberDashboard /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/barber/availability"
                    element={
                        <ProtectedRoute role={UserRole.BARBER}>
                            <DashboardLayout><AvailabilityManagement /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/barber/appointments"
                    element={
                        <ProtectedRoute role={UserRole.BARBER}>
                            <DashboardLayout><BarberAppointments /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/barber/schedule"
                    element={
                        <ProtectedRoute role={UserRole.BARBER}>
                            <DashboardLayout><BarberSchedule /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/barber/profile"
                    element={
                        <ProtectedRoute role={UserRole.BARBER}>
                            <DashboardLayout><BarberProfile /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Salon Owner Routes */}
                <Route
                    path="/salon-owner/dashboard"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><SalonOwnerDashboard /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salons-owner/my-salons"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><MySalons /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salon-owner/staff-management"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><StaffManagement /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salon-owner/analytics"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><Analytics /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salons/create"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><CreateSalon /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salon-owner/salons/:id"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><SalonOwnerSalonDetails /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salon-owner/salons/:id/services"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><ManageServices /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salon-owner/salons/:id/edit"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><EditSalon /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salon-owner/profile"
                    element={
                        <ProtectedRoute role={UserRole.SALON_OWNER}>
                            <DashboardLayout><SalonOwnerProfile /></DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Protected User Routes */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            {/* Inline RoleBasedLayout logic */}
                            <RoleBasedLayoutWrapper>
                                <Profile />
                            </RoleBasedLayoutWrapper>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <RoleBasedLayoutWrapper>
                                <Settings />
                            </RoleBasedLayoutWrapper>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Layout showFooter={false} showNavbar={false}><AdminLogin /></Layout>} />

                {/* New Super Admin Routes with AdminLayout */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role={UserRole.SUPER_ADMIN} redirectTo="/unauthorized">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="users" element={<UsersManagement />} />
                    {/* TODO: Add more admin pages */}
                    {/* <Route path="salons" element={<SalonsManagement />} /> */}
                    {/* <Route path="barbers" element={<BarbersManagement />} /> */}
                    {/* <Route path="appointments" element={<AppointmentsManagement />} /> */}
                    {/* <Route path="payments" element={<PaymentsManagement />} /> */}
                    {/* <Route path="reviews" element={<ReviewsManagement />} /> */}
                </Route>

                {/* Legacy admin routes (keep for backwards compatibility) */}
                <Route
                    path="/admin/superadmin"
                    element={
                        <ProtectedRoute role={UserRole.SUPER_ADMIN} redirectTo="/admin/login">
                            <Layout showFooter={false}><SuperAdminDashboard /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role={[UserRole.SUPER_ADMIN, UserRole.SALON_OWNER]} redirectTo="/admin/login">
                            <Layout showFooter={false}><Dashboard /></Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Unauthorized Access */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <RBACProvider>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </RBACProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
