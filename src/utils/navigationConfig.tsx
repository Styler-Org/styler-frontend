import React from 'react';
import {
    Person as PersonIcon,
    Settings as SettingsIcon,
    ContentCut as ContentCutIcon,
    LocationOn as LocationOnIcon,
    Info as InfoIcon,
    Dashboard as DashboardIcon,
    CalendarMonth as CalendarIcon,
    Store as StoreIcon,
    People as PeopleIcon,
    Assessment as AnalyticsIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';

export interface NavLink {
    label: string;
    path: string;
    icon: React.ReactNode;
}

export const getNavLinksForRole = (role?: string): NavLink[] => {
    switch (role) {
        case 'barber':
            return [
                { label: 'Dashboard', path: '/barber/dashboard', icon: <DashboardIcon /> },
                { label: 'My Appointments', path: '/barber/appointments', icon: <CalendarIcon /> },
                { label: 'My Schedule', path: '/barber/schedule', icon: <InfoIcon /> },
                { label: 'Profile', path: '/barber/profile', icon: <PersonIcon /> },
            ];
        case 'salon_owner':
            return [
                { label: 'Dashboard', path: '/salon-owner/dashboard', icon: <DashboardIcon /> },
                { label: 'Notifications', path: '/salon-owner/notifications', icon: <NotificationsIcon /> },
                { label: 'My Salons', path: '/salons-owner/my-salons', icon: <StoreIcon /> },
                { label: 'Staff Management', path: '/salon-owner/staff-management', icon: <PeopleIcon /> },
                { label: 'Analytics', path: '/salon-owner/analytics', icon: <AnalyticsIcon /> },
                { label: 'Profile', path: '/salon-owner/profile', icon: <PersonIcon /> },
            ];
        case 'customer':
        default:
            return [
                { label: 'Find Salons', path: '/salons', icon: <LocationOnIcon /> },
                { label: 'Services', path: '/services', icon: <ContentCutIcon /> },
                { label: 'About', path: '/about', icon: <InfoIcon /> },
            ];
    }
};
