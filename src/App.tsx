import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RBACProvider } from './context/RBACContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import IntroGate from './components/common/IntroGate';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthModal from './components/auth/AuthModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuthStore } from './stores/authStore';
import { useNotificationSocket } from './hooks/useNotificationSocket';
import { UserRole } from './types';

// Marketing Pages
import Home from './pages/Home';
import DownloadApp from './pages/DownloadApp';
import Unauthorized from './pages/Unauthorized';
import BecomePartner from './pages/BecomePartner';

// Auth & Onboarding
import Onboard from './pages/Onboard';
import Profile from './pages/Profile';
import PartnerSettings from './pages/customer/Settings';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import SalonsManagement from './pages/admin/SalonsManagement';
import AppointmentsManagement from './pages/admin/AppointmentsManagement';
import PartnerApplications from './pages/admin/PartnerApplications';
import AuditLogs from './pages/admin/AuditLogs';

// Barber Pages
import BarberDashboard from './pages/barber/BarberDashboard';
import AvailabilityManagement from './pages/barber/AvailabilityManagement';
import BarberAppointments from './pages/barber/BarberAppointments';
import BarberSchedule from './pages/barber/BarberSchedule';
import BarberProfile from './pages/barber/BarberProfile';

// Salon Owner Pages
import SalonOwnerDashboard from './pages/salon-owner/SalonOwnerDashboard';
import SalonOwnerNotifications from './pages/salon-owner/SalonOwnerNotifications';
import StaffManagement from './pages/salon-owner/StaffManagement';
import Analytics from './pages/salon-owner/Analytics';
import MySalons from './pages/salon-owner/MySalons';
import CreateSalon from './pages/salon-owner/CreateSalon';
import SalonOwnerProfile from './pages/salon-owner/SalonOwnerProfile';
import SalonOwnerSalonDetails from './pages/salon-owner/SalonOwnerSalonDetails';
import ManageServices from './pages/salon-owner/ManageServices';
import EditSalon from './pages/salon-owner/EditSalon';

interface LayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true, showNavbar = true }) => (
    <div className="app-layout">
        {showNavbar && <Navbar />}
        <main>{children}</main>
        {showFooter && <Footer />}
    </div>
);

const RoleBasedLayoutWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuthStore();
    const isProfessional = user?.role === UserRole.BARBER || user?.role === UserRole.SALON_OWNER;
    if (isProfessional) return <DashboardLayout>{children}</DashboardLayout>;
    return <Layout>{children}</Layout>;
};

function AppContent() {
    return (
        <Router>
            <AuthModal />
            <Routes>
                {/* ── Marketing / Public Routes ── */}
                <Route path="/" element={<Layout showNavbar={false}><Home /></Layout>} />
                <Route path="/about" element={<Navigate to="/" replace />} />
                <Route path="/how-it-works" element={<Navigate to="/" replace />} />
                <Route path="/download" element={<Layout showNavbar={false}><DownloadApp /></Layout>} />
                <Route path="/become-a-partner" element={<Layout showNavbar={false}><BecomePartner /></Layout>} />
                <Route path="/contact" element={<Navigate to="/" replace />} />
                <Route path="/services" element={<Navigate to="/" replace />} />
                <Route path="/services/:id" element={<Navigate to="/" replace />} />

                {/* ── Partner Onboarding (from invite email link) ── */}
                <Route path="/onboard" element={<Onboard />} />

                {/* ── Barber Portal ── */}
                <Route path="/barber/dashboard" element={
                    <ProtectedRoute role={UserRole.BARBER}>
                        <DashboardLayout><BarberDashboard /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/barber/availability" element={
                    <ProtectedRoute role={UserRole.BARBER}>
                        <DashboardLayout><AvailabilityManagement /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/barber/appointments" element={
                    <ProtectedRoute role={UserRole.BARBER}>
                        <DashboardLayout><BarberAppointments /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/barber/schedule" element={
                    <ProtectedRoute role={UserRole.BARBER}>
                        <DashboardLayout><BarberSchedule /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/barber/profile" element={
                    <ProtectedRoute role={UserRole.BARBER}>
                        <DashboardLayout><BarberProfile /></DashboardLayout>
                    </ProtectedRoute>
                } />

                {/* ── Salon Owner Portal ── */}
                <Route path="/salon-owner/dashboard" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><SalonOwnerDashboard /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/notifications" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><SalonOwnerNotifications /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/my-salons" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><MySalons /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/staff-management" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><StaffManagement /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/analytics" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><Analytics /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salons/create" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><CreateSalon /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/salons/:id" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><SalonOwnerSalonDetails /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/salons/:id/services" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><ManageServices /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/salons/:id/edit" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><EditSalon /></DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route path="/salon-owner/profile" element={
                    <ProtectedRoute role={UserRole.SALON_OWNER}>
                        <DashboardLayout><SalonOwnerProfile /></DashboardLayout>
                    </ProtectedRoute>
                } />

                {/* ── Shared Partner Routes ── */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <RoleBasedLayoutWrapper><Profile /></RoleBasedLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <RoleBasedLayoutWrapper><PartnerSettings /></RoleBasedLayoutWrapper>
                    </ProtectedRoute>
                } />

                {/* ── Admin Panel ── */}
                <Route path="/admin/login" element={<Layout showFooter={false} showNavbar={false}><AdminLogin /></Layout>} />
                <Route path="/admin" element={
                    <ProtectedRoute role={UserRole.SUPER_ADMIN} redirectTo="/unauthorized">
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="salons" element={<SalonsManagement />} />
                    <Route path="appointments" element={<AppointmentsManagement />} />
                    <Route path="partner-applications" element={<PartnerApplications />} />
                    <Route path="audit-logs" element={<AuditLogs />} />
                </Route>
                {/* Legacy destinations — both consolidated into the real dashboard at /admin */}
                <Route path="/admin/superadmin" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

                <Route path="/unauthorized" element={<Unauthorized />} />
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
                        <IntroGate>
                            <AppContent />
                        </IntroGate>
                    </ToastProvider>
                </RBACProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
